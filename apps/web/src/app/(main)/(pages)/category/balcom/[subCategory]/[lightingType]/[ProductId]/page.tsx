import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@repo/database";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClientComponent from "./products";

const getProductWattage = (productName: string): number => {
  if (!productName) return 0;
  const match = productName.match(/(\d+)(?:W)/);
  return match ? parseInt(match[1], 10) : 0;
};

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      productId: true,
      category: {
        select: {
          name: true,
        },
      },
      lightingtype: {
        select: {
          name: true,
        },
      },
    },
  });
  return products.map((product) => ({
    subCategory: product.category.name,
    lightingType: product.lightingtype.name,
    ProductId: product.productId,
  }));
}
export default async function ProductPage({
  params,
}: {
  params: { lightingType: string; ProductId: string; subCategory: string };
}) {
  const { lightingType, ProductId, subCategory } = params;
  console.log("Params:", params);
  const product = await prisma.product.findUnique({
    where: {
      productId: ProductId,
      sectionType: subCategory,
      spotlightType: lightingType,
    },
    include: { category: true, lightingtype: true },
  });
  console.log("Product:", product);
  if (!product) {
    console.log("Product not found");
    notFound();
  }
  const relatedProducts = await getRelatedProducts(product, subCategory);
  let configuration = await prisma.configuration.findFirst({
    where: { ProductId: product.productId },
  });

  if (!configuration) {
    console.log(
      `Configuration not found for ProductId: ${product.productId}. Creating new configuration.`,
    );
    configuration = await prisma.configuration.create({
      data: {
        ProductId: product.productId,
        configPrice: product.price,
        priceIncrease: 0,
        shippingPrice: 0,
        discount: product.discount,
        quantity: 1,
        totalPrice: product.price,
      },
    });
    console.log(`New configuration created with ID: ${configuration.id}`);
  } else {
    console.log(`Existing configuration found with ID: ${configuration.id}`);
  }
  return (
    <>
      {product && (
        <ProductClientComponent
          product={product}
          relatedProducts={relatedProducts}
          configuration={configuration}
        >
          <Breadcrumb />
        </ProductClientComponent>
      )}
    </>
  );
}
export async function generateMetadata({
  params,
}: {
  params: { subCategory: string; ProductId: string; lightingType: string };
}): Promise<Metadata> {
  const { lightingType, ProductId, subCategory } = params;

  const product = await prisma.product.findUnique({
    where: {
      productId: ProductId,
      sectionType: subCategory,
      spotlightType: lightingType,
    },
    include: { category: true, lightingtype: true },
  });

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      icons: "/balcom.ico",
    });
  }
  const isOutdoor = product.maxIP && product.maxIP >= 65;
  const wattage = getProductWattage(product.productName);
  const title = `${product.productName} - ${wattage}W ${product.sectionType} ${product.lightingtype.name} | Lighting`;
  const description = `Discover the ${product.productName}, a ${wattage}W ${product.sectionType} ${product.lightingtype.name.toLowerCase()} perfect for ${product.category.name.toLowerCase()} applications. ${isOutdoor
    ? `With an IP rating of IP${product.maxIP}, it's ideal for outdoor use. `
    : ""
    }Featuring a ${product.colorTemperature} color temperature and ${product.cri ? `CRI of ${product.cri}, ` : ""}this ${product.brandOfLed} LED light offers ${product.luminousFlux} lumens of brightness. Shop now at Balcom Lighting!`;
  return constructMetadata({
    title,
    description,
    icons: "/balcom.ico",
    image: product.productImages[0] || undefined,
  });
}
const getRelatedProducts = async (product: unknown, subCategory: string) => {
  const currentWattage = getProductWattage(product.productName);
  const relatedProducts = await prisma.product.findMany({
    where: {
      sectionType: subCategory,
      productName: {
        contains: "W",
      },
      productId: {
        not: product.productId,
      },
    },
  });
  return relatedProducts.filter((relatedProduct) => {
    const wattage = getProductWattage(relatedProduct.productName);
    return wattage >= currentWattage - 1 && wattage <= currentWattage + 2;
  });
};
