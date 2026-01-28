import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to fix JSON files to match Prisma schema requirements
 * 
 * Issues to fix:
 * 1. Convert numeric values to strings in products-details-en.json
 *    - "Maximum wattage": number -> string
 *    - "IP": number -> string
 *    - "maxIP": number -> string
 * 2. Ensure all files have consistent structure
 */

function fixEnglishFile() {
  const filePath = path.resolve(__dirname, '../../../apps/web/src/data/products-details-en.json');
  console.log(`📝 Reading ${filePath}...`);
  
  const content = readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  let fixedCount = 0;
  
  function fixSpecificationsTable(specs: any): void {
    if (!specs || typeof specs !== 'object') return;
    
    // Fix numeric fields that should be strings
    const numericFields = ['Maximum wattage', 'IP', 'maxIP'];
    
    for (const field of numericFields) {
      if (specs[field] !== undefined && typeof specs[field] === 'number') {
        specs[field] = String(specs[field]);
        fixedCount++;
      }
    }
  }
  
  function processCategory(category: any): void {
    if (!category || typeof category !== 'object') return;
    
    for (const lightingType of Object.values(category)) {
      if (!Array.isArray(lightingType)) continue;
      
      for (const productArray of lightingType) {
        if (!Array.isArray(productArray) && typeof productArray === 'object') {
          // Handle case where productArray is actually an object
          for (const product of Object.values(productArray)) {
            if (product && typeof product === 'object' && 'specificationsTable' in product) {
              fixSpecificationsTable((product as any).specificationsTable);
            }
          }
        } else if (Array.isArray(productArray)) {
          for (const productObj of productArray) {
            if (!productObj || typeof productObj !== 'object') continue;
            
            for (const product of Object.values(productObj)) {
              if (product && typeof product === 'object' && 'specificationsTable' in product) {
                fixSpecificationsTable((product as any).specificationsTable);
              }
            }
          }
        }
      }
    }
  }
  
  // Process all brands
  if (data.categories) {
    for (const brand of Object.values(data.categories)) {
      if (!brand || typeof brand !== 'object') continue;
      
      for (const category of Object.values(brand)) {
        processCategory(category);
      }
    }
  }
  
  // Write fixed file
  const fixedContent = JSON.stringify(data, null, 4);
  writeFileSync(filePath, fixedContent, 'utf8');
  
  console.log(`✅ Fixed ${fixedCount} numeric values in products-details-en.json`);
}

function validateStructure() {
  console.log('\n🔍 Validating JSON file structures...');
  
  const files = [
    {
      name: 'products-details-static.json',
      path: path.resolve(__dirname, '../../../apps/web/src/data/products-details-static.json')
    },
    {
      name: 'products-details-ar.json',
      path: path.resolve(__dirname, '../../../apps/web/src/data/products-details-ar.json')
    },
    {
      name: 'products-details-en.json',
      path: path.resolve(__dirname, '../../../apps/web/src/data/products-details-en.json')
    }
  ];
  
  for (const file of files) {
    try {
      const content = readFileSync(file.path, 'utf8');
      const data = JSON.parse(content);
      
      if (!data.categories) {
        console.error(`❌ ${file.name}: Missing 'categories' key`);
        continue;
      }
      
      let productCount = 0;
      let specsCount = 0;
      
      for (const brand of Object.values(data.categories)) {
        if (!brand || typeof brand !== 'object') continue;
        
        for (const category of Object.values(brand)) {
          if (!category || typeof category !== 'object') continue;
          
          for (const lightingType of Object.values(category)) {
            if (!Array.isArray(lightingType)) continue;
            
            for (const productArray of lightingType) {
              if (Array.isArray(productArray)) {
                for (const productObj of productArray) {
                  if (!productObj || typeof productObj !== 'object') continue;
                  
                  for (const [productId, product] of Object.entries(productObj)) {
                    productCount++;
                    
                    if (product && typeof product === 'object' && 'specificationsTable' in product) {
                      specsCount++;
                    }
                  }
                }
              } else if (typeof productArray === 'object') {
                for (const [productId, product] of Object.entries(productArray)) {
                  productCount++;
                  
                  if (product && typeof product === 'object' && 'specificationsTable' in product) {
                    specsCount++;
                  }
                }
              }
            }
          }
        }
      }
      
      console.log(`✅ ${file.name}: ${productCount} products, ${specsCount} with specifications`);
      
    } catch (error) {
      console.error(`❌ ${file.name}: Error -`, error);
    }
  }
}

// Main execution
console.log('🚀 Starting JSON file fixes...\n');

try {
  fixEnglishFile();
  validateStructure();
  
  console.log('\n✅ All fixes completed successfully!');
} catch (error) {
  console.error('❌ Error during fixes:', error);
  process.exit(1);
}
