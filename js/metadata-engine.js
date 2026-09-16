'use strict';
/**
 * Pattern Generator PRO V2 — metadata-engine.js
 * Stock metadata for Adobe Stock, Shutterstock, Pond5
 * Smart keyword generation + quality scoring
 */

const MetadataEngine = {

  // ─── Pattern Display Names ────────────────────────────────
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
  },

  CATEGORIES: {
    adobe: ['Backgrounds/Textures','Abstract','Architecture/Buildings','Arts/Entertainment',
      'Beauty/Fashion','Business/Finance','Education','Food/Drink','Health/Medicine',
      'Holidays','Illustrations/Clip-Art','Industrial','Interiors/Furniture',
      'Miscellaneous','Nature','Objects','Parks/Outdoor','People','Science','Technology',
      'Travel','Vintage','Wildlife'],
    shutterstock: ['Abstract','Backgrounds','Beauty & Fashion','Business & Finance',
      'Celebrities','Culture & Religion','Education','Environment','Food & Drink',
      'Healthcare & Medical','Holidays','Icons & Symbols','Illustration & Painting',
      'Industry','Nature & Wildlife','Objects','People','Sports & Recreation',
      'Technology','Transportation & Vehicles','Vintage'],
    pond5: ['Abstract','Backgrounds & Textures','Business','Design Elements',
      'Fashion','Food & Beverage','Holidays','Icons','Illustrations','Nature',
      'Patterns','Technology','Vintage & Retro'],
  },

  DESIGN_TYPES: ['Digital Artwork','Illustration','Pattern','Background','Textile','Texture','Vector Style'],

  // ─── Generate Metadata ───────────────────────────────────
  generate(state, index) {
    index = Math.max(1, index || 1);
    const type = state.patternType || 'geometric';
    const typeName = this.PATTERN_NAMES[type] || 'Pattern';
    const getColor = (typeof getColorName === 'function') ? getColorName
      : (typeof ColorEngine !== 'undefined' && typeof ColorEngine.getColorName === 'function') ? ColorEngine.getColorName
      : (c => c);
    const colors = state.colors || ['#333333'];
    const colorNames = colors.map(getColor);
    const seed = state.seed || 1;

    const primaryColor = colorNames[0] || 'Multicolor';
    const secondaryColor = colorNames[1] || '';
    const paletteDesc = colorNames.slice(0, 3).join(', ');

    // Style descriptors
    const style = this._inferStyle(type, state);
    const use = this._inferUse(type);

    const title = this._buildTitle(typeName, primaryColor, secondaryColor, style);
    const description = this._buildDescription(typeName, paletteDesc, style, use, seed);
    const keywords = this._buildKeywords(type, typeName, colorNames, style, use, state);
    const filename = this._buildFilename(typeName, primaryColor, secondaryColor, style, index, state.exportFormat || 'png', seed, state.canvasWidth, state.canvasHeight);
    const category = this._inferCategory(type);
    const designType = this._inferDesignType(type);

    // Quality metrics
    const kwCount = keywords.length;
    const duplicates = kwCount - new Set(keywords).size;
    const seoScore = Math.min(100, Math.round(
      (Math.min(kwCount, 50) / 50) * 40 +
      (title.length > 30 && title.length < 120 ? 30 : 15) +
      (description.length > 100 ? 30 : 15)
    ));

    return {
      filename,
      title,
      description,
      keywords: [...new Set(keywords)],
      keywordsString: [...new Set(keywords)].join(', '),
      category,
      designType,
      colorPalette: colorNames.join(' | '),
      patternType: typeName,
      seed: String(seed),
      width: String(state.canvasWidth || 4000),
      height: String(state.canvasHeight || 2663),
      stats: { kwCount, duplicates, seoScore, titleLen: title.length, descLen: description.length },
    };
  },

  _inferStyle(type, state) {
    const luxuryTypes = ['mandala','moroccan','islamic','luxury','wedding'];
    const minimalTypes = ['minimalLine','lineart','stripe','grid'];
    const retroTypes = ['memphis','retro','vintage','doodle'];
    const techTypes = ['technology','futuristic','pixel','isometric'];
    const organicTypes = ['organic','organicFlow','floral','botanical','leaves','marble','wave'];
    const seasonalTypes = ['christmas','halloween','valentine','kids'];

    if (luxuryTypes.includes(type)) return 'Luxury';
    if (minimalTypes.includes(type)) return 'Minimal';
    if (retroTypes.includes(type)) return 'Retro';
    if (techTypes.includes(type)) return 'Modern';
    if (organicTypes.includes(type)) return 'Organic';
    if (seasonalTypes.includes(type)) return 'Festive';
    if (state && state.density > 7) return 'Dense';
    return 'Abstract';
  },

  _inferUse(type) {
    const uses = {
      plaid:'fabric printing,textile design,fashion',
      tartan:'fabric printing,textile design,Scottish style',
      checkered:'surface design,flooring,textile',
      gingham:'picnic,fashion,home decor',
      mandala:'meditation,wall art,yoga',
      moroccan:'interior design,tile design,decor',
      islamic:'architecture,art,textile',
      floral:'fashion,wallpaper,gift wrap',
      botanical:'nature decor,fabric,stationery',
      marble:'luxury backgrounds,interior,branding',
      technology:'tech branding,website background,presentations',
      christmas:'holiday cards,packaging,wrapping paper',
      halloween:'holiday design,costume,party decor',
      wedding:'invitations,decor,stationery',
      valentine:'greeting cards,gifts,packaging',
    };
    return uses[type] || 'backgrounds,wallpaper,graphic design,web design';
  },

  _buildTitle(typeName, primary, secondary, style) {
    if (secondary) {
      return `${style} ${primary} and ${secondary} ${typeName} Seamless Pattern Background`;
    }
    return `${style} ${primary} ${typeName} Seamless Repeat Pattern Background`;
  },

  _buildDescription(typeName, paletteDesc, style, use, seed) {
    return `A professional seamless ${typeName.toLowerCase()} pattern in ${paletteDesc} color palette. ` +
      `This ${style.toLowerCase()} digital design tiles perfectly for ${use}. ` +
      `High-resolution, royalty-free seamless repeat pattern suitable for print and web. Seed: ${seed}.`;
  },

  _buildKeywords(type, typeName, colorNames, style, use, state) {
    const base = [
      typeName.toLowerCase(),
      'seamless pattern',
      'seamless',
      'pattern',
      'background',
      'texture',
      'tile',
      'repeat',
      'digital art',
      'surface design',
      style.toLowerCase(),
      'abstract',
      'decorative',
      'wallpaper',
      'fabric',
      'textile',
      'stock',
      'royalty free',
      'print ready',
      'high resolution',
    ];

    // Color keywords
    colorNames.forEach(c => {
      if (c && c.length > 2) {
        base.push(c.toLowerCase());
        base.push(c.toLowerCase() + ' pattern');
      }
    });

    // Use keywords
    use.split(',').forEach(u => base.push(u.trim()));

    // Type-specific
    const typeKws = {
      plaid: ['plaid pattern','tartan style','Scottish','preppy','buffalo plaid'],
      tartan: ['tartan pattern','Scottish plaid','clan tartan','kilt fabric'],
      checkered: ['checker','checkerboard','chess pattern','grid pattern'],
      mandala: ['mandala art','circle pattern','meditation','boho','spiritual'],
      moroccan: ['moroccan tile','arabesque','geometric arabesque','Moroccan design'],
      islamic: ['Islamic art','geometric Islamic','arabesque','star pattern'],
      herringbone: ['herringbone','chevron weave','tweed','arrow pattern'],
      marble: ['marble texture','stone background','natural marble','luxury marble'],
      floral: ['flower pattern','botanical','bloom','spring pattern','garden'],
      botanical: ['leaves pattern','plant design','nature pattern','botanical art'],
      geometric: ['geometric shapes','modern geometric','abstract geometric'],
      hexagonal: ['honeycomb pattern','hexagon','honeycomb'],
      wave: ['wave pattern','ocean wave','fluid','flowing'],
      christmas: ['Christmas pattern','holiday','festive','xmas','winter holiday'],
      halloween: ['Halloween pattern','spooky','ghost','pumpkin','horror'],
      technology: ['tech pattern','circuit board','digital pattern','cyber'],
      memphis: ['Memphis design','80s pattern','retro geometric','pop art'],
    };

    if (typeKws[type]) base.push(...typeKws[type]);

    // Scale/density modifiers
    if (state) {
      if (state.scale < 30) base.push('small pattern','fine pattern','micro pattern');
      if (state.scale > 70) base.push('large scale','bold pattern','oversized');
      if (state.density > 7) base.push('dense pattern','intricate');
    }

    // Clean and deduplicate
    return [...new Set(base.map(k => k.trim().toLowerCase()).filter(Boolean))].slice(0, 50);
  },

  _buildFilename(typeName, primary, secondary, style, index, format, seed, width, height) {
    if (typeof generateFilename === 'function') {
      return generateFilename(typeName, index, format, seed, width, height);
    }
    const parts = [
      'patternforge',
      typeName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      seed ? `s${seed}` : '',
      (width && height) ? `${width}x${height}` : '',
      String(index).padStart(3, '0'),
    ].filter(Boolean);
    return parts.join('_') + '.' + format.replace('.', '');
  },

  _inferCategory(type) {
    const catMap = {
      plaid:'Backgrounds/Textures',tartan:'Backgrounds/Textures',
      checkered:'Backgrounds/Textures',gingham:'Backgrounds/Textures',
      mandala:'Arts/Entertainment',moroccan:'Arts/Entertainment',
      islamic:'Arts/Entertainment',floral:'Nature',botanical:'Nature',
      leaves:'Nature',marble:'Backgrounds/Textures',
      christmas:'Holidays',halloween:'Holidays',valentine:'Holidays',wedding:'Holidays',
      technology:'Technology',futuristic:'Technology',
      kids:'Illustrations/Clip-Art',memphis:'Abstract',retro:'Vintage',
    };
    return catMap[type] || 'Abstract';
  },

  _inferDesignType(type) {
    const rasterTypes = ['marble','grain','noise'];
    if (rasterTypes.includes(type)) return 'Raster';
    return 'Digital Artwork';
  },

  // ─── CSV Export ──────────────────────────────────────────
  exportCSV(metadataList, platform) {
    if (!metadataList || !metadataList.length) return;
    platform = platform || 'all';

    let headers, getRow;

    if (platform === 'adobe') {
      headers = ['Filename','Title','Description','Keywords','Category','Sub-Category'];
      getRow = m => [m.filename, m.title, m.description, m.keywordsString, m.category, m.designType];
    } else if (platform === 'shutterstock') {
      headers = ['Filename','Description','Keywords','Category'];
      getRow = m => [m.filename, m.title, m.keywordsString, m.category];
    } else if (platform === 'pond5') {
      headers = ['Filename','Title','Description','Tags'];
      getRow = m => [m.filename, m.title, m.description, m.keywordsString];
    } else {
      // All platforms
      headers = ['Filename','Title','Description','Keywords','Category','Design Type',
        'Pattern Type','Colors','Seed','Width','Height'];
      getRow = m => [m.filename, m.title, m.description, m.keywordsString,
        m.category, m.designType, m.patternType, m.colorPalette, m.seed, m.width, m.height];
    }

    const esc = v => `"${(v || '').replace(/"/g, '""')}"`;
    const rows = metadataList.map(m => getRow(m).map(esc).join(','));
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pgpro_${platform}_metadata.csv`;
    a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  },
};

if (typeof window !== 'undefined') window.MetadataEngine = MetadataEngine;
if (typeof module !== 'undefined') module.exports = MetadataEngine;
