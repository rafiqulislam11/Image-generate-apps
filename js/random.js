'use strict';
/**
 * PatternForge — random.js
 * Seeded PRNG (Mulberry32), color utilities, palette presets
 * All functions are globally available (no modules needed)
 */

// ─── Mulberry32 Seeded PRNG ───────────────────────────────────────────────────
function createSeededRandom(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
        s += 0x6D2B79F5;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ─── Color Conversion ─────────────────────────────────────────────────────────
function hexToRgb(hex) {
    const clean = (hex || '#000000').trim().replace(/^#/, '');
    const full  = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean.padEnd(6, '0');
    const n = parseInt(full, 16) || 0;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => {
        const h = Math.round(Math.max(0, Math.min(255, v))).toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('');
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

function blendColors(hex1, hex2, t) {
    t = (t === undefined) ? 0.5 : Math.max(0, Math.min(1, t));
    const a = hexToRgb(hex1), b = hexToRgb(hex2);
    return rgbToHex(
        Math.round(a.r + (b.r - a.r) * t),
        Math.round(a.g + (b.g - a.g) * t),
        Math.round(a.b + (b.b - a.b) * t)
    );
}

function hexWithAlpha(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    const a = Math.max(0, Math.min(1, alpha !== undefined ? alpha : 1));
    return `rgba(${r},${g},${b},${a})`;
}

function colorLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function contrastColor(hex) {
    return colorLuminance(hex) > 0.5 ? '#111111' : '#ffffff';
}

// ─── Random Helpers ───────────────────────────────────────────────────────────
function randomNumber(rng, min, max) {
    return min + rng() * (max - min);
}

function randomInt(rng, min, max) {
    return Math.floor(min + rng() * (max - min + 1));
}

function randomPick(rng, arr) {
    if (!arr || !arr.length) return undefined;
    return arr[Math.floor(rng() * arr.length)];
}

function randomColor(rng) {
    const h = rng() * 360;
    const s = 35 + rng() * 55;
    const l = 15 + rng() * 65;
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}

// ─── Palette Presets ──────────────────────────────────────────────────────────
const PALETTES = {
    'Navy + Orange':        ['#0d1b3e', '#e05c00', '#c24a00', '#f07020'],
    'Black + Gold':         ['#111111', '#c9a84c', '#8b6914', '#e8c96d'],
    'Red + Black':          ['#8b0000', '#1a1a1a', '#cc2200', '#3a0000'],
    'Green + Cream':        ['#1e4d2b', '#f5f0e0', '#2e6b3e', '#e8dfc0'],
    'Blue + White':         ['#1a3a6e', '#f0f4ff', '#2b5ca8', '#d0ddf5'],
    'Purple + Pink':        ['#4b0082', '#ff69b4', '#7b00c2', '#ff88c8'],
    'Brown + Beige':        ['#5c3317', '#f5e6c8', '#7a4a2a', '#e8d4a0'],
    'Burgundy + Cream':     ['#6b1a2e', '#f5f0e8', '#8b2040', '#e0d8c8'],
    'Forest Green + Gold':  ['#1a3a1a', '#b8960c', '#2a5a2a', '#d4ad2a'],
    'Charcoal + Orange':    ['#2d2d2d', '#e05c00', '#3d3d3d', '#f07530'],
    'Cobalt + Amber':       ['#1a2a6e', '#d4860c', '#2b4ca8', '#e8a030'],
    'Teal + Rust':          ['#0d4a4a', '#b84a1a', '#1a6060', '#cc6030'],
    'Sage + Terracotta':    ['#4a6a4a', '#c0603a', '#6a8a6a', '#d4784a'],
    'Indigo + Cream':       ['#2d1b69', '#f0ead8', '#3d2a90', '#e8ddc0'],
    'Midnight + Silver':    ['#0a0a1a', '#a8a8c0', '#14142a', '#c0c0d8'],
};

const PALETTE_NAMES = Object.keys(PALETTES);

function randomNamedPalette(rng, count) {
    count = Math.max(2, Math.min(8, count || 4));
    const name = randomPick(rng, PALETTE_NAMES);
    const pal  = PALETTES[name].slice();
    while (pal.length < count) pal.push(randomColor(rng));
    return pal.slice(0, count);
}

function randomPremiumPalette(rng, type, count) {
    count = Math.max(2, Math.min(8, count || 4));
    type  = type || 'vibrant';

    switch (type) {
        case 'monochrome': {
            const h = rng() * 360;
            const out = [];
            for (let i = 0; i < count; i++) {
                const l = 10 + (i / Math.max(1, count - 1)) * 75;
                const { r, g, b } = hslToRgb(h, 20, l);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'pastel': {
            const out = [];
            for (let i = 0; i < count; i++) {
                const h = (i / count) * 360 + rng() * 40;
                const { r, g, b } = hslToRgb(h % 360, 55 + rng() * 20, 78 + rng() * 10);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'luxury': {
            const baseH = rng() < 0.5 ? 250 + rng() * 50 : rng() * 30;
            const out   = [];
            const { r: r0, g: g0, b: b0 } = hslToRgb(baseH, 50, 12);
            out.push(rgbToHex(r0, g0, b0));
            const goldH = 38 + rng() * 10;
            const { r: rg, g: gg, b: bg } = hslToRgb(goldH, 70, 52);
            out.push(rgbToHex(rg, gg, bg));
            for (let i = 2; i < count; i++) {
                const { r, g, b } = hslToRgb(baseH + rng() * 20, 40, 18 + i * 8);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'dark': {
            const h = rng() * 360;
            const out = [];
            for (let i = 0; i < count; i++) {
                const { r, g, b } = hslToRgb(h + i * 15, 25 + rng() * 20, 8 + i * 6);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'vibrant': {
            const out = [];
            for (let i = 0; i < count; i++) {
                const { r, g, b } = hslToRgb((i / count) * 360 + rng() * 20, 90 + rng() * 10, 50 + rng() * 10);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'earth': {
            const pool = ['#5c3317','#8b6914','#4a7c59','#c4a265','#6b4c3b','#a08040','#7a5c38','#3d2b1a'];
            const shuffled = pool.slice().sort(() => rng() - 0.5);
            return shuffled.slice(0, count);
        }
        case 'autumn': {
            const out  = [];
            const autH = [15, 25, 35, 120, 90];
            for (let i = 0; i < count; i++) {
                const h = autH[i % autH.length] + (rng() - 0.5) * 20;
                const { r, g, b } = hslToRgb(h, 60 + rng() * 30, 25 + rng() * 40);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'winter': {
            const out = [];
            for (let i = 0; i < count; i++) {
                const h = 200 + rng() * 60;
                const { r, g, b } = hslToRgb(h, 30 + rng() * 30, 30 + rng() * 50);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'spring': {
            const out = [];
            for (let i = 0; i < count; i++) {
                const h = [120, 160, 60, 300, 180][i % 5] + (rng() - 0.5) * 30;
                const { r, g, b } = hslToRgb(h % 360, 55 + rng() * 25, 45 + rng() * 30);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        case 'summer': {
            const out  = [];
            const sumH = [30, 50, 200, 160];
            for (let i = 0; i < count; i++) {
                const h = sumH[i % sumH.length] + (rng() - 0.5) * 20;
                const { r, g, b } = hslToRgb(h % 360, 75 + rng() * 20, 50 + rng() * 20);
                out.push(rgbToHex(r, g, b));
            }
            return out;
        }
        default:
            return randomNamedPalette(rng, count);
    }
}

// ─── Image Color Extraction ───────────────────────────────────────────────────
function extractDominantColors(imageData, count) {
    count = Math.max(1, count || 6);
    const data = imageData.data;
    const step = Math.max(1, Math.floor(data.length / (count * 300)));
    const buckets = {};

    for (let i = 0; i < data.length; i += 4 * step) {
        if (data[i + 3] < 128) continue; // skip transparent
        const r = Math.round(data[i]     / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        buckets[key] = (buckets[key] || 0) + 1;
    }

    const sorted = Object.entries(buckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count);

    if (!sorted.length) return ['#333333', '#aaaaaa'];

    return sorted.map(([key]) => {
        const [r, g, b] = key.split(',').map(Number);
        return rgbToHex(r, g, b);
    });
}

// ─── Global Seed State ────────────────────────────────────────────────────────
let _globalSeed = 483920;
let _globalRng  = createSeededRandom(_globalSeed);

function setSeed(seed) {
    _globalSeed = (Math.abs(parseInt(seed, 10)) || 1);
    _globalRng  = createSeededRandom(_globalSeed);
    return _globalSeed;
}

function getSeed()  { return _globalSeed; }
function getRng()   { return _globalRng; }
function resetRng() { _globalRng = createSeededRandom(_globalSeed); }

function generateRandomSeed() {
    const s = (Math.random() * 999999 | 0) + 1;
    setSeed(s);
    return s;
}
