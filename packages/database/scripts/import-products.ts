
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { existsSync, readFileSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_uwOxFJ0L4bTp@ep-rapid-pond-a2995531-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    },
  },
  log: ['warn', 'error'],
});

// Enhanced Type Definitions
type SupportedLanguage = "ar" | "en";
type ProductColorTemp = "warm" | "cool" | "white";
type ProductIP = "IP20" | "IP44" | "IP54" | "IP65" | "IP68";

interface TranslationMap {
  [key: string]: {
    en: string;
    ar: string;
  };
}

interface ProductSpecificationData {
  input?: string;
  maximumWattage?: string;
  brandOfLed?: string;
  luminousFlux?: string;
  mainMaterial?: string;
  cri?: string;
  beamAngle?: string;
  workingTemperature?: string;
  fixtureDimmable?: string;
  electrical?: string;
  powerFactor?: string;
  colorTemperature?: string;
  ip?: string;
  energySaving?: string;
  lifeTime?: string;
  finish?: string;
  lampBase?: string;
  bulb?: string;
  customSpecs?: Record<string, any> | null;
}

// Advanced Slug Generation Engine with Collision Detection
class SmartSlugGenerator {
  private static readonly SLUG_CACHE = new Map<string, Set<string>>();
  private static readonly ARABIC_TO_ENGLISH_MAP: Record<string, string> = {
    'داخلي': 'indoor',
    'خارجي': 'outdoor',
    'نجف': 'chandelier',
    'معلق': 'pendant',
    'سقف': 'ceiling',
    'جداري': 'wall',
    'اضاءه جدارية': 'wall-washer',
    'إضاءة سفلية': 'downlight',
    'كشاف ضوء': 'spotlight',
    'العائله 202': 'family-202',
    'العائله 500': 'family-500',
    'العائله 800': 'family-800',
    'العائله 900': 'family-900',
    'شريط ليد': 'led-strip',
    'اضاءة خطية': 'linear-lighting',
    'إضاءة علوية': 'uplight',
    'حربات': 'spikes',
    'اعمدة': 'bollards',
  };

  /**
   * Generate unique, SEO-friendly slugs with collision detection
   */
  static generateUniqueSlug(
    text: string,
    language: SupportedLanguage,
    context: string = 'global'
  ): string {
    // Use direct mapping for Arabic terms to ensure consistency
    const baseSlug = language === 'ar' && this.ARABIC_TO_ENGLISH_MAP[text]
      ? this.ARABIC_TO_ENGLISH_MAP[text]
      : this.sanitizeText(text);

    const cacheKey = `${language}-${context}`;

    if (!this.SLUG_CACHE.has(cacheKey)) {
      this.SLUG_CACHE.set(cacheKey, new Set());
    }

    const existingSlugs = this.SLUG_CACHE.get(cacheKey)!;
    let finalSlug = baseSlug;
    let counter = 1;

    // Handle collisions by appending counter
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    existingSlugs.add(finalSlug);
    return finalSlug;
  }

  /**
   * Advanced text sanitization for URL-friendly slugs
   */
  private static sanitizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Remove Arabic diacritics and special characters
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      // Replace Arabic/English spaces and punctuation
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      // Convert multiple spaces to single hyphen
      .replace(/[\s_\u00A0]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length for SEO
      .substring(0, 50)
      .replace(/-+$/, ''); // Remove trailing hyphens after truncation
  }

  /**
   * Generate hash-based fallback for problematic strings
   */
  static generateHashSlug(text: string, context: string): string {
    const hash = crypto.createHash('md5').update(`${text}-${context}`).digest('hex').substring(0, 8);
    return `item-${hash}`;
  }

  /**
   * Clear cache for testing/development
   */
  static clearCache(): void {
    this.SLUG_CACHE.clear();
  }
}

class EnterpriseTranslationRegistry {
  private static readonly CATEGORY_TRANSLATIONS: TranslationMap = {
    indoor: { en: "Indoor Lighting", ar: "إضاءة داخلية" },
    outdoor: { en: "Outdoor Lighting", ar: "إضاءة خارجية" },
    chandelier: { en: "Chandeliers", ar: "النجف" },
  };

  private static readonly LIGHTING_TYPE_TRANSLATIONS: TranslationMap = {
    "track-light": { en: "Track light", ar: "تراك لايت" },
    cob: { en: "COB", ar: "COB" },
    "panel-light": { en: "Panel light", ar: "إضاءة بانل" },
    "led-strip": { en: "LED Strips", ar: "شرائط الليد" },
    "linear-lighting": { en: "Linear Lighting", ar: "الإضاءة الخطية" },
    "uplight": { en: "Uplights", ar: "الإضاءة العلوية" },
    "spikes": { en: "Spike Lights", ar: "الحربات" },
    "bollard": { en: "Bollard Lights", ar: "إضاءة الأعمدة" },
    "flood-light": { en: "Flood Lights", ar: "كشافات الوجهات و الملاعب" },
    "wall-washer": { en: "Wall Washer Lights", ar: "إضاءة جدارية" }
  };

  static getCategoryTranslation(category: string, language: SupportedLanguage): string {
    return this.CATEGORY_TRANSLATIONS[category]?.[language] ||
      this.fallbackTranslation(category, language);
  }

  static getLightingTypeTranslation(lightingType: string, language: SupportedLanguage): string {
    return this.LIGHTING_TYPE_TRANSLATIONS[lightingType]?.[language] ||
      this.fallbackTranslation(lightingType, language);
  }

  private static fallbackTranslation(text: string, language: SupportedLanguage): string {
    if (language === 'ar') {
      return `مجموعة ${text}`;
    }
    return text.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Dynamically add translations at runtime
   */
  static addCategoryTranslation(key: string, en: string, ar: string): void {
    this.CATEGORY_TRANSLATIONS[key] = { en, ar };
  }

  static addLightingTypeTranslation(key: string, en: string, ar: string): void {
    this.LIGHTING_TYPE_TRANSLATIONS[key] = { en, ar };
  }

  /**
   * Get all available translations for debugging
   */
  static getAllTranslations(): { categories: TranslationMap; lightingTypes: TranslationMap } {
    return {
      categories: { ...this.CATEGORY_TRANSLATIONS },
      lightingTypes: { ...this.LIGHTING_TYPE_TRANSLATIONS }
    };
  }
}

// Performance-Optimized File Resolver
class OptimizedFileResolver {
  private static readonly FILE_CACHE = new Map<string, any>();

  private static readonly SEARCH_PATTERNS = {
    static: [
      'src/data/products-details-static.json',
      'data/products-details-static.json',
      'products-details-static.json',
      'apps/web/src/data/products-details-static.json',
    ],
    arabic: [
      'src/data/products-details-ar.json',
      'data/products-details-ar.json',
      'products-details-ar.json',
      'apps/web/src/data/products-details-ar.json',
    ],
    english: [
      'src/data/products-details-en.json',
      'data/products-details-en.json',
      'products-details-en.json',
      'apps/web/src/data/products-details-en.json',
    ]
  };

  private static readonly BASE_PATHS = [
    __dirname,
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../..'),
    path.resolve(__dirname, '../../..'),
    process.cwd(),
  ];

  static resolveFile(fileType: keyof typeof this.SEARCH_PATTERNS): string | null {
    const cacheKey = `file_${fileType}`;

    if (this.FILE_CACHE.has(cacheKey)) {
      return this.FILE_CACHE.get(cacheKey);
    }

    const patterns = this.SEARCH_PATTERNS[fileType];

    for (const basePath of this.BASE_PATHS) {
      for (const pattern of patterns) {
        const fullPath = path.resolve(basePath, pattern);
        if (existsSync(fullPath)) {
          this.FILE_CACHE.set(cacheKey, fullPath);
          return fullPath;
        }
      }
    }

    this.FILE_CACHE.set(cacheKey, null);
    return null;
  }

  static loadAndCacheJson(filePath: string | null): any {
    if (!filePath || !existsSync(filePath)) return null;

    const cacheKey = `json_${filePath}`;

    if (this.FILE_CACHE.has(cacheKey)) {
      return this.FILE_CACHE.get(cacheKey);
    }

    try {
      const data = JSON.parse(readFileSync(filePath, "utf8"));
      this.FILE_CACHE.set(cacheKey, data);
      return data;
    } catch (error) {
      Logger.error(`Failed to load JSON file: ${filePath}`, error);
      return null;
    }
  }
}

// Enhanced Logger with Metrics Dashboard
class Logger {
  private static metrics = {
    operations: new Map<string, { start: number; count: number }>(),
    errors: 0,
    warnings: 0,
    success: 0,
    dbOperations: 0,
    cacheHits: 0,
  };

  static startTimer(operation: string): void {
    this.metrics.operations.set(operation, {
      start: performance.now(),
      count: (this.metrics.operations.get(operation)?.count || 0) + 1
    });
  }

  static endTimer(operation: string): number {
    const metric = this.metrics.operations.get(operation);
    if (!metric) return 0;

    const duration = performance.now() - metric.start;
    console.log(`✅ ${operation} completed in ${duration.toFixed(2)}ms`);
    return duration;
  }

  static success(message: string): void {
    console.log(`✅ ${message}`);
    this.metrics.success++;
  }

  static error(message: string, error?: any): void {
    console.error(`❌ ${message}`);
    if (error && process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    this.metrics.errors++;
  }

  static warning(message: string): void {
    console.warn(`⚠️ ${message}`);
    this.metrics.warnings++;
  }

  static info(message: string): void {
    console.log(`ℹ️ ${message}`);
  }

  static dbOperation(): void {
    this.metrics.dbOperations++;
  }

  static cacheHit(): void {
    this.metrics.cacheHits++;
  }

  static getMetrics() {
    return { ...this.metrics };
  }

  static displayDashboard(): void {
    console.log('\n📊 Performance Dashboard:');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Success Operations: ${this.metrics.success}`);
    console.log(`⚠️ Warnings: ${this.metrics.warnings}`);
    console.log(`❌ Errors: ${this.metrics.errors}`);
    console.log(`🗄️ Database Operations: ${this.metrics.dbOperations}`);
    console.log(`⚡ Cache Hits: ${this.metrics.cacheHits}`);

    const operationTimes = Array.from(this.metrics.operations.entries())
      .map(([name, data]) => ({ name, count: data.count }));

    if (operationTimes.length > 0) {
      console.log(`\n🔄 Operation Counts:`);
      operationTimes.forEach(({ name, count }) => {
        console.log(`   ${name}: ${count}x`);
      });
    }
  }
}

// Product Data Processor (Enhanced with Fixed hNumber Extraction)
class ProductDataProcessor {
  private static readonly SPECIFICATION_FIELD_MAPPING = {
    ar: {
      "المدخل": "input",
      "أقصى قوة كهربائية (w)": "maximumWattage",
      "علامة الليد التجارية": "brandOfLed",
      "الومن": "luminousFlux",
      "مادة التصنيع": "mainMaterial",
      "مؤشر تجسيد الألوان": "cri",
      "زاوية الإضاءة°": "beamAngle",
      "درجة حرارة التشغيل": "workingTemperature",
      "قابلية التعتيم": "fixtureDimmable",
      "الترانس": "electrical",
      "معامل القدرة": "powerFactor",
      "عامل القدرة": "powerFactor",
      "درجة حرارة لون الاضاءة": "colorTemperature",
      "درجة حرارة لون الإضاءة": "colorTemperature",
      "درجة الحماية": "ip",
      "توفير الطاقة": "energySaving",
      "العمر الافتراضي": "lifeTime",
      "التشطيب": "finish",
      "قاعدة المصباح": "lampBase",
      "المصباح": "bulb",
    },
    en: {
      "Input": "input",
      "Maximum wattage": "maximumWattage",
      "Brand Of Led": "brandOfLed",
      "Luminous Flux": "luminousFlux",
      "Main Material": "mainMaterial",
      "CRI": "cri",
      "Beam Angle": "beamAngle",
      "Working Temperature": "workingTemperature",
      "Fixture Dimmable": "fixtureDimmable",
      "Electrical": "electrical",
      "Power Factor": "powerFactor",
      "Color Temperature": "colorTemperature",
      "IP": "ip",
      "Energy Saving": "energySaving",
      "Life Time": "lifeTime",
      "Finished": "finish",
      "Lamp Base": "lampBase",
      "BULB": "bulb",
    }
  };

  static determineProductColor(specifications: any): ProductColorTemp {
    try {
      const colorTemp = specifications["Color Temperature"] ||
        specifications["درجة حرارة لون الإضاءة"] ||
        specifications["درجة حرارة لون الاضاءة"];

      if (!colorTemp) return "warm";

      const colorStr = String(colorTemp).toLowerCase();
      if (colorStr.includes("3000") || colorStr.includes("٣٠٠٠")) return "warm";
      if (colorStr.includes("4000") || colorStr.includes("٤٠٠٠")) return "cool";
      if (colorStr.includes("6500") || colorStr.includes("٦٥٠٠")) return "white";

      return "warm";
    } catch (error) {
      Logger.warning(`Failed to determine product color, defaulting to warm`);
      return "warm";
    }
  }

  static determineProductIP(specifications: any): ProductIP {
    try {
      const ip = specifications.IP || specifications["درجة الحماية"];
      if (!ip) return "IP20";

      const ipStr = String(ip);
      const ipMap: Record<string, ProductIP> = {
        "20": "IP20", "٢٠": "IP20",
        "44": "IP44", "٤٤": "IP44",
        "54": "IP54", "٥٤": "IP54",
        "65": "IP65", "٦٥": "IP65",
        "68": "IP68", "٦٨": "IP68"
      };

      return ipMap[ipStr] || "IP20";
    } catch (error) {
      Logger.warning(`Failed to determine IP rating, defaulting to IP20`);
      return "IP20";
    }
  }

  /**
   * Enhanced Hnumber extraction that checks both product data and specifications
   * FIXED: Now properly looks in both locations where Hnumber might exist
   */
  static extractHNumber(productData: any, specifications: any = null): number | null {
    try {
      // FIRST: Check in main product data (this is where Hnumber usually is in static JSON)
      if (productData && typeof productData === 'object') {
        const possibleFields = [
          "Hnumber",        // Primary field in static JSON
          "hnumber",
          "HNumber",
          "hNumber",
          "number",
          "units"
        ];

        for (const field of possibleFields) {
          const value = productData[field];
          if (value !== undefined && value !== null && value !== '') {
            const numValue = this.parseNumberValue(value);
            if (numValue !== null && numValue > 0) {
              console.log(`✅ Found Hnumber in product data: ${numValue} from field: ${field}`);
              return numValue;
            }
          }
        }
      }

      // SECOND: Check in specifications table as fallback
      if (specifications && typeof specifications === 'object') {
        const specFields = [
          "Hnumber",
          "hnumber",
          "عدد الوحدات",    // Arabic
          "number",
          "units",
          "وحدات"
        ];

        for (const field of specFields) {
          const value = specifications[field];
          if (value !== undefined && value !== null && value !== '') {
            const numValue = this.parseNumberValue(value);
            if (numValue !== null && numValue > 0) {
              console.log(`✅ Found Hnumber in specifications: ${numValue} from field: ${field}`);
              return numValue;
            }
          }
        }
      }

      return null;

    } catch (error) {
      console.error(`❌ Error extracting Hnumber:`, error);
      return null;
    }
  }

  private static parseNumberValue(value: any): number | null {
    try {
      if (typeof value === 'number') {
        return isNaN(value) ? null : Math.floor(value);
      }

      if (typeof value === 'string') {
        const cleanValue = value.trim().replace(/[^\d]/g, '');
        if (cleanValue === '') return null;

        const num = parseInt(cleanValue, 10);
        return isNaN(num) ? null : num;
      }

      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  static processSpecifications(specifications: any, language: SupportedLanguage): ProductSpecificationData {
    try {
      const fieldMapping = this.SPECIFICATION_FIELD_MAPPING[language];
      const result: ProductSpecificationData = {};
      const customSpecs: Record<string, any> = {};

      for (const [key, value] of Object.entries(specifications)) {
        const mappedField = fieldMapping[key as keyof typeof fieldMapping];
        const normalizedValue = this.normalizeValue(value);

        if (mappedField) {
          (result as any)[mappedField] = normalizedValue;
        } else if (!["عدد الوحدات", "Hnumber", "number", "maxIP"].includes(key)) {
          customSpecs[key] = value;
        }
      }

      if (Object.keys(customSpecs).length > 0) {
        result.customSpecs = customSpecs;
      }

      return result;
    } catch (error) {
      Logger.error(`Failed to process specifications for language ${language}`, error);
      return {};
    }
  }

  private static normalizeValue(value: any): string {
    try {
      if (typeof value === "string") return value.trim();
      if (typeof value === "number") return String(value);
      if (value === null || value === undefined) return "";
      return JSON.stringify(value);
    } catch (error) {
      return "";
    }
  }
}

// Batch Processor
class BatchProcessor {
  private static readonly BATCH_SIZE = 50;

  static async processBatch<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    batchName: string
  ): Promise<void> {
    Logger.startTimer(`Batch Processing: ${batchName}`);

    for (let i = 0; i < items.length; i += this.BATCH_SIZE) {
      const batch = items.slice(i, i + this.BATCH_SIZE);
      const batchPromises = batch.map(processor);

      try {
        await Promise.all(batchPromises);
        Logger.info(`Processed batch ${Math.ceil((i + 1) / this.BATCH_SIZE)} of ${Math.ceil(items.length / this.BATCH_SIZE)}`);
      } catch (error) {
        Logger.error(`Batch processing failed for ${batchName}`, error);
        throw error;
      }
    }

    Logger.endTimer(`Batch Processing: ${batchName}`);
  }
}

// Enhanced Database Operations with Improved Slug Management
class DatabaseOperations {
  private static readonly OPERATION_CACHE = new Map<string, any>();

  /**
   * Enhanced category creation with collision-resistant slugs
   */
  static async ensureCategoryWithTranslations(category: string) {
    const cacheKey = `category_${category}`;

    if (this.OPERATION_CACHE.has(cacheKey)) {
      Logger.cacheHit();
      return this.OPERATION_CACHE.get(cacheKey);
    }

    Logger.dbOperation();

    try {
      // Generate base slug for the category entity
      const baseSlug = SmartSlugGenerator.generateUniqueSlug(category, 'en', 'category-base');

      const categoryRecord = await prisma.category.upsert({
        where: { name: category },
        update: { slug: baseSlug },
        create: {
          name: category,
          slug: baseSlug,
          isActive: true,
          sortOrder: 0,
        },
      });

      // Create translations with collision-resistant slugs
      const translationPromises = (["en", "ar"] as SupportedLanguage[]).map(async (language) => {
        const translatedName = EnterpriseTranslationRegistry.getCategoryTranslation(category, language);

        // Generate unique slug per language with context
        const localizedSlug = SmartSlugGenerator.generateUniqueSlug(
          translatedName,
          language,
          `category-${categoryRecord.id}`
        );

        Logger.info(`Creating ${language} translation for category ${category}: ${translatedName} -> ${localizedSlug}`);

        return await prisma.categoryTranslation.upsert({
          where: {
            categoryId_language: {
              categoryId: categoryRecord.id,
              language,
            },
          },
          update: {
            name: translatedName,
            slug: localizedSlug,
          },
          create: {
            categoryId: categoryRecord.id,
            language,
            name: translatedName,
            slug: localizedSlug,
            description: `${translatedName} products and lighting solutions`,
            metaTitle: `${translatedName} | Art Lighting`,
            metaDesc: `Discover our premium ${translatedName.toLowerCase()} collection`,
          },
        });
      });

      await Promise.all(translationPromises);

      this.OPERATION_CACHE.set(cacheKey, categoryRecord);
      Logger.success(`Successfully processed category: ${category}`);

      return categoryRecord;

    } catch (error) {
      Logger.error(`Failed to ensure category ${category}`, error);

      // Fallback: try with hash-based slug
      try {
        const fallbackSlug = SmartSlugGenerator.generateHashSlug(category, 'category');
        Logger.warning(`Using fallback slug for category ${category}: ${fallbackSlug}`);

        const fallbackRecord = await prisma.category.upsert({
          where: { name: category },
          update: {},
          create: {
            name: category,
            slug: fallbackSlug,
            isActive: true,
            sortOrder: 0,
          },
        });

        return fallbackRecord;
      } catch (fallbackError) {
        Logger.error(`Fallback failed for category ${category}`, fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Enhanced lighting type creation with collision-resistant slugs
   */
  static async ensureLightingTypeWithTranslations(lightingType: string) {
    const cacheKey = `lightingType_${lightingType}`;

    if (this.OPERATION_CACHE.has(cacheKey)) {
      Logger.cacheHit();
      return this.OPERATION_CACHE.get(cacheKey);
    }

    Logger.dbOperation();

    try {
      const baseSlug = SmartSlugGenerator.generateUniqueSlug(lightingType, 'en', 'lighting-base');

      const lightingTypeRecord = await prisma.lightingType.upsert({
        where: { name: lightingType },
        update: { slug: baseSlug },
        create: {
          name: lightingType,
          slug: baseSlug,
          isActive: true,
          sortOrder: 0,
        },
      });

      const translationPromises = (["en", "ar"] as SupportedLanguage[]).map(async (language) => {
        const translatedName = EnterpriseTranslationRegistry.getLightingTypeTranslation(lightingType, language);

        const localizedSlug = SmartSlugGenerator.generateUniqueSlug(
          translatedName,
          language,
          `lighting-${lightingTypeRecord.id}`
        );

        Logger.info(`Creating ${language} translation for lighting type ${lightingType}: ${translatedName} -> ${localizedSlug}`);

        return await prisma.lightingTypeTranslation.upsert({
          where: {
            lightingTypeId_language: {
              lightingTypeId: lightingTypeRecord.id,
              language,
            },
          },
          update: {
            name: translatedName,
            slug: localizedSlug,
          },
          create: {
            lightingTypeId: lightingTypeRecord.id,
            language,
            name: translatedName,
            slug: localizedSlug,
            description: `Professional ${translatedName.toLowerCase()} lighting solutions`,
            metaTitle: `${translatedName} | Art Lighting Solutions`,
            metaDesc: `Explore our ${translatedName.toLowerCase()} range for your lighting needs`,
          },
        });
      });

      await Promise.all(translationPromises);

      this.OPERATION_CACHE.set(cacheKey, lightingTypeRecord);
      Logger.success(`Successfully processed lighting type: ${lightingType}`);

      return lightingTypeRecord;

    } catch (error) {
      Logger.error(`Failed to ensure lighting type ${lightingType}`, error);

      // Fallback with hash
      try {
        const fallbackSlug = SmartSlugGenerator.generateHashSlug(lightingType, 'lighting');
        Logger.warning(`Using fallback slug for lighting type ${lightingType}: ${fallbackSlug}`);

        const fallbackRecord = await prisma.lightingType.upsert({
          where: { name: lightingType },
          update: {},
          create: {
            name: lightingType,
            slug: fallbackSlug,
            isActive: true,
            sortOrder: 0,
          },
        });

        return fallbackRecord;
      } catch (fallbackError) {
        Logger.error(`Fallback failed for lighting type ${lightingType}`, fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Clear operation cache for fresh runs
   */
  static clearCache(): void {
    this.OPERATION_CACHE.clear();
    Logger.info('Database operation cache cleared');
  }
}

// Main Processing Engine (Enhanced with Better Error Recovery and Fixed Hnumber)
class ProductImportEngine {
  private static async loadDataFiles() {
    Logger.startTimer("Data Loading");

    const staticPath = OptimizedFileResolver.resolveFile('static');
    const arabicPath = OptimizedFileResolver.resolveFile('arabic');
    const englishPath = OptimizedFileResolver.resolveFile('english');

    if (!staticPath) {
      throw new Error("Critical Error: Static data file is required but not found!");
    }

    const staticData = OptimizedFileResolver.loadAndCacheJson(staticPath);
    const arabicData = OptimizedFileResolver.loadAndCacheJson(arabicPath);
    const englishData = OptimizedFileResolver.loadAndCacheJson(englishPath);

    if (!staticData) {
      throw new Error("Failed to load static product data");
    }

    Logger.endTimer("Data Loading");
    Logger.info(`Data files loaded - Static: ✅, Arabic: ${arabicData ? '✅' : '⚠️'}, English: ${englishData ? '✅' : '⚠️'}`);

    return { staticData, arabicData, englishData };
  }

  static async processProducts() {
    Logger.startTimer("Complete Product Import");

    try {
      const { staticData, arabicData, englishData } = await this.loadDataFiles();

      if (!staticData?.categories) {
        throw new Error("Invalid static data structure - missing categories");
      }

      const supportedLanguages: SupportedLanguage[] = ["ar", "en"];
      const translationData = { ar: arabicData, en: englishData };

      let totalProcessed = 0;
      let processedBrands = 0;
      let processedCategories = 0;

      // Clear caches for fresh run
      DatabaseOperations.clearCache();
      SmartSlugGenerator.clearCache();

      Logger.info(`Starting import of ${Object.keys(staticData.categories).length} brands...`);

      // Process each brand
      for (const [brand, brandData] of Object.entries(staticData.categories)) {
        Logger.startTimer(`Brand: ${brand}`);
        Logger.info(`🏢 Processing brand: ${brand}`);

        try {
          // Process each category within the brand
          for (const [category, categoryData] of Object.entries(brandData as any)) {
            Logger.startTimer(`Category: ${brand}/${category}`);
            Logger.info(`📂 Processing category: ${brand}/${category}`);

            let categoryRecord;
            try {
              categoryRecord = await DatabaseOperations.ensureCategoryWithTranslations(category);
              processedCategories++;
            } catch (categoryError) {
              Logger.error(`Failed to create category ${category}, skipping...`, categoryError);
              continue;
            }

            // Process each lighting type within the category
            for (const [lightingType, products] of Object.entries(categoryData as any)) {
              Logger.startTimer(`LightingType: ${lightingType}`);
              Logger.info(`💡 Processing lighting type: ${lightingType} (${(products as any[]).length} products)`);

              let lightingTypeRecord;
              try {
                lightingTypeRecord = await DatabaseOperations.ensureLightingTypeWithTranslations(lightingType);
              } catch (lightingTypeError) {
                Logger.error(`Failed to create lighting type ${lightingType}, skipping...`, lightingTypeError);
                continue;
              }

              // Process products in batches with error recovery
              try {
                await BatchProcessor.processBatch(
                  products as any[],
                  async (productArray) => {
                    for (const [productId, productData] of Object.entries(productArray)) {
                      try {
                        await this.processProduct(
                          productId,
                          productData as any,
                          categoryRecord,
                          lightingTypeRecord,
                          brand,
                          category,
                          lightingType,
                          translationData,
                          supportedLanguages
                        );
                        totalProcessed++;
                      } catch (productError) {
                        Logger.error(`Failed to process product ${productId}`, productError);
                        // Continue with next product instead of failing entire batch
                      }
                    }
                  },
                  `${brand}-${category}-${lightingType}`
                );
              } catch (batchError) {
                Logger.error(`Batch processing failed for ${brand}-${category}-${lightingType}`, batchError);
                // Continue with next lighting type
              }

              Logger.endTimer(`LightingType: ${lightingType}`);
            }

            Logger.endTimer(`Category: ${brand}/${category}`);
          }

          processedBrands++;
          Logger.endTimer(`Brand: ${brand}`);
          Logger.success(`✅ Completed brand: ${brand}`);

        } catch (brandError) {
          Logger.error(`Failed processing brand ${brand}`, brandError);
          // Continue with next brand
        }
      }

      Logger.endTimer("Complete Product Import");
      Logger.success(`🎉 Successfully processed ${totalProcessed} products across ${processedBrands} brands and ${processedCategories} categories`);

      return { totalProcessed, processedBrands, processedCategories };

    } catch (error) {
      Logger.error("Critical error in product processing", error);
      throw error;
    }
  }

  /**
   * FIXED: processProduct method with proper Hnumber extraction
   */
  private static async processProduct(
    productId: string,
    productData: any,  // This contains Hnumber from static JSON
    categoryRecord: any,
    lightingTypeRecord: any,
    brand: string,
    category: string,
    lightingType: string,
    translationData: any,
    supportedLanguages: SupportedLanguage[]
  ) {
    try {
      Logger.dbOperation();

      console.log(`\n🎯 Processing product ${productId}`);
      console.log(`📦 Product data keys:`, Object.keys(productData || {}));

      // Extract specifications for enum determination
      let specificationsForEnums = {};

      // IMPORTANT: Extract Hnumber from BOTH product data AND specifications
      // Check for Hnumber in static product data FIRST
      let hNumberValue = ProductDataProcessor.extractHNumber(productData, null);

      if (hNumberValue !== null) {
        Logger.success(`✅ Found Hnumber in static data for ${productId}: ${hNumberValue}`);
      } else {
        Logger.info(`🔍 Hnumber not found in static data, checking specifications...`);
      }

      // Try to get English specifications for color/IP determination
      if (translationData.en?.categories?.[brand]?.[category]) {
        const categoryData = translationData.en.categories[brand][category];
        for (const [translatedLightingType, products] of Object.entries(categoryData)) {
          const foundProduct = (products as any[]).find(p => p[productId]);
          if (foundProduct?.[productId]?.specificationsTable) {
            specificationsForEnums = foundProduct[productId].specificationsTable;

            // If we didn't find Hnumber in static data, try specifications
            if (hNumberValue === null) {
              hNumberValue = ProductDataProcessor.extractHNumber(null, specificationsForEnums);
              if (hNumberValue !== null) {
                Logger.success(`✅ Found Hnumber in English specifications for ${productId}: ${hNumberValue}`);
              }
            }
            break;
          }
        }
      }

      // Fallback to Arabic specifications
      if (hNumberValue === null && translationData.ar?.categories?.[brand]?.[category]) {
        const categoryData = translationData.ar.categories[brand][category];
        for (const [translatedLightingType, products] of Object.entries(categoryData)) {
          const foundProduct = (products as any[]).find(p => p[productId]);
          if (foundProduct?.[productId]?.specificationsTable) {
            const arabicSpecs = foundProduct[productId].specificationsTable;
            hNumberValue = ProductDataProcessor.extractHNumber(null, arabicSpecs);
            if (hNumberValue !== null) {
              Logger.success(`✅ Found Hnumber in Arabic specifications for ${productId}: ${hNumberValue}`);
            }
            break;
          }
        }
      }

      // Log final result
      if (hNumberValue !== null) {
        Logger.success(`🎯 Final Hnumber for ${productId}: ${hNumberValue}`);
      } else {
        Logger.warning(`⚠️ No Hnumber found for ${productId} - will be stored as NULL`);

        // Debug: Show what fields are available
        console.log(`📋 Available product data fields:`, Object.keys(productData || {}));
        if (Object.keys(specificationsForEnums).length > 0) {
          console.log(`📋 Available specification fields:`, Object.keys(specificationsForEnums));
        }
      }

      // Create product record with enhanced validation
      const productCreateData = {
        productId: productData.ProductId || productId,
        productName: productData.productName || productId,
        productImages: Array.isArray(productData.productImages) ? productData.productImages : [],
        maxIP: productData.MaxIP ? parseInt(String(productData.MaxIP)) : null,
        spotlightType: productData.spotlightType || lightingType,
        brand: productData.brand || brand,
        price: typeof productData.price === 'number' ? productData.price : 0,
        priceIncrease: typeof productData.priceIncrease === 'number' ? productData.priceIncrease : 0,
        sectionType: productData.sectionType || category,
        quantity: typeof productData.quantity === 'number' ? productData.quantity : 0,
        categoryId: categoryRecord.id,
        lightingtypeId: lightingTypeRecord.id,
        productColor: ProductDataProcessor.determineProductColor(specificationsForEnums),
        productIp: ProductDataProcessor.determineProductIP(specificationsForEnums),
        discount: typeof productData.discount === 'number' ? productData.discount : 0,
        chandelierLightingType: productData.chandelierLightingType || null,
        hNumber: hNumberValue, // This should now contain the correct value
        isActive: true,
        featured: false,
      };

      console.log(`📝 Final product data for ${productId}:`, {
        productId: productCreateData.productId,
        productName: productCreateData.productName,
        hNumber: productCreateData.hNumber,
        brand: productCreateData.brand
      });

      await prisma.product.upsert({
        where: { productId: productCreateData.productId },
        update: {
          ...productCreateData,
          updatedAt: new Date(),
        },
        create: productCreateData,
      });

      // Process specifications for each available language with enhanced error handling
      const specificationPromises = supportedLanguages.map(async (language) => {
        try {
          const langData = translationData[language];
          if (!langData?.categories?.[brand]?.[category]) {
            Logger.warning(`No ${language} data available for ${brand}/${category}`);
            return;
          }

          const categoryData = langData.categories[brand][category];
          let foundSpecifications = null;

          // Search through all lighting type variations
          for (const [translatedLightingType, products] of Object.entries(categoryData)) {
            const foundProduct = (products as any[]).find(p => p[productId]);
            if (foundProduct?.[productId]?.specificationsTable) {
              foundSpecifications = foundProduct[productId].specificationsTable;
              break;
            }
          }

          if (!foundSpecifications) {
            Logger.warning(`No specifications found for product ${productId} in ${language}`);
            return;
          }

          const specificationObject = ProductDataProcessor.processSpecifications(
            foundSpecifications,
            language
          );

          await prisma.productSpecification.upsert({
            where: {
              productId_language: {
                productId: productCreateData.productId,
                language,
              },
            },
            update: {
              ...specificationObject,
              updatedAt: new Date(),
            },
            create: {
              productId: productCreateData.productId,
              language,
              ...specificationObject,
            },
          });

          Logger.success(`✅ Added ${language} specifications for ${productId}`);

        } catch (specError) {
          Logger.error(`Failed to process ${language} specifications for ${productId}`, specError);
          // Continue with other languages instead of failing
        }
      });

      await Promise.all(specificationPromises);
      Logger.success(`🎯 Successfully processed product: ${productId}`);

    } catch (error) {
      Logger.error(`💥 Failed to process product ${productId}`, error);
      throw error;
    }
  }
}

// Enhanced System Diagnostics
class SystemDiagnostics {
  static async performHealthCheck(): Promise<void> {
    Logger.startTimer("System Health Check");

    try {
      // Database connectivity test
      await prisma.$queryRaw`SELECT 1`;
      Logger.success("Database connection: OK");

      // File system check
      const staticPath = OptimizedFileResolver.resolveFile('static');
      const arabicPath = OptimizedFileResolver.resolveFile('arabic');
      const englishPath = OptimizedFileResolver.resolveFile('english');

      Logger.info(`Static file: ${staticPath ? '✅ Found' : '❌ Missing'}`);
      Logger.info(`Arabic file: ${arabicPath ? '✅ Found' : '⚠️ Missing (optional)'}`);
      Logger.info(`English file: ${englishPath ? '✅ Found' : '⚠️ Missing (optional)'}`);

      // Schema validation
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      ` as any[];

      const requiredTables = [
        'categories', 'category_translations',
        'lighting_types', 'lighting_type_translations',
        'products', 'product_specifications'
      ];

      const missingTables = requiredTables.filter(table =>
        !tables.some((t: any) => t.table_name === table)
      );

      if (missingTables.length > 0) {
        Logger.error(`Missing database tables: ${missingTables.join(', ')}`);
        throw new Error('Database schema incomplete');
      }

      Logger.success("Database schema: OK");
      Logger.success("System health check passed");

    } catch (error) {
      Logger.error("System health check failed", error);
      throw error;
    } finally {
      Logger.endTimer("System Health Check");
    }
  }

  static async generateImportReport(): Promise<void> {
    try {
      Logger.startTimer("Import Report Generation");

      const [
        productCount,
        categoryCount,
        lightingTypeCount,
        specificationStats,
        brandStats,
        activeProductCount,
        hnumberStats,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.lightingType.count(),
        prisma.productSpecification.groupBy({
          by: ["language"],
          _count: true,
        }),
        prisma.product.groupBy({
          by: ["brand"],
          _count: true,
        }),
        prisma.product.count({
          where: { isActive: true }
        }),
        prisma.product.groupBy({
          by: ["hNumber"],
          _count: true,
        }),
      ]);

      console.log("\n📊 COMPREHENSIVE IMPORT REPORT");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      console.log(`\n📦 PRODUCTS:`);
      console.log(`   Total Products: ${productCount}`);
      console.log(`   Active Products: ${activeProductCount}`);
      console.log(`   Inactive Products: ${productCount - activeProductCount}`);

      console.log(`\n📂 CATEGORIES:`);
      console.log(`   Total Categories: ${categoryCount}`);

      console.log(`\n💡 LIGHTING TYPES:`);
      console.log(`   Total Lighting Types: ${lightingTypeCount}`);

      console.log(`\n🏢 BRANDS:`);
      brandStats.forEach(stat => {
        console.log(`   ${stat.brand}: ${stat._count} products`);
      });

      console.log(`\n📋 SPECIFICATIONS BY LANGUAGE:`);
      specificationStats.forEach(stat => {
        console.log(`   ${stat.language.toUpperCase()}: ${stat._count} specification sets`);
      });

      // HNUMBER ANALYSIS
      console.log(`\n🔢 HNUMBER ANALYSIS:`);
      const productsWithHnumber = await prisma.product.count({
        where: {
          hNumber: { not: null }
        }
      });
      const productsWithoutHnumber = productCount - productsWithHnumber;
      console.log(`   Products WITH Hnumber: ${productsWithHnumber}`);
      console.log(`   Products WITHOUT Hnumber: ${productsWithoutHnumber}`);
      console.log(`   Hnumber Success Rate: ${((productsWithHnumber / productCount) * 100).toFixed(1)}%`);

      // Advanced analytics
      const averagePrice = await prisma.product.aggregate({
        _avg: { price: true }
      });

      const priceRange = await prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true }
      });

      console.log(`\n💰 PRICING ANALYTICS:`);
      console.log(`   Average Price: ${averagePrice._avg.price?.toFixed(2) || 'N/A'} EGP`);
      console.log(`   Price Range: ${priceRange._min.price} - ${priceRange._max.price} EGP`);

      Logger.endTimer("Import Report Generation");

    } catch (error) {
      Logger.error("Failed to generate import report", error);
    }
  }
}

// Main Execution Function
async function main() {
  const startTime = performance.now();

  try {
    console.log("🚀 ENTERPRISE PRODUCT IMPORT SYSTEM v2.0");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // System diagnostics
    await SystemDiagnostics.performHealthCheck();

    // Database connection
    await prisma.$connect();
    Logger.success("Enterprise database connection established");

    // Execute import with comprehensive error handling
    Logger.info("🔄 Initiating product import process...");
    const { totalProcessed, processedBrands, processedCategories } = await ProductImportEngine.processProducts();

    // Generate comprehensive report
    await SystemDiagnostics.generateImportReport();

    // Display performance metrics
    Logger.displayDashboard();

    const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️ TOTAL EXECUTION TIME: ${totalTime}s`);
    console.log(`🎯 PROCESSING RATE: ${(totalProcessed / parseFloat(totalTime)).toFixed(2)} products/second`);

    Logger.success("🎉 ENTERPRISE IMPORT COMPLETED SUCCESSFULLY!");

  } catch (error) {
    Logger.error("💥 CRITICAL IMPORT FAILURE", error);

    console.log("\n🔧 TROUBLESHOOTING GUIDE:");
    console.log("1. Verify all JSON files are present and valid");
    console.log("2. Check database connection and schema");
    console.log("3. Ensure sufficient disk space and memory");
    console.log("4. Review error logs above for specific issues");

    process.exit(1);
  } finally {
    await prisma.$disconnect();
    Logger.info("Database connection closed");
  }
}

// Enhanced Error Handling & Process Management
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Promise Rejection:', reason);
  console.error('Promise that caused rejection:', promise);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
  Logger.info(`🛑 Received ${signal}, initiating graceful shutdown...`);

  try {
    await prisma.$disconnect();
    Logger.success("Database connections closed");
  } catch (error) {
    Logger.error("Error during shutdown", error);
  }

  Logger.info("Shutdown complete");
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Memory monitoring for large imports
if (process.env.NODE_ENV === 'development') {
  const memoryMonitor = setInterval(() => {
    const usage = process.memoryUsage();
    if (usage.heapUsed > 512 * 1024 * 1024) { // 512MB threshold
      Logger.warning(`High memory usage: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
    }
  }, 30000);

  process.on('exit', () => {
    clearInterval(memoryMonitor);
  });
}

// Execute the main function
main().catch(error => {
  Logger.error("Unhandled error in main execution", error);
  process.exit(1);
});