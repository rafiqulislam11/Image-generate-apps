'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
const linkRegex = /<link[^>]+href=["']([^"']+)["']/g;

let match;
const localScripts = [];
while ((match = scriptRegex.exec(html)) !== null) {
  const src = match[1].split('?')[0];
  if (!src.startsWith('http')) {
    localScripts.push(src);
  }
}

const localStyles = [];
while ((match = linkRegex.exec(html)) !== null) {
  const href = match[1].split('?')[0];
  if (!href.startsWith('http')) {
    localStyles.push(href);
  }
}

console.log('=== VERIFYING SCRIPTS ===');
let missingCount = 0;
localScripts.forEach(s => {
  const abs = path.join(__dirname, '..', s);
  if (fs.existsSync(abs)) {
    const size = fs.statSync(abs).size;
    console.log(`  ✅ ${s} (${size} bytes)`);
  } else {
    console.error(`  ❌ MISSING: ${s}`);
    missingCount++;
  }
});

console.log('\n=== VERIFYING STYLES ===');
localStyles.forEach(s => {
  const abs = path.join(__dirname, '..', s);
  if (fs.existsSync(abs)) {
    const size = fs.statSync(abs).size;
    console.log(`  ✅ ${s} (${size} bytes)`);
  } else {
    console.error(`  ❌ MISSING: ${s}`);
    missingCount++;
  }
});

console.log(`\nResult: ${missingCount === 0 ? 'ALL ASSETS PRESENT AND VERIFIED' : `${missingCount} ASSETS MISSING`}`);
process.exit(missingCount === 0 ? 0 : 1);
