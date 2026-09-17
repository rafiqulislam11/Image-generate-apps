'use strict';
/**
 * tests/test-1000-templates.js
 * Comprehensive validation for 1,000 Design Templates & Presets
 */

const assert = require('assert');
const path = require('path');

console.log('=== VALIDATING 1,000 DESIGN TEMPLATES (BUTTON PRESETS) ===\n');

// 1. Load Templates
const templates = require(path.join(__dirname, '../data/templates.js'));
assert(Array.isArray(templates), 'templates should be an array');
console.log(`✅ Total Templates Count: ${templates.length} (Expected: 1000)`);
assert.strictEqual(templates.length, 1000, 'Must have exactly 1000 templates');

// 2. Category Distribution
const categories = {};
templates.forEach(t => {
  categories[t.category] = (categories[t.category] || 0) + 1;
});
console.log('✅ Category Breakdown:');
Object.entries(categories).forEach(([cat, count]) => {
  console.log(`   • ${cat}: ${count} presets`);
  assert.strictEqual(count, 100, `Category ${cat} must have exactly 100 presets`);
});

// 3. Supported PatternEngine Generators
global.window = {};
const PatternEngine = require(path.join(__dirname, '../js/pattern-engine.js'));
global.PatternEngine = PatternEngine;
window.PatternEngine = PatternEngine;
require(path.join(__dirname, '../js/spiral-patterns.js'));
require(path.join(__dirname, '../js/master-art-engine.js'));

const supported = new Set(PatternEngine.getPatternTypes());
let invalidGenerators = 0;
const usedTypes = new Set();

templates.forEach((t, i) => {
  assert(t.id, `Template #${i} must have id`);
  assert(t.name, `Template #${i} must have name`);
  assert(t.icon, `Template #${i} must have icon`);
  assert(t.state, `Template #${i} must have state`);
  assert(Array.isArray(t.state.colors) && t.state.colors.length >= 3, `Template #${i} must have 3+ colors`);
  
  const pt = t.state.patternType;
  usedTypes.add(pt);
  const gen = PatternEngine._getGenerator(pt);
  if (!gen || (gen === PatternEngine._genMap.plaid && pt !== 'plaid')) {
    console.error(`❌ Unsupported generator: ${pt} in template ${t.id}`);
    invalidGenerators++;
  }
});

console.log(`✅ Unique patternTypes used across 1,000 presets: ${usedTypes.size}`);
assert.strictEqual(invalidGenerators, 0, 'All patternTypes must be supported in PatternEngine without fallback');
console.log('✅ 100% of generators across all 1,000 presets are fully supported!');

console.log('\n========================================');
console.log('ALL 1,000 PRESETS VALIDATED SUCCESSFULLY!');
console.log('========================================\n');
