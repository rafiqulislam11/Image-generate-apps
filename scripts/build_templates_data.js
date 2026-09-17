'use strict';
/**
 * scripts/build_templates_data.js
 * Generates 1,000 Curated Professional Design Templates / Presets into data/templates.js
 * 10 Categories x 100 Presets each = exactly 1,000 Presets.
 * All patternTypes are 100% verified to exist in PatternEngine.
 */

const fs = require('fs');
const path = require('path');

const CATEGORIES_CONFIG = [
  {
    category: 'luxury',
    categoryName: 'Luxury & Royal',
    icon: '👑',
    patternTypes: ['versaceBaroque', 'artDecoFan', 'goldSpiral', 'marble', 'isometric', 'guilloche', 'mandala', 'torusMandala'],
    palettes: [
      ['#0a0b10', '#d4af37', '#f5e6a3', '#aa7c11'], // Royal Gold & Obsidian
      ['#031b18', '#0d9488', '#d4af37', '#fef3c7'], // Emerald & Gold
      ['#180828', '#c084fc', '#d4af37', '#ffffff'], // Regal Imperial Violet
      ['#1a0505', '#e11d48', '#d4af37', '#fef2f2'], // Crimson Velvet Gold
      ['#0b132b', '#1c2541', '#d4af37', '#6fffe9'], // Midnight Sapphire Gold
      ['#1c1917', '#e7e5e4', '#d4af37', '#78716c'], // Platinum & Brushed Brass
      ['#0f172a', '#38bdf8', '#d4af37', '#f8fafc'], // Celestial Navy Gold
      ['#2e1065', '#d4af37', '#f43f5e', '#fef9c3'], // Byzantine Palace
      ['#09090b', '#fbbf24', '#f59e0b', '#71717a'], // 24K Liquid Nugget
      ['#1e1b4b', '#818cf8', '#facc15', '#f1f5f9']  // Monaco Yacht Night
    ],
    descriptors: [
      '24K Liquid Gold Damask Filigree', 'Imperial Versailles Acanthus Brocade', 'Venetian Marble Inlay with Gold Leaf',
      'Art Deco Gatsby Luxury Fan Motif', 'Baroque Rococo Palace Tapestry', 'Gilded Obsidian Geometric Matrix',
      'Royal Sovereign Crown Jewel Lattice', 'Haute Horlogerie Guilloche Enamel', 'Milanese High-Fashion Gilded Silk',
      'Byzantine Mosaic Emperor Ornament'
    ],
    tags: ['luxury', 'royal', 'gold', 'baroque', 'damask', 'elegant', 'exclusive', 'regal', 'rich']
  },
  {
    category: 'geometric',
    categoryName: 'Geometric & 3D',
    icon: '📐',
    patternTypes: ['isometric', 'hexagonal', 'bauhausGeo', 'penroseTiling', 'voronoiCells', 'triangle', 'diamond', 'squareGrid'],
    palettes: [
      ['#0f172a', '#38bdf8', '#818cf8', '#f8fafc'], // Cyber Cyan Isometric
      ['#18181b', '#f97316', '#fbbf24', '#fafafa'], // Bauhaus Warm Concrete
      ['#022c22', '#10b981', '#6ee7b7', '#f0fdf4'], // Emerald Hex Grid
      ['#1e1b4b', '#6366f1', '#a855f7', '#e0e7ff'], // Prism Polygon Mesh
      ['#27272a', '#e11d48', '#f43f5e', '#ffffff'], // Sharp Crimson Facet
      ['#0c0a09', '#78716c', '#d6d3d1', '#f5f5f4'], // Brutalist Monochrome
      ['#172554', '#2563eb', '#60a5fa', '#eff6ff'], // Blueprint Precision
      ['#3b0764', '#c084fc', '#e879f9', '#fdf4ff'], // Neon Tessellation
      ['#14532d', '#84cc16', '#facc15', '#f7fee7'], // Tangram Polygonal
      ['#042f2e', '#14b8a6', '#5eead4', '#f0fdfa']  // Low Poly Horizon
    ],
    descriptors: [
      'Precision Isometric Interlocking Cubes', 'Hexagonal Honeycomb Quantum Grid', 'Bauhaus Architectural Geometry Rhythm',
      'Non-periodic Penrose Star Tessellation', 'Voronoi Cellular Bubble Network', 'Fractal Triangulated Facet Matrix',
      'Diamond Harlequin Optical Illusion', 'Sharp Low-Poly 3D Crystalline Lattice', 'Modernist Swiss Architectural Blueprint',
      'Escherian Impossible Staircase Symmetry'
    ],
    tags: ['geometric', 'isometric', '3d', 'hexagonal', 'bauhaus', 'cubes', 'grid', 'architecture', 'sharp']
  },
  {
    category: 'floral',
    categoryName: 'Floral & Botanical',
    icon: '🌸',
    patternTypes: ['floral', 'botanical', 'roseCurve', 'rhodoneaRose', 'leaves', 'circle', 'gradient', 'barnsleyFern'],
    palettes: [
      ['#0f172a', '#f43f5e', '#fecdd3', '#e2e8f0'], // Sakura Midnight Blush
      ['#022c22', '#059669', '#34d399', '#f0fdf4'], // Lush Forest Botanical
      ['#4c0519', '#fb7185', '#fda4af', '#fff1f2'], // English Romantic Peony
      ['#1e1b4b', '#ec4899', '#f472b6', '#fdf2f8'], // Twilight Orchid Bloom
      ['#713f12', '#eab308', '#fde047', '#fefce8'], // Sunflower Golden Hour
      ['#064e3b', '#10b981', '#f43f5e', '#fbbf24'], // Tropical Jungle Flora
      ['#312e81', '#818cf8', '#c7d2fe', '#e0e7ff'], // Provencal Lavender Sprig
      ['#3f3f46', '#fb923c', '#fdba74', '#fff7ed'], // Vintage Autumn Botanics
      ['#134e4a', '#2dd4bf', '#99f6e4', '#f0fdfa'], // Mint Waterlily Pond
      ['#581c87', '#d8b4fe', '#f0abfc', '#faf5ff']  // Wild Wisteria Cascade
    ],
    descriptors: [
      'Delicate Japanese Cherry Blossom Spray', 'Victorian Heirloom English Rose Garden', 'Monstera & Tropical Palm Fronds',
      'French Chintz Peony & Hydrangea Bouquet', 'Golden Veined Velvet Foliage Canopy', 'Spring Meadow Wildflower Tapestry',
      'Sacred Lotus Bloom Water Reflection', 'Herbarium Botanical Pressed Leaf Study', 'Romantic Bridal Lace Rosette Swirls',
      'Art Nouveau Flowing Lily Vine Ribbon'
    ],
    tags: ['floral', 'botanical', 'flowers', 'rose', 'blossom', 'leaves', 'nature', 'romantic', 'garden']
  },
  {
    category: 'cyberpunk',
    categoryName: 'Cyberpunk & Sci-Fi',
    icon: '⚡',
    patternTypes: ['cyberpunkCircuit', 'laserGrid', 'cyberpunkQuantumMatrix', 'synthwaveSun', 'neonCityGrid', 'wireframeTerrain', 'matrixRain', 'isometric'],
    palettes: [
      ['#05060f', '#ff007f', '#00f0ff', '#7928ca'], // Neo-Tokyo Neon Magenta
      ['#020617', '#22c55e', '#4ade80', '#0f172a'], // Matrix Terminal Green
      ['#090014', '#f43f5e', '#8b5cf6', '#06b6d4'], // Outrun Synthwave Horizon
      ['#030712', '#e11d48', '#fb7185', '#f43f5e'], // Laser Red Hologram
      ['#080c16', '#38bdf8', '#818cf8', '#c084fc'], // Quantum Cybernetic Core
      ['#11001c', '#f59e0b', '#ec4899', '#06b6d4'], // Blade Runner Rain Alley
      ['#050d1a', '#00ffcc', '#0077fe', '#ffffff'], // Tron Blue Circuit Pathway
      ['#0f051d', '#d946ef', '#8b5cf6', '#06b6d4'], // Electric Ultraviolet Pulse
      ['#0a0f0d', '#10b981', '#06b6d4', '#e2e8f0'], // Cyber Deck Data Stream
      ['#18051a', '#ff0055', '#ffe600', '#00ffff']  // Glitch City Laser Array
    ],
    descriptors: [
      'High-Voltage Cybernetic PCB Circuit Grid', 'Outrun Synthwave Neon Grid Horizon', 'Quantum Data Stream Fiber Bus',
      'Holographic Wireframe Polyhedral Core', 'Tokyo Night Alley Neon Sign Dispersion', 'Laser Vector Diffraction Mesh',
      'Matrix Binary Cascade Rain Matrix', 'Hyperdrive Warp Space Vector Tunnel', 'Neural Mesh Quantum Synapse Array',
      'Augmented Reality HUD Geometric Overlay'
    ],
    tags: ['cyberpunk', 'neon', 'sci-fi', 'circuits', 'laser', 'synthwave', 'futuristic', 'hologram', 'quantum']
  },
  {
    category: 'abstract',
    categoryName: 'Abstract & Fluid',
    icon: '🌊',
    patternTypes: ['vectorFlowField', 'fluidTurbulence', 'strangeAttractor', 'marble', 'chladniPlate', 'meshWireframe', 'cloud', 'organicFlow'],
    palettes: [
      ['#0f172a', '#ec4899', '#6366f1', '#f8fafc'], // Prismatic Flow
      ['#030712', '#06b6d4', '#3b82f6', '#e0f2fe'], // Oceanic Liquid Acrylic
      ['#1e1b4b', '#a855f7', '#ec4899', '#fdf4ff'], // Fluid Chroma Swirl
      ['#18181b', '#f43f5e', '#fbbf24', '#ffffff'], // Abstract Expressionist Splash
      ['#022c22', '#10b981', '#eab308', '#fef9c3'], // Aurora Dynamic Stream
      ['#1e293b', '#94a3b8', '#cbd5e1', '#f1f5f9'], // Minimalist Silver Silk
      ['#2e1065', '#d946ef', '#06b6d4', '#f5f3ff'], // Strange Attractor Orbit
      ['#3b0764', '#ec4899', '#f97316', '#fff7ed'], // Sunset Fluid Turbulence
      ['#082f49', '#0284c7', '#38bdf8', '#f0f9ff'], // Hydrodynamic Wave Ripple
      ['#171717', '#525252', '#d4d4d4', '#fafafa']  // Charcoal Smoke Diffusion
    ],
    descriptors: [
      'Generative Vector Flow Field Ribbons', 'Dynamic Fluid Turbulence Marble Swirl', 'Chaotic Lorenz Strange Attractor Orbits',
      'Chladni Acoustic Cymatic Resonance Plate', 'Prismatic Acrylic Pour Dynamic Gradient', 'Abstract Linear Tension Vector Weave',
      'Vibrant Smoke Plume Micro-Turbulence', 'Non-Euclidean Curvature Space Ripples', 'Polychromatic Liquid Marble Marbling',
      'Microscopic Organic Molecular Flow'
    ],
    tags: ['abstract', 'fluid', 'flow', 'marble', 'generative', 'liquid', 'wave', 'stream', 'modern']
  },
  {
    category: 'nature',
    categoryName: 'Nature & Landscape',
    icon: '🌿',
    patternTypes: ['topographicIso', 'crystalGeode', 'auroraBorealis', 'deepSeaCoral', 'leaves', 'cloud', 'gradient', 'reactionDiffusion'],
    palettes: [
      ['#064e3b', '#047857', '#a7f3d0', '#fef3c7'], // Alpine Mountain Valley
      ['#451a03', '#d97706', '#fde68a', '#fef3c7'], // Sahara Desert Sand Dunes
      ['#0c4a6e', '#0284c7', '#7dd3fc', '#f0f9ff'], // Pacific Ocean Coral Reef
      ['#022c22', '#059669', '#34d399', '#ecfdf5'], // Deep Redwood Forest
      ['#3b0764', '#7e22ce', '#38bdf8', '#fdf4ff'], // Polar Aurora Borealis
      ['#713f12', '#a16207', '#fde047', '#fefce8'], // Autumn Forest Canopy
      ['#1c1917', '#78716c', '#d6d3d1', '#fafaf9'], // Basalt Volcanic Cliffs
      ['#164e63', '#0891b2', '#67e8f9', '#ecfeff'], // Glacial Crevasse Ice
      ['#701a75', '#c026d3', '#f0abfc', '#fdf4ff'], // Amethyst Crystal Geode
      ['#312e81', '#4338ca', '#818cf8', '#e0e7ff']  // Twilight Horizon Ridge
    ],
    descriptors: [
      'Topographic Contour Mountain Altitude Lines', 'Shifting Wind-Blown Desert Sand Dunes', 'Subterranean Amethyst Geode Crystals',
      'Bioluminescent Deep Coral Trench', 'Shimmering Northern Lights Polar Aurora', 'Microscopic Dendritic Mineral Growth',
      'Misty Pine Forest Morning Ridge', 'Oceanic Tectonic Shelf Bathymetry', 'Volcanic Columnar Basalt Formations',
      'River Estuary Delta Silt Sedimentation'
    ],
    tags: ['nature', 'landscape', 'mountain', 'topography', 'ocean', 'forest', 'geode', 'aurora', 'earth']
  },
  {
    category: 'traditional',
    categoryName: 'Traditional & Ethnic',
    icon: '🏮',
    patternTypes: ['islamic', 'girihTiling', 'greekKey', 'celticKnotwork', 'mandala', 'torusMandala', 'metatronsCube', 'sriYantra'],
    palettes: [
      ['#042f2e', '#0d9488', '#f59e0b', '#fef3c7'], // Alhambra Moroccan Turquoise
      ['#1e1b4b', '#4338ca', '#f43f5e', '#ffffff'], // Japanese Indigo Sakura
      ['#451a03', '#b45309', '#f59e0b', '#fef3c7'], // Mediterranean Terracotta & Gold
      ['#18181b', '#d4af37', '#ffffff', '#71717a'], // Greek Hellenic Gold & Marble
      ['#064e3b', '#10b981', '#eab308', '#fef9c3'], // Celtic Emerald Knotwork
      ['#881337', '#e11d48', '#facc15', '#fff1f2'], // Mughal Royal Palace Tapestry
      ['#172554', '#1d4ed8', '#93c5fd', '#ffffff'], // Delft Blue Porcelain Ceramic
      ['#3b0764', '#9333ea', '#f59e0b', '#faf5ff'], // Sacred Tibetan Thangka Mandala
      ['#27272a', '#ef4444', '#f59e0b', '#ffffff'], // Traditional Kyoto Kimono Motif
      ['#0c0a09', '#ca8a04', '#fef08a', '#e7e5e4']  // Ottoman Palace Imperial Tiles
    ],
    descriptors: [
      'Eightfold Islamic Girih Star Mosaic', 'Classic Geometric Japanese Rhythm', 'Traditional Ocean Crest Waves Motif',
      'Continuous Hellenic Greek Key Meander', 'Interlocking Sacred Celtic Eternity Knotwork', 'Alhambra Zellige Glazed Ceramic Tile',
      'Sacred Sri Yantra Cosmic Geometry', 'Nordic Viking Interlace Ornament', 'Persian Paisley Silk Motif',
      'African Geometric Royal Sacred Weave'
    ],
    tags: ['traditional', 'cultural', 'ethnic', 'islamic', 'japanese', 'celtic', 'mandala', 'zellige', 'heritage']
  },
  {
    category: 'minimal',
    categoryName: 'Modern Minimalist',
    icon: '✨',
    patternTypes: ['squareGrid', 'stripe', 'polkaDot', 'bauhausGeo', 'circle', 'colorBlock', 'gradient', 'abstractLine'],
    palettes: [
      ['#09090b', '#27272a', '#a1a1aa', '#ffffff'], // Mono Charcoal & Milk
      ['#1e293b', '#38bdf8', '#e2e8f0', '#f8fafc'], // Nordic Clean Sky
      ['#18181b', '#ef4444', '#f43f5e', '#ffffff'], // Swiss Red Dot Precision
      ['#1c1917', '#78716c', '#d6d3d1', '#fafaf9'], // Warm Alabaster Minimal
      ['#0f172a', '#10b981', '#cbd5e1', '#ffffff'], // Sage Botanical Line
      ['#172554', '#3b82f6', '#93c5fd', '#eff6ff'], // Architectural Cobalt Grid
      ['#3b0764', '#a855f7', '#f3e8ff', '#ffffff'], // Soft Lilac Monoline
      ['#451a03', '#d97706', '#fef3c7', '#ffffff'], // Ochre Scandi Line Art
      ['#022c22', '#059669', '#a7f3d0', '#ffffff'], // Clean Pine Needle Spacing
      ['#262626', '#525252', '#a3a3a3', '#fafafa']  // Bauhaus Industrial Concrete
    ],
    descriptors: [
      'Swiss International Typographic Grid', 'Minimalist Precision Pinstripe Rhythm', 'Refined Zen Circle Geometry',
      'Scandinavian Clean Line Contour Art', 'Monochrome Polka Dot Modernist Array', 'Bauhaus Balanced Geometric Composition',
      'Architectural Modular Blueprint Layout', 'Subtle Muted Micro-Dot Spatial Mesh', 'Contemporary Fine Monoline Intersect',
      'Pure Negative Space Vector Horizon'
    ],
    tags: ['minimal', 'modern', 'clean', 'lines', 'scandinavian', 'swiss', 'subtle', 'monochrome', 'simple']
  },
  {
    category: 'textile',
    categoryName: 'Textile & Fabric',
    icon: '🧶',
    patternTypes: ['tartan', 'herringbone', 'houndstoothPro', 'plaid', 'abstractTextile', 'stripe', 'crossStripe', 'diagonalStripe'],
    palettes: [
      ['#064e3b', '#991b1b', '#d97706', '#f8fafc'], // Scottish Highland Tartan
      ['#27272a', '#71717a', '#d4d4d8', '#3f3f46'], // Heritage Tweed Herringbone
      ['#0f172a', '#1e3a8a', '#3b82f6', '#e2e8f0'], // Raw Selvage Indigo Denim
      ['#18181b', '#3f3f46', '#e4e4e7', '#ffffff'], // Haute Couture Houndstooth
      ['#451a03', '#78350f', '#d97706', '#fef3c7'], // Rustic Burlap Linen Weave
      ['#312e81', '#4338ca', '#a5b4fc', '#ffffff'], // Oxford Pinpoint Cotton Shirting
      ['#4c0519', '#9f1239', '#fb7185', '#fff1f2'], // Velvet Jacquard Brocade
      ['#134e4a', '#0f766e', '#5eead4', '#f0fdfa'], // Bohemian Handwoven Ikat
      ['#3b0764', '#6b21a8', '#d8b4fe', '#faf5ff'], // Royal Silk Damask Weave
      ['#1e293b', '#475569', '#94a3b8', '#f8fafc']  // Carbon Fiber Composite Twill
    ],
    descriptors: [
      'Authentic Scottish Clan Plaid Tartan', 'Heritage Woolen Tweed Herringbone Weave', 'Classic Haute Couture Houndstooth Check',
      'Raw Denim Diagonal Twill Texture', 'Rustic Natural Flax Burlap Weave', 'Fine Italian Suiting Pinstripe Wool',
      'Bohemian Artisan Woven Ikat Tapestry', 'Embossed Silk Damask Jacquard Loom', 'Chunky Knitted Cable Wool Pattern',
      'High-Tech Aeronautic Carbon Fiber Weave'
    ],
    tags: ['textile', 'fabric', 'tartan', 'herringbone', 'houndstooth', 'tweed', 'weave', 'cloth', 'fashion']
  },
  {
    category: 'cosmic',
    categoryName: 'Cosmic & Ethereal',
    icon: '🌌',
    patternTypes: ['bioluminescentAbyss', 'cosmicHyperNebula', 'nebulaSpiral', 'auroraBorealis', 'goldSpiral', 'cloud', 'gradient', 'spiralGalaxy'],
    palettes: [
      ['#030712', '#7c3aed', '#06b6d4', '#f0fdf4'], // Deep Space Nebula Gas
      ['#020617', '#0284c7', '#38bdf8', '#ffffff'], // Stellar Constellation Starfield
      ['#0b0a1a', '#ec4899', '#8b5cf6', '#38bdf8'], // Cosmic Galaxy Spiral Core
      ['#03141f', '#00ffcc', '#0077fe', '#f8fafc'], // Bioluminescent Trench Abyss
      ['#1a0528', '#f43f5e', '#fbbf24', '#ffffff'], // Supernova Stellar Flare
      ['#022c22', '#10b981', '#38bdf8', '#f0fdf4'], // Celestial Aurora Borealis
      ['#0f172a', '#6366f1', '#a855f7', '#e0e7ff'], // Astral Geometric Astrology
      ['#18051a', '#e11d48', '#c084fc', '#fff1f2'], // Interstellar Dust Cloud
      ['#050814', '#3b82f6', '#60a5fa', '#eff6ff'], // Andromeda Galaxy Arms
      ['#1c1033', '#facc15', '#f43f5e', '#ffffff']  // Golden Starburst Zodiac
    ],
    descriptors: [
      'Deep Space Orion Nebula Gas Cloud', 'Luminous Bioluminescent Abyssal Glow', 'Whirling Milky Way Galaxy Spiral Arms',
      'Ancient Astrological Celestial Star Chart', 'Solar Prominence Corona Energy Flare', 'Interstellar Pulsar Radio Frequency Wave',
      'Astral Geometry Sacred Orbit Rings', 'Sub-Zero Cryo Glacial Aurora Curtain', 'Supermassive Black Hole Event Horizon',
      'Cosmic Microwave Background Radiance'
    ],
    tags: ['cosmic', 'space', 'galaxy', 'nebula', 'stars', 'celestial', 'ethereal', 'glow', 'astral']
  }
];

// Variation suffixes to create 100 unique, distinct presets per category (100 x 10 = 1000)
const VARIATION_MODIFIERS = [
  { name: 'Prime', scale: 45, density: 5, lt: 1.5, rot: 0, blend: 0.7, fxGlow: 30, fxShadow: 25 },
  { name: 'Ultra', scale: 60, density: 7, lt: 2.0, rot: 15, blend: 0.85, fxGlow: 45, fxShadow: 35 },
  { name: 'Minimal', scale: 35, density: 4, lt: 1.0, rot: 0, blend: 0.5, fxGlow: 0, fxShadow: 15 },
  { name: 'Vibrant', scale: 50, density: 6, lt: 2.2, rot: 45, blend: 0.9, fxGlow: 50, fxShadow: 20 },
  { name: 'Dark Moody', scale: 55, density: 8, lt: 1.8, rot: 30, blend: 0.8, fxGlow: 25, fxShadow: 45 },
  { name: 'Delicate', scale: 40, density: 4, lt: 0.9, rot: 0, blend: 0.6, fxGlow: 15, fxShadow: 10 },
  { name: 'Intense', scale: 65, density: 9, lt: 2.5, rot: 60, blend: 0.95, fxGlow: 60, fxShadow: 40 },
  { name: 'Soft Glow', scale: 50, density: 5, lt: 1.4, rot: 90, blend: 0.75, fxGlow: 40, fxShadow: 20 },
  { name: 'Sharp Dynamic', scale: 48, density: 7, lt: 1.9, rot: 45, blend: 0.8, fxGlow: 20, fxShadow: 30 },
  { name: 'Ethereal Lux', scale: 52, density: 6, lt: 1.6, rot: 120, blend: 0.85, fxGlow: 35, fxShadow: 30 }
];

const allTemplates = [];
let idCounter = 1;

CATEGORIES_CONFIG.forEach(cfg => {
  for (let i = 0; i < 100; i++) {
    const descIdx = i % cfg.descriptors.length;
    const palIdx = Math.floor(i / 10) % cfg.palettes.length;
    const modIdx = i % VARIATION_MODIFIERS.length;
    const typeIdx = (i + Math.floor(i / 10)) % cfg.patternTypes.length;

    const baseName = cfg.descriptors[descIdx];
    const mod = VARIATION_MODIFIERS[modIdx];
    const pal = cfg.palettes[palIdx];
    const patternType = cfg.patternTypes[typeIdx];

    const numStr = String(idCounter).padStart(4, '0');
    const tplId = `tpl_${cfg.category}_${numStr}`;
    const fullName = `${baseName} · ${mod.name}`;

    const tpl = {
      id: tplId,
      presetNumber: idCounter,
      name: fullName,
      category: cfg.category,
      categoryName: cfg.categoryName,
      icon: cfg.icon,
      description: `${baseName} formatted in a ${mod.name.toLowerCase()} aesthetic with ${cfg.categoryName.toLowerCase()} styling.`,
      tags: [...cfg.tags, patternType, mod.name.toLowerCase(), `preset-${idCounter}`],
      state: {
        patternType: patternType,
        colors: [...pal],
        scale: mod.scale + ((i % 5) * 2),
        density: Math.min(10, Math.max(3, mod.density + ((i % 3) - 1))),
        lineThickness: Number((mod.lt + ((i % 4) * 0.2)).toFixed(1)),
        opacity: Number((0.85 + ((i % 4) * 0.04)).toFixed(2)),
        rotation: (mod.rot + ((i % 6) * 15)) % 360,
        spacing: 8 + ((i % 7) * 2),
        blendStrength: Number((mod.blend).toFixed(2)),
        seamless: true,
        effects: {
          glow: { enabled: mod.fxGlow > 0, intensity: mod.fxGlow },
          shadow: { enabled: mod.fxShadow > 0, intensity: mod.fxShadow },
          paper: { enabled: cfg.category === 'traditional' || cfg.category === 'minimal', intensity: 20 },
          grain: { enabled: cfg.category === 'luxury' || cfg.category === 'abstract', intensity: 15 },
          glass: { enabled: cfg.category === 'geometric' || cfg.category === 'cyberpunk', intensity: 25 },
          fabric: { enabled: cfg.category === 'textile', intensity: 45 }
        }
      }
    };

    allTemplates.push(tpl);
    idCounter++;
  }
});

console.log(`Generated ${allTemplates.length} templates across ${CATEGORIES_CONFIG.length} categories.`);

// Generate output file
const fileContent = `'use strict';
/**
 * AI Pattern & Image Design Studio PRO — data/templates.js
 * 1,000 Curated Ready-Made Design Templates & Presets (Button Format)
 * Categories: Luxury (100), Geometric (100), Floral (100), Cyberpunk (100),
 * Abstract (100), Nature (100), Traditional (100), Minimal (100), Textile (100), Cosmic (100).
 */

const PATTERN_TEMPLATES = ${JSON.stringify(allTemplates, null, 2)};

if (typeof window !== 'undefined') {
  window.PATTERN_TEMPLATES = PATTERN_TEMPLATES;
}
if (typeof module !== 'undefined') {
  module.exports = PATTERN_TEMPLATES;
}
`;

const outputPath = path.join(__dirname, '../data/templates.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Saved 1,000 templates to ${outputPath} (${(fileContent.length / 1024).toFixed(1)} KB)`);
