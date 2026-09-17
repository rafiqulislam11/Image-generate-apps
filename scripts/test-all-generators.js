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

// Create mock 2D context
function createMockCtx() {
  const noop = () => {};
  const grad = { addColorStop: noop };
  return {
    save: noop,
    restore: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    arc: noop,
    arcTo: noop,
    bezierCurveTo: noop,
    quadraticCurveTo: noop,
    rect: noop,
    fill: noop,
    stroke: noop,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    translate: noop,
    rotate: noop,
    scale: noop,
    drawImage: noop,
    setLineDash: noop,
    createLinearGradient: () => grad,
    createRadialGradient: () => grad,
    createPattern: () => ({}),
    getImageData: () => ({ data: new Uint8ClampedArray(400) }),
    putImageData: noop,
    fillStyle: '#000000',
    strokeStyle: '#ffffff',
    lineWidth: 1,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    lineCap: 'butt',
    lineJoin: 'miter',
    shadowColor: 'transparent',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };
}

const allTypes = new Set();
CORE_PATTERN_CATEGORIES.forEach(c => {
  if (c.patternTypes) c.patternTypes.forEach(t => allTypes.add(t));
  c.subCategories.forEach(s => allTypes.add(s.patternType));
});
PATTERN_CATEGORIES.forEach(c => {
  if (c.patternTypes) c.patternTypes.forEach(t => allTypes.add(t));
  c.subCategories.forEach(s => allTypes.add(s.patternType));
});

const rng = () => 0.5;
const testSettings = {
  scale: 50,
  rotation: 45,
  density: 5,
  blendStrength: 0.6,
  lineThickness: 1.5,
  opacity: 0.85,
  stripeWidth: 20,
  stripeGap: 4,
  colors: ['#0d1b3e', '#e05c00', '#c24a00', '#ffd700']
};

let passed = 0;
let errors = [];

allTypes.forEach(type => {
  try {
    const ctx = createMockCtx();
    PatternEngine.generate(ctx, 400, 300, { ...testSettings, patternType: type }, rng);
    passed++;
  } catch (err) {
    errors.push({ type, error: err.message });
  }
});

console.log(`Rendered ${passed} / ${allTypes.size} patternTypes successfully without throwing!`);
if (errors.length > 0) {
  console.error('Errors found:', errors);
}
