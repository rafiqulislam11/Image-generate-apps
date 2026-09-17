'use strict';
/**
 * tests/test-templates-interactive.js
 * End-to-end interactive UI test for Design Templates (1,000 Presets in Button format)
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('🧪 Starting Interactive Templates UI Flow Verification...\n');

// Mock browser DOM
class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.classList = {
      _classes: new Set(className.split(' ').filter(Boolean)),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c) => {
        if (this.classList._classes.has(c)) this.classList._classes.delete(c);
        else this.classList._classes.add(c);
      }
    };
    this.children = [];
    this._innerHTML = '';
    this.value = '';
    this.style = {};
    this.attributes = {};
    this._listeners = {};
  }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(val) {
    this._innerHTML = val;
    if (val === '') this.children = [];
  }
  setAttribute(name, val) { this.attributes[name] = String(val); }
  getAttribute(name) { return this.attributes[name] || null; }
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }
  dispatchEvent(evt) {
    const list = this._listeners[evt.type] || [];
    list.forEach(fn => fn(evt));
  }
  click() {
    this.dispatchEvent({ type: 'click', stopPropagation: () => {}, preventDefault: () => {} });
  }
  appendChild(child) {
    this.children.push(child);
  }
  querySelectorAll(sel) {
    const results = [];
    const walk = (el) => {
      if (!el.children) return;
      for (const c of el.children) {
        if (sel.startsWith('.')) {
          const cls = sel.substring(1);
          if (c.classList && c.classList.contains(cls)) results.push(c);
        } else if (sel.startsWith('#')) {
          const id = sel.substring(1);
          if (c.id === id) results.push(c);
        }
        walk(c);
      }
    };
    walk(this);
    return results;
  }
  querySelector(sel) {
    const res = this.querySelectorAll(sel);
    return res[0] || null;
  }
  scrollIntoView() {}
}

const elements = {};
function getEl(id, tag = 'div', cls = '') {
  if (!elements[id]) elements[id] = new MockElement(tag, id, cls);
  return elements[id];
}

const dom = {
  getElementById: (id) => elements[id] || null,
  querySelectorAll: (sel) => {
    if (sel.includes('#template-filter-chips .category-chip')) {
      return elements['template-filter-chips'] ? elements['template-filter-chips'].children : [];
    }
    return [];
  },
  querySelector: (sel) => null,
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {}
};

global.document = dom;
global.window = {
  addEventListener: () => {}
};

// Setup Elements
const container = getEl('templates-grid-container', 'div', 'templates-grid-container');
const searchInput = getEl('template-search-input', 'input');
const searchClear = getEl('template-search-clear', 'button');
const randomBtn = getEl('btn-random-template', 'button');
const btnViewCards = getEl('btn-tpl-view-cards', 'button');
const btnViewButtons = getEl('btn-tpl-view-buttons', 'button');
const loadMoreBtn = getEl('btn-template-load-more', 'button');
const loadMoreContainer = getEl('template-load-more-container', 'div');
const counterEl = getEl('template-results-count', 'span');
const loadMoreCounterEl = getEl('template-load-more-counter', 'span');

const filterChipsEl = getEl('template-filter-chips', 'div');
const cats = ['all', 'luxury', 'geometric', 'floral', 'cyberpunk', 'abstract', 'nature', 'traditional', 'minimal', 'textile', 'cosmic'];
cats.forEach(c => {
  const chip = new MockElement('button', '', 'category-chip');
  chip.setAttribute('data-tfilter', c);
  if (c === 'all') chip.classList.add('active');
  filterChipsEl.appendChild(chip);
});

// Load Templates & App
const PATTERN_TEMPLATES = require(path.join(__dirname, '../data/templates.js'));
global.PATTERN_TEMPLATES = PATTERN_TEMPLATES;

const App = require(path.join(__dirname, '../js/app.js'));
let lastApplied = null;
App.applyTemplate = function(tpl) {
  lastApplied = tpl;
  this.state = this.state || {};
  Object.assign(this.state, tpl.state);
};

// Run initTemplates
App.initTemplates();

// 1. Initial Render Check
assert(container.children.length === 60, `Should render 60 preset buttons initially, got ${container.children.length}`);
console.log(`  ✅ PASS: Rendered initial 60 preset buttons`);
assert.strictEqual(counterEl.textContent, '1,000 Presets');
console.log(`  ✅ PASS: Counter displays 1,000 Presets`);

// 2. Click a preset button
const firstBtn = container.children[0];
firstBtn.click();
assert(lastApplied !== null, 'Clicking button should call applyTemplate');
console.log(`  ✅ PASS: Preset button click applies template: ${lastApplied.name}`);
assert(firstBtn.classList.contains('active'), 'Clicked preset button should have active class');
console.log(`  ✅ PASS: Applied button receives active highlight`);

// 3. Category Filter
const luxuryChip = filterChipsEl.children[1];
luxuryChip.click();
assert(container.children.length === 60, `Luxury category should render initial 60 buttons, got ${container.children.length}`);
assert.strictEqual(counterEl.textContent, '100 Presets');
console.log(`  ✅ PASS: Luxury category filter shows 100 Presets`);

// 4. Load More
loadMoreBtn.click();
assert(container.children.length === 100, `Loading more should render all 100 luxury presets, got ${container.children.length}`);
assert.strictEqual(loadMoreContainer.style.display, 'none');
console.log(`  ✅ PASS: Load More expands to show all 100 presets and hides load more button`);

// 5. Random Button
randomBtn.click();
assert(lastApplied.category === 'luxury', `Random button while luxury filter active should pick luxury preset`);
console.log(`  ✅ PASS: Random preset successfully picked: ${lastApplied.name}`);

// 6. View Mode Toggle
btnViewButtons.click();
assert(btnViewButtons.classList.contains('active'), 'Buttons mode should be active');
assert(container.className.includes('compact-mode'), 'Container should have compact-mode class');
console.log(`  ✅ PASS: View mode toggle switches to compact button layout`);

console.log('\n========================================');
console.log('TEMPLATES UI TEST: All tests passed!');
console.log('========================================\n');
