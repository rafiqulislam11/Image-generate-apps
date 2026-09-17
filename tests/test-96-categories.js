'use strict';
const path = require('path');
const fs = require('fs');

console.log('=== VERIFYING 96 BACKGROUND CATEGORIES & 9,600 SUBCATEGORIES ===\n');

let pass = 0;
let fail = 0;
function test(desc, cond) {
  if (cond) {
    console.log(`  ✅ PASS: ${desc}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
    fail++;
  }
}

// 1. Categories Data Validation
const categoriesPath = path.join(__dirname, '../data/categories.js');
const { PATTERN_CATEGORIES, CategoryEngine } = require(categoriesPath);

test('PATTERN_CATEGORIES is defined and is an Array', Array.isArray(PATTERN_CATEGORIES));
test('Exactly 96 Background Categories present', PATTERN_CATEGORIES.length === 96);

let totalSubCategories = 0;
let validIdCount = 0;
let validNameCount = 0;
let validDescCount = 0;
let validIconCount = 0;
let valid100Count = 0;
let validColorsCount = 0;
let validPromptsCount = 0;

PATTERN_CATEGORIES.forEach((cat, idx) => {
  if (cat.id && typeof cat.id === 'string') validIdCount++;
  if (cat.name && typeof cat.name === 'string') validNameCount++;
  if (cat.description && typeof cat.description === 'string') validDescCount++;
  if (cat.icon && typeof cat.icon === 'string') validIconCount++;
  if (Array.isArray(cat.subCategories) && cat.subCategories.length === 100) valid100Count++;
  if (Array.isArray(cat.subCategories)) {
    totalSubCategories += cat.subCategories.length;
    cat.subCategories.forEach(sub => {
      if (Array.isArray(sub.colors) && sub.colors.length >= 2) validColorsCount++;
      if (sub.prompt && sub.prompt.length > 10) validPromptsCount++;
    });
  }
});

test('All 96 categories have valid string IDs', validIdCount === 96);
test('All 96 categories have valid Names', validNameCount === 96);
test('All 96 categories have Descriptions', validDescCount === 96);
test('All 96 categories have Icons', validIconCount === 96);
test('All 96 categories have exactly 100 sub-categories', valid100Count === 96);
test('Total sub-categories count equals 9,600', totalSubCategories === 9600);
test('All 9,600 sub-categories have valid color palettes', validColorsCount === 9600);
test('All 9,600 sub-categories have full AI prompts', validPromptsCount === 9600);

// 2. CategoryEngine Helpers
test('CategoryEngine.getAll() returns 96 categories', CategoryEngine.getAll().length === 96);
test('CategoryEngine.getById("abstract_bg") returns Abstract Background', CategoryEngine.getById('abstract_bg')?.name === 'Abstract Background');
test('CategoryEngine.getById("business_bg") returns Business Background', CategoryEngine.getById('business_bg')?.name === 'Business Background');
test('CategoryEngine.getByGroup("space") returns 12 space categories', CategoryEngine.getByGroup('space').length === 12);
test('CategoryEngine.getSubCategories("neon_bg") returns 100 sub-categories', CategoryEngine.getSubCategories('neon_bg').length === 100);
test('CategoryEngine.search("bokeh") finds Bokeh Background', CategoryEngine.search('bokeh').some(c => c.name.includes('Bokeh')));
test('CategoryEngine.getRandomSubcategory() returns category & subcategory', Boolean(CategoryEngine.getRandomSubcategory()?.subCategory));

// 3. HTML Checks
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
test('index.html contains "96 Background Categories"', htmlContent.includes('96 Background Categories'));
test('index.html contains "9,600 Sub-styles"', htmlContent.includes('9,600 Sub-styles'));
test('index.html contains modal-subcategory-explorer', htmlContent.includes('id="modal-subcategory-explorer"'));
test('index.html contains subcat-search-input', htmlContent.includes('id="subcat-search-input"'));
test('index.html contains subcat-grid-container', htmlContent.includes('id="subcat-grid-container"'));
test('index.html contains category-filter-chips', htmlContent.includes('id="category-filter-chips"'));

// 4. CSS Checks
const cssContent = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');
test('style.css contains .category-studio-card styles', cssContent.includes('.category-studio-card'));
test('style.css contains .subcat-modal-box styles', cssContent.includes('.subcat-modal-box'));
test('style.css contains .btn-subcat-apply styles', cssContent.includes('.btn-subcat-apply'));
test('style.css contains .subcat-palette-dots styles', cssContent.includes('.subcat-palette-dots'));

// 5. AI Parser Checks
const AIParser = require(path.join(__dirname, '../js/ai-parser.js'));
const p1 = AIParser.parse('Neon cyberpunk grid with glowing violet lines');
test('AIParser successfully parses neon prompt', p1.category !== undefined);
const p2 = AIParser.parse('Amethyst crystal geode background with gold veins');
test('AIParser successfully parses crystal prompt', p2.category !== undefined);
const p3 = AIParser.parse('Frosted glassmorphism background with soft blur');
test('AIParser successfully parses frosted glass prompt', p3.category !== undefined);

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${pass} Passed, ${fail} Failed`);
console.log(`========================================\n`);

if (fail > 0) process.exit(1);
