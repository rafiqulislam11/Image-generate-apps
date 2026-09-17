const path = require('path');
const fs = require('fs');

global.window = {};
const PatternEngine = require(path.join(__dirname, '../js/pattern-engine.js'));
global.PatternEngine = PatternEngine;
window.PatternEngine = PatternEngine;
require(path.join(__dirname, '../js/spiral-patterns.js'));
require(path.join(__dirname, '../js/master-art-engine.js'));

const { PATTERN_CATEGORIES } = require(path.join(__dirname, '../data/categories.js'));
const { CORE_PATTERN_CATEGORIES } = require(path.join(__dirname, '../data/pattern-categories.js'));

console.log('--- CHECKING PATTERN_CATEGORIES (96 Backgrounds) ---');
let bgPlaidCount = 0;
let bgTotalSubs = 0;
const bgMissingTypes = new Set();

PATTERN_CATEGORIES.forEach(cat => {
  cat.subCategories.forEach(sub => {
    bgTotalSubs++;
    const pt = sub.patternType || cat.patternTypes[0];
    const gen = PatternEngine._getGenerator(pt);
    if (gen === PatternEngine._genMap.plaid && pt !== 'plaid') {
      bgPlaidCount++;
      bgMissingTypes.add(pt);
    }
  });
});
console.log(`96 Backgrounds: ${bgPlaidCount} / ${bgTotalSubs} sub-categories fall back to PLAID!`);
console.log('Missing types in backgrounds:', [...bgMissingTypes]);

console.log('\n--- CHECKING CORE_PATTERN_CATEGORIES (100 Patterns) ---');
let patPlaidCount = 0;
let patTotalSubs = 0;
const patMissingTypes = new Set();

CORE_PATTERN_CATEGORIES.forEach(cat => {
  cat.subCategories.forEach(sub => {
    patTotalSubs++;
    const pt = sub.patternType || (cat.patternTypes && cat.patternTypes[0]);
    const gen = PatternEngine._getGenerator(pt);
    if (gen === PatternEngine._genMap.plaid && pt !== 'plaid') {
      patPlaidCount++;
      patMissingTypes.add(pt);
    }
  });
});
console.log(`100 Patterns: ${patPlaidCount} / ${patTotalSubs} sub-patterns fall back to PLAID!`);
console.log('Missing types in patterns:', [...patMissingTypes]);
