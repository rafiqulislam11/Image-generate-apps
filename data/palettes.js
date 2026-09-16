'use strict';
/**
 * AI Pattern & Image Design Studio PRO — data/palettes.js
 * Curated Professional Color Palettes
 */

const CURATED_PALETTES = [
  {
    id: 'pal_royal_gold',
    name: '24K Royal Gold',
    category: 'luxury',
    colors: ['#0b0c10', '#d4af37', '#f3e5ab', '#aa7c11', '#1f2833']
  },
  {
    id: 'pal_cyberpunk',
    name: 'Cyberpunk 2099',
    category: 'neon',
    colors: ['#05060f', '#ff007f', '#00f0ff', '#7928ca', '#ffe600']
  },
  {
    id: 'pal_emerald_zen',
    name: 'Emerald Zen Forest',
    category: 'nature',
    colors: ['#022c22', '#059669', '#10b981', '#6ee7b7', '#ecfdf5']
  },
  {
    id: 'pal_sunset_bliss',
    name: 'Horizon Sunset Glow',
    category: 'warm',
    colors: ['#1e1b4b', '#be185d', '#ea580c', '#f59e0b', '#fef08a']
  },
  {
    id: 'pal_nordic_minimal',
    name: 'Nordic Clean Minimal',
    category: 'minimal',
    colors: ['#09090b', '#27272a', '#71717a', '#e4e4e7', '#fafafa']
  },
  {
    id: 'pal_cherry_blossom',
    name: 'Pastel Cherry Blossom',
    category: 'pastel',
    colors: ['#fff1f2', '#fda4af', '#f43f5e', '#be123c', '#4c0519']
  },
  {
    id: 'pal_moroccan_spice',
    name: 'Moroccan Zellige Spice',
    category: 'islamic',
    colors: ['#0f172a', '#0284c7', '#d97706', '#b45309', '#f8fafc']
  },
  {
    id: 'pal_cosmic_nebula',
    name: 'Deep Cosmic Nebula',
    category: 'neon',
    colors: ['#020617', '#3b82f6', '#8b5cf6', '#ec4899', '#38bdf8']
  },
  {
    id: 'pal_vintage_tweed',
    name: 'Vintage Tweed & Leather',
    category: 'vintage',
    colors: ['#1c1917', '#44403c', '#78716c', '#b45309', '#e7e5e4']
  },
  {
    id: 'pal_ocean_abyss',
    name: 'Pacific Ocean Trench',
    category: 'cool',
    colors: ['#030712', '#0f172a', '#0284c7', '#06b6d4', '#a5f3fc']
  },
  {
    id: 'pal_candy_pop',
    name: 'Memphis Candy Pop',
    category: 'kids',
    colors: ['#ffffff', '#ff007f', '#00f0ff', '#ffe600', '#7928ca']
  },
  {
    id: 'pal_autumn_harvest',
    name: 'Harvest Pumpkin & Maple',
    category: 'warm',
    colors: ['#271c19', '#7c2d12', '#c2410c', '#ea580c', '#fbbf24']
  }
];

if (typeof window !== 'undefined') {
  window.CURATED_PALETTES = CURATED_PALETTES;
}
if (typeof module !== 'undefined') {
  module.exports = CURATED_PALETTES;
}
