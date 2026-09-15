'use strict';
/**
 * PatternForge — export.js
 * PNG / JPG / WebP export, batch generation, CSV metadata
 * Depends on: random.js, pattern-engine.js
 */

// ─── Filename Generator ───────────────────────────────────────────────────────
function generateFilename(patternType, index, format) {
    const idx  = String(Math.max(1, index || 1)).padStart(3, '0');
    const type = ((patternType || 'pattern') + '').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const ext  = (format || 'png').toLowerCase().replace('.', '');
    return `patternforge_${type}_${idx}.${ext}`;
}

// ─── Colour Name Helper ───────────────────────────────────────────────────────
function getColorName(hex) {
    if (!hex) return 'Unknown';
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
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

// ─── Category Helper ──────────────────────────────────────────────────────────
function getCategoryForType(type) {
    const map = {
        plaid:            'Plaid & Tartan',
        tartan:           'Plaid & Tartan',
        checkered:        'Checkered & Gingham',
        gingham:          'Checkered & Gingham',
        grid:             'Geometric Grids',
        stripe:           'Stripes',
        diagonalStripe:   'Stripes',
        crossStripe:      'Stripes',
        multiStripe:      'Stripes',
        woven:            'Woven Textile',
        geometric:        'Geometric',
        squareGrid:       'Geometric Grids',
        herringbone:      'Herringbone',
        interlockingGrid: 'Geometric Grids',
        abstractTextile:  'Abstract Textile',
        minimalLine:      'Minimalist',
        diamond:          'Geometric',
        hexagonal:        'Geometric',
        wave:             'Organic',
        randomGeometric:  'Abstract',
    };
    return map[type] || 'Pattern Background';
}

// ─── SEO Metadata Generator ───────────────────────────────────────────────────
function generateMetadata(settings, index) {
    if (typeof MetadataEngine !== 'undefined' && typeof MetadataEngine.generate === 'function') {
        return MetadataEngine.generate(settings, index);
    }

    const type    = settings.patternType || 'plaid';
    const colors  = settings.colors || ['#0d1b3e', '#e05c00'];
    const seed    = settings.seed || getSeed();
    index = Math.max(1, index || 1);

    const typeNames = {
        plaid:'Plaid',tartan:'Tartan',checkered:'Checkered',gingham:'Gingham',
        grid:'Grid',stripe:'Stripe',diagonalStripe:'Diagonal Stripe',crossStripe:'Cross Stripe',
        woven:'Woven Textile',geometric:'Geometric',squareGrid:'Square Grid',
        multiStripe:'Multi Stripe',herringbone:'Herringbone',interlockingGrid:'Interlocking Grid',
        abstractTextile:'Abstract Textile',minimalLine:'Minimal Line',diamond:'Diamond Pattern',
        hexagonal:'Hexagonal',wave:'Wave',randomGeometric:'Random Geometric',
        mandala:'Mandala',moroccan:'Moroccan',islamic:'Islamic Star',memphis:'Memphis',
        polkaDot:'Polka Dot',chevron:'Chevron',zigzag:'Zigzag',spiral:'Spiral',
        triangle:'Triangle',hexStar:'Hex Star',cross:'Cross',isometric:'Isometric',
        lineart:'Line Art',doodle:'Doodle',retro:'Retro',marble:'Marble',
        gridNoise:'Grid Noise',abstractLine:'Abstract Line',organic:'Organic',
        organicFlow:'Organic Flow',floral:'Floral',botanical:'Botanical',leaves:'Leaves',
        pixel:'Pixel Art',luxury:'Luxury',kids:'Kids Fun',technology:'Technology',
        futuristic:'Futuristic',christmas:'Christmas',halloween:'Halloween',
        wedding:'Wedding',valentine:'Valentine',business:'Business',
    };

    const colorNames  = colors.map(getColorName);
    const typeName    = typeNames[type] || (type.charAt(0).toUpperCase() + type.slice(1));
    const primaryColor    = colorNames[0] || 'Multicolor';
    const secondaryColor  = colorNames[1] || '';

    const title = secondaryColor
        ? `Abstract ${primaryColor} and ${secondaryColor} ${typeName} Seamless Textile Background`
        : `Abstract ${primaryColor} ${typeName} Seamless Textile Background`;

    const description = `A procedurally generated seamless ${typeName.toLowerCase()} pattern background featuring ${colorNames.join(', ')} colors. ` +
        `This original digital textile design is ideal for backgrounds, fabric printing, wallpapers, and graphic design projects. Seed: ${seed}.`;

    const keywords = [
        typeName.toLowerCase(), 'seamless', 'pattern', 'background', 'textile', 'fabric',
        'geometric', 'abstract', 'decorative', 'digital art', 'graphic design', 'wallpaper',
        'repeating pattern', 'vector style', 'printable', 'stock background', 'tile pattern',
        ...colorNames.map(c => c.toLowerCase()),
    ].filter((v, i, a) => v && a.indexOf(v) === i).join(', ');

    const category = getCategoryForType(type);

    return {
        filename:     generateFilename(type, index, settings.exportFormat || 'png'),
        title,
        description,
        keywords,
        category,
        patternType:  typeName,
        colorPalette: colorNames.join(' | '),
        seed:         String(seed),
        width:        String(settings.canvasWidth  || 4000),
        height:       String(settings.canvasHeight || 2663),
    };
}

// ─── Render Full-Resolution Pattern ──────────────────────────────────────────
function renderFullResPattern(settings) {
    const w = Math.max(100, settings.canvasWidth  || 4000);
    const h = Math.max(100, settings.canvasHeight || 2663);

    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Always use the seed from settings for reproducibility
    const rng = createSeededRandom(settings.seed || getSeed());
    PatternEngine.generate(ctx, w, h, settings, rng);
    return canvas;
}

// ─── Single Image Export (Blob / ObjectURL for 8K/4K Reliability) ──────────────
function exportImage(sourceCanvas, format, quality, filename) {
    return new Promise((resolve, reject) => {
        try {
            const mime = format === 'jpg'  ? 'image/jpeg'
                       : format === 'webp' ? 'image/webp'
                       : 'image/png';
            const q = Math.max(0, Math.min(100, quality || 90)) / 100;
            const finalName = filename || `patternforge_export.${format || 'png'}`;

            let exportTarget = sourceCanvas;
            if (format === 'jpg' && typeof document !== 'undefined') {
                try {
                    const flatCanvas = document.createElement('canvas');
                    flatCanvas.width = sourceCanvas.width;
                    flatCanvas.height = sourceCanvas.height;
                    const fCtx = flatCanvas.getContext('2d');
                    if (fCtx) {
                        fCtx.fillStyle = '#ffffff';
                        fCtx.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
                        fCtx.drawImage(sourceCanvas, 0, 0);
                        exportTarget = flatCanvas;
                    }
                } catch (e) {
                    exportTarget = sourceCanvas;
                }
            }

            if (typeof exportTarget.toBlob === 'function') {
                exportTarget.toBlob(blob => {
                    if (!blob) {
                        try {
                            const url = exportTarget.toDataURL(mime, q);
                            triggerDownload(url, finalName);
                            resolve({ url, filename: finalName });
                        } catch (err) {
                            reject(new Error('Export failed: ' + err.message));
                        }
                        return;
                    }
                    const url = URL.createObjectURL(blob);
                    triggerDownload(url, finalName);
                    setTimeout(() => URL.revokeObjectURL(url), 2500);
                    resolve({ url, filename: finalName });
                }, mime, q);
            } else {
                const url = exportTarget.toDataURL(mime, q);
                triggerDownload(url, finalName);
                resolve({ url, filename: finalName });
            }
        } catch (err) {
            reject(new Error('Export failed: ' + err.message));
        }
    });
}

function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ─── Download Current Canvas ──────────────────────────────────────────────────
function downloadCanvas(canvas, settings) {
    const format   = settings.exportFormat  || 'png';
    const quality  = settings.exportQuality || 90;
    const filename = generateFilename(settings.patternType || 'pattern', 1, format);
    return exportImage(canvas, format, quality, filename);
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
function generateCSV(metadataList) {
    if (!metadataList || !metadataList.length) return;

    const headers = [
        'Filename', 'Title', 'Description', 'Keywords', 'Category',
        'Pattern Type', 'Color Palette', 'Seed', 'Width', 'Height',
    ];

    const esc = v => `"${(v || '').toString().replace(/"/g, '""')}"`;

    const rows = metadataList.map(m => [
        m.filename, m.title, m.description,
        Array.isArray(m.keywords) ? m.keywords.join(', ') : m.keywords,
        m.category, m.patternType, m.colorPalette,
        m.seed, m.width, m.height,
    ].map(esc));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'patternforge_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Batch Export ─────────────────────────────────────────────────────────────
async function batchExport(settingsList, onProgress) {
    const metadataList = [];

    for (let i = 0; i < settingsList.length; i++) {
        const s = settingsList[i];
        try {
            const canvas = renderFullResPattern(s);
            const format = s.exportFormat || 'png';
            const quality = Math.max(0, Math.min(100, s.exportQuality || 90));
            const filename = generateFilename(s.patternType, i + 1, format);

            await exportImage(canvas, format, quality, filename);

            const meta = generateMetadata(s, i + 1);
            meta.filename = filename;
            metadataList.push(meta);

            if (typeof onProgress === 'function') onProgress(i + 1, settingsList.length);

            // Stagger downloads to avoid browser rate limiting
            await new Promise(res => setTimeout(res, 180));
        } catch (err) {
            console.error(`Batch export item ${i + 1} failed:`, err);
        }
    }

    return metadataList;
}
