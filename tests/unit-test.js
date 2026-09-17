'use strict';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('=== RUNNING AI PATTERN STUDIO PRO TEST SUITE ===\n');

const path = require('path');

// 1. Check Categories (96 Background Categories with 100 Sub-categories each = 9,600 total)
try {
  const PATTERN_CATEGORIES = require(path.join(__dirname, '../data/categories.js'));
  assert(Array.isArray(PATTERN_CATEGORIES), 'PATTERN_CATEGORIES is an array');
  assert(PATTERN_CATEGORIES.length === 96, `PATTERN_CATEGORIES has 96 categories (found ${PATTERN_CATEGORIES?.length})`);
  const firstCat = PATTERN_CATEGORIES[0];
  assert(firstCat.id && firstCat.name && firstCat.patternTypes?.length > 0, 'Category has id, name, and patternTypes');
  const totalSubCats = PATTERN_CATEGORIES.reduce((sum, c) => sum + (c.subCategories?.length || 0), 0);
  assert(totalSubCats === 9600, `PATTERN_CATEGORIES has 9,600 total sub-categories (found ${totalSubCats})`);
  assert(firstCat.subCategories.length === 100, `First category (${firstCat.name}) contains 100 sub-categories`);
  const lastCat = PATTERN_CATEGORIES[95];
  assert(lastCat.name === 'Business Background' && lastCat.subCategories.length === 100, `96th category (${lastCat.name}) contains 100 sub-categories`);
} catch (e) {
  assert(false, 'Failed loading categories.js: ' + e.message);
}

// 2. Check Templates
try {
  const PATTERN_TEMPLATES = require(path.join(__dirname, '../data/templates.js'));
  assert(Array.isArray(PATTERN_TEMPLATES), 'PATTERN_TEMPLATES is an array');
  assert(PATTERN_TEMPLATES.length >= 8, `PATTERN_TEMPLATES has curated templates (found ${PATTERN_TEMPLATES?.length})`);
  const firstTpl = PATTERN_TEMPLATES[0];
  assert(firstTpl.state && firstTpl.state.patternType && firstTpl.state.colors, 'Template has valid state configuration');
} catch (e) {
  assert(false, 'Failed loading templates.js: ' + e.message);
}

// 3. Check AIParser
try {
  const AIParser = require(path.join(__dirname, '../js/ai-parser.js'));
  assert(typeof AIParser !== 'undefined', 'AIParser is loaded');
  const parsed1 = AIParser.parse('Luxury emerald and gold art deco damask with floral symmetry, seamless 8K wallpaper');
  assert(Boolean(parsed1.category), `Prompt category parsed correctly: ${parsed1.category}`);
  assert(parsed1.colors && parsed1.colors.length >= 2, `Colors extracted: ${parsed1.colors?.join(', ')}`);
  assert(parsed1.scale > 0, `Scale parsed: ${parsed1.scale}`);
  assert(parsed1.densityValue > 0, `Density value parsed: ${parsed1.densityValue}`);
} catch (e) {
  assert(false, 'Failed testing AIParser: ' + e.message);
}

// 4. Check SimilarityEngine
try {
  const SimilarityEngine = require(path.join(__dirname, '../js/similarity-engine.js'));
  assert(typeof SimilarityEngine !== 'undefined', 'SimilarityEngine is loaded');
  const stateA = { patternType: 'plaid', colors: ['#000000', '#ffffff'], scale: 50, density: 5 };
  const stateB = { patternType: 'plaid', colors: ['#000000', '#ffffff'], scale: 50, density: 5 };
  const stateC = { patternType: 'mandala', colors: ['#ff0055', '#00ffcc', '#ffff00', '#0000ff'], scale: 95, density: 12 };
  const simIdentical = SimilarityEngine.compareStates(stateA, stateB);
  assert(simIdentical > 0.8, `Identical states have high similarity score: ${simIdentical}`);
  const simDifferent = SimilarityEngine.compareStates(stateA, stateC);
  assert(simDifferent < 0.5, `Different states have low similarity score: ${simDifferent}`);
  const evalResult = SimilarityEngine.evaluateSimilarity(stateA, [stateB, stateC]);
  assert(evalResult.duplicateDetected === true, 'Duplicate detected when comparing identical state');
  assert(evalResult.disclaimer.toLowerCase().includes('approximate mathematical'), 'Disclaimer includes mathematical indicator notice');
} catch (e) {
  assert(false, 'Failed testing SimilarityEngine: ' + e.message);
}

// 5. Check MetadataEngine
try {
  const MetadataEngine = require(path.join(__dirname, '../js/metadata-engine.js'));
  assert(typeof MetadataEngine !== 'undefined', 'MetadataEngine is loaded');
  const mockState = {
    patternType: 'cyberpunkCircuit',
    colors: ['#000000', '#00ffcc', '#ff0055', '#7928ca'],
    scale: 50,
    density: 5,
    rotation: 45,
    seed: 123456
  };
  const meta = MetadataEngine.generate(mockState);
  assert(meta.title && meta.title.length > 5, `Metadata title generated: ${meta.title}`);
  assert(meta.keywords && meta.keywords.length >= 10, `Generated ${meta.keywords?.length} commercial stock tags`);
  assert(meta.aiDisclosure && meta.aiDisclosure.includes('AI'), 'AI disclosure notice included');
} catch (e) {
  assert(false, 'Failed testing MetadataEngine: ' + e.message);
}

// 6. Check ProjectManager
try {
  const ProjectManager = require(path.join(__dirname, '../js/project-manager.js'));
  assert(typeof ProjectManager !== 'undefined', 'ProjectManager is loaded');
  const userFolders = ProjectManager.FOLDERS.filter(f => f.id !== 'all');
  assert(userFolders.length === 6, `ProjectManager has 6 organized user folders (found ${userFolders.length})`);
  const folderIds = userFolders.map(f => f.id);
  assert(folderIds.includes('stock_ready') && folderIds.includes('client_projects'), 'Contains stock_ready and client_projects');
} catch (e) {
  assert(false, 'Failed testing ProjectManager: ' + e.message);
}

// 7. Check AIService
try {
  const AIService = require(path.join(__dirname, '../js/ai-service.js'));
  assert(typeof AIService !== 'undefined', 'AIService is loaded');
  assert(AIService.isConfigured() === false, 'Fresh AIService correctly defaults to unconfigured');
  AIService.generateDesign({ prompt: 'test' }).then(res => {
    assert(res.source === 'local_demo', 'AIService transparently falls back to Local Demo Generator');
    assert(res.disclaimer.includes('External AI Provider Not Configured'), 'Disclaimer clearly states fallback without fake AI claims');
    printSummary();
  }).catch(err => {
    assert(false, 'AIService error: ' + err.message);
    printSummary();
  });
} catch (e) {
  assert(false, 'Failed testing AIService: ' + e.message);
  printSummary();
}

function printSummary() {
  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log(`========================================`);
  process.exit(testsFailed > 0 ? 1 : 0);
}
