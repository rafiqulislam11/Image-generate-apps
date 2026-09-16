'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/ai-parser.js
 * Smart Natural Language Prompt Assistant & Structured Design Parameter Extractor
 * Transforms raw user prompts into complete, editable structured design parameters.
 */

const AIParser = {

  CATEGORY_KEYWORDS: {
    geometric:   ['geometric', 'geometry', 'polygon', 'isometric', 'grid', 'lattice', 'triangle', 'bauhaus', 'cubes', 'angular'],
    floral:      ['floral', 'flower', 'bloom', 'blossom', 'rose', 'petals', 'bouquet', 'cherry blossom'],
    botanical:   ['botanical', 'leaf', 'leaves', 'plant', 'fern', 'foliage', 'jungle', 'monstera', 'eucalyptus', 'forest'],
    islamic:     ['islamic', 'arabic', 'girih', 'zellige', 'moroccan', 'arabesque', 'mosque', 'palace'],
    mandala:     ['mandala', 'radial', 'circular', 'medallion', 'zen', 'spiritual', 'meditation', 'sri yantra', 'flower of life'],
    abstract:    ['abstract', 'fluid', 'marble', 'acrylic', 'flow field', 'turbulence', 'chaos', 'attractor'],
    minimal:     ['minimal', 'minimalist', 'clean', 'pinstripe', 'simple', 'subtle', 'whitespace', 'scandinavian', 'zen line'],
    seamless:    ['seamless', 'repeating', 'tile', 'continuous', 'endless', 'repeat'],
    lineart:     ['line art', 'lineart', 'monoline', 'contour', 'sketch', 'pen drawing', 'wireframe'],
    organic:     ['organic', 'cellular', 'biomorphic', 'amoeba', 'wave', 'curves', 'river'],
    kids:        ['kids', 'children', 'nursery', 'playful', 'cartoon', 'cute', 'confetti', 'rainbow'],
    animal:      ['animal', 'leopard', 'zebra', 'skin', 'fur', 'feathers', 'wildlife', 'tortoise'],
    food:        ['food', 'coffee', 'bakery', 'fruit', 'culinary', 'kitchen', 'citrus'],
    nature:      ['nature', 'landscape', 'mountain', 'topographic', 'geode', 'aurora', 'crystal', 'sea'],
    retro:       ['retro', '70s', '80s', 'groovy', 'mid-century', 'atomic', 'arcade', 'synthwave'],
    vintage:     ['vintage', 'antique', 'victorian', 'heritage', 'engraving', 'sepia', 'baroque', 'filigree'],
    luxury:      ['luxury', 'gold', 'metallic', 'royal', 'champagne', 'premium', 'haute couture', 'obsidian', 'exclusive', 'opulent'],
    christmas:   ['christmas', 'xmas', 'holiday', 'snowflake', 'festive', 'winter', 'noel'],
    halloween:   ['halloween', 'spooky', 'ghost', 'spiderweb', 'horror', 'gothic', 'pumpkin'],
    newyear:     ['new year', 'fireworks', 'celebration', 'glamour', 'countdown', 'glitter'],
    wedding:     ['wedding', 'bridal', 'marriage', 'love', 'lace', 'romantic', 'anniversary'],
    business:    ['business', 'corporate', 'finance', 'executive', 'data', 'blueprint', 'office'],
    textile:     ['textile', 'fabric', 'tweed', 'herringbone', 'woven', 'wool', 'linen', 'cloth'],
    wallpaper:   ['wallpaper', 'interior', 'feature wall', 'mural', 'wall covering', 'damask'],
    background:  ['background', 'backdrop', 'texture', 'subtle texture', 'surface', 'paper grain'],
    decorative:  ['decorative', 'ornament', 'frieze', 'guilloche', 'crest', 'security pattern'],
    monogram:    ['monogram', 'initials', 'alphabet', 'typographic', 'interlocking initials'],
    damask:      ['damask', 'acanthus', 'venetian', 'figured fabric', 'heraldic damask'],
    tribal:      ['tribal', 'aztec', 'mudcloth', 'folk', 'indigenous', 'ethnic'],
    zentangle:   ['zentangle', 'doodle art', 'optical illusion', 'tangle', 'meditative line']
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
      const catObj = (typeof PATTERN_CATEGORIES !== 'undefined')
        ? PATTERN_CATEGORIES.find(c => c.id === detectedCategory)
        : null;
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
