// apps/web/src/lib/cache/redis.service.ts
import { Redis } from "@upstash/redis";

/**
 * Redis Caching Service
 * Replaces in-memory caching for production scalability
 * Works in serverless environments
 */

// Initialize Redis (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env)
const redis = Redis.fromEnv();

/**
 * Cache TTL (Time To Live) configurations in seconds
 */
export const CacheTTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  ONE_HOUR: 3600,
  SIX_HOURS: 21600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
} as const;

/**
 * Cache key prefixes for organization
 */
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
  /**
   * Get value from cache
   * Returns null if key doesn't exist or has expired
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  static async set<T>(
    key: string,
    data: T,
    ttl: number = CacheTTL.FIVE_MINUTES
  ): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete a specific key from cache
   */
  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache DELETE error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete all keys matching a pattern
   * Use with caution - can be slow with many keys
   */
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

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL of a key in seconds
   * Returns -1 if key doesn't exist, -2 if key has no TTL
   */
  static async getTTL(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a counter
   * Useful for rate limiting or analytics
   */
  static async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      console.error(`Cache INCREMENT error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Cache-aside pattern helper
   * Tries to get from cache, if miss then fetches from source and caches
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CacheTTL.FIVE_MINUTES
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch from source
    const data = await fetchFn();
    
    // Store in cache
    await this.set(key, data, ttl);
    
    return data;
  }

  /**
   * Get multiple keys at once (pipeline)
   * More efficient than multiple individual gets
   */
  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const results = await redis.mget(...keys);
      return results as (T | null)[];
    } catch (error) {
      console.error(`Cache MGET error for keys ${keys.join(", ")}:`, error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple keys at once (pipeline)
   * More efficient than multiple individual sets
   */
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

  /**
   * Clear all cache
   * USE WITH EXTREME CAUTION - only for testing/development
   */
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
