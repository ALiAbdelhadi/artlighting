
import { prisma } from "@repo/database";
import ProductsClient from "./products-client";

const ProductsSection = async () => {
  const productIds = [
    "product-jy-202-15w",
    "product-jy-540-7w",
    "product-jy-810-30w",
    "product-jy-922-30w",
    "product-jy-lnrd-001b-32w",
    "product-MC15C001",
    "product-MC15P400",
    "product-MC15F001",
    "product-MC15G001",
    "product-MC15E004",
    "product-MC6014-H5",
    "product-MC6015-H3",
    "product-MC1608-H6",
    "product-MC6031-H5D",
    "product-MC6031-H5D",
    "product-MC6038-P1",
    "product-MC6041-P8",
    "product-MC6051-3",
    "product-MC6091-H8",
    "product-MC6094-P1",
    "product-MC6097-W1",
    "product-MC7021-H8",
    "product-MC7091-Rod",
    "product-MC7104-2",
    "product-MC7105-C1",
    "product-OH0109-H4",
    "product-OH1109-H5",
    "product-OH1203-H5",
    "product-OH1207-S2",
    "product-OH1209-H5",
    "product-OH1309-H6",
    "product-OH1601-H6",
    "product-jy-5050-12v-3000k",
    "product-jy-un-002-3w",
    "product-jy-un-009-3w",
    "product-jy-316-5w",
    "product-jy-5053-200w",
    "product-jy-309-36w",
  ];
  const selectedProducts = await prisma.product.findMany({
    where: {
      productId: { in: productIds },
    },
    orderBy: {
      createdAt: "asc"
    },
  });
  return <ProductsClient products={selectedProducts} />;
};

export default ProductsSection;
