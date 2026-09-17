const path = require('path');
global.window = {};
const PatternEngine = require(path.join(__dirname, '../js/pattern-engine.js'));
global.PatternEngine = PatternEngine;
window.PatternEngine = PatternEngine;
require(path.join(__dirname, '../js/spiral-patterns.js'));
require(path.join(__dirname, '../js/master-art-engine.js'));

const aliases = {
  roseCurve: PatternEngine._getGenerator('rhodoneaRose'),
  goldSpiral: PatternEngine._getGenerator('goldenSpiral'),
  guilloche: PatternEngine._getGenerator('guillocheBanknote'),
  metatronsCube: PatternEngine._getGenerator('metatronCube'),
  torusMandala: PatternEngine._getGenerator('torusSacred'),
  circle: PatternEngine._getGenerator('concentricCircles') || PatternEngine._getGenerator('circleGrid'),
  voronoiCells: PatternEngine._getGenerator('voronoiStainedGlass'),
  chladniPlate: PatternEngine._getGenerator('chladniAcoustics'),
  theodorusSpiral: PatternEngine._getGenerator('archimedeanSpiral'),
  sineLattice: PatternEngine._getGenerator('sineWaveMesh') || PatternEngine._getGenerator('wave'),
  meshWireframe: PatternEngine._getGenerator('isometric'),
  colorBlock: PatternEngine._getGenerator('bauhausGeo') || PatternEngine._getGenerator('memphis'),
};

for (const [k, v] of Object.entries(aliases)) {
  console.log(k, '-> is valid function?', typeof v === 'function' && v !== PatternEngine._genMap.plaid);
}
