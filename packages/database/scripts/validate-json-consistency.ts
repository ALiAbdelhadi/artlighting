import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to validate consistency between JSON files
 */

interface ProductInfo {
  productId: string;
  brand: string;
  category: string;
  lightingType: string;
  hasHnumber: boolean;
  hasSpecsAr: boolean;
  hasSpecsEn: boolean;
}

function getAllProducts() {
  const staticPath = path.resolve(__dirname, '../../../apps/web/src/data/products-details-static.json');
  const arPath = path.resolve(__dirname, '../../../apps/web/src/data/products-details-ar.json');
  const enPath = path.resolve(__dirname, '../../../apps/web/src/data/products-details-en.json');
  
  const staticData = JSON.parse(readFileSync(staticPath, 'utf8'));
  const arData = JSON.parse(readFileSync(arPath, 'utf8'));
  const enData = JSON.parse(readFileSync(enPath, 'utf8'));
  
  const products: Map<string, ProductInfo> = new Map();
  
  // Extract products from static file
  for (const [brand, brandData] of Object.entries(staticData.categories)) {
    if (!brandData || typeof brandData !== 'object') continue;
    
    for (const [category, categoryData] of Object.entries(brandData as any)) {
      if (!categoryData || typeof categoryData !== 'object') continue;
      
      for (const [lightingType, productsArray] of Object.entries(categoryData)) {
        if (!Array.isArray(productsArray)) continue;
        
        for (const productObj of productsArray) {
          if (!productObj || typeof productObj !== 'object') continue;
          
          for (const [productId, productData] of Object.entries(productObj)) {
            const product = productData as any;
            products.set(productId, {
              productId,
              brand,
              category,
              lightingType,
              hasHnumber: product?.Hnumber !== undefined && product?.Hnumber !== null,
              hasSpecsAr: false,
              hasSpecsEn: false
            });
          }
        }
      }
    }
  }
  
  // Check Arabic specifications
  for (const [brand, brandData] of Object.entries(arData.categories)) {
    if (!brandData || typeof brandData !== 'object') continue;
    
    for (const [category, categoryData] of Object.entries(brandData as any)) {
      if (!categoryData || typeof categoryData !== 'object') continue;
      
      for (const [lightingType, productsArray] of Object.entries(categoryData)) {
        if (!Array.isArray(productsArray)) continue;
        
        for (const productObj of productsArray) {
          if (!productObj || typeof productObj !== 'object') continue;
          
          for (const [productId, productData] of Object.entries(productObj)) {
            const product = productData as any;
            const info = products.get(productId);
            if (info) {
              info.hasSpecsAr = product?.specificationsTable !== undefined;
            } else {
              console.warn(`⚠️ Product ${productId} found in AR file but not in static file`);
            }
          }
        }
      }
    }
  }
  
  // Check English specifications
  for (const [brand, brandData] of Object.entries(enData.categories)) {
    if (!brandData || typeof brandData !== 'object') continue;
    
    for (const [category, categoryData] of Object.entries(brandData as any)) {
      if (!categoryData || typeof categoryData !== 'object') continue;
      
      for (const [lightingType, productsArray] of Object.entries(categoryData)) {
        if (!Array.isArray(productsArray)) continue;
        
        for (const productObj of productsArray) {
          if (!productObj || typeof productObj !== 'object') continue;
          
          for (const [productId, productData] of Object.entries(productObj)) {
            const product = productData as any;
            const info = products.get(productId);
            if (info) {
              info.hasSpecsEn = product?.specificationsTable !== undefined;
            } else {
              console.warn(`⚠️ Product ${productId} found in EN file but not in static file`);
            }
          }
        }
      }
    }
  }
  
  return products;
}

function validateConsistency() {
  console.log('🔍 Validating JSON file consistency...\n');
  
  const products = getAllProducts();
  
  const issues: string[] = [];
  const stats = {
    total: products.size,
    withHnumber: 0,
    withSpecsAr: 0,
    withSpecsEn: 0,
    missingSpecsAr: 0,
    missingSpecsEn: 0,
    missingBothSpecs: 0
  };
  
  for (const [productId, info] of products) {
    if (info.hasHnumber) stats.withHnumber++;
    if (info.hasSpecsAr) stats.withSpecsAr++;
    if (info.hasSpecsEn) stats.withSpecsEn++;
    
    if (!info.hasSpecsAr) {
      stats.missingSpecsAr++;
      if (!info.hasSpecsEn) {
        stats.missingBothSpecs++;
        issues.push(`❌ ${productId} (${info.brand}/${info.category}/${info.lightingType}): Missing both AR and EN specifications`);
      } else {
        issues.push(`⚠️ ${productId} (${info.brand}/${info.category}/${info.lightingType}): Missing AR specifications`);
      }
    } else if (!info.hasSpecsEn) {
      stats.missingSpecsEn++;
      issues.push(`⚠️ ${productId} (${info.brand}/${info.category}/${info.lightingType}): Missing EN specifications`);
    }
  }
  
  console.log('📊 Statistics:');
  console.log(`   Total products: ${stats.total}`);
  console.log(`   Products with Hnumber: ${stats.withHnumber} (${((stats.withHnumber / stats.total) * 100).toFixed(1)}%)`);
  console.log(`   Products with AR specs: ${stats.withSpecsAr} (${((stats.withSpecsAr / stats.total) * 100).toFixed(1)}%)`);
  console.log(`   Products with EN specs: ${stats.withSpecsEn} (${((stats.withSpecsEn / stats.total) * 100).toFixed(1)}%)`);
  console.log(`   Missing AR specs: ${stats.missingSpecsAr}`);
  console.log(`   Missing EN specs: ${stats.missingSpecsEn}`);
  console.log(`   Missing both specs: ${stats.missingBothSpecs}\n`);
  
  if (issues.length > 0) {
    console.log('⚠️ Issues found:');
    issues.slice(0, 20).forEach(issue => console.log(`   ${issue}`));
    if (issues.length > 20) {
      console.log(`   ... and ${issues.length - 20} more issues`);
    }
  } else {
    console.log('✅ All products have consistent structure!');
  }
}

validateConsistency();
