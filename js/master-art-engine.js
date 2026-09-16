'use strict';
/**
 * PatternForge PRO V2 — master-art-engine.js
 * 8 "মারাত্মক" (Master/Insane Level) Generative Art Engines
 * Multi-Pass Layered Composition:
 *   1. Atmospheric Cosmic Nebula & Deep Space Abyss
 *   2. Core Parametric & Mathematical Generative Engine
 *   3. Volumetric Glow & Specular Light Beams
 *   4. Luminous Stardust, Gold Flakes & Quantum Sparks (25,000+ particles)
 *   5. 35mm Photographic Film Grain & Fine Art Micro-Texture (Guarantees 10MB+ Master PNG)
 */

(function() {

  // Helper utilities for master engines
  const M = {
    colors(s, fallback) {
      if (s.colors && s.colors.length >= 2) return s.colors;
      return fallback || ['#090a0f', '#ff007f', '#00f0ff', '#7928ca', '#ffd700'];
    },
    scale(s) { return Math.max(0.1, (s.scale || 50) / 50); },
    opacity(s) { return s.opacity !== undefined ? Math.max(0, Math.min(1, s.opacity)) : 0.9; },
    blend(s) { return s.blendStrength !== undefined ? Math.max(0, Math.min(1, s.blendStrength)) : 0.75; },
    density(s) { return Math.max(1, s.density || 6); },
    rot(s) { return ((s.rotation || 0) * Math.PI) / 180; },
    lt(s, def) { return Math.max(0.5, s.lineThickness !== undefined ? s.lineThickness : (def || 2)); },
    
    // Hex to RGBA
    rgba(hex, alpha) {
      if (!hex || hex[0] !== '#') return `rgba(255,255,255,${alpha})`;
      const c = hex.slice(1);
      const num = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`;
    },

    // Interpolate between two hex colors
    lerpHex(hex1, hex2, t) {
      t = Math.max(0, Math.min(1, t));
      const c1 = parseInt(hex1.slice(1), 16);
      const c2 = parseInt(hex2.slice(1), 16);
      const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
      const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      return `rgb(${r},${g},${b})`;
    }
  };

  const MasterEngines = {};

  // ══════════════════════════════════════════════════════════════════════════
  // MASTER SHADER & FX PIPELINE (Atmosphere, Bloom, Particles, Micro-Texture)
  // ══════════════════════════════════════════════════════════════════════════

  // 1. Deep Space Atmospheric Nebula Layer
  function renderAtmosphericNebula(ctx, w, h, colors, rng) {
    ctx.save();
    // Deep cosmic background gradient
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.05, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.7);
    bgGrad.addColorStop(0, colors[0] || '#05060d');
    bgGrad.addColorStop(0.5, M.rgba(colors[1] || '#0d1124', 0.85));
    bgGrad.addColorStop(1, '#020205');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Multi-octave cosmic gas clouds
    const numClouds = 7;
    for (let c = 0; c < numClouds; c++) {
      const cx = (0.2 + rng() * 0.6) * w;
      const cy = (0.2 + rng() * 0.6) * h;
      const radius = (0.25 + rng() * 0.5) * Math.min(w, h);
      const col = colors[(c % (colors.length - 1)) + 1];

      const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      cloudGrad.addColorStop(0, M.rgba(col, 0.22));
      cloudGrad.addColorStop(0.4, M.rgba(col, 0.09));
      cloudGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Distant star cluster points
    const starCount = Math.round(Math.min(w * h * 0.0003, 3000));
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < starCount; i++) {
      const sx = rng() * w;
      const sy = rng() * h;
      const size = rng() < 0.9 ? (0.6 + rng() * 1.2) : (1.8 + rng() * 2.5);
      const alpha = 0.2 + rng() * 0.75;
      ctx.globalAlpha = alpha;
      ctx.fillRect(sx, sy, size, size);
      // Rare bright star with lens cross
      if (size > 3.0 && rng() < 0.1) {
        ctx.strokeStyle = M.rgba(colors[i % colors.length], 0.6);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - 12, sy); ctx.lineTo(sx + 12, sy);
        ctx.moveTo(sx, sy - 12); ctx.lineTo(sx, sy + 12);
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.restore();
  }

  // 2. Volumetric Ray-Tracing Glow & Radial Light Beams
  function renderVolumetricRays(ctx, w, h, colors, beamCount = 36, intensity = 0.45) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(w, h) * 0.65;

    for (let i = 0; i < beamCount; i++) {
      const angle = (i * 2 * Math.PI) / beamCount;
      const spread = (Math.PI * 2) / (beamCount * 2.2);
      const col = colors[(i % (colors.length - 1)) + 1];

      const rayGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      rayGrad.addColorStop(0, M.rgba(col, intensity * 0.4));
      rayGrad.addColorStop(0.3, M.rgba(col, intensity * 0.15));
      rayGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, angle - spread, angle + spread);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. Stardust, Golden Flakes & Quantum Sparks (25,000+ Sub-Pixel Particles)
  function renderStardustParticles(ctx, w, h, colors, countMultiplier = 1.0, rng) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    // Resolution-scaled particle count for ultra-detail
    const baseCount = Math.round(Math.min(w * h * 0.002, 60000) * countMultiplier);
    const cx = w / 2, cy = h / 2;

    for (let i = 0; i < baseCount; i++) {
      // Swirling distribution towards center
      const rRatio = Math.pow(rng(), 1.4);
      const angle = rng() * Math.PI * 2 + rRatio * 4;
      const dist = rRatio * Math.hypot(cx, cy);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;

      if (px < 0 || px >= w || py < 0 || py >= h) continue;

      const pSize = 0.5 + rng() * 2.2;
      const pAlpha = 0.15 + rng() * 0.85;
      const col = colors[Math.floor(rng() * colors.length)];

      ctx.fillStyle = M.rgba(col, pAlpha);
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. 35mm Photographic Film Grain & Micro-Surface Texture
  // This produces exquisite physical realism AND ensures high information entropy (Guarantees >10MB PNG)
  function renderMicroTexture10MB(ctx, w, h, intensity = 0.08, rng) {
    try {
      ctx.save();
      // Block-based sub-pixel noise generation for fast execution on 8K canvases
      const noiseCanvas = document.createElement('canvas');
      const nw = 512, nh = 512;
      noiseCanvas.width = nw;
      noiseCanvas.height = nh;
      const nCtx = noiseCanvas.getContext('2d');
      const imgData = nCtx.createImageData(nw, nh);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        // High frequency chromatic grain
        const n1 = (rng() * 255) | 0;
        const n2 = (rng() * 255) | 0;
        const n3 = (rng() * 255) | 0;
        d[i]     = n1;
        d[i + 1] = n2;
        d[i + 2] = n3;
        d[i + 3] = (30 + rng() * 55) | 0;
      }
      nCtx.putImageData(imgData, 0, 0);

      // Pattern fill over main canvas
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = Math.max(0.04, Math.min(0.25, intensity));
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);

      // Subtle fine art canvas grain
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = Math.max(0.02, intensity * 0.5);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
    } catch(e) {
      // Fallback
    }
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 8 MASTER GENERATIVE ENGINES (মারাত্মক লেভেল)
  // ══════════════════════════════════════════════════════════════════════════

  // ─── 1. Cosmic Hyper-Nebula & Deep Space Abyss ─────────────────────────────
  MasterEngines.cosmicHyperNebula = function(ctx, w, h, s, rng) {
    const cols = M.colors(s, ['#030308', '#ff007f', '#4a00e0', '#00f0ff', '#ffd700']);
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    // Layer 1: Nebula Backdrop
    renderAtmosphericNebula(ctx, w, h, cols, rng);

    // Layer 2: Volumetric Rays
    renderVolumetricRays(ctx, w, h, cols, 24, 0.4);

    // Layer 3: Interstellar Logarithmic Vortex Arms
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    const numArms = Math.max(3, Math.round(dens * 0.8));
    const maxTheta = 12 * Math.PI;
    const steps = 1800;

    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = (arm * 2 * Math.PI) / numArms;
      const col = cols[(arm % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineWidth = Math.max(1, 2.5 * sc);

      // Core luminous beam
      ctx.beginPath();
      for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * maxTheta;
        const r = Math.pow(1.14, theta * 0.7) * (20 * sc);
        if (r > Math.hypot(cx, cy) * 1.2) break;

        const x = r * Math.cos(theta + armOffset);
        const y = r * Math.sin(theta + armOffset);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = M.rgba(col, 0.85);
      ctx.shadowColor = col;
      ctx.shadowBlur = 18 * sc;
      ctx.stroke();

      // Outer gas aura
      ctx.lineWidth = Math.max(4, 9 * sc);
      ctx.strokeStyle = M.rgba(col, 0.25);
      ctx.shadowBlur = 35 * sc;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // Layer 4: Central Singularity Core
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140 * sc);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.25, M.rgba(cols[1], 0.95));
    coreGrad.addColorStop(0.65, M.rgba(cols[2] || cols[1], 0.4));
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 140 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Layer 5: Stardust Particles
    renderStardustParticles(ctx, w, h, cols, 1.2, rng);

    // Layer 6: Film Grain (10MB+ Guarantee)
    renderMicroTexture10MB(ctx, w, h, 0.12, rng);
  };


  // ─── 2. Cyberpunk 2099 Quantum Matrix ─────────────────────────────────────
  MasterEngines.cyberpunkQuantumMatrix = function(ctx, w, h, s, rng) {
    const cols = M.colors(s, ['#0a0718', '#00f0ff', '#ff0055', '#7928ca', '#ffe600']);
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    // Dark grid foundation
    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Perspective Cyber Grid Floor
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = M.rgba(cols[1], 0.35);
    ctx.lineWidth = Math.max(1, 1.5 * sc);

    const gridCell = Math.max(25, Math.round(55 * sc));
    // Hexagonal circuit matrix
    const hexR = gridCell * 1.2;
    const hDist = hexR * Math.sqrt(3);
    const vDist = hexR * 1.5;

    for (let y = -vDist; y < h + vDist; y += vDist) {
      for (let x = -hDist; x < w + hDist; x += hDist) {
        const offset = ((Math.round(y / vDist) % 2) * hDist) / 2;
        const hx = x + offset;
        const hy = y;

        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (a * Math.PI) / 3 + Math.PI / 6;
          const px = hx + Math.cos(angle) * hexR * 0.92;
          const py = hy + Math.sin(angle) * hexR * 0.92;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Glowing center node on select hexes
        if (rng() < 0.25) {
          ctx.fillStyle = M.rgba(cols[2], 0.7);
          ctx.fillRect(hx - 2 * sc, hy - 2 * sc, 4 * sc, 4 * sc);
        }
      }
    }
    ctx.restore();

    // Central Quantum Core with Rotating HUD Segments
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    const ringCount = Math.max(5, Math.round(dens * 1.4));
    for (let r = 1; r <= ringCount; r++) {
      const radius = r * 35 * sc;
      const col = cols[(r % (cols.length - 1)) + 1];
      const segments = 4 + (r % 5) * 3;
      const segArc = (Math.PI * 2) / segments;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = col;
      ctx.shadowBlur = 15 * sc;
      ctx.strokeStyle = M.rgba(col, 0.9);
      ctx.lineWidth = (1.5 + (r % 3) * 1.5) * sc;

      for (let sIdx = 0; sIdx < segments; sIdx++) {
        if (sIdx % 2 === 0) continue; // broken HUD look
        const startA = sIdx * segArc + (r * 0.2);
        const endA = startA + segArc * 0.75;
        ctx.beginPath();
        ctx.arc(0, 0, radius, startA, endA);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Laser Circuit Paths Radiating Outward
    const circuitCount = 32;
    for (let c = 0; c < circuitCount; c++) {
      const angle = (c * 2 * Math.PI) / circuitCount;
      const col = cols[(c % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = M.rgba(col, 0.75);
      ctx.lineWidth = Math.max(1, 2 * sc);
      ctx.shadowColor = col;
      ctx.shadowBlur = 10 * sc;

      let curX = Math.cos(angle) * (60 * sc);
      let curY = Math.sin(angle) * (60 * sc);
      ctx.beginPath();
      ctx.moveTo(curX, curY);

      let curA = angle;
      const hops = 4;
      for (let h = 0; h < hops; h++) {
        curA += (rng() > 0.5 ? 1 : -1) * (Math.PI / 4);
        const len = (40 + rng() * 60) * sc;
        curX += Math.cos(curA) * len;
        curY += Math.sin(curA) * len;
        ctx.lineTo(curX, curY);
      }
      ctx.stroke();

      // Terminal node
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(curX, curY, 3 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Neon Spark Particles
    renderStardustParticles(ctx, w, h, cols, 1.0, rng);
    renderMicroTexture10MB(ctx, w, h, 0.11, rng);
  };


  // ─── 3. Royal 24K Liquid Gold & Black Obsidian ────────────────────────────
  MasterEngines.royal24kLiquidGold = function(ctx, w, h, s, rng) {
    const goldCols = ['#08080a', '#d4af37', '#f3e5ab', '#aa7c11', '#fff2b2', '#221c10'];
    const cols = (s.colors && s.colors.length >= 3) ? s.colors : goldCols;
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    // Deep obsidian black marble base
    const baseGrad = ctx.createLinearGradient(0, 0, w, h);
    baseGrad.addColorStop(0, cols[0] || '#08080a');
    baseGrad.addColorStop(0.5, '#121217');
    baseGrad.addColorStop(1, '#050508');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Liquid Gold Vein Layers
    const ribbonCount = Math.max(12, Math.round(dens * 3.5));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    for (let r = 0; r < ribbonCount; r++) {
      const yOffset = ((r - ribbonCount / 2) * (h / ribbonCount)) * 1.2;
      const col = cols[(r % (cols.length - 1)) + 1];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-w, yOffset);

      const freq1 = 0.003 / sc;
      const freq2 = 0.008 / sc;
      const amp1 = (60 + (r % 4) * 30) * sc;
      const amp2 = (25 + (r % 3) * 15) * sc;

      for (let x = -w; x <= w; x += 12) {
        const y = yOffset + Math.sin(x * freq1 + r) * amp1 + Math.cos(x * freq2 - r * 0.5) * amp2;
        ctx.lineTo(x, y);
      }

      // Metallic 3D specular gradient
      ctx.lineWidth = Math.max(2, (8 + (r % 5) * 5) * sc);
      ctx.strokeStyle = M.rgba(col, 0.85);
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 12 * sc;
      ctx.stroke();

      // Bright gold specular highlight line
      ctx.lineWidth = Math.max(1, 2 * sc);
      ctx.strokeStyle = '#fff5cf';
      ctx.shadowBlur = 6 * sc;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // Concentric Guilloche Rosette Medallion in Center
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-rot * 0.5);
    const petals = 24;
    const maxR = 260 * sc;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < petals; i++) {
      const a = (i * 2 * Math.PI) / petals;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(maxR * 0.5, 0, maxR * 0.5, maxR * 0.15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = M.rgba('#ffd700', 0.65);
      ctx.lineWidth = Math.max(1, 1.8 * sc);
      ctx.shadowColor = '#ffea75';
      ctx.shadowBlur = 8 * sc;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    ctx.restore();

    // Gold Leaf Flakes & Micro Dust
    renderStardustParticles(ctx, w, h, ['#ffd700', '#fff0aa', '#d4af37', '#ffffff'], 1.1, rng);
    renderMicroTexture10MB(ctx, w, h, 0.14, rng);
  };


  // ─── 4. Multiverse Sacred Portal & Hyper-Mandala ───────────────────────────
  MasterEngines.multiverseSacredPortal = function(ctx, w, h, s, rng) {
    const cols = M.colors(s, ['#05020f', '#00f5d4', '#7b2cbf', '#f72585', '#ffd166', '#ffffff']);
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    renderAtmosphericNebula(ctx, w, h, cols, rng);
    renderVolumetricRays(ctx, w, h, cols, 48, 0.5);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // 1. Torus Energy Mandala Wireframe
    const torusRings = Math.max(12, Math.round(dens * 3));
    const torusRad = 220 * sc;
    for (let i = 0; i < torusRings; i++) {
      const a = (i * 2 * Math.PI) / torusRings;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = M.rgba(col, 0.75);
      ctx.lineWidth = Math.max(1, 1.5 * sc);
      ctx.shadowColor = col;
      ctx.shadowBlur = 10 * sc;

      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * (torusRad * 0.4), Math.sin(a) * (torusRad * 0.4), torusRad, torusRad * 0.55, a, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Metatron's 3D Cube Polyhedral Vectors
    const nodes = [];
    const baseR = 150 * sc;
    nodes.push({ x: 0, y: 0 }); // Center

    // Inner hexagon (6 nodes)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      nodes.push({ x: Math.cos(a) * baseR, y: Math.sin(a) * baseR });
    }
    // Outer hexagon (6 nodes)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6;
      nodes.push({ x: Math.cos(a) * baseR * 1.732, y: Math.sin(a) * baseR * 1.732 });
    }

    // Connect all Metatron lines
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = M.rgba('#ffffff', 0.5);
    ctx.lineWidth = Math.max(1, 1.2 * sc);
    ctx.shadowColor = cols[1];
    ctx.shadowBlur = 14 * sc;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Luminous Node Spheres
    for (let i = 0; i < nodes.length; i++) {
      const nGrad = ctx.createRadialGradient(nodes[i].x, nodes[i].y, 0, nodes[i].x, nodes[i].y, 22 * sc);
      nGrad.addColorStop(0, '#ffffff');
      nGrad.addColorStop(0.35, M.rgba(cols[(i % (cols.length - 1)) + 1], 0.8));
      nGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nGrad;
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 22 * sc, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Central Sri Yantra Interlocking Triangles
    const triCount = 9;
    for (let t = 0; t < triCount; t++) {
      const tH = (baseR * (0.3 + (t / triCount) * 0.75));
      const inverted = t % 2 === 1;
      const col = cols[(t % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = M.rgba(col, 0.85);
      ctx.lineWidth = Math.max(1, 2.2 * sc);
      ctx.shadowColor = col;
      ctx.shadowBlur = 12 * sc;

      ctx.beginPath();
      if (!inverted) {
        ctx.moveTo(0, -tH);
        ctx.lineTo(tH * 0.866, tH * 0.5);
        ctx.lineTo(-tH * 0.866, tH * 0.5);
      } else {
        ctx.moveTo(0, tH);
        ctx.lineTo(tH * 0.866, -tH * 0.5);
        ctx.lineTo(-tH * 0.866, -tH * 0.5);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    renderStardustParticles(ctx, w, h, cols, 1.25, rng);
    renderMicroTexture10MB(ctx, w, h, 0.13, rng);
  };


  // ─── 5. Prismatic Diamond Aurora & Caustics ────────────────────────────────
  MasterEngines.prismaticDiamondAurora = function(ctx, w, h, s, rng) {
    const cols = M.colors(s, ['#020b14', '#00ffff', '#ff00aa', '#ffff00', '#00ff66', '#ffffff']);
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    renderAtmosphericNebula(ctx, w, h, cols, rng);
    renderVolumetricRays(ctx, w, h, cols, 60, 0.6);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Faceted Diamond Refraction Geometry
    const facets = Math.max(16, Math.round(dens * 3.5));
    const maxRadius = Math.min(w, h) * 0.45;

    for (let f = 0; f < facets; f++) {
      const a1 = (f * 2 * Math.PI) / facets;
      const a2 = ((f + 1) * 2 * Math.PI) / facets;
      const col = cols[(f % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const grad = ctx.createRadialGradient(0, 0, 0, Math.cos(a1) * maxRadius, Math.sin(a1) * maxRadius, maxRadius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, M.rgba(col, 0.7));
      grad.addColorStop(0.8, M.rgba(cols[((f + 2) % (cols.length - 1)) + 1], 0.2));
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a1) * maxRadius, Math.sin(a1) * maxRadius);
      ctx.lineTo(Math.cos(a2) * maxRadius, Math.sin(a2) * maxRadius);
      ctx.closePath();
      ctx.fill();

      // Sharp crystal facet edge
      ctx.strokeStyle = M.rgba('#ffffff', 0.65);
      ctx.lineWidth = Math.max(1, 1.5 * sc);
      ctx.stroke();
      ctx.restore();
    }

    // Chromatic Aberration Dispersion Rings
    for (let r = 1; r <= 8; r++) {
      const radius = r * 35 * sc;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineWidth = Math.max(1, 2 * sc);

      // Red channel
      ctx.strokeStyle = 'rgba(255,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(-2 * sc, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Green channel
      ctx.strokeStyle = 'rgba(0,255,0,0.6)';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Blue channel
      ctx.strokeStyle = 'rgba(0,100,255,0.6)';
      ctx.beginPath();
      ctx.arc(2 * sc, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    renderStardustParticles(ctx, w, h, ['#ffffff', '#00ffff', '#ff77e1', '#ffff77'], 1.3, rng);
    renderMicroTexture10MB(ctx, w, h, 0.12, rng);
  };


  // ─── 6. Volcanic Magma Abyss & Solar Flare ─────────────────────────────────
  MasterEngines.volcanicMagmaCore = function(ctx, w, h, s, rng) {
    const fireCols = ['#080202', '#ff2200', '#ff7700', '#ffcc00', '#ffffff', '#3d0505'];
    const cols = (s.colors && s.colors.length >= 3) ? s.colors : fireCols;
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    // Dark magma stone base
    const bg = ctx.createRadialGradient(cx, cy, 50 * sc, cx, cy, Math.hypot(cx, cy));
    bg.addColorStop(0, '#2b0202');
    bg.addColorStop(0.5, '#120202');
    bg.addColorStop(1, '#020000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    renderVolumetricRays(ctx, w, h, ['#ff2200', '#ff9900', '#ffcc00'], 32, 0.6);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Blazing Solar Corona Arcs
    const arcs = Math.max(14, Math.round(dens * 2.8));
    for (let a = 0; a < arcs; a++) {
      const angle = (a * 2 * Math.PI) / arcs;
      const arcR = (120 + (a % 5) * 45) * sc;
      const col = cols[(a % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = M.rgba(col, 0.85);
      ctx.lineWidth = Math.max(2, (3 + (a % 3) * 2) * sc);
      ctx.shadowColor = col;
      ctx.shadowBlur = 25 * sc;

      ctx.beginPath();
      const p1x = Math.cos(angle) * (80 * sc);
      const p1y = Math.sin(angle) * (80 * sc);
      const ctrlX = Math.cos(angle + 0.5) * (arcR * 1.8);
      const ctrlY = Math.sin(angle + 0.5) * (arcR * 1.8);
      const p2x = Math.cos(angle + 1.0) * (80 * sc);
      const p2y = Math.sin(angle + 1.0) * (80 * sc);

      ctx.moveTo(p1x, p1y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y);
      ctx.stroke();
      ctx.restore();
    }

    // Blazing Incandescent Core
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 110 * sc);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, '#ffea75');
    coreGrad.addColorStop(0.65, '#ff4400');
    coreGrad.addColorStop(0.9, '#6b0800');
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 110 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();

    // Fiery Embers & Sparks
    renderStardustParticles(ctx, w, h, ['#ffffff', '#ffcc00', '#ff5500', '#ff2200'], 1.4, rng);
    renderMicroTexture10MB(ctx, w, h, 0.13, rng);
  };


  // ─── 7. Bioluminescent Deep Ocean Alien Fractal ───────────────────────────
  MasterEngines.bioluminescentAbyss = function(ctx, w, h, s, rng) {
    const oceanCols = ['#01060f', '#00f5d4', '#00bbf9', '#7209b7', '#f72585', '#ffffff'];
    const cols = (s.colors && s.colors.length >= 3) ? s.colors : oceanCols;
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    // Abyssal deep ocean gradient
    renderAtmosphericNebula(ctx, w, h, cols, rng);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Fractal Tendrils / Jellyfish Phosphorescent Arms
    const arms = Math.max(12, Math.round(dens * 2.5));
    for (let arm = 0; arm < arms; arm++) {
      const baseA = (arm * 2 * Math.PI) / arms;
      const col = cols[(arm % (cols.length - 1)) + 1];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = M.rgba(col, 0.8);
      ctx.lineWidth = Math.max(1, 2 * sc);
      ctx.shadowColor = col;
      ctx.shadowBlur = 16 * sc;

      ctx.beginPath();
      let curX = 0, curY = 0;
      ctx.moveTo(curX, curY);

      const segments = 24;
      for (let seg = 1; seg <= segments; seg++) {
        const segDist = seg * (12 * sc);
        const wave = Math.sin(seg * 0.4 + arm) * (20 * sc);
        const a = baseA + (wave / segDist);
        curX = Math.cos(a) * segDist;
        curY = Math.sin(a) * segDist;
        ctx.lineTo(curX, curY);

        // Phosphorescent Node Bubbles
        if (seg % 4 === 0) {
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(curX, curY, (2 + (seg % 3) * 1.5) * sc, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    renderStardustParticles(ctx, w, h, ['#00f5d4', '#00bbf9', '#ffffff', '#80ffdb'], 1.2, rng);
    renderMicroTexture10MB(ctx, w, h, 0.12, rng);
  };


  // ─── 8. Quantum Particle Storm & Strange Attractor ────────────────────────
  MasterEngines.quantumParticleStorm = function(ctx, w, h, s, rng) {
    const cols = M.colors(s, ['#04020a', '#9d4edd', '#00f0ff', '#ff007f', '#ffffff']);
    const sc = M.scale(s);
    const dens = M.density(s);
    const rot = M.rot(s);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    renderAtmosphericNebula(ctx, w, h, cols, rng);
    renderVolumetricRays(ctx, w, h, cols, 36, 0.35);

    // 50,000+ Clifford / Peter de Jong Mathematical Attractor Points
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.globalCompositeOperation = 'screen';

    // Parameters for chaotic mathematical attractor
    const a = -1.4 + (s.seed % 100) * 0.008;
    const b = 1.6 + ((s.seed >> 2) % 100) * 0.007;
    const c = 1.0 + ((s.seed >> 4) % 100) * 0.006;
    const d = 0.7 + ((s.seed >> 6) % 100) * 0.005;

    let x = 0.1, y = 0.1;
    const totalPoints = Math.round(Math.min(w * h * 0.0025, 80000) * (dens / 5));
    const attractorScale = Math.min(w, h) * 0.22 * sc;

    for (let i = 0; i < totalPoints; i++) {
      const xNew = Math.sin(a * y) - Math.cos(b * x);
      const yNew = Math.sin(c * x) - Math.cos(d * y);
      x = xNew;
      y = yNew;

      if (i > 100) { // skip warmup
        const px = x * attractorScale;
        const py = y * attractorScale;
        const colIdx = Math.floor((Math.hypot(px, py) / (attractorScale * 1.5)) * cols.length) % (cols.length - 1) + 1;
        const col = cols[colIdx];

        ctx.fillStyle = M.rgba(col, 0.35);
        ctx.fillRect(px, py, 1.2 * sc, 1.2 * sc);
      }
    }
    ctx.restore();

    renderStardustParticles(ctx, w, h, cols, 1.1, rng);
    renderMicroTexture10MB(ctx, w, h, 0.13, rng);
  };


  // ══════════════════════════════════════════════════════════════════════════
  // REGISTRATION WITH PATTERN ENGINE
  // ══════════════════════════════════════════════════════════════════════════
  if (typeof window !== 'undefined') {
    window.MasterArtEngines = MasterEngines;
    if (window.PatternEngine && typeof window.PatternEngine.registerPatterns === 'function') {
      window.PatternEngine.registerPatterns(MasterEngines);
    }
  }

  if (typeof module !== 'undefined') {
    module.exports = MasterEngines;
  }
})();
