-- ============================================================================
-- SUPPLEMENTARY INDEXES
-- Full-text search indexes only. Every composite/lookup index this file used
-- to declare is now expressed directly in packages/database/prisma/schema.prisma
-- as @@index(...) and is created automatically by `prisma migrate dev` /
-- `db push` — keeping them here too would just duplicate index creation.
--
-- Prisma's declarative @@index cannot express GIN/to_tsvector expression
-- indexes, so those three stay here as plain SQL, run manually post-migration.
--
-- Previous version of this file targeted PascalCase table names ("Product",
-- "Order", etc.) that never matched the schema's @@map'd snake_case tables
-- (products, orders, ...) — it would have failed or no-op'd if run as-is.
-- Table names below are corrected to match schema.prisma's @@map values.
-- ============================================================================

CREATE INDEX IF NOT EXISTS "idx_product_name_fulltext"
ON "products" USING gin(to_tsvector('english', "productName"));

CREATE INDEX IF NOT EXISTS "idx_product_brand_fulltext"
ON "products" USING gin(to_tsvector('english', "brand"));

CREATE INDEX IF NOT EXISTS "idx_product_translation_name_fulltext"
ON "product_translations" USING gin(to_tsvector('english', "name"));

ANALYZE "products";
ANALYZE "product_translations";
