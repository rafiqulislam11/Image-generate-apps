'use strict';
const path = require('path');
const fs = require('fs');

console.log('🧪 Starting Interactive Category Flow Verification...\n');

// 1. Setup mock DOM
const elements = {};
function createMockElement(tag, id = '') {
  const el = {
    tagName: tag.toUpperCase(),
    id,
    className: '',
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    style: {},
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    children: [],
    appendChild(child) { this.children.push(child); return child; },
    listeners: {},
    addEventListener(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    },
    dispatchEvent(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(fn => fn(data || { target: this }));
      }
    },
    querySelectorAll(selector) {
      const results = [];
      const walk = (node) => {
        if (node.children) {
          node.children.forEach(child => {
            if (selector.startsWith('.') && child.className && child.className.includes(selector.slice(1))) {
              results.push(child);
            }
            walk(child);
          });
        }
      };
      walk(this);
      return results;
    },
    querySelector(selector) {
      const list = this.querySelectorAll(selector);
      return list[0] || null;
    },
    get innerHTML() { return this._html || ''; },
    set innerHTML(val) {
      this._html = val;
      this.children = [];
    }
  };
  return el;
}

const elementIds = [
  'categories-grid-container',
  'category-search-input',
  'category-filter-chips',
  'categories-count-badge',
  'panel-categories-header-title',
  'btn-mode-patterns',
  'btn-mode-backgrounds',
  'modal-subcategory-explorer',
  'modal-subcat-backdrop',
  'modal-subcat-close',
  'btn-subcat-close-footer',
  'btn-subcat-random',
  'subcat-modal-icon',
  'subcat-modal-category-name',
  'subcat-modal-count-badge',
  'subcat-modal-desc',
  'subcat-search-input',
  'subcat-tags-container',
  'subcat-grid-container',
  'subcat-footer-info',
  'ai-prompt-input',
  'ai-studio-prompt'
];

elementIds.forEach(id => {
  elements[id] = createMockElement('div', id);
});

global.document = {
  getElementById(id) {
    return elements[id] || null;
  },
  createElement(tag) {
    return createMockElement(tag);
  }
};

// 2. Load Data
const { PATTERN_CATEGORIES } = require(path.join(__dirname, '../data/categories.js'));
const { CORE_PATTERN_CATEGORIES } = require(path.join(__dirname, '../data/pattern-categories.js'));

global.PATTERN_CATEGORIES = PATTERN_CATEGORIES;
global.CORE_PATTERN_CATEGORIES = CORE_PATTERN_CATEGORIES;

// 3. Load App slice for Categories
const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

// Extract App object definition
const dummyApp = {
  state: {
    patternType: 'geometric',
    colors: ['#000000', '#ffffff'],
    scale: 50,
    density: 5
  },
  selectPattern(type) {
    this.state.patternType = type;
  },
  applyStateToUI() {},
  syncEasySlidersFromState() {},
  pushHistory() {},
  requestRender() {},
  updatePatternInfo() {},
  generateVariations() {},
  showToast(msg) { this.lastToast = msg; }
};

// Extract initCategories, initSubCategoryModalEvents, openSubCategoryModal, applySubCategoryToStudio
const m1 = appCode.match(/initCategories\(\)\s*\{([\s\S]*?)\n\s*\},[\r\n]+\s*\/\/\s*───\s*Sub-category Modal Explorer/);
const m2 = appCode.match(/initSubCategoryModalEvents\(\)\s*\{([\s\S]*?)\n\s*\},[\r\n]+\s*openSubCategoryModal/);
const m3 = appCode.match(/openSubCategoryModal\(category\)\s*\{([\s\S]*?)\n\s*\},[\r\n]+\s*applySubCategoryToStudio/);
const m4 = appCode.match(/applySubCategoryToStudio\(category,\s*subCategory\)\s*\{([\s\S]*?)\n\s*\},[\r\n]+\s*\/\/\s*───\s*Curated Design Templates/);

if (!m1 || !m2 || !m3 || !m4) {
  console.error('❌ Could not extract category methods from app.js');
  process.exit(1);
}

dummyApp.initCategories = new Function(m1[1]).bind(dummyApp);
dummyApp.initSubCategoryModalEvents = new Function(m2[1]).bind(dummyApp);
dummyApp.openSubCategoryModal = new Function('category', m3[1]).bind(dummyApp);
dummyApp.applySubCategoryToStudio = new Function('category', 'subCategory', m4[1]).bind(dummyApp);

// 4. Test initial state (Patterns mode)
dummyApp.initCategories();

let grid = elements['categories-grid-container'];
let chips = elements['category-filter-chips'];

let pass = 0;
let fail = 0;
function assert(desc, cond) {
  if (cond) {
    console.log(`  ✅ PASS: ${desc}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
    fail++;
  }
}

assert('Initial mode is patterns', dummyApp._activeCategoryMode === 'patterns');
assert('100 pattern category cards rendered', grid.children.length === 100);
assert('14 filter chips generated for patterns', chips.children.length === 14);

// 5. Test search functionality
elements['category-search-input'].dispatchEvent('input', { target: { value: 'Islamic' } });
assert('Search "Islamic" finds Islamic Pattern', grid.children.some(c => c.innerHTML.includes('Islamic Pattern')));

elements['category-search-input'].dispatchEvent('input', { target: { value: '' } });
assert('Clearing search restores 100 categories', grid.children.length === 100);

// 6. Test Switch to Backgrounds mode
elements['btn-mode-backgrounds'].dispatchEvent('click');
assert('Active mode is now backgrounds', dummyApp._activeCategoryMode === 'backgrounds');
assert('96 background categories rendered', grid.children.length === 96);
assert('12 filter chips generated for backgrounds', chips.children.length === 12);

// 7. Test Sub-category Explorer Modal
const testCat = CORE_PATTERN_CATEGORIES[0]; // Geometric Pattern
dummyApp.openSubCategoryModal(testCat);

assert('Modal becomes active', elements['modal-subcategory-explorer'].classList.contains('active'));
assert('Modal category title set', elements['subcat-modal-category-name'].textContent.includes('Geometric'));
assert('Modal grid container has 100 sub-patterns', elements['subcat-grid-container'].children.length === 100);

// 8. Test Apply to Studio
const testSub = testCat.subCategories[0];
dummyApp.applySubCategoryToStudio(testCat, testSub);

assert('Studio patternType applied', dummyApp.state.patternType === testSub.patternType);
assert('Studio colors applied', dummyApp.state.colors.length >= 2);
assert('AI prompt input updated', elements['ai-prompt-input'].value === testSub.prompt);
assert('Studio prompt input updated', elements['ai-studio-prompt'].value === testSub.prompt);
assert('Toast triggered with success message', dummyApp.lastToast.includes('Generated'));

console.log(`\n========================================`);
console.log(`INTERACTIVE TEST SUMMARY: ${pass} Passed, ${fail} Failed`);
console.log(`========================================\n`);

process.exit(fail === 0 ? 0 : 1);
