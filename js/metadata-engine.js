'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/metadata-engine.js
 * Commercial Stock Metadata Studio: Adobe Stock, Shutterstock, Pond5, Creative Fabrica, Design Bundles
 * Generates SEO-optimized titles, descriptions, keyword tags, and multi-platform CSV exports.
 */

const MetadataEngine = {

  PATTERN_NAMES: {
    plaid:'Plaid',tartan:'Tartan',checkered:'Checkered',gingham:'Gingham',
    grid:'Grid',stripe:'Stripe',diagonalStripe:'Diagonal Stripe',crossStripe:'Cross Stripe',
    woven:'Woven Textile',geometric:'Geometric',squareGrid:'Square Grid',
    multiStripe:'Multi Stripe',herringbone:'Herringbone',interlockingGrid:'Interlocking Grid',
    abstractTextile:'Abstract Textile',minimalLine:'Minimal Line',diamond:'Diamond',
    hexagonal:'Hexagonal',wave:'Wave',randomGeometric:'Random Geometric',
    mandala:'Mandala',moroccan:'Moroccan',islamic:'Islamic Geometric',memphis:'Memphis',
    polkaDot:'Polka Dot',chevron:'Chevron',zigzag:'Zigzag',spiral:'Spiral',
    triangle:'Triangle',hexStar:'Hex Star',cross:'Cross',isometric:'Isometric',
    lineart:'Line Art',doodle:'Doodle',retro:'Retro',marble:'Marble',
    gridNoise:'Grid Noise',abstractLine:'Abstract Line',organic:'Organic',
    organicFlow:'Organic Flow',floral:'Floral',botanical:'Botanical',leaves:'Leaves',
    pixel:'Pixel Art',luxury:'Luxury',kids:'Kids Fun',technology:'Technology',
    futuristic:'Futuristic',christmas:'Christmas',halloween:'Halloween',
    wedding:'Wedding',valentine:'Valentine',business:'Business',
    versaceBaroque:'Versace Baroque',artDecoFan:'Art Deco Fan',
    cyberpunkCircuit:'Cyber Circuit',topographicIso:'Topographic Contour',
    auroraBorealis:'Aurora Borealis',supernovaBurst:'Supernova Burst'
  },

  PLATFORMS: {
    adobe: { name: 'Adobe Stock', maxTitle: 120, maxKeywords: 50 },
    shutterstock: { name: 'Shutterstock', maxTitle: 200, maxKeywords: 50 },
    pond5: { name: 'Pond5', maxTitle: 100, maxKeywords: 50 },
    creativeFabrica: { name: 'Creative Fabrica', maxTitle: 150, maxKeywords: 40 },
    designBundles: { name: 'Design Bundles', maxTitle: 150, maxKeywords: 40 }
  },

  CATEGORIES: {
    adobe: ['Backgrounds/Textures','Abstract','Architecture/Buildings','Arts/Entertainment',
      'Beauty/Fashion','Business/Finance','Education','Food/Drink','Holidays','Illustrations/Clip-Art',
      'Miscellaneous','Nature','Objects','Science','Technology','Vintage'],
    shutterstock: ['Abstract','Backgrounds','Beauty & Fashion','Business & Finance',
      'Culture & Religion','Education','Environment','Food & Drink','Holidays','Illustrations & Vectors',
      'Nature','Objects','Technology','Vintage'],
    pond5: ['Abstract','Backgrounds & Textures','Business','Design Elements','Holidays','Illustrations','Patterns','Technology'],
    creativeFabrica: ['Patterns','Backgrounds','Sublimation','Digital Papers','Textures','Craft Designs'],
    designBundles: ['Patterns','Digital Paper','Textures','Sublimation Designs','Backgrounds','Graphic Packs']
  },

  DESIGN_TYPES: ['Digital Artwork', 'Seamless Pattern', 'Vector Graphic', 'Textile Design', 'Commercial Background', 'Sublimation Texture'],

  // ─── Generate Metadata ───────────────────────────────────
  generate(state, index = 1) {
    index = Math.max(1, index);
    const type = state.patternType || 'geometric';
    const typeName = this.PATTERN_NAMES[type] || (type.charAt(0).toUpperCase() + type.slice(1));
    const getColor = (typeof getColorName === 'function') ? getColorName
      : (typeof ColorEngine !== 'undefined' && typeof ColorEngine.getColorName === 'function') ? ColorEngine.getColorName
      : (c => c);
    
    const colors = state.colors || ['#1e293b', '#3b82f6'];
    const colorNames = colors.map(getColor);
    const seed = state.seed || 483920;

    const primaryColor = colorNames[0] || 'Multicolor';
    const secondaryColor = colorNames[1] || '';
    const paletteDesc = colorNames.slice(0, 3).join(', ');

    // Infer Style, Use, and Orientation
    const style = this._inferStyle(type, state);
    const use = this._inferUse(type);
    const w = state.canvasWidth || 4000;
    const h = state.canvasHeight || 2663;
    const orientation = w > h ? 'Landscape' : (w < h ? 'Portrait' : 'Square');

    const background = (state.colors && state.colors.length > 0) ? `${colorNames[0]} Background` : 'Neutral Background';

    const title = this._buildTitle(typeName, primaryColor, secondaryColor, style);
    const description = this._buildDescription(typeName, paletteDesc, style, use, seed);
    const keywords = this._buildKeywords(type, typeName, colorNames, style, use, state);
    const filename = this._buildFilename(typeName, primaryColor, secondaryColor, style, index, state.exportFormat || 'png', seed, w, h);
    const category = this._inferCategory(type);
    const designType = 'Seamless Pattern / Background';

    // Quality & SEO Scoring
    const kwCount = keywords.length;
    const duplicates = kwCount - new Set(keywords).size;
    const seoScore = Math.min(100, Math.round(
      (Math.min(kwCount, 45) / 45) * 40 +
      (title.length >= 35 && title.length <= 120 ? 30 : 15) +
      (description.length >= 90 ? 30 : 15)
    ));

    return {
      filename,
      title,
      description,
      keywords: [...new Set(keywords)],
      keywordsString: [...new Set(keywords)].join(', '),
      category,
      designType,
      style,
      background,
      color: primaryColor,
      orientation,
      resolution: `${w}x${h}`,
      format: (state.exportFormat || 'png').toUpperCase(),
      colorPalette: colorNames.join(' | '),
      patternType: typeName,
      seed: String(seed),
      width: String(w),
      height: String(h),
      aiDisclosure: 'Generative AI: Yes (Procedural & Algorithmic Design)',
      disclaimer: 'Metadata is optimized for commercial indexing. Marketplace acceptance is subject to target platform review.',
      stats: { kwCount, duplicates, seoScore, titleLen: title.length, descLen: description.length }
    };
  },

  _inferStyle(type, state) {
    if (state && state.density > 7) return 'Intricate';
    if (state && state.scale < 30) return 'Micro Minimal';
    if (['luxury', 'versaceBaroque', 'artDecoFan'].includes(type)) return 'Luxury Opulent';
    if (['islamic', 'moroccan'].includes(type)) return 'Traditional Geometric';
    if (['cyberpunkCircuit', 'futuristic', 'supernovaBurst'].includes(type)) return 'Futuristic Sci-Fi';
    if (['mandala', 'spiral'].includes(type)) return 'Sacred Radial';
    if (['retro', 'memphis'].includes(type)) return 'Retro 80s';
    if (['floral', 'botanical'].includes(type)) return 'Botanical Organic';
    return 'Modern Minimalist';
  },

  _inferUse(type) {
    if (['plaid', 'tartan', 'herringbone', 'woven', 'houndstoothPro'].includes(type)) return 'textiles, fabrics, apparel, and fashion prints';
    if (['artDecoFan', 'versaceBaroque', 'damask', 'moroccan'].includes(type)) return 'luxury wallpaper, feature walls, and interior decor';
    if (['cyberpunkCircuit', 'business', 'grid'].includes(type)) return 'digital website backgrounds, app interfaces, and tech presentations';
    return 'packaging, gift wrap, stationery, posters, and digital artwork';
  },

  _buildTitle(typeName, primary, secondary, style) {
    const sec = secondary ? `and ${secondary} ` : '';
    return `Seamless ${primary} ${sec}${typeName} Pattern Background — ${style} Digital Texture`;
  },

  _buildDescription(typeName, paletteDesc, style, use, seed) {
    return `A high-resolution seamless ${typeName.toLowerCase()} pattern background designed with a refined ${style.toLowerCase()} aesthetic. ` +
      `Featuring harmonious ${paletteDesc} tones, this commercial-ready repeating design is ideal for ${use}. ` +
      `Clean edge continuity and print-ready quality. Unique Seed: ${seed}.`;
  },

  _buildKeywords(type, typeName, colorNames, style, use, state) {
    const base = [
      typeName.toLowerCase(), 'seamless', 'pattern', 'background', 'texture',
      'repeating', 'tile', 'wallpaper', 'textile', 'print', 'digital paper',
      'commercial use', 'geometric', 'graphic design', 'decorative', 'high resolution',
      ...colorNames.map(c => c.toLowerCase())
    ];

    const typeSpecific = {
      plaid: ['tartan', 'scottish', 'flannel', 'fabric weave', 'lumberjack'],
      tartan: ['highland', 'kilt', 'clan plaid', 'scottish wool', 'textile'],
      islamic: ['girih', 'zellige', 'arabesque', 'moroccan mosaic', 'star geometric', 'mosque'],
      mandala: ['zen', 'spiritual', 'meditation', 'radial symmetry', 'sacred geometry', 'sri yantra'],
      floral: ['botanical', 'flowers', 'blossom', 'rose petals', 'nature print', 'spring'],
      cyberpunkCircuit: ['circuit board', 'pcb', 'cyber neon', 'futuristic', 'digital matrix', 'sci-fi'],
      versaceBaroque: ['luxury gold', 'acanthus', 'damask', 'royal velvet', 'baroque scroll', 'vintage'],
      artDecoFan: ['gatsby', '1920s', 'luxury fan', 'vintage glamour', 'deco lines', 'brass'],
      houndstoothPro: ['houndstooth', 'pied de poule', 'tweed', 'fashion textile', 'woven wool'],
      herringbone: ['herringbone', 'chevron weave', 'parquet', 'arrow stripe', 'tweed fabric'],
      topographicIso: ['topographic map', 'contour lines', 'elevation', 'geographic', 'river bed'],
      auroraBorealis: ['northern lights', 'polar sky', 'cosmic wave', 'luminescent', 'night lights']
    };

    if (typeSpecific[type]) {
      base.push(...typeSpecific[type]);
    }

    if (state && state.scale > 70) base.push('large scale', 'bold pattern');
    if (state && state.scale < 30) base.push('small scale', 'micro pattern', 'delicate');

    // Deduplicate and filter out unwanted words
    return [...new Set(base.map(k => k.trim().toLowerCase()).filter(Boolean))].slice(0, 50);
  },

  _buildFilename(typeName, primary, secondary, style, index, format, seed, w, h) {
    if (typeof generateFilename === 'function') {
      return generateFilename(typeName, index, format, seed, w, h);
    }
    const cleanType = typeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const idx = String(index).padStart(3, '0');
    return `patternforge_${cleanType}_s${seed}_${w}x${h}_${idx}.${format.toLowerCase().replace('.', '')}`;
  },

  _inferCategory(type) {
    const catMap = {
      plaid:'Backgrounds/Textures', tartan:'Backgrounds/Textures',
      islamic:'Culture & Religion', moroccan:'Culture & Religion',
      mandala:'Abstract', floral:'Nature', botanical:'Nature',
      cyberpunkCircuit:'Technology', business:'Business & Finance',
      versaceBaroque:'Backgrounds/Textures', artDecoFan:'Backgrounds/Textures'
    };
    return catMap[type] || 'Backgrounds/Textures';
  },

  // ─── Standard 12-Column CSV Export (Single & Bulk) ──────────────────────────
  exportCSV(metadataList, filename = 'pattern_metadata.csv') {
    if (!metadataList || !metadataList.length) return;

    // The standard 12 columns requested in Section 16
    const headers = [
      'Filename', 'Title', 'Description', 'Keywords', 'Category',
      'Design Type', 'Style', 'Background', 'Color', 'Orientation',
      'Resolution', 'Format'
    ];

    const esc = v => `"${(v || '').toString().replace(/"/g, '""')}"`;

    const rows = metadataList.map(m => [
      m.filename,
      m.title,
      m.description,
      Array.isArray(m.keywords) ? m.keywords.join(', ') : m.keywordsString,
      m.category,
      m.designType,
      m.style,
      m.background,
      m.color,
      m.orientation,
      m.resolution,
      m.format
    ].map(esc).join(','));

    // Include UTF-8 BOM for full Microsoft Excel & cross-platform compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
};

if (typeof window !== 'undefined') window.MetadataEngine = MetadataEngine;
if (typeof module !== 'undefined') module.exports = MetadataEngine;
