# ملخص إصلاحات ملفات JSON

## المشاكل التي تم اكتشافها وإصلاحها

### 1. ✅ مشكلة في `products-details-en.json`
**المشكلة**: بعض القيم كانت رقمية (numbers) بدلاً من نصية (strings)
- `"Maximum wattage": 15` → يجب أن يكون `"Maximum wattage": "15"`
- `"IP": 20` → يجب أن يكون `"IP": "20"`
- `"maxIP": 65` → يجب أن يكون `"maxIP": "65"`

**السبب**: Prisma schema يتوقع أن جميع حقول `ProductSpecification` تكون من نوع `String?` وليس `Int?`

**الحل**: تم تحويل 196 قيمة رقمية إلى نصية باستخدام سكريبت `fix-json-files.ts`

### 2. ✅ مشكلة عدم الاتساق بين الملفات
**المشكلة**: كان هناك منتجين في `products-details-en.json` غير موجودين في `products-details-static.json`:
- `jy-sl-001-150` (في قسم `street-light`)
- `jy-sl-003-30w` (في قسم `stairs-light`)

**السبب**: `import-products.ts` يعتمد على `products-details-static.json` كمرجع أساسي، والمنتجات الموجودة فقط في ملفات الترجمة لن يتم استيرادها

**الحل**: تم إزالة المنتجين من `products-details-en.json` لضمان الاتساق

### 3. ✅ التحقق من البنية
**النتائج**:
- ✅ جميع المنتجات (117) لديها مواصفات في AR file
- ✅ جميع المنتجات (117) لديها مواصفات في EN file
- ✅ 47 منتج (40.2%) لديهم `Hnumber` في static file (وهذا طبيعي لأن منتجات balcom لا تحتاج Hnumber)

## الملفات المعدلة

1. `apps/web/src/data/products-details-en.json`
   - تحويل جميع القيم الرقمية إلى نصية
   - إزالة المنتجين غير المتسقين

2. `packages/database/scripts/fix-json-files.ts` (جديد)
   - سكريبت لإصلاح القيم الرقمية

3. `packages/database/scripts/validate-json-consistency.ts` (جديد)
   - سكريبت للتحقق من الاتساق بين الملفات

## كيفية استخدام السكريبتات

### إصلاح الملفات:
```bash
cd packages/database
npx tsx scripts/fix-json-files.ts
```

### التحقق من الاتساق:
```bash
cd packages/database
npx tsx scripts/validate-json-consistency.ts
```

## ملاحظات مهمة

1. **Hnumber**: ليس كل المنتجات تحتاج `Hnumber`. فقط منتجات chandelier من brand `mister-led` تحتاج هذا الحقل.

2. **البنية المتوقعة**: 
   - `products-details-static.json`: يحتوي على البيانات الأساسية للمنتجات
   - `products-details-ar.json`: يحتوي على `specificationsTable` بالعربية
   - `products-details-en.json`: يحتوي على `specificationsTable` بالإنجليزية

3. **أنواع البيانات**: جميع قيم `specificationsTable` يجب أن تكون نصية (strings) لتتوافق مع Prisma schema.
