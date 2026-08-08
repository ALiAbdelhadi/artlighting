-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."OrderOption" AS ENUM ('BasicShipping', 'StandardShipping', 'ExpressShipping');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('awaiting_shipment', 'processing', 'shipped', 'delivered', 'fulfilled', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "public"."ProductChandLamp" AS ENUM ('lamp9w', 'lamp12w');

-- CreateEnum
CREATE TYPE "public"."ProductColorTemp" AS ENUM ('warm', 'cool', 'white');

-- CreateEnum
CREATE TYPE "public"."ProductIP" AS ENUM ('IP20', 'IP44', 'IP54', 'IP65', 'IP68');

-- CreateTable
CREATE TABLE "public"."cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "slug" TEXT,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."configurations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "configPrice" DOUBLE PRECISION NOT NULL,
    "priceIncrease" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "lampPriceIncrease" DOUBLE PRECISION DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "productIp" "public"."ProductIP" NOT NULL DEFAULT 'IP20',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."currency_rates" (
    "id" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lighting_type_translations" (
    "id" TEXT NOT NULL,
    "lightingTypeId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "slug" TEXT,

    CONSTRAINT "lighting_type_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lighting_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lighting_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "configPrice" DOUBLE PRECISION NOT NULL,
    "configurationId" TEXT,
    "localizedName" TEXT,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImages" TEXT[],
    "productColorTemp" TEXT NOT NULL,
    "productIp" TEXT NOT NULL,
    "productChandLamp" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'awaiting_shipment',
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "customerLanguage" TEXT NOT NULL DEFAULT 'ar',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productPrice" DOUBLE PRECISION NOT NULL,
    "discountedPrice" DOUBLE PRECISION,
    "discountApplied" BOOLEAN NOT NULL DEFAULT false,
    "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "configPrice" DOUBLE PRECISION NOT NULL,
    "priceIncrease" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brand" TEXT,
    "chandelierLightingType" TEXT,
    "orderTimeReceived" TIMESTAMP(3),
    "configurationId" TEXT,
    "shippingAddressId" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_specifications" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "input" TEXT,
    "maximumWattage" TEXT,
    "brandOfLed" TEXT,
    "luminousFlux" TEXT,
    "mainMaterial" TEXT,
    "cri" TEXT,
    "beamAngle" TEXT,
    "workingTemperature" TEXT,
    "fixtureDimmable" TEXT,
    "electrical" TEXT,
    "powerFactor" TEXT,
    "colorTemperature" TEXT,
    "ip" TEXT,
    "energySaving" TEXT,
    "lifeTime" TEXT,
    "finish" TEXT,
    "lampBase" TEXT,
    "bulb" TEXT,
    "customSpecs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_translations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImages" TEXT[],
    "maxIP" INTEGER,
    "spotlightType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceIncrease" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sectionType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "brand" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "chandelierLightingType" TEXT,
    "hNumber" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "lightingtypeId" TEXT NOT NULL,
    "productColor" "public"."ProductColorTemp" NOT NULL DEFAULT 'warm',
    "productIp" "public"."ProductIP" NOT NULL DEFAULT 'IP20',
    "productChandLamp" "public"."ProductChandLamp" NOT NULL DEFAULT 'lamp9w',

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shipping_addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'EG',
    "phoneNumber" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shipping_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'ar',
    "preferredCurrency" TEXT NOT NULL DEFAULT 'EGP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "configurationId" TEXT,
    "productId" TEXT,
    "shippingAddressId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cart_items_cartId_idx" ON "public"."cart_items"("cartId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "public"."cart_items"("cartId" ASC, "productId" ASC);

-- CreateIndex
CREATE INDEX "cart_items_productId_idx" ON "public"."cart_items"("productId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "public"."carts"("userId" ASC);

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "public"."categories"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name" ASC);

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "public"."categories"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_categoryId_language_key" ON "public"."category_translations"("categoryId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "category_translations_language_idx" ON "public"."category_translations"("language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_language_slug_key" ON "public"."category_translations"("language" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "idx_category_translation_category_language" ON "public"."category_translations"("categoryId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "configurations_productId_idx" ON "public"."configurations"("productId" ASC);

-- CreateIndex
CREATE INDEX "idx_configuration_product_updated" ON "public"."configurations"("productId" ASC, "updatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "currency_rates_fromCurrency_toCurrency_key" ON "public"."currency_rates"("fromCurrency" ASC, "toCurrency" ASC);

-- CreateIndex
CREATE INDEX "currency_rates_isActive_idx" ON "public"."currency_rates"("isActive" ASC);

-- CreateIndex
CREATE INDEX "idx_lighting_type_trans_type_language" ON "public"."lighting_type_translations"("lightingTypeId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "lighting_type_translations_language_idx" ON "public"."lighting_type_translations"("language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "lighting_type_translations_language_slug_key" ON "public"."lighting_type_translations"("language" ASC, "slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "lighting_type_translations_lightingTypeId_language_key" ON "public"."lighting_type_translations"("lightingTypeId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "lighting_types_isActive_idx" ON "public"."lighting_types"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "lighting_types_name_key" ON "public"."lighting_types"("name" ASC);

-- CreateIndex
CREATE INDEX "lighting_types_slug_idx" ON "public"."lighting_types"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "lighting_types_slug_key" ON "public"."lighting_types"("slug" ASC);

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "public"."order_items"("orderId" ASC);

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "public"."order_items"("productId" ASC);

-- CreateIndex
CREATE INDEX "idx_order_completed_created" ON "public"."orders"("isCompleted" ASC, "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_order_status_created" ON "public"."orders"("status" ASC, "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_order_user_created" ON "public"."orders"("userId" ASC, "createdAt" DESC);

-- CreateIndex
CREATE INDEX "orders_isCompleted_idx" ON "public"."orders"("isCompleted" ASC);

-- CreateIndex
CREATE INDEX "orders_productId_idx" ON "public"."orders"("productId" ASC);

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "public"."orders"("status" ASC);

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "public"."orders"("userId" ASC);

-- CreateIndex
CREATE INDEX "idx_product_spec_product_language" ON "public"."product_specifications"("productId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "product_specifications_language_idx" ON "public"."product_specifications"("language" ASC);

-- CreateIndex
CREATE INDEX "product_specifications_productId_idx" ON "public"."product_specifications"("productId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "product_specifications_productId_language_key" ON "public"."product_specifications"("productId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "idx_product_translation_product_language" ON "public"."product_translations"("productId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "product_translations_language_idx" ON "public"."product_translations"("language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_productId_language_key" ON "public"."product_translations"("productId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "idx_product_brand_section_active_featured" ON "public"."products"("brand" ASC, "sectionType" ASC, "isActive" ASC, "featured" ASC);

-- CreateIndex
CREATE INDEX "idx_product_brand_section_spotlight_active" ON "public"."products"("brand" ASC, "sectionType" ASC, "spotlightType" ASC, "isActive" ASC);

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "public"."products"("brand" ASC);

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "public"."products"("categoryId" ASC);

-- CreateIndex
CREATE INDEX "products_featured_idx" ON "public"."products"("featured" ASC);

-- CreateIndex
CREATE INDEX "products_isActive_idx" ON "public"."products"("isActive" ASC);

-- CreateIndex
CREATE INDEX "products_lightingtypeId_idx" ON "public"."products"("lightingtypeId" ASC);

-- CreateIndex
CREATE INDEX "products_productId_idx" ON "public"."products"("productId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "products_productId_key" ON "public"."products"("productId" ASC);

-- CreateIndex
CREATE INDEX "products_sectionType_idx" ON "public"."products"("sectionType" ASC);

-- CreateIndex
CREATE INDEX "products_spotlightType_idx" ON "public"."products"("spotlightType" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "shipping_addresses_userId_key" ON "public"."shipping_addresses"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key" ASC);

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_shippingAddressId_key" ON "public"."users"("shippingAddressId" ASC);

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category_translations" ADD CONSTRAINT "category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lighting_type_translations" ADD CONSTRAINT "lighting_type_translations_lightingTypeId_fkey" FOREIGN KEY ("lightingTypeId") REFERENCES "public"."lighting_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "public"."configurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "public"."configurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."shipping_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_specifications" ADD CONSTRAINT "product_specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_translations" ADD CONSTRAINT "product_translations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_lightingtypeId_fkey" FOREIGN KEY ("lightingtypeId") REFERENCES "public"."lighting_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shipping_addresses" ADD CONSTRAINT "shipping_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "public"."configurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

