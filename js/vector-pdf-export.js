'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/vector-pdf-export.js
 * True SVG Vector Path Synthesizer & Client-Side Print-Ready PDF Generator
 */

const VectorPdfExport = {
  /**
   * Generates clean vector SVG paths for procedural geometric patterns
   */
  generateVectorSVG(settings, w = 1200, h = 1200) {
    const type = settings.patternType || 'grid';
    const colors = settings.colors || ['#111827', '#3b82f6', '#10b981', '#f59e0b'];
    const scale = Math.max(10, settings.scale || 50);
    const lt = Math.max(0.5, settings.lineThickness || 1.5);
    const op = settings.opacity !== undefined ? settings.opacity : 0.9;

    let svgElements = '';

    // Background rect
    svgElements += `<rect width="${w}" height="${h}" fill="${colors[0] || '#ffffff'}" />\n`;

    switch (type) {
      case 'grid':
      case 'squareGrid': {
        const step = Math.max(15, scale);
        svgElements += `<g stroke="${colors[1] || '#000000'}" stroke-width="${lt}" opacity="${op}">\n`;
        for (let x = 0; x <= w; x += step) {
          svgElements += `  <line x1="${x}" y1="0" x2="${x}" y2="${h}" />\n`;
        }
        for (let y = 0; y <= h; y += step) {
          svgElements += `  <line x1="0" y1="${y}" x2="${w}" y2="${y}" />\n`;
        }
        svgElements += `</g>\n`;
        break;
      }

      case 'stripe': {
        const step = Math.max(20, scale);
        const barW = Math.max(5, step * 0.4);
        svgElements += `<g opacity="${op}">\n`;
        for (let x = 0; x <= w + step; x += step) {
          svgElements += `  <rect x="${x}" y="0" width="${barW}" height="${h}" fill="${colors[1] || '#3b82f6'}" />\n`;
        }
        svgElements += `</g>\n`;
        break;
      }

      case 'diagonalStripe': {
        const step = Math.max(25, scale);
        svgElements += `<g stroke="${colors[1] || '#3b82f6'}" stroke-width="${lt * 4}" opacity="${op}">\n`;
        for (let x = -h; x <= w + h; x += step) {
          svgElements += `  <line x1="${x}" y1="0" x2="${x + h}" y2="${h}" />\n`;
        }
        svgElements += `</g>\n`;
        break;
      }

      case 'plaid':
      case 'tartan': {
        const step = Math.max(30, scale);
        const col1 = colors[1] || '#3b82f6';
        const col2 = colors[2] || '#f59e0b';
        svgElements += `<g opacity="${op * 0.7}">\n`;
        for (let x = 0; x <= w; x += step) {
          svgElements += `  <rect x="${x}" y="0" width="${step * 0.4}" height="${h}" fill="${col1}" />\n`;
        }
        for (let y = 0; y <= h; y += step) {
          svgElements += `  <rect x="0" y="${y}" width="${w}" height="${step * 0.4}" fill="${col2}" />\n`;
        }
        svgElements += `</g>\n`;
        break;
      }

      case 'polkaDot': {
        const step = Math.max(20, scale);
        const radius = Math.max(3, step * 0.22);
        const col = colors[1] || '#3b82f6';
        svgElements += `<g fill="${col}" opacity="${op}">\n`;
        for (let y = step / 2; y <= h; y += step) {
          for (let x = step / 2; x <= w; x += step) {
            svgElements += `  <circle cx="${x}" cy="${y}" r="${radius}" />\n`;
          }
        }
        svgElements += `</g>\n`;
        break;
      }

      case 'triangle': {
        const s = Math.max(25, scale);
        const hTri = s * 0.866;
        svgElements += `<g stroke="${colors[1] || '#3b82f6'}" fill="none" stroke-width="${lt}" opacity="${op}">\n`;
        for (let y = 0; y <= h + s; y += hTri) {
          for (let x = 0; x <= w + s; x += s) {
            svgElements += `  <polygon points="${x},${y + hTri} ${x + s / 2},${y} ${x + s},${y + hTri}" />\n`;
          }
        }
        svgElements += `</g>\n`;
        break;
      }

      case 'mandala':
      case 'spiral':
      case 'goldSpiral': {
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) * 0.45;
        const rays = Math.max(8, Math.round((settings.density || 6) * 3));
        svgElements += `<g stroke="${colors[1] || '#d4af37'}" fill="none" stroke-width="${lt}" opacity="${op}">\n`;
        for (let i = 0; i < rays; i++) {
          const angle = (i * 2 * Math.PI) / rays;
          const x2 = cx + Math.cos(angle) * maxR;
          const y2 = cy + Math.sin(angle) * maxR;
          svgElements += `  <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />\n`;
          svgElements += `  <circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(maxR * 0.15).toFixed(1)}" stroke="${colors[2] || '#f5e6a3'}" />\n`;
        }
        for (let r = 20; r <= maxR; r += 25) {
          svgElements += `  <circle cx="${cx}" cy="${cy}" r="${r}" />\n`;
        }
        svgElements += `</g>\n`;
        break;
      }

      default: {
        // General geometric lines fallback
        const step = Math.max(20, scale);
        svgElements += `<g stroke="${colors[1] || '#3b82f6'}" stroke-width="${lt}" opacity="${op}">\n`;
        for (let i = 0; i <= w + h; i += step) {
          svgElements += `  <line x1="${i}" y1="0" x2="0" y2="${i}" />\n`;
        }
        svgElements += `</g>\n`;
        break;
      }
    }

    const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <title>AI Pattern Studio PRO — ${type}</title>
  <desc>Clean editable vector path output</desc>
${svgElements}</svg>`;

    return svgHeader;
  },

  /**
   * Client-Side Print-Ready PDF Generator (ISO 32000-1)
   * Wraps ultra-high resolution raster canvas stream into a standard print PDF document
   */
  async generatePrintPDF(sourceCanvas, settings, filename = 'pattern_print_ready.pdf') {
    const imgDataUrl = sourceCanvas.toDataURL('image/jpeg', 0.95);
    const rawB64 = imgDataUrl.split(',')[1];
    const binStr = atob(rawB64);
    const imgBytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      imgBytes[i] = binStr.charCodeAt(i);
    }

    const w = sourceCanvas.width;
    const h = sourceCanvas.height;

    // Convert pixels to PDF points (72 points per inch @ 300 PPI)
    const ppi = settings.ppi || 300;
    const ptW = Math.round((w / ppi) * 72);
    const ptH = Math.round((h / ppi) * 72);

    const pdfChunks = [];
    const offsets = [];

    function addChunk(str) {
      offsets.push(pdfChunks.reduce((acc, c) => acc + c.length, 0));
      pdfChunks.push(new TextEncoder().encode(str));
    }

    // PDF Header
    addChunk('%PDF-1.4\n%âãÏÓ\n');

    // Obj 1: Catalog
    addChunk('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    // Obj 2: Pages
    addChunk('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

    // Obj 3: Page
    addChunk(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptW} ${ptH}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`);

    // Obj 4: Contents Stream
    const contentStream = `q\n${ptW} 0 0 ${ptH} 0 0 cm\n/Im1 Do\nQ\n`;
    addChunk(`4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`);

    // Obj 5: Image XObject
    offsets.push(pdfChunks.reduce((acc, c) => acc + c.length, 0));
    const imgHeader = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`;
    const imgFooter = '\nendstream\nendobj\n';
    
    pdfChunks.push(new TextEncoder().encode(imgHeader));
    pdfChunks.push(imgBytes);
    pdfChunks.push(new TextEncoder().encode(imgFooter));

    // Cross reference table
    const xrefOffset = pdfChunks.reduce((acc, c) => acc + c.length, 0);
    let xref = `xref\n0 6\n0000000000 65535 f \n`;
    for (let i = 1; i <= 5; i++) {
      xref += String(offsets[i - 1]).padStart(10, '0') + ' 00000 n \n';
    }
    xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    pdfChunks.push(new TextEncoder().encode(xref));

    const totalLen = pdfChunks.reduce((acc, c) => acc + c.length, 0);
    const finalPdf = new Uint8Array(totalLen);
    let curOffset = 0;
    for (const chunk of pdfChunks) {
      finalPdf.set(chunk, curOffset);
      curOffset += chunk.length;
    }

    const blob = new Blob([finalPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);

    return { filename, sizeBytes: blob.size, url };
  }
};

if (typeof window !== 'undefined') {
  window.VectorPdfExport = VectorPdfExport;
}
if (typeof module !== 'undefined') {
  module.exports = VectorPdfExport;
}
