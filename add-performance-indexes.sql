-- ============================================================================
-- DATABASE PERFORMANCE INDEXES
-- Critical indexes to fix N+1 queries and improve query performance
-- ============================================================================

-- Product indexes for common query patterns
CREATE INDEX IF NOT EXISTS "idx_product_brand_section_active_featured" 
ON "Product"("brand", "sectionType", "isActive", "featured");

CREATE INDEX IF NOT EXISTS "idx_product_brand_section_spotlight_active" 
ON "Product"("brand", "sectionType", "spotlightType", "isActive");

CREATE INDEX IF NOT EXISTS "idx_product_category_active" 
ON "Product"("categoryId", "isActive");

CREATE INDEX IF NOT EXISTS "idx_product_lighting_type_active" 
ON "Product"("lightingtypeId", "isActive");

CREATE INDEX IF NOT EXISTS "idx_product_featured_active" 
ON "Product"("featured", "isActive");

CREATE INDEX IF NOT EXISTS "idx_product_created_at" 
ON "Product"("createdAt" DESC);

-- ProductTranslation indexes for faster lookups
CREATE INDEX IF NOT EXISTS "idx_product_translation_product_language" 
ON "ProductTranslation"("productId", "language");

CREATE INDEX IF NOT EXISTS "idx_product_translation_language_name" 
ON "ProductTranslation"("language", "name");

-- ProductSpecification indexes
CREATE INDEX IF NOT EXISTS "idx_product_specification_product_language" 
ON "ProductSpecification"("productId", "language");

-- Order indexes for user queries and status filtering
CREATE INDEX IF NOT EXISTS "idx_order_user_created" 
ON "Order"("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_status_created" 
ON "Order"("status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_completed_created" 
ON "Order"("isCompleted", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_user_status" 
ON "Order"("userId", "status");

-- Configuration indexes
CREATE INDEX IF NOT EXISTS "idx_configuration_product_updated" 
ON "Configuration"("productId", "updatedAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_configuration_user" 
ON "Configuration"("userId");

-- Cart and CartItem indexes
CREATE INDEX IF NOT EXISTS "idx_cart_user" 
ON "Cart"("userId");

CREATE INDEX IF NOT EXISTS "idx_cart_item_cart" 
ON "CartItem"("cartId");

CREATE INDEX IF NOT EXISTS "idx_cart_item_product" 
ON "CartItem"("productId");

-- ShippingAddress index
CREATE INDEX IF NOT EXISTS "idx_shipping_address_user" 
ON "ShippingAddress"("userId");

-- Category and LightingType translation indexes
CREATE INDEX IF NOT EXISTS "idx_category_translation_category_language" 
ON "CategoryTranslation"("categoryId", "language");

CREATE INDEX IF NOT EXISTS "idx_lighting_type_translation_type_language" 
ON "LightingTypeTranslation"("lightingTypeId", "language");

-- ============================================================================
-- FULL-TEXT SEARCH INDEXES (PostgreSQL specific)
-- ============================================================================

-- Full-text search on Product
CREATE INDEX IF NOT EXISTS "idx_product_name_fulltext" 
ON "Product" USING gin(to_tsvector('english', "productName"));

CREATE INDEX IF NOT EXISTS "idx_product_brand_fulltext" 
ON "Product" USING gin(to_tsvector('english', "brand"));

-- Full-text search on ProductTranslation
CREATE INDEX IF NOT EXISTS "idx_product_translation_name_fulltext" 
ON "ProductTranslation" USING gin(to_tsvector('english', "name"));

-- ============================================================================
-- ANALYZE tables to update statistics
-- ============================================================================

ANALYZE "Product";
ANALYZE "ProductTranslation";
ANALYZE "ProductSpecification";
ANALYZE "Order";
ANALYZE "Configuration";
ANALYZE "Cart";
ANALYZE "CartItem";
