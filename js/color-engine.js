'use strict';
/**
 * Pattern Generator PRO V2 — color-engine.js
 * Professional color management system
 */

const ColorEngine = {

  // ─── Harmony Generators ───────────────────────────────────
  generateHarmony(baseHex, type, count) {
    count = Math.max(2, Math.min(8, count || 4));
    const { r, g, b } = hexToRgb(baseHex);
    const { h, s, l } = rgbToHsl(r, g, b);

    switch (type) {
      case 'monochromatic':  return this._monochromatic(h, s, l, count);
      case 'complementary':  return this._complementary(h, s, l, count);
      case 'analogous':      return this._analogous(h, s, l, count);
      case 'triadic':        return this._triadic(h, s, l, count);
      case 'splitComp':      return this._splitComplementary(h, s, l, count);
      case 'tetradic':       return this._tetradic(h, s, l, count);
      case 'warm':           return this._warm(h, s, l, count);
      case 'cool':           return this._cool(h, s, l, count);
      case 'pastel':         return this._pastelHarmony(h, count);
      case 'neon':           return this._neon(h, count);
      case 'luxury':         return this._luxuryHarmony(h, count);
      case 'corporate':      return this._corporate(h, s, l, count);
      case 'vintage':        return this._vintage(h, count);
      default:               return this._monochromatic(h, s, l, count);
    }
  },

  _hsl(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(5, Math.min(95, l));
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
  },

  _monochromatic(h, s, l, n) {
    const out = [];
    const step = 60 / Math.max(1, n - 1);
    for (let i = 0; i < n; i++) {
      out.push(this._hsl(h, s * (0.5 + i * 0.1), 15 + i * step));
    }
    return out;
  },

  _complementary(h, s, l, n) {
    const cols = [this._hsl(h, s, l), this._hsl(h + 180, s, l)];
    while (cols.length < n) {
      cols.push(this._hsl(h, s * 0.7, l + (cols.length * 8)));
    }
    return cols.slice(0, n);
  },

  _analogous(h, s, l, n) {
    const out = [];
    const spread = 30;
    for (let i = 0; i < n; i++) {
      const offset = -spread + (i / Math.max(1, n - 1)) * spread * 2;
      out.push(this._hsl(h + offset, s, l));
    }
    return out;
  },

  _triadic(h, s, l, n) {
    const base = [
      this._hsl(h, s, l),
      this._hsl(h + 120, s, l),
      this._hsl(h + 240, s, l),
    ];
    while (base.length < n) base.push(this._hsl(h, s * 0.6, l + 15));
    return base.slice(0, n);
  },

  _splitComplementary(h, s, l, n) {
    const base = [
      this._hsl(h, s, l),
      this._hsl(h + 150, s, l),
      this._hsl(h + 210, s, l),
    ];
    while (base.length < n) base.push(this._hsl(h, s * 0.5, l + 20));
    return base.slice(0, n);
  },

  _tetradic(h, s, l, n) {
    const base = [
      this._hsl(h, s, l),
      this._hsl(h + 90, s, l),
      this._hsl(h + 180, s, l),
      this._hsl(h + 270, s, l),
    ];
    while (base.length < n) base.push(this._hsl(h, s * 0.5, l + 15));
    return base.slice(0, n);
  },

  _warm(h, s, l, n) {
    const warmH = ((h % 60) + 330) % 360;
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(this._hsl(warmH + i * 18, 70 + i * 3, 25 + i * 12));
    }
    return out;
  },

  _cool(h, s, l, n) {
    const coolH = 180 + ((h + 60) % 120);
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(this._hsl(coolH + i * 20, 60 + i * 5, 25 + i * 12));
    }
    return out;
  },

  _pastelHarmony(h, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(this._hsl(h + i * (360 / n), 55, 82));
    }
    return out;
  },

  _neon(h, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(this._hsl(h + i * (360 / n), 100, 55));
    }
    return out;
  },

  _luxuryHarmony(h, n) {
    const base = [
      this._hsl(0, 0, 8),       // near-black
      this._hsl(43, 72, 52),    // gold
      this._hsl(0, 0, 95),      // near-white
    ];
    for (let i = 3; i < n; i++) {
      base.push(this._hsl(43 + i * 10, 50, 35 + i * 5));
    }
    return base.slice(0, n);
  },

  _corporate(h, s, l, n) {
    const out = [this._hsl(h, s, l)];
    out.push(this._hsl(h, 30, 90));
    out.push(this._hsl(h, 20, 25));
    for (let i = 3; i < n; i++) {
      out.push(this._hsl(h, s * 0.4, 50 + i * 8));
    }
    return out.slice(0, n);
  },

  _vintage(h, n) {
    const vintageH = [20, 35, 50, 70, 130, 180];
    const out = [];
    for (let i = 0; i < n; i++) {
      const vh = vintageH[i % vintageH.length];
      out.push(this._hsl(vh, 45, 40));
    }
    return out;
  },

  // ─── HEX / RGB / HSL Parsing ────────────────────────────
  parseColor(value) {
    value = (value || '').trim();
    // HEX
    if (/^#?[0-9a-fA-F]{3,8}$/.test(value)) {
      if (!value.startsWith('#')) value = '#' + value;
      return this._normalizeHex(value);
    }
    // RGB
    const rgb = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgb) return rgbToHex(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]));
    // HSL
    const hsl = value.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
    if (hsl) {
      const { r, g, b } = hslToRgb(parseInt(hsl[1]), parseInt(hsl[2]), parseInt(hsl[3]));
      return rgbToHex(r, g, b);
    }
    return null;
  },

  _normalizeHex(hex) {
    const clean = hex.replace(/^#/, '');
    if (clean.length === 3) return '#' + clean.split('').map(c => c + c).join('');
    if (clean.length === 6) return hex;
    return '#000000';
  },

  toRgbString(hex) {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  },

  toHslString(hex) {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    return `hsl(${h}, ${s}%, ${l}%)`;
  },

  // ─── CMYK Conversions ────────────────────────────────────
  hexToCmyk(hex) {
    const { r, g, b } = hexToRgb(hex);
    return this.rgbToCmyk(r, g, b);
  },

  rgbToCmyk(r, g, b) {
    const rf = r / 255;
    const gf = g / 255;
    const bf = b / 255;
    const k = 1 - Math.max(rf, gf, bf);
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    const c = Math.round(((1 - rf - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gf - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bf - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  },

  cmykToRgb(c, m, y, k) {
    const cf = c / 100;
    const mf = m / 100;
    const yf = y / 100;
    const kf = k / 100;
    const r = Math.round(255 * (1 - cf) * (1 - kf));
    const g = Math.round(255 * (1 - mf) * (1 - kf));
    const b = Math.round(255 * (1 - yf) * (1 - kf));
    return { r, g, b };
  },

  cmykToHex(c, m, y, k) {
    const { r, g, b } = this.cmykToRgb(c, m, y, k);
    return rgbToHex(r, g, b);
  },

  // ─── Grayscale Conversion ────────────────────────────────
  toGrayscale(hex) {
    const { r, g, b } = hexToRgb(hex);
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return rgbToHex(gray, gray, gray);
  },

  paletteToGrayscale(colors) {
    return colors.map(c => this.toGrayscale(c));
  },

  // ─── Color Locking System ────────────────────────────────
  lockedIndices: new Set(),

  toggleLock(index) {
    if (this.lockedIndices.has(index)) {
      this.lockedIndices.delete(index);
      return false;
    } else {
      this.lockedIndices.add(index);
      return true;
    }
  },

  isLocked(index) {
    return this.lockedIndices.has(index);
  },

  clearLocks() {
    this.lockedIndices.clear();
  },

  // Randomize only unlocked colors
  randomizeUnlocked(currentColors, newColors) {
    return currentColors.map((col, idx) => {
      if (this.isLocked(idx)) return col;
      return newColors[idx] || col;
    });
  },

  // Replace single color
  replaceColor(colors, index, newHex) {
    const next = colors.slice();
    if (index >= 0 && index < next.length) {
      next[index] = newHex;
    }
    this.recordHistory(next);
    return next;
  },

  // ─── Palette History ─────────────────────────────────────
  _historyKey: 'pgpro_palette_history',

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(this._historyKey) || '[]');
    } catch {
      return [];
    }
  },

  recordHistory(palette) {
    if (!palette || !palette.length) return;
    const hist = this.getHistory();
    const key = palette.join('|');
    const filtered = hist.filter(p => p.join('|') !== key);
    filtered.unshift(palette.slice());
    const trimmed = filtered.slice(0, 20); // Keep last 20
    try {
      localStorage.setItem(this._historyKey, JSON.stringify(trimmed));
    } catch {}
  },

  // ─── Saved Palettes (localStorage) ──────────────────────
  getSavedPalettes() {
    try { return JSON.parse(localStorage.getItem('pgpro_palettes') || '{}'); } catch { return {}; }
  },

  savePalette(name, colors) {
    const p = this.getSavedPalettes();
    p[name] = colors;
    try { localStorage.setItem('pgpro_palettes', JSON.stringify(p)); return true; } catch { return false; }
  },

  deletePalette(name) {
    const p = this.getSavedPalettes();
    delete p[name];
    try { localStorage.setItem('pgpro_palettes', JSON.stringify(p)); } catch {}
  },

  // ─── Color Swap ─────────────────────────────────────────
  swapColors(colors, i, j) {
    const c = colors.slice();
    [c[i], c[j]] = [c[j], c[i]];
    return c;
  },

  getColorName(hex) {
    return getColorName(hex);
  }
};

function getColorName(hex) {
    if (!hex) return 'Unknown';
    let r = 128, g = 128, b = 128;
    if (typeof hexToRgb === 'function') {
        const rgb = hexToRgb(hex);
        if (rgb) { r = rgb.r; g = rgb.g; b = rgb.b; }
    } else {
        const clean = (hex + '').replace('#', '');
        if (clean.length === 6) {
            r = parseInt(clean.substring(0, 2), 16) || 0;
            g = parseInt(clean.substring(2, 4), 16) || 0;
            b = parseInt(clean.substring(4, 6), 16) || 0;
        }
    }
    let h = 0, s = 0, l = 50;
    if (typeof rgbToHsl === 'function') {
        const hsl = rgbToHsl(r, g, b);
        if (hsl) { h = hsl.h; s = hsl.s; l = hsl.l; }
    } else {
        const rf = r / 255, gf = g / 255, bf = b / 255;
        const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
        l = ((max + min) / 2) * 100;
        const d = max - min;
        s = (max === min) ? 0 : ((l > 50 ? d / (2 - max - min) : d / (max + min)) * 100);
        if (max === min) h = 0;
        else if (max === rf) h = ((gf - bf) / d + (gf < bf ? 6 : 0)) * 60;
        else if (max === gf) h = ((bf - rf) / d + 2) * 60;
        else h = ((rf - gf) / d + 4) * 60;
    }
    if (l < 8)  return 'Black';
    if (l > 92) return 'White';
    if (s < 12) {
        if (l < 30) return 'Dark Gray';
        if (l < 65) return 'Gray';
        return 'Light Gray';
    }
    const hueNames = [
        [10, 'Red'], [28, 'Red-Orange'], [40, 'Orange'], [58, 'Yellow'],
        [80, 'Yellow-Green'], [150, 'Green'], [185, 'Teal'], [210, 'Cyan'],
        [250, 'Blue'], [280, 'Indigo'], [320, 'Purple'], [350, 'Magenta'], [360, 'Red'],
    ];
    let hueName = 'Red';
    for (const [threshold, name] of hueNames) {
        if (h <= threshold) { hueName = name; break; }
    }
    const prefix = l < 28 ? 'Dark ' : l > 72 ? 'Light ' : s > 72 ? 'Vibrant ' : '';
    return prefix + hueName;
}

if (typeof window !== 'undefined') {
  window.ColorEngine = ColorEngine;
  window.getColorName = getColorName;
}
if (typeof module !== 'undefined') {
  module.exports = ColorEngine;
  module.exports.getColorName = getColorName;
}
