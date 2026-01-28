/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// Shipping
export const SHIPPING_PRICE_CAIRO = 69;
export const SHIPPING_PRICE_DEFAULT = 0; // To be determined for outside Cairo

// Delivery
export const DELIVERY_DAYS_CAIRO = 5;
export const DELIVERY_DAYS_OUTSIDE_CAIRO = 7;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const SEARCH_RESULTS_LIMIT = 10;

// Rate Limiting (requests per minute)
export const RATE_LIMITS = {
  AUTH: 10,
  API: 100,
  WRITE: 30,
  ORDER: 5,
  READ: 200,
  SEARCH: 50,
} as const;

// Products
export const FEATURED_PRODUCTS_LIMIT = 10;
export const RELATED_PRODUCTS_LIMIT = 8;

// Currency
export const DEFAULT_CURRENCY = "EGP";
export const SUPPORTED_CURRENCIES = ["EGP"] as const;

// Languages
export const DEFAULT_LANGUAGE = "ar";
export const SUPPORTED_LANGUAGES = ["ar", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
