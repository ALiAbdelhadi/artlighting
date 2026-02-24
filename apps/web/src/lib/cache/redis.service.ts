import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const CacheTTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  ONE_HOUR: 3600,
  SIX_HOURS: 21600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
} as const;

export const CachePrefix = {
  PRODUCT: "product:",
  PRODUCTS_LIST: "products:list:",
  PRODUCT_TRANSLATION: "product:trans:",
  PRODUCT_SPEC: "product:spec:",
  CATEGORY: "category:",
  CATEGORY_TRANSLATION: "category:trans:",
  LIGHTING_TYPE: "lighting:",
  LIGHTING_TYPE_TRANSLATION: "lighting:trans:",
  ORDER: "order:",
  CONFIGURATION: "config:",
  CART: "cart:",
  SEARCH: "search:",
  USER: "user:",
} as const;

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get<string | null>(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  static async set<T>(
    key: string,
    data: T,
    ttl: number = CacheTTL.FIVE_MINUTES
  ): Promise<boolean> {
    try {
      const payload = JSON.stringify(data);
      await redis.setex(key, ttl, payload);
      return true;
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache DELETE error for key ${key}:`, error);
      return false;
    }
  }

  static async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;

      await redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`Cache DELETE PATTERN error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  static async getTTL(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  static async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      console.error(`Cache INCREMENT error for key ${key}:`, error);
      return 0;
    }
  }

  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CacheTTL.FIVE_MINUTES
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    await this.set(key, data, ttl);
    return data;
  }

  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const rawResults = await redis.mget<(string | null)[]>(...keys);
      return rawResults.map((raw) => {
        if (!raw) return null;
        try {
          return JSON.parse(raw) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error(`Cache MGET error for keys ${keys.join(", ")}:`, error);
      return keys.map(() => null);
    }
  }

  static async mset(items: Record<string, unknown>): Promise<boolean> {
    try {
      const pipeline = redis.pipeline();

      Object.entries(items).forEach(([key, value]) => {
        pipeline.set(key, JSON.stringify(value));
      });

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Cache MSET error:", error);
      return false;
    }
  }

  static async flushAll(): Promise<boolean> {
    try {
      await redis.flushall();
      return true;
    } catch (error) {
      console.error("Cache FLUSH ALL error:", error);
      return false;
    }
  }
}

export class ProductCache {
  static async cacheProduct(productId: string, data: unknown): Promise<boolean> {
    const key = `${CachePrefix.PRODUCT}${productId}`;
    return CacheService.set(key, data, CacheTTL.FIFTEEN_MINUTES);
  }

  static async getProduct<T>(productId: string): Promise<T | null> {
    const key = `${CachePrefix.PRODUCT}${productId}`;
    return CacheService.get<T>(key);
  }

  static async invalidateProduct(productId: string): Promise<boolean> {
    const key = `${CachePrefix.PRODUCT}${productId}`;
    return CacheService.delete(key);
  }

  static async cacheProductList(
    filters: string,
    data: unknown
  ): Promise<boolean> {
    const key = `${CachePrefix.PRODUCTS_LIST}${filters}`;
    return CacheService.set(key, data, CacheTTL.FIVE_MINUTES);
  }

  static async getProductList<T>(filters: string): Promise<T | null> {
    const key = `${CachePrefix.PRODUCTS_LIST}${filters}`;
    return CacheService.get<T>(key);
  }

  static async invalidateAllProductLists(): Promise<number> {
    return CacheService.deletePattern(`${CachePrefix.PRODUCTS_LIST}*`);
  }
}

export class TranslationCache {
  static async cacheTranslations(
    entityType: string,
    entityId: string,
    language: string,
    data: unknown
  ): Promise<boolean> {
    const key = `${entityType}:trans:${entityId}:${language}`;
    return CacheService.set(key, data, CacheTTL.ONE_HOUR);
  }

  static async getTranslations<T>(
    entityType: string,
    entityId: string,
    language: string
  ): Promise<T | null> {
    const key = `${entityType}:trans:${entityId}:${language}`;
    return CacheService.get<T>(key);
  }

  static async invalidateTranslations(
    entityType: string,
    entityId: string
  ): Promise<number> {
    return CacheService.deletePattern(`${entityType}:trans:${entityId}:*`);
  }
}

export class SearchCache {
  static async cacheSearchResults(
    query: string,
    language: string,
    page: number,
    data: unknown
  ): Promise<boolean> {
    const key = `${CachePrefix.SEARCH}${query}:${language}:${page}`;
    return CacheService.set(key, data, CacheTTL.ONE_MINUTE);
  }

  static async getSearchResults<T>(
    query: string,
    language: string,
    page: number
  ): Promise<T | null> {
    const key = `${CachePrefix.SEARCH}${query}:${language}:${page}`;
    return CacheService.get<T>(key);
  }

  static async invalidateAllSearches(): Promise<number> {
    return CacheService.deletePattern(`${CachePrefix.SEARCH}*`);
  }
}
