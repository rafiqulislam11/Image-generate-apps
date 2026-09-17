const fs = require('fs');

const peCode = fs.readFileSync('js/pattern-engine.js', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

// Find all patterns defined in PatternEngine
const renderMatches = [...peCode.matchAll(/case\s+['"]([^'"]+)['"]\s*:/g)].map(m => m[1]);
console.log('Total case in PatternEngine:', renderMatches.length);

// Find PATTERNS in js/app.js
const pDefMatch = appCode.match(/const\s+PATTERNS\s*=\s*\[([\s\S]*?)\];/);
if (pDefMatch) {
  const ids = [...pDefMatch[1].matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log('Total patterns in App PATTERNS array:', ids.length);
} else {
  console.log('PATTERNS array not found directly in app.js');
}

// Check what happens in renderCanvas / renderPattern
console.log('Searching for renderCanvas or requestRender in app.js:');
const renderFn = appCode.match(/renderCanvas\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\},/);
if (renderFn) {
  console.log('renderCanvas snippet:', renderFn[1].slice(0, 500));
}
