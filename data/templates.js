'use strict';
/**
 * AI Pattern & Image Design Studio PRO — data/templates.js
 * Curated Ready-Made Editable Pattern Templates
 */

const PATTERN_TEMPLATES = [
  {
    id: 'tpl_floral_minimal',
    name: 'Floral Minimal',
    category: 'floral',
    icon: '🌸',
    description: 'Clean, elegant Japanese-inspired botanical lines with soft blush and champagne tones.',
    tags: ['floral', 'minimal', 'delicate', 'japan', 'botanical'],
    state: {
      patternType: 'floral',
      colors: ['#0f172a', '#f43f5e', '#fecdd3', '#e2e8f0'],
      scale: 45,
      density: 4,
      lineThickness: 1.2,
      opacity: 0.9,
      rotation: 0,
      spacing: 12,
      blendStrength: 0.5,
      seamless: true,
      effects: {
        paper: { enabled: true, intensity: 30 },
        glow: { enabled: false, intensity: 0 },
      }
    }
  },
  {
    id: 'tpl_luxury_damask',
    name: 'Luxury Damask',
    category: 'luxury',
    icon: '👑',
    description: 'Regal 24K liquid gold acanthus swirls over deep royal obsidian black.',
    tags: ['luxury', 'damask', 'gold', 'royal', 'baroque'],
    state: {
      patternType: 'versaceBaroque',
      colors: ['#0a0b10', '#d4af37', '#f5e6a3', '#aa7c11'],
      scale: 55,
      density: 6,
      lineThickness: 2,
      opacity: 0.95,
      rotation: 0,
      spacing: 15,
      blendStrength: 0.8,
      seamless: true,
      effects: {
        glow: { enabled: true, intensity: 35 },
        shadow: { enabled: true, intensity: 40 },
        grain: { enabled: true, intensity: 20 },
      }
    }
  },
  {
    id: 'tpl_geometric_modern',
    name: 'Geometric Modern',
    category: 'geometric',
    icon: '📐',
    description: 'Sharp isometric interlocking blocks with high-contrast architectural colors.',
    tags: ['geometric', 'modern', 'isometric', 'architecture', 'sharp'],
    state: {
      patternType: 'isometric',
      colors: ['#1e293b', '#38bdf8', '#818cf8', '#f8fafc'],
      scale: 50,
      density: 6,
      lineThickness: 1.5,
      opacity: 0.9,
      rotation: 45,
      spacing: 8,
      blendStrength: 0.7,
      seamless: true,
      effects: {
        glass: { enabled: true, intensity: 25 },
        shadow: { enabled: true, intensity: 30 }
      }
    }
  },
  {
    id: 'tpl_islamic_ornament',
    name: 'Islamic Ornament',
    category: 'islamic',
    icon: '🕌',
    description: 'Intricate eightfold girih star tessellation inspired by Alhambra mosaics.',
    tags: ['islamic', 'moroccan', 'zellige', 'star', 'sacred'],
    state: {
      patternType: 'islamic',
      colors: ['#042f2e', '#0d9488', '#f59e0b', '#fef3c7'],
      scale: 50,
      density: 7,
      lineThickness: 2,
      opacity: 0.92,
      rotation: 0,
      spacing: 10,
      blendStrength: 0.75,
      seamless: true,
      effects: {
        shadow: { enabled: true, intensity: 35 },
        paper: { enabled: true, intensity: 20 }
      }
    }
  },
  {
    id: 'tpl_cyberpunk_neon',
    name: 'Cyberpunk Neon',
    category: 'abstract',
    icon: '⚡',
    description: 'High-voltage electric magenta, cyan, and quantum circuit grids in deep space.',
    tags: ['cyberpunk', 'neon', 'circuit', 'sci-fi', 'glow'],
    state: {
      patternType: 'cyberpunkCircuit',
      colors: ['#05060f', '#ff007f', '#00f0ff', '#7928ca'],
      scale: 60,
      density: 8,
      lineThickness: 2,
      opacity: 1,
      rotation: 0,
      spacing: 12,
      blendStrength: 0.85,
      seamless: true,
      effects: {
        glow: { enabled: true, intensity: 65 },
        distortion: { enabled: true, intensity: 15 }
      }
    }
  },
  {
    id: 'tpl_kids_pattern',
    name: 'Kids Joyful Confetti',
    category: 'kids',
    icon: '🎈',
    description: 'Playful bouncy doodles and cheerful confetti shapes in sunny candy pastels.',
    tags: ['kids', 'playful', 'pastel', 'nursery', 'fun'],
    state: {
      patternType: 'memphis',
      colors: ['#fffbeb', '#f43f5e', '#38bdf8', '#fbbf24', '#a855f7'],
      scale: 45,
      density: 5,
      lineThickness: 2.5,
      opacity: 0.9,
      rotation: 15,
      spacing: 16,
      blendStrength: 0.6,
      seamless: true,
      effects: {
        shadow: { enabled: true, intensity: 15 }
      }
    }
  },
  {
    id: 'tpl_halloween_gothic',
    name: 'Halloween Spooky',
    category: 'halloween',
    icon: '🎃',
    description: 'Mystic nocturnal spiderwebs and eerie swirls in neon pumpkin orange and spectral violet.',
    tags: ['halloween', 'spooky', 'gothic', 'night', 'orange'],
    state: {
      patternType: 'halloween',
      colors: ['#0f051d', '#f97316', '#a855f7', '#1c1917'],
      scale: 55,
      density: 6,
      lineThickness: 1.8,
      opacity: 0.92,
      rotation: 0,
      spacing: 14,
      blendStrength: 0.8,
      seamless: true,
      effects: {
        glow: { enabled: true, intensity: 45 },
        noise: { enabled: true, intensity: 25 }
      }
    }
  },
  {
    id: 'tpl_christmas_tartan',
    name: 'Christmas Highland Tartan',
    category: 'christmas',
    icon: '🎄',
    description: 'Warm winter woolen plaid in pine forest green, ruby red, and golden threads.',
    tags: ['christmas', 'tartan', 'plaid', 'winter', 'holiday'],
    state: {
      patternType: 'tartan',
      colors: ['#064e3b', '#991b1b', '#d97706', '#f8fafc'],
      scale: 50,
      density: 5,
      lineThickness: 1.5,
      opacity: 0.9,
      rotation: 0,
      spacing: 10,
      blendStrength: 0.7,
      seamless: true,
      effects: {
        fabric: { enabled: true, intensity: 45 }
      }
    }
  },
  {
    id: 'tpl_wedding_elegance',
    name: 'Wedding Lace Elegance',
    category: 'wedding',
    icon: '💍',
    description: 'Delicate bridal rosette swirls in pearl cream, soft champagne, and gentle rose.',
    tags: ['wedding', 'lace', 'elegant', 'rose', 'bridal'],
    state: {
      patternType: 'wedding',
      colors: ['#fdfbf7', '#e2d9cc', '#f43f5e', '#d4af37'],
      scale: 40,
      density: 5,
      lineThickness: 1.2,
      opacity: 0.85,
      rotation: 0,
      spacing: 12,
      blendStrength: 0.5,
      seamless: true,
      effects: {
        paper: { enabled: true, intensity: 35 },
        shadow: { enabled: true, intensity: 20 }
      }
    }
  },
  {
    id: 'tpl_corporate_fintech',
    name: 'Business Global Grid',
    category: 'business',
    icon: '💼',
    description: 'Precise financial blueprint grid and data nodes in navy and cyan.',
    tags: ['business', 'tech', 'grid', 'corporate', 'blueprint'],
    state: {
      patternType: 'business',
      colors: ['#0a192f', '#0284c7', '#38bdf8', '#e2e8f0'],
      scale: 45,
      density: 6,
      lineThickness: 1,
      opacity: 0.85,
      rotation: 0,
      spacing: 8,
      blendStrength: 0.6,
      seamless: true,
      effects: {
        glow: { enabled: true, intensity: 20 }
      }
    }
  },
  {
    id: 'tpl_scottish_tweed',
    name: 'Textile Tweed Herringbone',
    category: 'textile',
    icon: '🧵',
    description: 'Authentic heritage herringbone weave in charcoal and heather oatmeal.',
    tags: ['textile', 'herringbone', 'tweed', 'fabric', 'wool'],
    state: {
      patternType: 'herringbone',
      colors: ['#27272a', '#71717a', '#d4d4d8', '#3f3f46'],
      scale: 50,
      density: 7,
      lineThickness: 1.6,
      opacity: 0.95,
      rotation: 0,
      spacing: 6,
      blendStrength: 0.7,
      seamless: true,
      effects: {
        fabric: { enabled: true, intensity: 55 },
        grain: { enabled: true, intensity: 25 }
      }
    }
  },
  {
    id: 'tpl_art_deco_wallpaper',
    name: 'Art Deco Luxury Wallpaper',
    category: 'wallpaper',
    icon: '🖼️',
    description: '1920s Gatsby luxury fan motifs in brushed brass and velvet emerald.',
    tags: ['wallpaper', 'artdeco', 'fan', 'luxury', 'interior'],
    state: {
      patternType: 'artDecoFan',
      colors: ['#022c22', '#ca8a04', '#fef08a', '#14532d'],
      scale: 60,
      density: 6,
      lineThickness: 2,
      opacity: 0.95,
      rotation: 0,
      spacing: 14,
      blendStrength: 0.8,
      seamless: true,
      effects: {
        glow: { enabled: true, intensity: 35 },
        shadow: { enabled: true, intensity: 45 }
      }
    }
  }
];

if (typeof window !== 'undefined') {
  window.PATTERN_TEMPLATES = PATTERN_TEMPLATES;
}
if (typeof module !== 'undefined') {
  module.exports = PATTERN_TEMPLATES;
}
