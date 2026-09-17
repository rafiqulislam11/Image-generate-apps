'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/ai-parser.js
 * Smart Natural Language Prompt Assistant & Structured Design Parameter Extractor
 * Transforms raw user prompts into complete, editable structured design parameters.
 */

const AIParser = {

  CATEGORY_KEYWORDS: {
    abstract:        ['abstract', 'fluid flow', 'generative', 'chaos', 'vector flow', 'attractor'],
    gradient:        ['gradient', 'blend', 'color spectrum', 'chromatic blend', 'mesh gradient'],
    blur:            ['blur', 'gaussian', 'defocus', 'soft blur', 'diffuse blur', 'ambient haze'],
    bokeh:           ['bokeh', 'light orbs', 'aperture', 'lens flare', 'night lights', 'defocused lights'],
    mesh:            ['mesh', 'wireframe', 'lattice', 'topological', '3d net', 'warp mesh'],
    liquid:          ['liquid', 'viscous', 'acrylic pour', 'liquid marble', 'droplets', 'liquid flow'],
    fluid:           ['fluid', 'hydrodynamic', 'turbulence', 'streamline', 'plasma drift'],
    wave:            ['wave', 'sine wave', 'ocean swell', 'undulation', 'oscillation', 'soundwave'],
    curve:           ['curve', 'bezier', 'parabolic', 'ribbon curve', 'arc trajectory'],
    spiral:          ['spiral', 'fibonacci', 'golden spiral', 'archimedean', 'logarithmic spiral'],
    swirl:           ['swirl', 'twirl', 'whirlpool', 'centrifugal', 'cyclone'],
    smoke:           ['smoke', 'vapor', 'incense', 'smoke plume', 'volumetric smoke'],
    fog:             ['fog', 'misty fog', 'haze', 'cloud bank', 'morning fog'],
    mist:            ['mist', 'water vapor', 'cascade spray', 'dewy mist'],
    cloud:           ['cloud', 'cumulus', 'cirrus', 'sky clouds', 'fluffy clouds', 'overcast'],
    sky:             ['sky', 'twilight sky', 'azure sky', 'sunset sky', 'horizon'],
    galaxy:          ['galaxy', 'milky way', 'galactic', 'spiral galaxy', 'star cluster'],
    cosmic:          ['cosmic', 'interstellar', 'gravitational', 'dark matter', 'deep space'],
    star:            ['star', 'constellation', 'starfield', 'twinkle', 'stellar'],
    nebula:          ['nebula', 'cosmic dust', 'orion nebula', 'stellar nursery', 'pillars of creation'],
    space:           ['space', 'outer space', 'deep space void', 'planetary orbit'],
    universe:        ['universe', 'multiverse', 'cosmic web', 'space-time'],
    aurora:          ['aurora', 'northern lights', 'polar lights', 'aurora borealis', 'geomagnetic'],
    light:           ['light', 'sunbeam', 'optical ray', 'refraction', 'studio light'],
    glow:            ['glow', 'luminescent', 'neon bloom', 'aura glow', 'halation'],
    neon:            ['neon', 'synthwave', 'cyberpunk neon', 'gas tube', 'fluorescent'],
    luminous:        ['luminous', 'phosphorescent', 'glow in dark', 'self-illuminating'],
    shimmer:         ['shimmer', 'pearl luster', 'silk glint', 'heat shimmer'],
    sparkle:         ['sparkle', 'diamond glint', 'fairy dust', 'champagne sparkle'],
    glitter:         ['glitter', 'sequins', 'metallic flakes', 'glitter dust'],
    particle:        ['particle', 'point cloud', 'plexus', 'quantum particle', 'swarm'],
    dust:            ['dust', 'sunbeam dust', 'film dust', 'cosmic dust', 'motes'],
    energy:          ['energy', 'tesla coil', 'lightning', 'plasma energy', 'force field'],
    fire:            ['fire', 'flame', 'blaze', 'magma', 'lava', 'embers', 'inferno'],
    water:           ['water', 'underwater caustics', 'pool ripples', 'lagoon'],
    ocean:           ['ocean', 'deep sea', 'marine', 'abyssal', 'coral reef'],
    ice:             ['ice', 'glacier', 'frost', 'frozen', 'snowflake', 'sub-zero'],
    crystal:         ['crystal', 'amethyst', 'geode', 'quartz', 'gemstone facet'],
    glass:           ['glass', 'glassmorphism', 'acrylic glass', 'transparent glass'],
    frosted_glass:   ['frosted glass', 'matte glass', 'acid-etched glass', 'translucent'],
    metallic:        ['metallic', 'brushed metal', 'titanium', 'steel plate', 'alloy'],
    gold:            ['gold', '24k gold', 'gold leaf', 'golden', 'gilded', 'champagne gold'],
    silver:          ['silver', 'sterling silver', 'platinum', 'quicksilver', 'silver plate'],
    copper:          ['copper', 'burnished copper', 'bronze', 'verdigris patina'],
    chrome:          ['chrome', 'liquid chrome', 'mirror chrome', 'mercury reflection'],
    holographic:     ['holographic', 'hologram', 'rainbow diffraction', 'holo foil'],
    iridescent:      ['iridescent', 'oil slick', 'thin-film', 'peacock luster'],
    chrome_gradient: ['chrome gradient', 'metallic gradient', 'liquid silver sweep'],
    three_d:         ['3d background', 'volumetric 3d', 'isometric cubes', 'spatial geometry'],
    three_d_render:  ['3d render', 'octane render', 'raytracing', 'cinema 4d', 'blender render'],
    minimal:         ['minimal', 'minimalist', 'clean whitespace', 'simple', 'pinstripe'],
    white:           ['white background', 'pure white', 'alabaster', 'off-white'],
    black:           ['black background', 'pitch black', 'obsidian', 'dark noir', 'pure black'],
    dark:            ['dark background', 'dark mode', 'charcoal', 'midnight dark'],
    pastel:          ['pastel', 'soft pastel', 'macaron', 'blush pink', 'mint green', 'lavender'],
    colorful:        ['colorful', 'rainbow explosion', 'vibrant multi-color', 'kaleidoscope'],
    monochrome:      ['monochrome', 'grayscale', 'black and white', 'tonal single hue'],
    duotone:         ['duotone', 'two-tone', 'spotify duotone', 'split-tone'],
    color_block:     ['color block', 'mondrian', 'bauhaus block', 'color planes'],
    memphis:         ['memphis', '80s memphis', 'squiggles', 'post-modernist'],
    geometric:       ['geometric', 'geometry', 'polygon', 'isometric grid', 'tessellation'],
    triangle:        ['triangle', 'triangular', 'delta mesh', 'pyramids'],
    circle:          ['circle', 'circular rings', 'concentric circles', 'flower of life'],
    square:          ['square', 'checkerboard', 'pixel grid', 'cubic'],
    hexagon:         ['hexagon', 'hexagonal', 'honeycomb', 'graphene', 'hex hive'],
    grid:            ['grid', 'blueprint grid', 'graph paper', 'coordinate grid'],
    dot:             ['dot', 'polka dot', 'halftone dot', 'stippling dots'],
    line:            ['line', 'monoline', 'linear strokes', 'parallel lines'],
    stripe:          ['stripe', 'striped', 'nautical stripe', 'barcode stripe'],
    wave_line:       ['wave line', 'guilloche line', 'contour wave', 'wavy lines'],
    seamless:        ['seamless', 'repeating tile', 'endless pattern', 'continuous tile'],
    pattern:         ['pattern background', 'ornament', 'frieze', 'damask pattern'],
    floral:          ['floral', 'flower', 'bloom', 'blossom', 'rose bouquet', 'sakura'],
    botanical:       ['botanical', 'leaves', 'foliage', 'monstera', 'fern', 'jungle'],
    leaf:            ['leaf', 'leaves', 'autumn leaf', 'leaf venation', 'ginkgo'],
    nature:          ['nature', 'wilderness', 'topography', 'mountain ridge', 'landscape'],
    marble:          ['marble', 'carrara marble', 'marquina marble', 'stone veins'],
    stone:           ['stone', 'slate stone', 'granite specks', 'pebble rock'],
    concrete:        ['concrete', 'cement wall', 'brutalist concrete', 'plaster'],
    paper:           ['paper', 'washi paper', 'parchment scroll', 'kraft paper', 'cardstock'],
    fabric:          ['fabric', 'linen weave', 'canvas cloth', 'denim', 'tweed'],
    wood:            ['wood', 'wood grain', 'walnut timber', 'oak plank', 'parquet'],
    sand:            ['sand', 'desert dunes', 'beach sand', 'zen gravel ripples'],
    grain:           ['grain', 'film grain', '35mm grain', 'analog noise'],
    noise:           ['noise', 'perlin noise', 'tv static', 'white noise'],
    halftone:        ['halftone', 'newsprint screen', 'comic benday dots', 'screen print'],
    grunge:          ['grunge', 'distressed paint', 'rust oxidation', 'urban grit'],
    vintage:         ['vintage', 'antique engraving', 'victorian filigree', 'heritage sepia'],
    retro:           ['retro', '70s groovy', '80s arcade', 'atomic mid-century'],
    y2k:             ['y2k', 'cyber chrome star', 'frutiger aero', 'year 2000'],
    cyberpunk:       ['cyberpunk', 'pcb circuit', 'matrix code', 'cyber city'],
    futuristic:      ['futuristic', 'sci-fi corridor', 'hyperloop tunnel', 'quantum core'],
    technology:      ['technology', 'fiber optic', 'cloud server', 'data flow'],
    digital:         ['digital', 'binary matrix', 'digital glitch', 'pixel display'],
    blockchain:      ['blockchain', 'crypto network', 'node ledger', 'smart contract'],
    business:        ['business', 'corporate pinstripe', 'financial chart', 'enterprise']
  },

  PATTERN_KEYWORDS: {
    mandala:          ['mandala', 'sri yantra', 'flower of life', 'metatron', 'radial'],
    islamic:          ['islamic', 'girih', 'zellige', '8-point', 'arabic star'],
    moroccan:         ['moroccan', 'marrakech', 'arabesque', 'kasbah'],
    versaceBaroque:   ['baroque', 'versace', 'acanthus', 'rococo'],
    artDecoFan:       ['art deco', 'deco fan', 'gatsby', 'fan pattern'],
    cyberpunkCircuit: ['circuit', 'cyberpunk', 'pcb', 'matrix', 'cyber'],
    goldSpiral:       ['golden spiral', 'fibonacci spiral', 'phi spiral'],
    houndstoothPro:   ['houndstooth', 'dogstooth', 'pied de poule'],
    herringbone:      ['herringbone', 'chevron weave', 'tweed'],
    plaid:            ['plaid', 'tartan plaid', 'checkered plaid'],
    tartan:           ['tartan', 'scottish tartan', 'highland'],
    floral:           ['floral', 'flower', 'rose', 'blossom'],
    botanical:        ['botanical', 'leaves', 'foliage', 'fern'],
    topographicIso:   ['topographic', 'elevation', 'contour map'],
    auroraBorealis:   ['aurora', 'northern lights', 'polar light'],
    supernovaBurst:   ['supernova', 'burst', 'starlight', 'fireworks'],
    geometric:        ['geometric', 'polygon', 'geometry'],
    isometric:        ['isometric', '3d cube', 'cube grid'],
    wave:             ['wave', 'ocean wave', 'swell', 'seigaiha'],
    marble:           ['marble', 'veined stone', 'liquid pour'],
    minimalLine:      ['minimal line', 'pinstripe', 'fine line'],
    polkaDot:         ['polka dot', 'dots', 'spots'],
    doodle:           ['doodle', 'scribble', 'hand-drawn'],
    memphis:          ['memphis', '80s geometric', 'funky pattern'],
    kids:             ['kids', 'cartoon pattern', 'nursery'],
    halloween:        ['halloween', 'spiderweb pattern', 'spooky pattern'],
    christmas:        ['christmas', 'snowflake pattern'],
    wedding:          ['wedding lace', 'bridal lace', 'wedding pattern']
  },

  COLOR_KEYWORDS: {
    '#000000': ['black', 'dark', 'noir', 'onyx', 'charcoal', 'midnight'],
    '#ffffff': ['white', 'cream', 'ivory', 'snow', 'pearl', 'light'],
    '#d4af37': ['gold', 'golden', 'gilded', 'brass', 'champagne'],
    '#0a192f': ['navy', 'deep navy', 'midnight blue', 'dark blue'],
    '#3b82f6': ['blue', 'cobalt', 'azure', 'sapphire', 'sky'],
    '#06b6d4': ['cyan', 'teal', 'electric cyan', 'turquoise', 'aqua'],
    '#10b981': ['emerald', 'green', 'jade', 'forest green', 'mint', 'sage'],
    '#ff007f': ['magenta', 'neon pink', 'hot pink', 'fuchsia'],
    '#f43f5e': ['rose', 'blush', 'pink', 'coral'],
    '#b91c1c': ['red', 'crimson', 'ruby', 'scarlet', 'burgundy'],
    '#f59e0b': ['amber', 'orange', 'gold yellow', 'mustard', 'ochre'],
    '#8b5cf6': ['purple', 'violet', 'lavender', 'amethyst'],
    '#78716c': ['stone', 'gray', 'grey', 'silver', 'slate', 'charcoal'],
    '#78350f': ['brown', 'copper', 'bronze', 'espresso', 'chocolate']
  },

  /**
   * Main Prompt Analysis Function
   * Returns structured design parameters ready for live generation & user editing.
   */
  parse(prompt) {
    return this.parsePrompt(prompt);
  },

  parsePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return null;
    const lower = prompt.toLowerCase().trim();

    // 1. Detect Category
    let detectedCategory = 'abstract';
    for (const [cat, keywords] of Object.entries(this.CATEGORY_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) {
        detectedCategory = cat;
        break;
      }
    }

    // 2. Detect Pattern Type
    let detectedType = 'geometric';
    for (const [type, keywords] of Object.entries(this.PATTERN_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) {
        detectedType = type;
        break;
      }
    }
    // Fallback if category matched but specific pattern didn't
    if (detectedType === 'geometric' && detectedCategory !== 'geometric') {
      const allCats = [
        ...(typeof CORE_PATTERN_CATEGORIES !== 'undefined' ? CORE_PATTERN_CATEGORIES : []),
        ...(typeof PATTERN_CATEGORIES !== 'undefined' ? PATTERN_CATEGORIES : [])
      ];
      const catObj = allCats.find(c => c.id === detectedCategory);
      if (catObj && catObj.patternTypes && catObj.patternTypes.length > 0) {
        detectedType = catObj.patternTypes[0];
      }
    }

    // 3. Detect Colors
    const detectedColors = this._detectColors(lower);
    const colors = detectedColors.length >= 2 ? detectedColors : (detectedColors.length === 1 ? [detectedColors[0], this._complementHex(detectedColors[0])] : ['#0b0c10', '#d4af37', '#f3e5ab', '#aa7c11']);

    // 4. Style & Complexity
    let style = 'Modern';
    let density = 6;
    let complexity = 'Medium';
    let lineThickness = 1.5;

    if (lower.includes('luxury') || lower.includes('gold') || lower.includes('royal')) {
      style = 'Luxury';
      density = 7;
      complexity = 'High';
      lineThickness = 2.0;
    } else if (lower.includes('minimal') || lower.includes('clean') || lower.includes('simple')) {
      style = 'Minimal';
      density = 3;
      complexity = 'Low';
      lineThickness = 1.0;
    } else if (lower.includes('dense') || lower.includes('intricate') || lower.includes('complex')) {
      style = 'Intricate';
      density = 9;
      complexity = 'High';
      lineThickness = 1.2;
    } else if (lower.includes('vintage') || lower.includes('retro') || lower.includes('heritage')) {
      style = 'Vintage';
      density = 6;
      complexity = 'Medium';
      lineThickness = 1.8;
    } else if (lower.includes('cyber') || lower.includes('neon') || lower.includes('sci-fi')) {
      style = 'Cyberpunk';
      density = 8;
      complexity = 'High';
      lineThickness = 2.0;
    }

    // 5. Composition & Symmetry
    let composition = 'Seamless Grid';
    if (lower.includes('radial') || lower.includes('mandala') || lower.includes('circular')) {
      composition = 'Radial Symmetry';
    } else if (lower.includes('wave') || lower.includes('fluid') || lower.includes('flow')) {
      composition = 'Flowing Rhythm';
    } else if (lower.includes('diagonal') || lower.includes('chevron')) {
      composition = 'Diagonal Chevron';
    }

    // 6. Background
    let background = 'Dark Obsidian';
    if (lower.includes('white background') || lower.includes('light background') || lower.includes('cream')) {
      background = 'Light Cream';
    } else if (lower.includes('transparent')) {
      background = 'Transparent';
    }

    // 7. Recommended Dimensions & Format based on use case
    let recommendedSize = { width: 4000, height: 4000, label: '4000 × 4000 (Square Master)' };
    let exportFormat = 'PNG';

    if (lower.includes('packaging') || lower.includes('wrap')) {
      recommendedSize = { width: 5000, height: 5000, label: '5000 × 5000 (Print Packaging @ 300 PPI)' };
    } else if (lower.includes('wallpaper') || lower.includes('mural')) {
      recommendedSize = { width: 7680, height: 4320, label: '7680 × 4320 (8K UHD Wallpaper)' };
    } else if (lower.includes('textile') || lower.includes('fabric')) {
      recommendedSize = { width: 4000, height: 4000, label: '4000 × 4000 (Seamless Fabric Tile)' };
    } else if (lower.includes('vector') || lower.includes('svg')) {
      exportFormat = 'SVG';
    }

    const confidence = this._calculateConfidence(detectedCategory, detectedType, colors, prompt);

    return {
      category: detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1),
      categoryId: detectedCategory,
      patternType: detectedType,
      style,
      subject: this._extractSubject(lower),
      colors,
      colorStyle: this._detectColorStyle(colors, lower),
      background,
      scale: lower.includes('large') ? 75 : (lower.includes('small') || lower.includes('delicate') || lower.includes('micro') ? 35 : 50),
      density: density >= 7 ? 'High' : (density <= 3 ? 'Low' : 'Medium'),
      densityValue: density,
      complexity,
      composition,
      seamless: true,
      canvasSize: recommendedSize,
      exportFormat,
      confidence,
      rawPrompt: prompt
    };
  },

  _extractSubject(prompt) {
    if (prompt.includes('floral') || prompt.includes('flower')) return 'Botanical flowers & blossoms';
    if (prompt.includes('circuit') || prompt.includes('cyber')) return 'Quantum technology circuits';
    if (prompt.includes('mandala') || prompt.includes('sacred')) return 'Sacred geometry radial mandala';
    if (prompt.includes('leaves') || prompt.includes('botanical')) return 'Tropical jungle foliage';
    if (prompt.includes('star') || prompt.includes('islamic')) return 'Eightfold girih geometric stars';
    if (prompt.includes('tartan') || prompt.includes('plaid')) return 'Highland woolen weave';
    if (prompt.includes('damask')) return 'Acanthus floral medallions';
    if (prompt.includes('wave')) return 'Oceanic fluid contour waves';
    return 'Parametric abstract geometric motifs';
  },

  _detectColorStyle(colors, prompt) {
    if (prompt.includes('gold')) return '24K Gold & Metallic Accent';
    if (prompt.includes('neon') || prompt.includes('cyber')) return 'Electric Neon & Dark Abyss';
    if (prompt.includes('pastel')) return 'Gentle Soft Pastel';
    if (prompt.includes('monochrome') || prompt.includes('black and white')) return 'High-Contrast Monochrome';
    if (prompt.includes('vintage') || prompt.includes('earth')) return 'Heritage Earth & Ochre';
    return 'Curated Harmonious Palette';
  },

  _detectColors(prompt) {
    const found = [];
    for (const [hex, keywords] of Object.entries(this.COLOR_KEYWORDS)) {
      if (keywords.some(k => prompt.includes(k))) {
        if (!found.includes(hex)) found.push(hex);
      }
      if (found.length >= 5) break;
    }
    return found;
  },

  _complementHex(hex) {
    const rgb = typeof hexToRgb === 'function' ? hexToRgb(hex) : { r: 100, g: 100, b: 100 };
    const hsl = typeof rgbToHsl === 'function' ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 180, s: 50, l: 50 };
    const compRgb = typeof hslToRgb === 'function' ? hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l) : { r: 200, g: 200, b: 200 };
    return typeof rgbToHex === 'function' ? rgbToHex(compRgb.r, compRgb.g, compRgb.b) : '#ffffff';
  },

  _calculateConfidence(category, patternType, colors, prompt) {
    let score = 40;
    if (category) score += 20;
    if (patternType) score += 20;
    if (colors && colors.length >= 2) score += 15;
    if (prompt.length > 20) score += 5;
    return Math.min(100, score);
  }
};

if (typeof window !== 'undefined') window.AIParser = AIParser;
if (typeof module !== 'undefined') module.exports = AIParser;
