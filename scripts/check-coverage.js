const path = require('path');
const { CORE_PATTERN_CATEGORIES } = require(path.join(__dirname, '../data/pattern-categories.js'));
const { PATTERN_CATEGORIES } = require(path.join(__dirname, '../data/categories.js'));
const fs = require('fs');

// Collect all unique patternTypes
const allTypes = new Set();
CORE_PATTERN_CATEGORIES.forEach(c => {
  if (c.patternTypes) c.patternTypes.forEach(t => allTypes.add(t));
  if (c.subCategories) c.subCategories.forEach(s => { if (s.patternType) allTypes.add(s.patternType); });
});
PATTERN_CATEGORIES.forEach(c => {
  if (c.patternTypes) c.patternTypes.forEach(t => allTypes.add(t));
  if (c.subCategories) c.subCategories.forEach(s => { if (s.patternType) allTypes.add(s.patternType); });
});

console.log('Total unique patternTypes across all 196 categories:', allTypes.size);

global.window = {};
const PatternEngine = require(path.join(__dirname, '../js/pattern-engine.js'));
global.PatternEngine = PatternEngine;
window.PatternEngine = PatternEngine;

require(path.join(__dirname, '../js/spiral-patterns.js'));
require(path.join(__dirname, '../js/master-art-engine.js'));

const supportedTypes = new Set(PatternEngine.getPatternTypes());
console.log('Total supported types in PatternEngine:', supportedTypes.size);

const unsupported = [];
for (const t of allTypes) {
  if (!supportedTypes.has(t)) {
    // Check if _getGenerator falls back to plaid or actually has a generator
    const gen = PatternEngine._getGenerator(t);
    if (gen === PatternEngine._genMap.plaid) {
      unsupported.push(t);
    }
  }
}

console.log('Unsupported types that fall back to plaid (Count):', unsupported.length);
if (unsupported.length > 0) {
  console.log('Unsupported types list:', unsupported);
}
