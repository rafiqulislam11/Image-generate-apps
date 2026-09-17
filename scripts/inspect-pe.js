const fs = require('fs');
const peCode = fs.readFileSync('js/pattern-engine.js', 'utf8');
console.log('Size of pattern-engine.js:', peCode.length);
console.log('First 500 chars:');
console.log(peCode.slice(0, 500));

// Find methods on PatternEngine or exported object
const methods = [...peCode.matchAll(/([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*\{/g)].map(m => m[1]);
console.log('Method names found in pattern-engine.js (first 30):', methods.slice(0, 30));

const patternsMatch = peCode.match(/(?:PATTERNS|patterns|registry|handlers)\s*[:=]\s*\{/);
if (patternsMatch) {
  console.log('Registry object found at index:', patternsMatch.index);
}
