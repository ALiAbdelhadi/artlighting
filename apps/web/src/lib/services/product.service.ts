// apps/web/src/lib/services/product.service.ts
import { prisma } from "@repo/database";
import type { Prisma } from "@repo/database";
import { CacheService, CacheTTL, CachePrefix } from "@/lib/cache/redis.service";

export interface ProductFilters {
  brand?: string;
  sectionType?: string;
  spotlightType?: string;
  categoryId?: string;
  lightingtypeId?: string;
  isActive?: boolean;
  featured?: boolean;
  searchQuery?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface ProductListResult<T> {
  products: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * Optimized Product Service - Eliminates N+1 queries
 * Uses Redis caching and eager loading
 */
export class ProductService {
  private static readonly DEFAULT_PAGE_SIZE = 20;
  private static readonly MAX_PAGE_SIZE = 100;

  /**
   * Get products with translations and specifications (OPTIMIZED - No N+1)
   * Uses eager loading, proper indexing, and Redis caching
   */
  static async getLocalizedProducts(
    filters: ProductFilters,
    language: string,
    pagination: PaginationParams = {}
  ): Promise<ProductListResult<unknown>> {
    const {
      page = 1,
      limit = this.DEFAULT_PAGE_SIZE,
      cursor
    } = pagination;

    const safeLimit = Math.min(limit, this.MAX_PAGE_SIZE);
    const skip = cursor ? undefined : (page - 1) * safeLimit;

    const cacheKey = `${CachePrefix.PRODUCTS_LIST}${JSON.stringify(filters)}:${language}:${page}:${safeLimit}`;

    const cached = await CacheService.get<ProductListResult<unknown>>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Prisma.ProductWhereInput = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
      ...(filters.brand && { brand: filters.brand }),
      ...(filters.sectionType && { sectionType: filters.sectionType }),
      ...(filters.spotlightType && { spotlightType: filters.spotlightType }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.lightingtypeId && { lightingtypeId: filters.lightingtypeId }),
      ...(filters.featured !== undefined && { featured: filters.featured }),
      ...(filters.searchQuery && {
        OR: [
          { productName: { contains: filters.searchQuery, mode: "insensitive" } },
          { brand: { contains: filters.searchQuery, mode: "insensitive" } },
          { sectionType: { contains: filters.searchQuery, mode: "insensitive" } }
        ]
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          translations: {
            where: { language },
            take: 1
          },
          specifications: {
            where: { language },
            take: 1
          }
        },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : { skip }),
        take: safeLimit + 1,
        orderBy: [
          { featured: "desc" },
          { createdAt: "desc" }
        ]
      }),
      prisma.product.count({ where })
    ]);

    const hasMore = products.length > safeLimit;
    const returnProducts = hasMore ? products.slice(0, safeLimit) : products;
    const nextCursor = hasMore ? returnProducts[returnProducts.length - 1]?.id : undefined;

    const result = {
      products: returnProducts,
      total,
      hasMore,
      nextCursor
    };

    await CacheService.set(cacheKey, result, CacheTTL.FIVE_MINUTES);

    return result;
  }

  static async getProductById(productId: string, language: string) {
    const cacheKey = `${CachePrefix.PRODUCT}${productId}:${language}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        translations: { where: { language }, take: 1 },
        specifications: { where: { language }, take: 1 },
        category: {
          include: { translations: { where: { language }, take: 1 } }
        },
        lightingtype: {
          include: { translations: { where: { language }, take: 1 } }
        }
      }
    });

    if (product) {
      await CacheService.set(cacheKey, product, CacheTTL.FIFTEEN_MINUTES);
    }

    return product;
  }

  static async getRelatedProducts(
    productId: string,
    brand: string,
    sectionType: string,
    language: string,
    limit: number = 8
  ) {
    const cacheKey = `${CachePrefix.PRODUCTS_LIST}related:${productId}:${language}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        brand,
        sectionType,
        isActive: true
      },
      include: {
        translations: { where: { language }, take: 1 },
        specifications: { where: { language }, take: 1 }
      },
      take: limit,
      orderBy: { featured: "desc" }
    });

    await CacheService.set(cacheKey, products, CacheTTL.FIVE_MINUTES);

    return products;
  }

  static async getFeaturedProducts(language: string, limit: number = 10) {
    const cacheKey = `${CachePrefix.PRODUCTS_LIST}featured:${language}:${limit}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: {
        translations: { where: { language }, take: 1 },
        specifications: { where: { language }, take: 1 }
      },
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    await CacheService.set(cacheKey, products, CacheTTL.FIVE_MINUTES);

    return products;
  }

  static async getProductsByIds(productIds: string[], language: string) {
    return prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        translations: { where: { language }, take: 1 },
        specifications: { where: { language }, take: 1 }
      }
    });
  }

  static async getProductWithConfiguration(
    productId: string,
    userId: string | null,
    language: string
  ) {
    const [product, configuration] = await Promise.all([
      this.getProductById(productId, language),
      userId
        ? prisma.configuration.findFirst({
            where: { productId, users: { some: { id: userId } } },
            orderBy: { updatedAt: "desc" }
          })
        : null
    ]);

    return { product, configuration };
  }

  static async invalidateProductCache(productId?: string) {
    if (productId) {
      await CacheService.deletePattern(`${CachePrefix.PRODUCT}${productId}:*`);
    }
    await CacheService.deletePattern(`${CachePrefix.PRODUCTS_LIST}*`);
  }
}
