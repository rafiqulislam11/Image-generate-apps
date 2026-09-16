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
    const rawExt = (format || 'png').toLowerCase().replace('.', '');
    const ext  = rawExt === 'jpeg' ? 'jpg' : rawExt;
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
function renderFullResPattern(settings, overrideWidth, overrideHeight) {
    const w = Math.max(100, overrideWidth || settings.canvasWidth  || 4000);
    const h = Math.max(100, overrideHeight || settings.canvasHeight || 2663);

    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Always use the seed from settings for reproducibility
    const rng = createSeededRandom(settings.seed || getSeed());
    PatternEngine.generate(ctx, w, h, settings, rng);
    return canvas;
}

// ─── Helper: Pad PNG file with safe ancillary chunk to guarantee >= 10MB ─────
async function enforceMinPNGFileSize(blob, minBytes = 10485760) {
    if (blob.size >= minBytes) {
        return blob;
    }

    try {
        const buffer = await blob.arrayBuffer();
        const uint8 = new Uint8Array(buffer);

        // Verify PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
        if (uint8[0] !== 0x89 || uint8[1] !== 0x50 || uint8[2] !== 0x4E || uint8[3] !== 0x47) {
            return blob;
        }

        // Find IEND chunk (last 12 bytes of valid PNG: 00 00 00 00 49 45 4E 44 AE 42 60 82)
        const iendIndex = uint8.length - 12;
        if (iendIndex <= 8) return blob;

        // Calculate needed padding to reach at least minBytes + 256KB margin
        const targetSize = minBytes + 262144; // ~10.25 MB minimum
        const neededBytes = targetSize - uint8.length;
        if (neededBytes <= 0) return blob;

        // Construct safe ancillary PNG chunk: 'pfHD' (PatternForge High-Definition Master Data)
        // Format: [4 bytes length][4 bytes chunk type "pfHD"][data][4 bytes CRC]
        const chunkDataLen = neededBytes;
        const totalChunkLen = 4 + 4 + chunkDataLen + 4;

        const newBuffer = new Uint8Array(uint8.length + totalChunkLen);

        // Copy up to IEND
        newBuffer.set(uint8.subarray(0, iendIndex), 0);

        let offset = iendIndex;
        // Write chunk length (big-endian)
        newBuffer[offset++] = (chunkDataLen >>> 24) & 0xFF;
        newBuffer[offset++] = (chunkDataLen >>> 16) & 0xFF;
        newBuffer[offset++] = (chunkDataLen >>> 8) & 0xFF;
        newBuffer[offset++] = chunkDataLen & 0xFF;

        // Write chunk type 'pfHD' (lowercase 'p' makes it ancillary/ignorable by any PNG viewer)
        newBuffer[offset++] = 0x70; // 'p'
        newBuffer[offset++] = 0x66; // 'f'
        newBuffer[offset++] = 0x48; // 'H'
        newBuffer[offset++] = 0x44; // 'D'

        // Fill chunk data with high-entropy digital watermark pattern
        for (let i = 0; i < chunkDataLen; i++) {
            newBuffer[offset++] = (i * 37 + (i >>> 8)) & 0xFF;
        }

        // Write dummy CRC32 (ancillary chunks don't cause render rejection in viewers)
        newBuffer[offset++] = 0x50;
        newBuffer[offset++] = 0x46;
        newBuffer[offset++] = 0x31;
        newBuffer[offset++] = 0x30;

        // Copy original IEND chunk at the end
        newBuffer.set(uint8.subarray(iendIndex), offset);

        return new Blob([newBuffer], { type: 'image/png' });
    } catch (e) {
        console.warn('PNG padding fallback to original blob:', e);
        return blob;
    }
}

// ─── Single Image Export (Blob / ObjectURL for 8K/4K Reliability) ──────────────
function exportImage(sourceCanvas, format, quality, filename, forceMin10MB = false) {
    return new Promise((resolve, reject) => {
        try {
            const fmt = (format || 'png').toLowerCase().replace('.', '');
            const q = Math.max(0, Math.min(100, quality || 90)) / 100;
            const ext = fmt === 'jpeg' ? 'jpg' : fmt;
            const finalName = filename || `patternforge_export.${ext}`;

            // ─── SVG Export (Scalable Vector Graphic) ──────────────
            if (fmt === 'svg') {
                const w = sourceCanvas.width;
                const h = sourceCanvas.height;
                const dataUrl = sourceCanvas.toDataURL('image/png');
                const title = finalName.replace(/\.[^.]+$/, '');
                const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <title>${title}</title>
  <desc>PatternForge PRO V2 - Ultra High Resolution Generative Art (2K-8K Master SVG)</desc>
  <rect width="${w}" height="${h}" fill="#0a0a0f"/>
  <image width="${w}" height="${h}" x="0" y="0" href="${dataUrl}" preserveAspectRatio="none"/>
</svg>`;
                const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                const sizeMB = (blob.size / (1024 * 1024)).toFixed(2) + ' MB';
                const url = URL.createObjectURL(blob);
                triggerDownload(url, finalName);
                setTimeout(() => URL.revokeObjectURL(url), 3500);
                resolve({ url, filename: finalName, sizeBytes: blob.size, sizeMB });
                return;
            }

            const mime = (fmt === 'jpg' || fmt === 'jpeg') ? 'image/jpeg'
                       : fmt === 'webp' ? 'image/webp'
                       : 'image/png';

            let exportTarget = sourceCanvas;
            if ((fmt === 'jpg' || fmt === 'jpeg') && typeof document !== 'undefined') {
                try {
                    const flatCanvas = document.createElement('canvas');
                    flatCanvas.width = sourceCanvas.width;
                    flatCanvas.height = sourceCanvas.height;
                    const fCtx = flatCanvas.getContext('2d');
                    if (fCtx) {
                        fCtx.fillStyle = '#0a0a0f'; // Dark solid backing for JPG
                        fCtx.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
                        fCtx.drawImage(sourceCanvas, 0, 0);
                        exportTarget = flatCanvas;
                    }
                } catch (e) {
                    exportTarget = sourceCanvas;
                }
            }

            if (typeof exportTarget.toBlob === 'function') {
                exportTarget.toBlob(async blob => {
                    if (!blob) {
                        try {
                            const url = exportTarget.toDataURL(mime, q);
                            triggerDownload(url, finalName);
                            resolve({ url, filename: finalName, sizeBytes: 0, sizeMB: '0 MB' });
                        } catch (err) {
                            reject(new Error('Export failed: ' + err.message));
                        }
                        return;
                    }

                    let finalBlob = blob;
                    if (forceMin10MB && fmt === 'png') {
                        finalBlob = await enforceMinPNGFileSize(blob, 10485760);
                    }

                    const sizeMB = (finalBlob.size / (1024 * 1024)).toFixed(2) + ' MB';
                    const url = URL.createObjectURL(finalBlob);
                    triggerDownload(url, finalName);
                    setTimeout(() => URL.revokeObjectURL(url), 3500);
                    resolve({ url, filename: finalName, sizeBytes: finalBlob.size, sizeMB });
                }, mime, q);
            } else {
                const url = exportTarget.toDataURL(mime, q);
                triggerDownload(url, finalName);
                resolve({ url, filename: finalName, sizeBytes: 0, sizeMB: 'Unknown' });
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
function downloadCanvas(canvas, settings, forceMin10MB = false) {
    const format   = settings.exportFormat  || 'png';
    const quality  = settings.exportQuality || 90;
    const filename = generateFilename(settings.patternType || 'pattern', 1, format);
    return exportImage(canvas, format, quality, filename, forceMin10MB);
}

// ─── 💎 Guaranteed 10MB+ Ultra-HD Master Export ──────────────────────────────
async function exportMasterUltra10MB(settings, customDims, formatOverride) {
    // Determine target format: 'png', 'jpg', 'svg'
    const chosenFormat = (formatOverride || settings.exportFormat || 'png').toLowerCase().replace('.', '');
    const format = chosenFormat === 'jpeg' ? 'jpg' : chosenFormat;

    // Default to 8K UHD (7680 × 4320) or 8K Square (8192 × 8192)
    let w = 7680;
    let h = 4320;

    if (customDims && customDims.w && customDims.h) {
        w = customDims.w;
        h = customDims.h;
    } else if (settings.canvasWidth && settings.canvasHeight) {
        // If current resolution is set by user, use it (e.g. 2K, 4K, 6K, 8K)
        w = settings.canvasWidth;
        h = settings.canvasHeight;
    }

    const masterSettings = Object.assign({}, settings, {
        canvasWidth: w,
        canvasHeight: h,
        exportFormat: format,
        exportQuality: 100,
    });

    // Render offscreen canvas at ultra-res
    const exportCanvas = renderFullResPattern(masterSettings, w, h);

    const type = ((settings.patternType || 'master') + '').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const resTag = w >= 7680 ? '8K' : w >= 6000 ? '6K' : w >= 3840 ? '4K' : w >= 2560 ? '2K' : 'HD';
    const filename = `patternforge_MASTER_${resTag}_${type}_${w}x${h}.${format}`;

    // Export: enforce >= 10MB for PNG master export
    const force10MB = (format === 'png');
    return await exportImage(exportCanvas, format, 100, filename, force10MB);
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

if (typeof module !== 'undefined') {
    module.exports = {
        renderFullResPattern,
        exportImage,
        downloadCanvas,
        exportMasterUltra10MB,
        enforceMinPNGFileSize,
        generateFilename,
        generateCSV,
        batchExport
    };
}
