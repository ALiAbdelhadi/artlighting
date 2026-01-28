# ملخص إصلاحات import-products.ts

## المشاكل التي تم إصلاحها

### 1. ✅ مشكلة `maxIP` في ProductSpecification
**المشكلة**: 
```
Unknown argument `maxIP`. Available options are marked with ?.
```

**السبب**: 
- `maxIP` موجود في `specificationsTable` في ملفات JSON
- لكن Prisma schema لـ `ProductSpecification` لا يحتوي على حقل `maxIP`
- `maxIP` موجود فقط في جدول `Product` (كـ `maxIP Int?`)

**الحل**:
1. إزالة `maxIP` من `ProductSpecificationData` interface
2. إزالة `maxIP` من `SPECIFICATION_FIELD_MAPPING`
3. إضافة كود لإزالة `maxIP` من `specificationData` قبل إرساله إلى Prisma

### 2. ✅ مشكلة عدم العثور على المواصفات في AR file
**المشكلة**: 
```
⚠️ No specifications found for product jy-202-15w in ar
```

**السبب**: 
- في static file، lighting type هو `"track-light"` (إنجليزي)
- في AR file، lighting type هو `"تراك لايت"` (عربي)
- الكود كان يحاول البحث في AR file باستخدام المفتاح الإنجليزي

**الحل**:
1. إضافة دالة `getArabicLightingType()` لتحويل المفتاح الإنجليزي إلى عربي
2. تحديث البحث في AR file لاستخدام المفتاح العربي الصحيح

## التغييرات في الكود

### ملف: `packages/database/scripts/import-products.ts`

1. **إزالة `maxIP` من interface**:
   ```typescript
   // قبل:
   maxIP?: string; // New field for maxIP
   
   // بعد:
   // Note: maxIP is NOT in ProductSpecification - it's only in Product table
   ```

2. **إزالة `maxIP` من SPECIFICATION_FIELD_MAPPING**:
   ```typescript
   // قبل:
   "maxIP": "maxIP",
   
   // بعد:
   // Note: "maxIP" is excluded - it belongs to Product table, not ProductSpecification
   ```

3. **إزالة `maxIP` من specificationData**:
   ```typescript
   // قبل:
   const specificationData = {
     ...specificationObject,
     ...
   }
   
   // بعد:
   const { maxIP, ...specWithoutMaxIP } = specificationObject as any;
   const specificationData = {
     ...specWithoutMaxIP,
     ...
   }
   ```

4. **إضافة دالة للعثور على المفتاح العربي**:
   ```typescript
   static getArabicLightingType(englishKey: string): string {
     // Reverse lookup: find Arabic key from English value
     for (const [arabicKey, englishValue] of Object.entries(this.ARABIC_LIGHTING_TYPE_MAP)) {
       if (englishValue === englishKey) {
         return arabicKey;
       }
     }
     return englishKey;
   }
   ```

5. **تحديث البحث في AR file**:
   ```typescript
   // قبل:
   const lightingTypesToTry = language === 'ar'
     ? [originalLightingType, lightingType].filter(...)
     : [lightingType, originalLightingType].filter(...);
   
   // بعد:
   const lightingTypesToTry = language === 'ar'
     ? [
         EnterpriseTranslationRegistry.getArabicLightingType(lightingType),
         originalLightingType ? EnterpriseTranslationRegistry.getArabicLightingType(originalLightingType) : null,
         originalLightingType,
         lightingType
       ].filter(...)
     : [lightingType, originalLightingType].filter(...);
   ```

## النتيجة المتوقعة

بعد هذه الإصلاحات:
- ✅ لن يظهر خطأ `Unknown argument maxIP` بعد الآن
- ✅ سيتم العثور على المواصفات في AR file بشكل صحيح
- ✅ `maxIP` سيتم حفظه فقط في جدول `Product` وليس في `ProductSpecification`

## ملاحظات

1. **`maxIP` في Product**: `maxIP` موجود في جدول `Product` ويتم حفظه بشكل صحيح من `productData.MaxIP` في static file
2. **`maxIP` في specificationsTable**: `maxIP` موجود في `specificationsTable` في ملفات JSON لكنه لا يُحفظ في `ProductSpecification` - هذا صحيح لأن Prisma schema لا يدعمه
3. **البحث في AR file**: الآن الكود يحاول البحث باستخدام المفتاح العربي الصحيح أولاً
