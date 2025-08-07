import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const ProductColorTemp = {
  warm: "warm",
  cool: "cool",
  white: "white",
};

const ProductIP = {
  IP20: "IP20",
  IP44: "IP44",
  IP54: "IP54",
  IP65: "IP65",
  IP68: "IP68",
};

function determineProductColor(productData) {
  const colorTemp = productData.specificationsTable["Color Temperature"];
  if (!colorTemp) return ProductColorTemp.warm;
  if (colorTemp.includes("3000K")) return ProductColorTemp.warm;
  if (colorTemp.includes("4000K")) return ProductColorTemp.cool;
  if (colorTemp.includes("6500K")) return ProductColorTemp.white;
  return ProductColorTemp.warm;
}

function determineProductIp(productData) {
  const ip = productData.specificationsTable.IP;
  if (ip === 20 || ip === "20") return ProductIP.IP20;
  if (ip === 44 || ip === "44") return ProductIP.IP44;
  if (ip === 54 || ip === "54") return ProductIP.IP54;
  if (ip === 65 || ip === "65") return ProductIP.IP65;
  if (ip === 68 || ip === "68") return ProductIP.IP68;
  return ProductIP.IP20;
}

async function main() {
  const data = JSON.parse(readFileSync("apps/web/src/data/products-details.json", "utf8"));
  for (const brand of Object.keys(data.categories)) {
    for (const category of Object.keys(data.categories[brand])) {
      for (const lightingType of Object.keys(
        data.categories[brand][category],
      )) {
        const products = data.categories[brand][category][lightingType];
        for (const product of products) {
          for (const productId of Object.keys(product)) {
            const productData = product[productId];
            try {
              console.log(
                `Processing brand: ${brand}, category: ${category}, lightingType: ${lightingType}, productId: ${productId}`,
              );
              let categoryRecord = await prisma.category.upsert({
                where: { name: category },
                update: {},
                create: { name: category },
              });
              let lightingTypeRecord = await prisma.lightingType.upsert({
                where: { name: lightingType },
                update: {},
                create: { name: lightingType },
              });
              const productCreateData = {
                productId: productData.ProductId,
                productName: productData.productName,
                productImages: productData.productImages || [],
                input: productData.specificationsTable?.Input || null,
                maximumWattage:
                  productData.specificationsTable?.["Maximum wattage"] || null,
                brandOfLed:
                  productData.specificationsTable?.["Brand Of Led"] || null,
                luminousFlux:
                  productData.specificationsTable?.["Luminous Flux"] || null,
                mainMaterial:
                  productData.specificationsTable?.["Main Material"] || null,
                cri: productData.specificationsTable?.CRI || null,
                beamAngle:
                  productData.specificationsTable?.["Beam Angle"] || null,
                workingTemperature:
                  productData.specificationsTable?.["Working Temperature"] ||
                  null,
                fixtureDimmable:
                  productData.specificationsTable?.["Fixture Dimmable"] || null,
                electrical: productData.specificationsTable?.Electrical || null,
                powerFactor:
                  productData.specificationsTable?.["Power Factor"] || null,
                colorTemperature:
                  productData.specificationsTable?.["Color Temperature"] ||
                  null,
                ip: productData.specificationsTable?.IP || null,
                energySaving:
                  productData.specificationsTable?.["Energy Saving"] || null,
                lifeTime:
                  productData.specificationsTable?.["Life Time"] || null,
                maxIP: productData.MaxIP || null,
                spotlightType: productData.spotlightType,
                Brand: productData.Brand,
                price: productData.price,
                sectionType: productData.sectionType,
                quantity: productData.quantity,
                category: { connect: { id: categoryRecord.id } },
                lightingtype: { connect: { id: lightingTypeRecord.id } },
                productColor: productData.specificationsTable
                  ? determineProductColor(productData)
                  : ProductColorTemp.warm,
                productIp: productData.specificationsTable
                  ? determineProductIp(productData)
                  : ProductIP.IP20,
                discount: productData.discount || 0,
                finish: productData.specificationsTable?.Finished || null,
                lampBase: productData.specificationsTable?.["Lamp Base"] || null,
                bulb: productData.specificationsTable?.BULB || null,
                hNumber:
                  productData.Hnumber ||
                  productData.specificationsTable?.Hnumber ||
                  productData.specificationsTable?.["Hnumber"] ||
                  null,
                ChandelierLightingType:
                  productData.ChandelierLightingType || null,
              };
              await prisma.product.upsert({
                where: { productId: productData.ProductId },
                update: productCreateData,
                create: productCreateData,
              });
              console.log(
                `Product with ID ${productData.ProductId} processed.`,
              );
            } catch (error) {
              console.error(
                `Error processing product with ID ${productId}:`,
                error,
              );
            }
          }
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });