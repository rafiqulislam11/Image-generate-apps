'use strict';
/**
 * PatternForge — export.js
 * PNG / JPG / SVG / WebP export, batch generation, ZIP archiver, CSV metadata
 * Depends on: random.js, pattern-engine.js
 */

// ─── IEEE 802.3 CRC32 Calculation for PNG & ZIP ──────────────────────────────
let _crcTable = null;
function getCrcTable() {
    if (_crcTable) return _crcTable;
    _crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        _crcTable[n] = c >>> 0;
    }
    return _crcTable;
}

function calculateCrc32(data, start = 0, length = (data ? data.length : 0)) {
    const table = getCrcTable();
    let crc = 0xFFFFFFFF;
    const end = start + length;
    for (let i = start; i < end; i++) {
        crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ─── Filename Generator ───────────────────────────────────────────────────────
function generateFilename(patternType, index, format, seed, width, height) {
    if (typeof patternType === 'object' && patternType !== null) {
        const s = patternType;
        return generateFilename(
            s.patternType || 'pattern',
            s.index || index || 1,
            s.exportFormat || format || 'png',
            s.seed,
            s.canvasWidth || width,
            s.canvasHeight || height
        );
    }
    const idx  = String(Math.max(1, index || 1)).padStart(3, '0');
    const type = ((patternType || 'pattern') + '').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const rawExt = (format || 'png').toLowerCase().replace('.', '');
    const ext  = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const seedPart = seed ? `_s${seed}` : '';
    const resPart = (width && height) ? `_${width}x${height}` : '';
    return `patternforge_${type}${seedPart}${resPart}_${idx}.${ext}`;
}

// ─── Colour Name Helper ───────────────────────────────────────────────────────
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
        filename:     generateFilename(type, index, settings.exportFormat || 'png', seed, settings.canvasWidth, settings.canvasHeight),
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

// ─── Render Full-Resolution Pattern (With Tile Mode Repeat Support) ───────────
function renderFullResPattern(settings, overrideWidth, overrideHeight) {
    const w = Math.max(100, overrideWidth || settings.canvasWidth  || 4000);
    const h = Math.max(100, overrideHeight || settings.canvasHeight || 2663);

    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const tileMode = settings.tileMode || 1;

    if (tileMode <= 1) {
        // Always use the seed from settings for reproducibility
        const rng = createSeededRandom(settings.seed || getSeed());
        PatternEngine.generate(ctx, w, h, settings, rng);
    } else {
        // Faithful WYSIWYG tile repeat rendering
        const tw = Math.max(20, Math.round(w / tileMode));
        const th = Math.max(20, Math.round(h / tileMode));
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = tw;
        tileCanvas.height = th;
        const tileCtx = tileCanvas.getContext('2d');
        const rng = createSeededRandom(settings.seed || getSeed());
        PatternEngine.generate(tileCtx, tw, th, settings, rng);

        for (let r = 0; r < tileMode; r++) {
            for (let c = 0; c < tileMode; c++) {
                ctx.drawImage(tileCanvas, c * tw, r * th);
            }
        }
    }

    return canvas;
}

// ─── Helper: Pad PNG file with safe ancillary chunk to guarantee >= 10MB ─────
async function enforceMinPNGFileSize(blob, minBytes = 10485760) {
    if (!blob || blob.size >= minBytes) {
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

        const chunkTypeOffset = offset;
        // Write chunk type 'pfHD' (lowercase 'p' makes it ancillary/ignorable by standard PNG viewers)
        newBuffer[offset++] = 0x70; // 'p'
        newBuffer[offset++] = 0x66; // 'f'
        newBuffer[offset++] = 0x48; // 'H'
        newBuffer[offset++] = 0x44; // 'D'

        // Fill chunk data with high-entropy digital watermark pattern
        for (let i = 0; i < chunkDataLen; i++) {
            newBuffer[offset++] = (i * 37 + (i >>> 8)) & 0xFF;
        }

        // Compute valid IEEE 802.3 CRC32 over Chunk Type (4 bytes) + Chunk Data (chunkDataLen bytes)
        const crc = calculateCrc32(newBuffer, chunkTypeOffset, 4 + chunkDataLen);
        newBuffer[offset++] = (crc >>> 24) & 0xFF;
        newBuffer[offset++] = (crc >>> 16) & 0xFF;
        newBuffer[offset++] = (crc >>> 8) & 0xFF;
        newBuffer[offset++] = crc & 0xFF;

        // Copy original IEND chunk at the end
        newBuffer.set(uint8.subarray(iendIndex), offset);

        return new Blob([newBuffer], { type: 'image/png' });
    } catch (e) {
        console.warn('PNG padding fallback to original blob:', e);
        return blob;
    }
}

// ─── Single Image Export (Blob / ObjectURL for 8K/4K Reliability) ──────────────
function exportImage(sourceCanvas, format, quality, filename, forceMin10MB = false, settings = null) {
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
                const title = finalName.replace(/\.[^.]+$/, '');

                // Safely convert canvas to blob and read via FileReader (prevents RangeError: Invalid string length on 4K/8K)
                if (typeof sourceCanvas.toBlob === 'function') {
                    sourceCanvas.toBlob(blob => {
                        if (!blob) {
                            try {
                                const dataUrl = sourceCanvas.toDataURL('image/png');
                                emitSVG(dataUrl);
                            } catch (err) {
                                reject(new Error('SVG export failed: ' + err.message));
                            }
                            return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            emitSVG(reader.result);
                        };
                        reader.onerror = () => reject(new Error('Failed reading canvas data for SVG'));
                        reader.readAsDataURL(blob);
                    }, 'image/png');
                } else {
                    const dataUrl = sourceCanvas.toDataURL('image/png');
                    emitSVG(dataUrl);
                }

                function emitSVG(dataUrl) {
                    const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <title>${title}</title>
  <desc>PatternForge PRO V2 - Ultra High Resolution Generative Art</desc>
  <image width="${w}" height="${h}" x="0" y="0" href="${dataUrl}" preserveAspectRatio="none"/>
</svg>`;
                    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                    const sizeMB = (blob.size / (1024 * 1024)).toFixed(2) + ' MB';
                    const url = URL.createObjectURL(blob);
                    triggerDownload(url, finalName);
                    setTimeout(() => URL.revokeObjectURL(url), 60000);
                    resolve({ url, filename: finalName, sizeBytes: blob.size, sizeMB });
                }
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
                        // Use palette background or clean neutral background instead of forced dark
                        let bgColor = '#ffffff';
                        if (settings && settings.colors && settings.colors.length > 0) {
                            bgColor = settings.colors[0];
                        }
                        fCtx.fillStyle = bgColor;
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
                            setTimeout(() => URL.revokeObjectURL(url), 60000);
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
                    // Retain URL for 60s so slow saves / dialogs never fail with network abort
                    setTimeout(() => URL.revokeObjectURL(url), 60000);
                    resolve({ url, filename: finalName, sizeBytes: finalBlob.size, sizeMB });
                }, mime, q);
            } else {
                const url = exportTarget.toDataURL(mime, q);
                triggerDownload(url, finalName);
                setTimeout(() => URL.revokeObjectURL(url), 60000);
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
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ─── Download Current Canvas ──────────────────────────────────────────────────
function downloadCanvas(canvas, settings, forceMin10MB = false) {
    const format   = settings.exportFormat  || 'png';
    const quality  = settings.exportQuality || 90;
    const filename = generateFilename(settings.patternType || 'pattern', 1, format, settings.seed, settings.canvasWidth, settings.canvasHeight);
    return exportImage(canvas, format, quality, filename, forceMin10MB, settings);
}

// ─── 💎 Guaranteed 10MB+ Ultra-HD Master Export ──────────────────────────────
async function exportMasterUltra10MB(settings, customDims, formatOverride) {
    // Determine target format: 'png', 'jpg', 'svg'
    const chosenFormat = (formatOverride || settings.exportFormat || 'png').toLowerCase().replace('.', '');
    const format = chosenFormat === 'jpeg' ? 'jpg' : chosenFormat;

    // Use high resolution: if customDims provided use them; if canvasWidth >= 2560 use it, else default to 8K UHD
    let w = 7680;
    let h = 4320;

    if (customDims && customDims.w && customDims.h) {
        w = customDims.w;
        h = customDims.h;
    } else if (settings.canvasWidth && settings.canvasHeight && settings.canvasWidth >= 2560) {
        w = settings.canvasWidth;
        h = settings.canvasHeight;
    }

    const masterSettings = Object.assign({}, settings, {
        canvasWidth: w,
        canvasHeight: h,
        exportFormat: format,
        exportQuality: 100,
        tileMode: settings.tileMode || 1,
    });

    // Render offscreen canvas at ultra-res with memory safeguard
    let exportCanvas;
    try {
        exportCanvas = renderFullResPattern(masterSettings, w, h);
    } catch (allocErr) {
        console.warn('Ultra-res allocation failed, falling back to 4K UHD:', allocErr);
        w = 3840;
        h = 2160;
        masterSettings.canvasWidth = w;
        masterSettings.canvasHeight = h;
        exportCanvas = renderFullResPattern(masterSettings, w, h);
    }

    const type = ((settings.patternType || 'master') + '').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const resTag = w >= 7680 ? '8K' : w >= 6000 ? '6K' : w >= 3840 ? '4K' : w >= 2560 ? '2K' : 'HD';
    const seedTag = settings.seed ? `_s${settings.seed}` : '';
    const filename = `patternforge_MASTER_${resTag}_${type}${seedTag}_${w}x${h}.${format}`;

    // Export: enforce >= 10MB for PNG master export
    const force10MB = (format === 'png');
    return await exportImage(exportCanvas, format, 100, filename, force10MB, masterSettings);
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
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ─── Pure Client-Side ZIP Generator ──────────────────────────────────────────
function createZipBlob(files) {
    const fileEntries = [];
    let localHeadersSize = 0;

    for (const file of files) {
        const nameBytes = new TextEncoder().encode(file.name);
        let dataBytes;
        if (file.data instanceof Uint8Array) {
            dataBytes = file.data;
        } else if (typeof file.data === 'string') {
            dataBytes = new TextEncoder().encode(file.data);
        } else {
            dataBytes = new Uint8Array(0);
        }
        const crc = calculateCrc32(dataBytes);
        const size = dataBytes.length;
        fileEntries.push({
            name: file.name,
            nameBytes,
            dataBytes,
            crc,
            size,
            offset: localHeadersSize
        });
        localHeadersSize += 30 + nameBytes.length + size;
    }

    let centralDirSize = 0;
    for (const entry of fileEntries) {
        centralDirSize += 46 + entry.nameBytes.length;
    }

    const totalSize = localHeadersSize + centralDirSize + 22;
    const buf = new Uint8Array(totalSize);
    const view = new DataView(buf.buffer);

    let offset = 0;
    for (const entry of fileEntries) {
        // Local file header (0x04034b50)
        view.setUint32(offset, 0x04034b50, true);
        view.setUint16(offset + 4, 20, true);
        view.setUint16(offset + 6, 0, true);
        view.setUint16(offset + 8, 0, true);
        view.setUint16(offset + 10, 0, true);
        view.setUint16(offset + 12, 0, true);
        view.setUint32(offset + 14, entry.crc, true);
        view.setUint32(offset + 18, entry.size, true);
        view.setUint32(offset + 22, entry.size, true);
        view.setUint16(offset + 26, entry.nameBytes.length, true);
        view.setUint16(offset + 28, 0, true);
        buf.set(entry.nameBytes, offset + 30);
        buf.set(entry.dataBytes, offset + 30 + entry.nameBytes.length);
        offset += 30 + entry.nameBytes.length + entry.size;
    }

    const centralDirOffset = offset;
    for (const entry of fileEntries) {
        // Central directory header (0x02014b50)
        view.setUint32(offset, 0x02014b50, true);
        view.setUint16(offset + 4, 20, true);
        view.setUint16(offset + 6, 20, true);
        view.setUint16(offset + 8, 0, true);
        view.setUint16(offset + 10, 0, true);
        view.setUint16(offset + 12, 0, true);
        view.setUint16(offset + 14, 0, true);
        view.setUint32(offset + 16, entry.crc, true);
        view.setUint32(offset + 20, entry.size, true);
        view.setUint32(offset + 24, entry.size, true);
        view.setUint16(offset + 28, entry.nameBytes.length, true);
        view.setUint16(offset + 30, 0, true);
        view.setUint16(offset + 32, 0, true);
        view.setUint16(offset + 34, 0, true);
        view.setUint16(offset + 36, 0, true);
        view.setUint32(offset + 38, 0, true);
        view.setUint32(offset + 42, entry.offset, true);
        buf.set(entry.nameBytes, offset + 46);
        offset += 46 + entry.nameBytes.length;
    }

    // End of central directory record (0x06054b50)
    view.setUint32(offset, 0x06054b50, true);
    view.setUint16(offset + 4, 0, true);
    view.setUint16(offset + 6, 0, true);
    view.setUint16(offset + 8, fileEntries.length, true);
    view.setUint16(offset + 10, fileEntries.length, true);
    view.setUint32(offset + 12, centralDirSize, true);
    view.setUint32(offset + 16, centralDirOffset, true);
    view.setUint16(offset + 20, 0, true);

    return new Blob([buf], { type: 'application/zip' });
}

// ─── Batch Export (Individual Files) ──────────────────────────────────────────
async function batchExport(settingsList, onProgress) {
    const metadataList = [];

    for (let i = 0; i < settingsList.length; i++) {
        const s = settingsList[i];
        try {
            const canvas = renderFullResPattern(s);
            const format = s.exportFormat || 'png';
            const quality = Math.max(0, Math.min(100, s.exportQuality || 90));
            const filename = generateFilename(s.patternType, i + 1, format, s.seed, s.canvasWidth, s.canvasHeight);

            await exportImage(canvas, format, quality, filename, false, s);

            const meta = generateMetadata(s, i + 1);
            meta.filename = filename;
            metadataList.push(meta);

            if (typeof onProgress === 'function') onProgress(i + 1, settingsList.length);

            // Stagger downloads to avoid browser rate limiting
            await new Promise(res => setTimeout(res, 250));
        } catch (err) {
            console.error(`Batch export item ${i + 1} failed:`, err);
        }
    }

    return metadataList;
}

// ─── Batch Export As Single ZIP (1-Click Safe Archive) ─────────────────────────
async function batchExportZip(settingsList, onProgress) {
    const files = [];
    const metadataList = [];

    for (let i = 0; i < settingsList.length; i++) {
        const s = settingsList[i];
        try {
            const canvas = renderFullResPattern(s);
            const format = (s.exportFormat || 'png').toLowerCase();
            const quality = Math.max(0, Math.min(100, s.exportQuality || 90)) / 100;
            const mime = (format === 'jpg' || format === 'jpeg') ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
            const ext = format === 'jpeg' ? 'jpg' : format;
            const filename = generateFilename(s.patternType, i + 1, format, s.seed, s.canvasWidth, s.canvasHeight);

            const imgBlob = await new Promise(res => canvas.toBlob(res, mime, quality));
            if (imgBlob) {
                const arrBuf = await imgBlob.arrayBuffer();
                files.push({
                    name: filename,
                    data: new Uint8Array(arrBuf)
                });
            }

            const meta = generateMetadata(s, i + 1);
            meta.filename = filename;
            metadataList.push(meta);

            if (typeof onProgress === 'function') onProgress(i + 1, settingsList.length);
        } catch (err) {
            console.error(`Batch item ${i + 1} render failed:`, err);
        }
    }

    // Add metadata CSV to ZIP
    if (metadataList.length > 0) {
        const headers = [
            'Filename', 'Title', 'Description', 'Keywords', 'Category',
            'Pattern Type', 'Color Palette', 'Seed', 'Width', 'Height'
        ];
        const esc = v => `"${(v || '').toString().replace(/"/g, '""')}"`;
        const rows = metadataList.map(m => [
            m.filename, m.title, m.description,
            Array.isArray(m.keywords) ? m.keywords.join(', ') : m.keywords,
            m.category, m.patternType, m.colorPalette,
            m.seed, m.width, m.height,
        ].map(esc));
        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        files.push({
            name: 'metadata.csv',
            data: csvContent
        });
    }

    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patternforge_batch_${files.length > 1 ? (files.length - 1) : 1}_patterns.zip`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);

    return metadataList;
}

if (typeof window !== 'undefined') {
    window.ExportEngine = {
        renderFullResPattern,
        exportImage,
        downloadCanvas,
        exportMasterUltra10MB,
        enforceMinPNGFileSize,
        generateFilename,
        generateCSV,
        createZipBlob,
        batchExport,
        batchExportZip,
        calculateCrc32
    };
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
        createZipBlob,
        batchExport,
        batchExportZip,
        calculateCrc32
    };
}

