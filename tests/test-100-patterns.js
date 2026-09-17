/**
 * 100 Core Pattern Categories & 10,000 Sub-patterns Verification Suite
 * Tests full dataset integrity, structure, schema, search, and engine methods.
 */

'use strict';
const assert = require('assert');

console.log('🧪 Starting 100 Core Pattern Categories & 10,000 Sub-patterns Verification...\n');

// 1. Load Data
const { CORE_PATTERN_CATEGORIES, PatternCategoryEngine } = require('../data/pattern-categories.js');

// 2. Category Count
assert.strictEqual(Array.isArray(CORE_PATTERN_CATEGORIES), true, 'CORE_PATTERN_CATEGORIES must be an array');
assert.strictEqual(CORE_PATTERN_CATEGORIES.length, 100, `Expected 100 categories, found ${CORE_PATTERN_CATEGORIES.length}`);
console.log('✅ Passed: Exactly 100 Core Pattern Categories loaded.');

// 3. Verify all 100 expected category names exist
const EXPECTED_NAMES = [
  'Geometric Pattern','Abstract Pattern','Floral Pattern','Botanical Pattern','Leaf Pattern',
  'Flower Pattern','Tropical Pattern','Nature Pattern','Animal Pattern','Bird Pattern',
  'Butterfly Pattern','Insect Pattern','Fish Pattern','Ocean Pattern','Marine Pattern',
  'Shell Pattern','Fruit Pattern','Vegetable Pattern','Food Pattern','Dessert Pattern',
  'Bakery Pattern','Coffee Pattern','Tea Pattern','Beverage Pattern','Kitchen Pattern',
  'Fashion Pattern','Clothing Pattern','Textile Pattern','Fabric Pattern','Sewing Pattern',
  'Lace Pattern','Crochet Pattern','Knitting Pattern','Islamic Pattern','Arabic Pattern',
  'Moroccan Pattern','Persian Pattern','Indian Pattern','Mandala Pattern','Paisley Pattern',
  'Aztec Pattern','Tribal Pattern','African Pattern','Japanese Pattern','Chinese Pattern',
  'Korean Pattern','Scandinavian Pattern','Celtic Pattern','Vintage Pattern','Retro Pattern',
  'Y2K Pattern','Memphis Pattern','Psychedelic Pattern','Boho Pattern','Minimal Pattern',
  'Line Pattern','Dot Pattern','Stripe Pattern','Wave Pattern','Grid Pattern',
  'Checkered Pattern','Plaid Pattern','Chevron Pattern','Zigzag Pattern','Spiral Pattern',
  'Circle Pattern','Triangle Pattern','Square Pattern','Hexagon Pattern','Polygon Pattern',
  'Diamond Pattern','Star Pattern','Heart Pattern','Doodle Pattern','Hand Drawn Pattern',
  'Sketch Pattern','Watercolor Pattern','Brush Pattern','Ink Pattern','Grunge Pattern',
  'Concrete Pattern','Marble Pattern','Stone Pattern','Wood Pattern','Paper Pattern',
  'Metal Pattern','Gold Pattern','Holographic Pattern','Gradient Pattern','Neon Pattern',
  'Glow Pattern','3D Pattern','Technology Pattern','Circuit Pattern','Digital Pattern',
  'Cyberpunk Pattern','Futuristic Pattern','Luxury Pattern','Wedding Pattern','Seasonal Pattern'
];

EXPECTED_NAMES.forEach((expectedName, idx) => {
  const num = idx + 1;
  const found = CORE_PATTERN_CATEGORIES.find(c => c.num === num);
  assert(found, `Category #${num} must exist`);
  assert.strictEqual(found.name, expectedName, `Category #${num}: expected "${expectedName}", got "${found.name}"`);
});
console.log('✅ Passed: All 100 category names verified with correct numbering.');

// 4. Sub-pattern count & schema
let totalSubPatterns = 0;
const seenIds = new Set();

CORE_PATTERN_CATEGORIES.forEach((cat, cIdx) => {
  // Basic fields
  assert(cat.id, `Category #${cIdx+1} missing id`);
  assert(!seenIds.has(cat.id), `Duplicate category ID: ${cat.id}`);
  seenIds.add(cat.id);
  assert.strictEqual(cat.num, cIdx + 1, `Category ${cat.id} wrong num`);
  assert(cat.name, `Category ${cat.id} missing name`);
  assert(cat.icon, `Category ${cat.id} missing icon`);
  assert(cat.group, `Category ${cat.id} missing group`);
  assert(cat.description && cat.description.length >= 10, `Category ${cat.id} description too short`);
  assert(Array.isArray(cat.tags) && cat.tags.length >= 2, `Category ${cat.id} needs >= 2 tags`);
  assert(Array.isArray(cat.patternTypes) && cat.patternTypes.length >= 1, `Category ${cat.id} needs patternTypes`);

  // subCategories
  const subCats = cat.subCategories || cat.subPatterns;
  assert(Array.isArray(subCats), `Category ${cat.id} subCategories must be array`);
  assert.strictEqual(subCats.length, 100, `Category ${cat.id} must have 100 sub-patterns, got ${subCats.length}`);

  subCats.forEach((sub, sIdx) => {
    assert.strictEqual(sub.num, sIdx + 1, `Sub #${sIdx+1} in ${cat.id} wrong num`);
    assert(sub.name, `Sub #${sIdx+1} in ${cat.id} missing name`);
    assert(sub.style, `Sub #${sIdx+1} in ${cat.id} missing style`);
    assert(sub.theme, `Sub #${sIdx+1} in ${cat.id} missing theme`);
    assert(Array.isArray(sub.colors) && sub.colors.length >= 2, `Sub #${sIdx+1} in ${cat.id} needs >= 2 colors`);
    assert(sub.patternType, `Sub #${sIdx+1} in ${cat.id} missing patternType`);
    assert(sub.prompt && sub.prompt.length >= 20, `Sub #${sIdx+1} in ${cat.id} prompt too short`);
  });

  totalSubPatterns += subCats.length;
});

assert.strictEqual(totalSubPatterns, 10000, `Expected 10,000 total sub-patterns, got ${totalSubPatterns}`);
console.log('✅ Passed: Exactly 10,000 sub-patterns with valid schema (colors, style, theme, prompt, patternType).');

// 5. PatternCategoryEngine API
assert(typeof PatternCategoryEngine === 'object', 'PatternCategoryEngine must exist');
assert(typeof PatternCategoryEngine.getAll === 'function', 'PatternCategoryEngine.getAll exists');
assert.strictEqual(PatternCategoryEngine.getAll().length, 100, 'getAll() returns 100');

const geoCat = PatternCategoryEngine.getById('geometric_pattern');
assert(geoCat, 'getById("geometric_pattern") returns a category');
assert.strictEqual(geoCat.name, 'Geometric Pattern');

const searchResults = PatternCategoryEngine.search('gold');
assert(searchResults.length > 0, `search("gold") returns matches, got ${searchResults.length}`);
console.log(`✅ Passed: PatternCategoryEngine.search("gold") returned ${searchResults.length} categories.`);

const rndResult = PatternCategoryEngine.getRandomSubpattern('mandala_pattern');
assert(rndResult, 'getRandomSubpattern() returns a result');
assert(rndResult.subCategory || rndResult.subPattern, 'random result has subCategory');
console.log('✅ Passed: PatternCategoryEngine helper API fully functional.');

console.log('\n🎉 ALL 100 Pattern Categories & 10,000 Sub-patterns Tests PASSED (100%)!\n');
