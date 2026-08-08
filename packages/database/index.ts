import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

const basePrisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = basePrisma
}

/**
 * `prisma.product.updatePrice(...)` is the only sanctioned way to change
 * Product.price — it atomically writes a PriceHistory row in the same
 * transaction. A generic `product.update` interceptor was considered instead
 * (to catch every write site automatically) but Prisma's client-extension API
 * has no reliable way to thread a `changedBy` value through arbitrary update
 * calls, and it would silently miss price changes made via upsert/updateMany/
 * raw SQL anyway — an explicit method that admin code must call is more honest
 * about what's actually covered.
 */
export const prisma = basePrisma.$extends({
  name: 'product-price-history',
  model: {
    product: {
      async updatePrice(productId: string, newPrice: number, changedBy: string) {
        return basePrisma.$transaction(async (tx) => {
          const current = await tx.product.findUniqueOrThrow({
            where: { id: productId },
            select: { price: true },
          })

          const updated = await tx.product.update({
            where: { id: productId },
            data: { price: newPrice },
          })

          if (current.price !== newPrice) {
            await tx.priceHistory.create({
              data: { productId, oldPrice: current.price, newPrice, changedBy },
            })
          }

          return updated
        })
      },
    },
  },
})

export * from "@prisma/client";