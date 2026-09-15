'use strict';
/**
 * Pattern Generator PRO V2 — ai-parser.js
 * AI-ready architecture: rule-based prompt parser
 * No API key required. Ready for future Gemini API integration.
 */

const AIParser = {

  // ─── Keyword Maps ────────────────────────────────────────
  PATTERN_KEYWORDS: {
    mandala:   ['mandala','circular','radial','medallion','meditation','zen','spiritual'],
    moroccan:  ['moroccan','marrakech','arabesque','kasbah','zellige'],
    islamic:   ['islamic','arabic','star geometric','mosque'],
    memphis:   ['memphis','80s','eighties','retro geo','pop art','funky'],
    geometric: ['geometric','shapes','polygon','angles','sharp','modern'],
    floral:    ['floral','flower','bloom','blossom','rose','botanical flower'],
    botanical: ['botanical','leaf','leaves','plant','fern','foliage'],
    marble:    ['marble','stone','natural','veined','granite'],
    wave:      ['wave','ocean','sea','fluid','flowing','water'],
    hexagonal: ['hex','honeycomb','hexagon','honeybee'],
    herringbone:['herringbone','chevron weave','tweed','arrow'],
    chevron:   ['chevron','zigzag stripe','v-shape','arrow stripe'],
    zigzag:    ['zigzag','zig-zag','lightning','jagged'],
    polkaDot:  ['polka dot','dots','circles','spots','dotted'],
    plaid:     ['plaid','tartan','plaid pattern','scottish'],
    tartan:    ['tartan','clan','kilt','scottish plaid'],
    checkered: ['checker','checkered','checkerboard','chess'],
    stripe:    ['stripe','striped','lines','pinstripe'],
    diamond:   ['diamond','rhombus','lozenge','argyle'],
    spiral:    ['spiral','swirl','helix','vortex'],
    isometric: ['isometric','3d','cube','3d grid','perspective'],
    pixel:     ['pixel','pixelated','8-bit','retro game','mosaic'],
    technology:['technology','tech','circuit','pcb','digital','cyber'],
    futuristic:['futuristic','sci-fi','space','neon','cyber punk'],
    christmas: ['christmas','xmas','holiday','snowflake','festive winter'],
    halloween: ['halloween','spooky','ghost','spider','horror','october'],
    wedding:   ['wedding','bridal','marriage','ceremony','elegant'],
    valentine: ['valentine','heart','love','romantic','red heart'],
    luxury:    ['luxury','gold','premium','opulent','high-end','exclusive'],
    organic:   ['organic','natural','amoeba','blob','biomorphic'],
    kids:      ['kids','children','fun','playful','cartoon','cute'],
  },

  COLOR_KEYWORDS: {
    '#000000': ['black','dark','noir','onyx'],
    '#ffffff': ['white','cream','ivory','snow','light'],
    '#c9a84c': ['gold','golden','gilded'],
    '#1a2a6e': ['navy','blue','cobalt','indigo','midnight blue'],
    '#8b0000': ['red','crimson','burgundy','maroon','scarlet'],
    '#228b22': ['green','forest green','emerald','sage'],
    '#ff69b4': ['pink','rose','blush','coral'],
    '#800080': ['purple','violet','lavender','mauve'],
    '#d97706': ['orange','amber','tangerine','rust'],
    '#6b7280': ['gray','grey','silver','ash'],
    '#f5f0e0': ['cream','beige','ivory','off-white'],
  },

  STYLE_KEYWORDS: {
    luxury:    { density: 6, scale: 40, blendStrength: 0.7 },
    minimal:   { density: 2, scale: 60, blendStrength: 0.4 },
    dense:     { density: 9, scale: 25, blendStrength: 0.8 },
    bold:      { density: 5, scale: 80, lineThickness: 3 },
    delicate:  { density: 3, scale: 30, lineThickness: 0.5 },
    large:     { scale: 90 },
    small:     { scale: 20 },
    fine:      { scale: 15, lineThickness: 0.5 },
  },

  // ─── Main Parse Function ─────────────────────────────────
  parsePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return null;
    const lower = prompt.toLowerCase();
    const result = {};

    // Detect pattern type
    for (const [patternType, keywords] of Object.entries(this.PATTERN_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) {
        result.patternType = patternType;
        break;
      }
    }

    // Detect colors
    const detectedColors = this._detectColors(lower);
    if (detectedColors.length >= 2) result.colors = detectedColors;
    else if (detectedColors.length === 1) result.colors = [detectedColors[0], this._complementHex(detectedColors[0])];

    // Detect style modifiers
    for (const [style, props] of Object.entries(this.STYLE_KEYWORDS)) {
      if (lower.includes(style)) Object.assign(result, props);
    }

    // Detect seamless
    if (lower.includes('seamless') || lower.includes('tile') || lower.includes('repeat')) {
      result.seamless = true;
    }

    // Detect scale modifiers
    if (lower.includes('large') || lower.includes('oversized') || lower.includes('big')) result.scale = 85;
    if (lower.includes('small') || lower.includes('micro') || lower.includes('fine')) result.scale = 20;

    // Detect use context
    result._inferredUse = this._detectUse(lower);
    result._confidence = this._calculateConfidence(result, lower);
    result._rawPrompt = prompt;

    return result;
  },

  _detectColors(prompt) {
    const colorMap = {
      'black': '#111111', 'white': '#f5f5f5', 'gold': '#c9a84c',
      'golden': '#c9a84c', 'silver': '#a0a0b0', 'red': '#cc2020',
      'crimson': '#8b0000', 'burgundy': '#6b1a2e', 'maroon': '#5c1010',
      'blue': '#1a3a6e', 'navy': '#0d1b3e', 'cobalt': '#1a2a8e',
      'indigo': '#3730a3', 'teal': '#0d4a4a', 'cyan': '#0891b2',
      'green': '#1a5a1a', 'emerald': '#065f46', 'sage': '#4a6a4a',
      'purple': '#4b0082', 'violet': '#6b21a8', 'lavender': '#a78bfa',
      'pink': '#db2777', 'rose': '#f43f5e', 'blush': '#f9a8d4',
      'orange': '#e05c00', 'amber': '#d4860c', 'rust': '#9a3412',
      'brown': '#5c3317', 'beige': '#f5e6c8', 'cream': '#f5f0e0',
      'ivory': '#fffff0', 'gray': '#6b7280', 'grey': '#6b7280',
      'charcoal': '#2d2d2d',
    };
    const found = [];
    for (const [name, hex] of Object.entries(colorMap)) {
      if (prompt.includes(name) && !found.includes(hex)) found.push(hex);
      if (found.length >= 4) break;
    }
    return found;
  },

  _complementHex(hex) {
    const rgb = typeof hexToRgb === 'function' ? hexToRgb(hex) : { r: 100, g: 100, b: 100 };
    const hsl = typeof rgbToHsl === 'function' ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 180, s: 50, l: 50 };
    const compRgb = typeof hslToRgb === 'function' ? hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l) : { r: 200, g: 200, b: 200 };
    return typeof rgbToHex === 'function' ? rgbToHex(compRgb.r, compRgb.g, compRgb.b) : '#ffffff';
  },

  _detectUse(prompt) {
    if (prompt.includes('textile') || prompt.includes('fabric') || prompt.includes('clothing')) return 'textile';
    if (prompt.includes('wallpaper') || prompt.includes('wall')) return 'wallpaper';
    if (prompt.includes('website') || prompt.includes('web') || prompt.includes('digital')) return 'web';
    if (prompt.includes('print') || prompt.includes('poster')) return 'print';
    if (prompt.includes('packaging') || prompt.includes('wrap')) return 'packaging';
    return 'general';
  },

  _calculateConfidence(result, prompt) {
    let score = 0;
    if (result.patternType) score += 40;
    if (result.colors && result.colors.length) score += 30;
    if (Object.keys(result).length > 3) score += 20;
    if (prompt.length > 10) score += 10;
    return Math.min(100, score);
  },
};

if (typeof window !== 'undefined') window.AIParser = AIParser;
if (typeof module !== 'undefined') module.exports = AIParser;

