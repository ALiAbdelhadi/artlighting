import { db } from "@/db";
import ProductsClient from "./ProductClient";
const ProductsPage =  async () => {
    const productIds = [
        "product-jy-805-7w",
        "product-jy-903-8w",
        "product-jy-lnrd-001b-32w",
        "product-jy-un-002-3w",
        "product-jy-540-7w",
        "product-MC15C001",
        "product-MC15P400",
        "product-MC6015-H3",
        "product-MC6038-P1",
        "product-jy-202-15w"
    ];
    const selectedProducts = await db.product.findMany({
        where: {
            productId: {in: productIds}
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return (
        <ProductsClient products={selectedProducts}/>
    )
}

export default ProductsPage