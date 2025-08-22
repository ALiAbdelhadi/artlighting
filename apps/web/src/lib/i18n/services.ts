import { prisma } from "@repo/database";
import type { SupportedLanguage, LocalizedCategory, SectionType, LocalizedProduct } from "./types";
interface LocalizedProduct {
    // المعرفات الأساسية
    id: string;
    productId: string;
    productName: string;
    localizedName?: string;
    localizedDescription?: string;

    // بيانات المنتج
    brand: string;
    price: number;
    discount?: number;
    priceIncrease?: number;
    quantity: number;

    // الصور
    images: string[];
    productImages?: string[]; // للتوافق

    // التصنيف
    sectionType: string;
    spotlightType: string;
    categoryId?: string;
    lightingtypeId?: string;

    // البيانات الفنية المهمة
    maxIP?: number;
    hNumber?: number; // مهم للنجف
    chandelierLightingType?: string; // مهم للنجف

    // الخصائص
    productColor?: string;
    productIp?: string;
    productChandLamp?: string;

    // الحالة
    isActive?: boolean;
    featured?: boolean;

    // المواصفات
    specifications?: {
        language: string;
        maximumWattage?: string;
        mainMaterial?: string;
        beamAngle?: string;
        lampBase?: string;
        input?: string;
        brandOfLed?: string;
        luminousFlux?: string;
        cri?: string;
        workingTemperature?: string;
        fixtureDimmable?: string;
        electrical?: string;
        powerFactor?: string;
        colorTemperature?: string;
        ip?: string;
        energySaving?: string;
        lifeTime?: string;
        finish?: string;
        bulb?: string;
        customSpecs?: any;
    };

    // للتوافق مع الكود القديم
    specificationsArray?: any[];
    translations?: any[];
    maximumWattage?: string;
    mainMaterial?: string;
    beamAngle?: string;
    lampBase?: string;
    colorTemperature?: string;
    lifeTime?: string;
    finish?: string;
    input?: string;

    // التوقيتات
    createdAt?: Date;
    updatedAt?: Date;
}
export class I18nService {
    private static instance: I18nService;
    private translationCache = new Map<string, any>();

    static getInstance(): I18nService {
        if (!this.instance) {
            this.instance = new I18nService();
        }
        return this.instance;
    }

    private getCacheKey(entity: string, language: string, ...params: string[]): string {
        return `${entity}_${language}_${params.join('_')}`;
    }

    /**
     * Get localized categories for a specific brand
     */
    async getLocalizedCategories(
        brand: string,
        language: SupportedLanguage = "en"
    ): Promise<LocalizedCategory[]> {
        const cacheKey = this.getCacheKey("categories", language, brand);

        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            // Get categories with product counts
            const categoriesWithCounts = await prisma.product.groupBy({
                by: ["sectionType", "categoryId"],
                where: {
                    brand: brand,
                    isActive: true,
                },
                _count: {
                    _all: true,
                },
                orderBy: {
                    sectionType: "desc",
                },
            });

            // Get category details with translations
            const categoryIds = [...new Set(categoriesWithCounts.map(c => c.categoryId))];

            const categoriesWithTranslations = await prisma.category.findMany({
                where: {
                    id: { in: categoryIds },
                    isActive: true,
                },
                include: {
                    translations: {
                        where: {
                            language: language,
                        },
                    },
                },
            });

            // Merge data and create localized categories
            const localizedCategories: LocalizedCategory[] = categoriesWithCounts.map(groupItem => {
                const categoryDetail = categoriesWithTranslations.find(c => c.id === groupItem.categoryId);
                const translation = categoryDetail?.translations[0];

                return {
                    id: groupItem.categoryId,
                    name: categoryDetail?.name || groupItem.sectionType,
                    slug: categoryDetail?.slug || groupItem.sectionType,
                    localizedName: translation?.name || categoryDetail?.name || groupItem.sectionType,
                    localizedSlug: translation?.slug || categoryDetail?.slug || groupItem.sectionType,
                    sectionType: groupItem.sectionType,
                    productCount: groupItem._count._all,
                    image: this.getSectionTypeImage(groupItem.sectionType as SectionType),
                };
            });

            // Cache the result for 5 minutes
            this.translationCache.set(cacheKey, localizedCategories);
            setTimeout(() => {
                this.translationCache.delete(cacheKey);
            }, 5 * 60 * 1000);

            return localizedCategories;
        } catch (error) {
            console.error(`Failed to get localized categories for ${brand}:`, error);
            throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get localized lighting types for a category
     */
    async getLocalizedLightingTypes(
        brand: string,
        sectionType: string,
        language: SupportedLanguage = "en"
    ) {
        const cacheKey = this.getCacheKey("lightingTypes", language, brand, sectionType);

        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            // نفس الكود الحالي
            const lightingTypesWithCounts = await prisma.product.groupBy({
                by: ["lightingtypeId", "spotlightType", "categoryId"], // أضفنا categoryId هنا
                where: {
                    brand,
                    sectionType,
                    isActive: true,
                },
                _count: { _all: true },
            });

            const lightingTypeIds = [...new Set(lightingTypesWithCounts.map(lt => lt.lightingtypeId))];
            const categoryIds = [...new Set(lightingTypesWithCounts.map(lt => lt.categoryId))];

            // جلب الترجمات
            const [lightingTypesWithTranslations, categoriesWithTranslations, firstProductImages] = await Promise.all([
                prisma.lightingType.findMany({
                    where: { id: { in: lightingTypeIds }, isActive: true },
                    include: { translations: { where: { language } } },
                }),
                prisma.category.findMany({
                    where: { id: { in: categoryIds }, isActive: true },
                    include: { translations: { where: { language } } },
                }),
                Promise.all(
                    lightingTypesWithCounts.map(async (groupItem) => {
                        const firstProduct = await prisma.product.findFirst({
                            where: {
                                brand,
                                sectionType,
                                spotlightType: groupItem.spotlightType,
                                isActive: true,
                                productImages: { isEmpty: false },
                            },
                            select: { productImages: true, spotlightType: true },
                            orderBy: { createdAt: "asc" },
                        });
                        return {
                            spotlightType: groupItem.spotlightType,
                            firstImage: firstProduct?.productImages?.[0] || null,
                        };
                    })
                )
            ]);

            const localizedLightingTypes = lightingTypesWithCounts.map(groupItem => {
                const lightingTypeDetail = lightingTypesWithTranslations.find(lt => lt.id === groupItem.lightingtypeId);
                const translation = lightingTypeDetail?.translations[0];
                const imageData = firstProductImages.find(img => img.spotlightType === groupItem.spotlightType);
                const categoryDetail = categoriesWithTranslations.find(c => c.id === groupItem.categoryId);
                const categoryTranslation = categoryDetail?.translations[0];

                return {
                    id: groupItem.lightingtypeId,
                    name: lightingTypeDetail?.name || groupItem.spotlightType,
                    slug: lightingTypeDetail?.slug || groupItem.spotlightType,
                    localizedName: translation?.name || lightingTypeDetail?.name || groupItem.spotlightType,
                    localizedSlug: translation?.slug || lightingTypeDetail?.slug || groupItem.spotlightType,
                    spotlightType: groupItem.spotlightType,
                    productCount: groupItem._count._all,
                    firstProductImage: imageData?.firstImage || null,
                    // أضفنا اسم الكاتيجوري المترجم هنا
                    localizedCategoryName: categoryTranslation?.name || categoryDetail?.name || "",
                };
            });

            this.translationCache.set(cacheKey, localizedLightingTypes);
            setTimeout(() => this.translationCache.delete(cacheKey), 5 * 60 * 1000);

            return localizedLightingTypes;
        } catch (error) {
            console.error(`Failed to get localized lighting types:`, error);
            throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    /**
     * Get localized products
     */
    async getLocalizedProducts(
        filters: {
            brand?: string;
            sectionType?: string;
            spotlightType?: string;
            categoryId?: string;
            lightingtypeId?: string;
        },
        language: SupportedLanguage = "en",
        pagination: { page: number; limit: number } = { page: 1, limit: 20 },
        options?: {
            includeSpecifications?: boolean;
            includeTranslations?: boolean;
            includeImages?: boolean;
        }
    ): Promise<{ products: LocalizedProduct[]; total: number; hasMore: boolean }> {
        const cacheKey = this.getCacheKey(
            "products",
            language,
            JSON.stringify(filters),
            `${pagination.page}_${pagination.limit}`,
            JSON.stringify(options || {})
        );

        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            const where = {
                ...filters,
                isActive: true,
            };

            // تحديد الحقول المطلوبة بناءً على الخيارات
            const includeFields = {
                translations: options?.includeTranslations !== false ? {
                    where: { language },
                } : false,
                specifications: options?.includeSpecifications !== false ? {
                    where: { language },
                } : false,
                // يمكن إضافة المزيد من العلاقات حسب الحاجة
            };

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    include: includeFields,
                    skip: (pagination.page - 1) * pagination.limit,
                    take: pagination.limit,
                    orderBy: [
                        { featured: 'desc' },
                        { createdAt: 'desc' },
                    ],
                }),
                prisma.product.count({ where }),
            ]);

            const localizedProducts: LocalizedProduct[] = products.map(product => {
                // الحصول على المواصفات الأولى أو إنشاء واحدة افتراضية
                const primarySpec = product.specifications?.[0];

                // الحصول على الترجمة الأولى أو استخدام الاسم الأساسي
                const primaryTranslation = product.translations?.[0];

                return {
                    // المعرفات الأساسية
                    id: product.id,
                    productId: product.productId,
                    productName: product.productName,
                    localizedName: primaryTranslation?.name || product.productName,
                    localizedDescription: primaryTranslation?.description,

                    // بيانات المنتج الأساسية
                    brand: product.brand,
                    price: product.price,
                    discount: product.discount || 0,
                    priceIncrease: product.priceIncrease || 0,
                    quantity: product.quantity,

                    // الصور
                    images: product.productImages,
                    productImages: product.productImages, // للتوافق مع الإصدارات القديمة

                    // التصنيف والنوع
                    sectionType: product.sectionType,
                    spotlightType: product.spotlightType,
                    categoryId: product.categoryId,
                    lightingtypeId: product.lightingtypeId,

                    // البيانات الفنية المهمة
                    maxIP: product.maxIP,
                    hNumber: product.hNumber, // هذا هو الحقل المفقود!
                    chandelierLightingType: product.chandelierLightingType, // وهذا أيضاً!

                    // الخصائص التقنية
                    productColor: product.productColor,
                    productIp: product.productIp,
                    productChandLamp: product.productChandLamp,

                    // حالة المنتج
                    isActive: product.isActive,
                    featured: product.featured,

                    // المواصفات المفصلة
                    specifications: primarySpec ? {
                        language: primarySpec.language,
                        maximumWattage: primarySpec.maximumWattage,
                        mainMaterial: primarySpec.mainMaterial,
                        beamAngle: primarySpec.beamAngle,
                        lampBase: primarySpec.lampBase,
                        input: primarySpec.input,
                        brandOfLed: primarySpec.brandOfLed,
                        luminousFlux: primarySpec.luminousFlux,
                        cri: primarySpec.cri,
                        workingTemperature: primarySpec.workingTemperature,
                        fixtureDimmable: primarySpec.fixtureDimmable,
                        electrical: primarySpec.electrical,
                        powerFactor: primarySpec.powerFactor,
                        colorTemperature: primarySpec.colorTemperature,
                        ip: primarySpec.ip,
                        energySaving: primarySpec.energySaving,
                        lifeTime: primarySpec.lifeTime,
                        finish: primarySpec.finish,
                        bulb: primarySpec.bulb,
                        customSpecs: primarySpec.customSpecs,
                    } : undefined,

                    // مصفوفة المواصفات الكاملة (للتوافق)
                    specificationsArray: product.specifications || [],

                    // مصفوفة الترجمات الكاملة
                    translations: product.translations || [],

                    // التوقيتات
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,

                    // للتوافق مع الكود القديم - نسخ المواصفات للمستوى الأعلى
                    maximumWattage: primarySpec?.maximumWattage,
                    mainMaterial: primarySpec?.mainMaterial,
                    beamAngle: primarySpec?.beamAngle,
                    lampBase: primarySpec?.lampBase,
                    colorTemperature: primarySpec?.colorTemperature,
                    lifeTime: primarySpec?.lifeTime,
                    finish: primarySpec?.finish,
                    input: primarySpec?.input,
                };
            });

            const result = {
                products: localizedProducts,
                total,
                hasMore: pagination.page * pagination.limit < total,
            };

            // إضافة تسجيل للمراقبة
            console.log('🔍 [getLocalizedProducts] Result sample:', {
                count: localizedProducts.length,
                firstProduct: localizedProducts[0] ? {
                    productId: localizedProducts[0].productId,
                    localizedName: localizedProducts[0].localizedName,
                    hNumber: localizedProducts[0].hNumber,
                    chandelierLightingType: localizedProducts[0].chandelierLightingType,
                    hasSpecifications: !!localizedProducts[0].specifications,
                    specificationsKeys: localizedProducts[0].specifications ? Object.keys(localizedProducts[0].specifications) : [],
                } : null
            });

            this.translationCache.set(cacheKey, result);
            setTimeout(() => {
                this.translationCache.delete(cacheKey);
            }, 5 * 60 * 1000);

            return result;
        } catch (error) {
            console.error(`Failed to get localized products:`, error);
            throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // إضافة تعريف interface محدث لـ LocalizedProduct


    /**
     * Get single localized product with full details
     */
    async getLocalizedProduct(
        productId: string,
        language: SupportedLanguage = "en"
    ): Promise<LocalizedProduct | null> {
        const cacheKey = this.getCacheKey("product", language, productId);

        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            const product = await prisma.product.findUnique({
                where: { productId },
                include: {
                    translations: {
                        where: { language },
                    },
                    specifications: {
                        where: { language },
                    },
                    category: {
                        include: {
                            translations: {
                                where: { language },
                            },
                        },
                    },
                    lightingtype: {
                        include: {
                            translations: {
                                where: { language },
                            },
                        },
                    },
                },
            });

            if (!product) return null;

            const localizedProduct: LocalizedProduct = {
                id: product.id,
                productId: product.productId,
                productName: product.productName,
                localizedName: product.translations[0]?.name || product.productName,
                brand: product.brand,
                price: product.price,
                discount: product.discount || 0,
                images: product.productImages,
                specifications: product.specifications[0] ? this.formatSpecifications(product.specifications[0]) : undefined,
                quantity: product.quantity,
                maxIP: product.maxIP,
                spotlightType: product.spotlightType,
                sectionType: product.sectionType,
            };

            this.translationCache.set(cacheKey, localizedProduct);
            setTimeout(() => {
                this.translationCache.delete(cacheKey);
            }, 5 * 60 * 1000);

            return localizedProduct;
        } catch (error) {
            console.error(`Failed to get localized product ${productId}:`, error);
            return null;
        }
    }

    private formatSpecifications(specifications: any): Record<string, string> {
        const formatted: Record<string, string> = {};

        const fields = [
            'input', 'maximumWattage', 'brandOfLed', 'luminousFlux',
            'mainMaterial', 'cri', 'beamAngle', 'workingTemperature',
            'fixtureDimmable', 'electrical', 'powerFactor', 'colorTemperature',
            'ip', 'energySaving', 'lifeTime', 'finish', 'lampBase', 'bulb'
        ];

        fields.forEach(field => {
            if (specifications[field]) {
                formatted[field] = specifications[field];
            }
        });

        // Add custom specifications if they exist
        if (specifications.customSpecs) {
            Object.assign(formatted, specifications.customSpecs);
        }

        return formatted;
    }

    private getSectionTypeImage(sectionType: SectionType): string {
        const sectionTypeImages: Record<SectionType, string> = {
            indoor: "/indoor/products500/jy-539-7w/JY-539-7W (1).png",
            outdoor: "/new-collection/new-collection-2.jpg",
            chandelier: "/chandelier/MC15W/MC15W009.jpg",
        };

        return sectionTypeImages[sectionType] || "/brand/balcom.png";
    }

    /**
     * Clear all cached translations
     */
    clearCache(): void {
        this.translationCache.clear();
    }

    /**
     * Clear cache for specific language
     */
    clearLanguageCache(language: SupportedLanguage): void {
        const keysToDelete = Array.from(this.translationCache.keys())
            .filter(key => key.includes(`_${language}_`));

        keysToDelete.forEach(key => {
            this.translationCache.delete(key);
        });
    }
}