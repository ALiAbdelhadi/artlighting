/**
 * Populates the new ProductVariant / ProductImage tables from the 117
 * existing products, additive only — does not touch Product.price/quantity/
 * productImages, which the storefront still reads directly. Safe to re-run:
 * skips products that already have a variant or images.
 *
 * Each product gets exactly one default ProductVariant (sku = the product's
 * existing productId, since nothing in the current catalog has more than one
 * purchasable configuration per product today) and one ProductImage row per
 * entry in its productImages array, in the same order.
 *
 * Run: pnpm --filter @repo/database migrate:variants-images
 */
import { prisma } from "../index";

async function main() {
  const products = await prisma.product.findMany({
    include: {
      specifications: { where: { language: "en" } },
      variants: { select: { id: true } },
      images: { select: { id: true } },
    },
  });

  let variantsCreated = 0;
  let imagesCreated = 0;
  let skippedVariants = 0;
  let skippedImages = 0;
  const noSpecFinishOrWattage: string[] = [];

  for (const product of products) {
    const spec = product.specifications[0];

    if (product.variants.length === 0) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: product.productId,
          wattage: spec?.maximumWattage ?? null,
          colorTemp: product.productColor,
          finish: spec?.finish ?? null,
          size: null, // no source field for this in the current catalog data
          stock: product.quantity,
          priceOverride: null,
          isDefault: true,
        },
      });
      variantsCreated++;
      if (!spec?.maximumWattage && !spec?.finish) {
        noSpecFinishOrWattage.push(product.productId);
      }
    } else {
      skippedVariants++;
    }

    if (product.images.length === 0 && product.productImages.length > 0) {
      await prisma.productImage.createMany({
        data: product.productImages.map((url, index) => ({
          productId: product.id,
          url,
          altText: product.productName,
          order: index,
          isPrimary: index === 0,
        })),
      });
      imagesCreated += product.productImages.length;
    } else {
      skippedImages++;
    }
  }

  console.log(`Products processed: ${products.length}`);
  console.log(`Variants created: ${variantsCreated} (skipped, already had one: ${skippedVariants})`);
  console.log(`Images created: ${imagesCreated} (products skipped, already had images or none to copy: ${skippedImages})`);
  console.log(
    `Products with neither wattage nor finish in EN spec (variant created with both null): ${noSpecFinishOrWattage.length}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
