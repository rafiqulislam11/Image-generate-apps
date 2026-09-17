'use strict';
/**
 * PatternForge PRO V2 — spiral-patterns.js
 * 150 Advanced Parametric Spiral, Spirograph, Sacred Geometry,
 * Harmonic, Fractal, Architectural & Digital Canvas Patterns.
 * Fully interactive with all sliders: Scale, Width, Gap, Line Thickness,
 * Density, Opacity, Rotation, Blend Strength, and Color Studios.
 */

(function() {
  const S = {
    colors(s, fallback) {
      return (s.colors && s.colors.length >= 2) ? s.colors : (fallback || ['#0d1b3e', '#e05c00', '#c24a00']);
    },
    scale(s) { return Math.max(0.05, (s.scale || 50) / 50); },
    opacity(s) { return s.opacity !== undefined ? Math.max(0, Math.min(1, s.opacity)) : 0.85; },
    blend(s) { return s.blendStrength !== undefined ? Math.max(0, Math.min(1, s.blendStrength)) : 0.6; },
    lt(s, def) { return Math.max(0.5, s.lineThickness !== undefined ? s.lineThickness : (def || 1.5)); },
    density(s) { return Math.max(1, s.density || 5); },
    rot(s) { return ((s.rotation || 0) * Math.PI) / 180; },
    stripeW(s) { return Math.max(2, s.stripeWidth || 20); },
    stripeG(s) { return Math.max(0, s.stripeGap || 4); },
    alphaColor(hex, alpha) {
      if (typeof hexWithAlpha === 'function') return hexWithAlpha(hex, alpha);
      if (!hex || hex[0] !== '#') return hex;
      const c = hex.slice(1);
      const num = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }
  };

  const newPatterns = {};

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 1: 🌀 SPIRALS & VORTICES (25 Patterns)
  // ══════════════════════════════════════════════════════════════════════════

  // 1. Archimedean Spiral (r = a + bθ)
  newPatterns.archimedeanSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const dens = S.density(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const numArms = Math.max(1, Math.round(dens / 1.5));
    const b = (3 + S.stripeW(s) * 0.15) * sc;

    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = (arm * 2 * Math.PI) / numArms + rot;
      const col = cols[(arm + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * (1 + (arm % 2) * 0.4);

      let first = true;
      for (let theta = 0; theta < 40 * Math.PI; theta += 0.05) {
        const r = b * theta;
        if (r > maxR) break;
        const x = cx + r * Math.cos(theta + armOffset);
        const y = cy + r * Math.sin(theta + armOffset);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 2. Golden Ratio Spiral (Fibonacci)
  newPatterns.goldenSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const phi = 1.6180339887;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const arms = Math.max(2, Math.round(S.density(s) * 0.8));
    for (let a = 0; a < arms; a++) {
      const armRot = rot + (a * 2 * Math.PI) / arms;
      const col = cols[(a + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;

      let first = true;
      for (let theta = 0; theta < 18 * Math.PI; theta += 0.04) {
        const r = 4 * sc * Math.pow(phi, (2 * theta) / Math.PI * 0.25);
        if (r > maxR) break;
        const x = cx + r * Math.cos(theta + armRot);
        const y = cy + r * Math.sin(theta + armRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 3. Logarithmic Spiral
  newPatterns.logarithmicSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const k = 0.12 * (1 + S.density(s) * 0.05);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const arms = Math.max(2, Math.round(S.density(s)));
    for (let a = 0; a < arms; a++) {
      const aRot = rot + (a * 2 * Math.PI) / arms;
      const col = cols[(a + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      let first = true;
      for (let theta = 0; theta < 25 * Math.PI; theta += 0.05) {
        const r = (5 * sc) * Math.exp(k * theta);
        if (r > maxR) break;
        const x = cx + r * Math.cos(theta + aRot);
        const y = cy + r * Math.sin(theta + aRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 4. Fermat's Spiral (Parabolic r² = a²θ)
  newPatterns.fermatSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const aVal = 14 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const arms = Math.max(2, Math.round(S.density(s)));
    for (let a = 0; a < arms; a++) {
      const aRot = rot + (a * 2 * Math.PI) / arms;
      const col = cols[(a + 1) % cols.length];
      for (const sign of [1, -1]) {
        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op * 0.9);
        ctx.lineWidth = lt * sc;
        let first = true;
        for (let theta = 0; theta < 60 * Math.PI; theta += 0.1) {
          const r = sign * aVal * Math.sqrt(theta);
          if (Math.abs(r) > maxR) break;
          const x = cx + r * Math.cos(theta + aRot);
          const y = cy + r * Math.sin(theta + aRot);
          if (first) { ctx.moveTo(x, y); first = false; }
          else { ctx.lineTo(x, y); }
        }
        ctx.stroke();
      }
    }
  };

  // 5. Hyperbolic Spiral (r = a / θ)
  newPatterns.hyperbolicSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const aVal = 800 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const arms = Math.max(3, Math.round(S.density(s) * 1.2));
    for (let i = 0; i < arms; i++) {
      const aRot = rot + (i * 2 * Math.PI) / arms;
      const col = cols[(i + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      let first = true;
      for (let theta = 0.2; theta < 18 * Math.PI; theta += 0.05) {
        const r = aVal / theta;
        if (r > maxR) continue;
        if (r < 2) break;
        const x = cx + r * Math.cos(theta + aRot);
        const y = cy + r * Math.sin(theta + aRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 6. Lituus Spiral
  newPatterns.lituusSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const arms = Math.max(2, Math.round(S.density(s)));
    for (let a = 0; a < arms; a++) {
      const aRot = rot + (a * 2 * Math.PI) / arms;
      const col = cols[(a + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      let first = true;
      for (let theta = 0.05; theta < 15 * Math.PI; theta += 0.04) {
        const r = (250 * sc) / Math.sqrt(theta);
        if (r > maxR) continue;
        if (r < 3) break;
        const x = cx + r * Math.cos(theta + aRot);
        const y = cy + r * Math.sin(theta + aRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 7. Dual Interlocking Spiral
  newPatterns.dualInterlockingSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 2; i++) {
      const col = cols[(i + 1) % cols.length];
      const dir = i === 0 ? 1 : -1;
      const offset = rot + (i * Math.PI);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 2;
      let first = true;
      for (let theta = 0; theta < 28 * Math.PI; theta += 0.05) {
        const r = (6 + S.stripeW(s) * 0.2) * sc * theta;
        if (r > maxR) break;
        const x = cx + r * Math.cos(dir * theta + offset);
        const y = cy + r * Math.sin(dir * theta + offset);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 8. Triple Spiral (Celtic Triskelion)
  newPatterns.tripleSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const dist = 60 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 3; i++) {
      const angle = rot + (i * 2 * Math.PI) / 3;
      const ocx = cx + dist * Math.cos(angle);
      const ocy = cy + dist * Math.sin(angle);
      const col = cols[(i + 1) % cols.length];

      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.8;
      let first = true;
      for (let theta = 0; theta < 14 * Math.PI; theta += 0.06) {
        const r = (5 * sc) * theta;
        const x = ocx + r * Math.cos(theta + angle);
        const y = ocy + r * Math.sin(theta + angle);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 9. Quad Spiral
  newPatterns.quadSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 4; i++) {
      const aRot = rot + (i * Math.PI) / 2;
      const col = cols[(i + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.6;
      let first = true;
      for (let theta = 0; theta < 25 * Math.PI; theta += 0.05) {
        const r = (5 + S.stripeW(s) * 0.1) * sc * theta;
        if (r > maxR) break;
        const x = cx + r * Math.cos(theta + aRot);
        const y = cy + r * Math.sin(theta + aRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 10. Hex Spiral Starburst
  newPatterns.hexSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 6; i++) {
      const aRot = rot + (i * Math.PI) / 3;
      const col = cols[(i + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.4;
      let first = true;
      for (let theta = 0; theta < 20 * Math.PI; theta += 0.06) {
        const r = (4.5 + S.stripeW(s) * 0.08) * sc * theta;
        if (r > maxR) break;
        const x = cx + r * Math.cos(theta + aRot);
        const y = cy + r * Math.sin(theta + aRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 11. Octa Spiral
  newPatterns.octaSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 8; i++) {
      const aRot = rot + (i * Math.PI) / 4;
      const col = cols[(i + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.2;
      let first = true;
      for (let theta = 0; theta < 18 * Math.PI; theta += 0.06) {
        const r = (4 * sc) * theta;
        if (r > maxR) break;
        const x = cx + r * Math.cos(theta + aRot);
        const y = cy + r * Math.sin(theta + aRot);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 12. Spiral Galaxy
  newPatterns.spiralGalaxy = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const arms = 4;
    const count = 300 * S.density(s);

    for (let i = 0; i < count; i++) {
      const arm = i % arms;
      const t = Math.pow(rng(), 1.6) * 12 * Math.PI;
      const r = (6 * sc) * t;
      if (r > maxR) continue;
      const spread = (rng() - 0.5) * (18 * sc + r * 0.12);
      const angle = t + (arm * 2 * Math.PI) / arms + rot;
      const x = cx + r * Math.cos(angle) + spread * Math.sin(angle);
      const y = cy + r * Math.sin(angle) - spread * Math.cos(angle);
      const col = cols[(arm + 1 + Math.floor(rng() * 2)) % cols.length];
      const pSize = (1 + rng() * 3) * sc;

      ctx.fillStyle = S.alphaColor(col, op * (0.3 + rng() * 0.7));
      ctx.beginPath();
      ctx.arc(x, y, pSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // 13. Vortex Whirlpool
  newPatterns.vortexWhirlpool = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rings = Math.max(15, Math.round(S.density(s) * 6));
    for (let i = 1; i <= rings; i++) {
      const progress = i / rings;
      const r = progress * maxR * sc;
      const twist = rot + Math.pow(1 - progress, 1.8) * 6 * Math.PI;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(twist);
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.75, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op * (0.4 + 0.6 * progress));
      ctx.lineWidth = lt * sc * (1 + 2 * (1 - progress));
      ctx.stroke();
      ctx.restore();
    }
  };

  // 14. Squircle Spiral
  newPatterns.squircleSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const count = Math.max(10, Math.round(S.density(s) * 5));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 1; i <= count; i++) {
      const size = i * 20 * sc;
      const angle = rot + (i * 0.15);
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      const r = size * 0.25;
      const hs = size / 2;
      ctx.beginPath();
      ctx.roundRect(-hs, -hs, size, size, r);
      ctx.stroke();
      ctx.restore();
    }
  };

  // 15. Polygonal Spiral
  newPatterns.polygonalSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const sides = Math.max(3, Math.min(8, Math.round(S.density(s))));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    let len = 4 * sc;
    let angle = rot;
    let currX = cx, currY = cy;
    ctx.moveTo(currX, currY);

    const stepAngle = (2 * Math.PI) / sides;
    const maxDiag = Math.hypot(w, h);

    for (let step = 0; step < 300; step++) {
      currX += len * Math.cos(angle);
      currY += len * Math.sin(angle);
      ctx.lineTo(currX, currY);
      angle += stepAngle + 0.02;
      len += 1.8 * sc;
      if (Math.hypot(currX - cx, currY - cy) > maxDiag) break;
    }
    ctx.stroke();
  };

  // 16. Concentric Ripple Spiral
  newPatterns.concentricRipple = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const waveFreq = S.density(s) * 0.8;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rings = Math.max(12, Math.round(maxR / (18 * sc)));
    for (let r = 1; r <= rings; r++) {
      const radius = r * 18 * sc;
      const col = cols[(r % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let theta = 0; theta <= 2 * Math.PI + 0.05; theta += 0.05) {
        const wave = 6 * sc * Math.sin(theta * waveFreq + r * 0.4);
        const rad = radius + wave;
        const x = cx + rad * Math.cos(theta);
        const y = cy + rad * Math.sin(theta);
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 17. Fibonacci Lattice (Phyllotaxis)
  newPatterns.fibonacciLattice = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const goldenAngle = 137.50776405 * (Math.PI / 180);
    const maxPoints = 150 * S.density(s);
    const cScale = (5 + S.stripeW(s) * 0.15) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let n = 0; n < maxPoints; n++) {
      const r = cScale * Math.sqrt(n);
      const theta = n * goldenAngle + rot;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      const col = cols[(n % (cols.length - 1)) + 1];
      const pSize = Math.max(1.5, (1.8 + (n % 4) * 0.8) * sc);

      ctx.fillStyle = S.alphaColor(col, op);
      ctx.beginPath();
      ctx.arc(x, y, pSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // 18. Cyclone Spiral
  newPatterns.cycloneSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const bands = 5;
    for (let b = 0; b < bands; b++) {
      const aOffset = rot + (b * 2 * Math.PI) / bands;
      const col = cols[(b % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op * 0.85);
      ctx.lineWidth = lt * sc * (1.5 + b * 0.3);

      let first = true;
      for (let theta = 0; theta < 20 * Math.PI; theta += 0.08) {
        const r = (4 * sc) * Math.pow(theta, 1.25);
        if (r > maxR) break;
        const wiggle = 8 * sc * Math.sin(theta * 3);
        const x = cx + (r + wiggle) * Math.cos(theta + aOffset);
        const y = cy + (r + wiggle) * Math.sin(theta + aOffset);
        if (first) { ctx.moveTo(x, y); first = false; }
        else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    }
  };

  // 19. Nebula Spiral
  newPatterns.nebulaSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let arm = 0; arm < 3; arm++) {
      const aRot = rot + (arm * 2 * Math.PI) / 3;
      const col = cols[(arm % (cols.length - 1)) + 1];
      for (let t = 0; t < 16 * Math.PI; t += 0.15) {
        const r = (5 * sc) * Math.pow(t, 1.15);
        if (r > maxR) break;
        const x = cx + r * Math.cos(t + aRot) + (rng() - 0.5) * 20 * sc;
        const y = cy + r * Math.sin(t + aRot) + (rng() - 0.5) * 20 * sc;
        const blobR = (6 + rng() * 14) * sc;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, blobR);
        grad.addColorStop(0, S.alphaColor(col, op * 0.4));
        grad.addColorStop(1, S.alphaColor(col, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, blobR, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // 20. Chasm Spiral (Hypnotic Optical Tunnel)
  newPatterns.chasmSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rays = 24;
    for (let i = 0; i < rays; i++) {
      const a1 = rot + (i * 2 * Math.PI) / rays;
      const a2 = rot + ((i + 1) * 2 * Math.PI) / rays;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let r = 0; r <= maxR; r += 15 * sc) {
        const twist = (r / maxR) * 3 * Math.PI;
        const x = cx + r * Math.cos(a1 + twist);
        const y = cy + r * Math.sin(a1 + twist);
        ctx.lineTo(x, y);
      }
      for (let r = maxR; r >= 0; r -= 15 * sc) {
        const twist = (r / maxR) * 3 * Math.PI;
        const x = cx + r * Math.cos(a2 + twist);
        const y = cy + r * Math.sin(a2 + twist);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (i % 2 === 0) {
        ctx.fillStyle = S.alphaColor(col, op);
        ctx.fill();
      }
    }
  };

  // 21. Helix Ribbon (3D Projected Double Spiral)
  newPatterns.helixRibbon = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const steps = 400;
    const radius = 120 * sc;
    const pitch = 2.5 * sc;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    for (let strand = 0; strand < 2; strand++) {
      const col = cols[(strand + 1) % cols.length];
      const phase = strand * Math.PI;
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 2;

      for (let i = -steps / 2; i <= steps / 2; i++) {
        const t = i * 0.1;
        const x = radius * Math.cos(t + phase);
        const y = i * pitch;
        if (i === -steps / 2) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // 22. Spiral Labyrinth
  newPatterns.spiralLabyrinth = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 3);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const laneW = 16 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const numLanes = Math.floor(maxR / laneW);
    for (let i = 1; i <= numLanes; i++) {
      const col = cols[(i % (cols.length - 1)) + 1];
      const r = i * laneW;
      const gapAngle = ((i * 47) % 360) * (Math.PI / 180);
      const gapWidth = 0.4;

      ctx.beginPath();
      ctx.arc(cx, cy, r, gapAngle + gapWidth, gapAngle + 2 * Math.PI - gapWidth);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;
      ctx.stroke();
    }
  };

  // 23. Solar Flare Spiral
  newPatterns.solarFlareSpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const flares = Math.max(12, Math.round(S.density(s) * 4));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let f = 0; f < flares; f++) {
      const a = rot + (f * 2 * Math.PI) / flares;
      const col = cols[(f % (cols.length - 1)) + 1];
      const flareLen = (120 + (f % 3) * 60) * sc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const c1x = cx + flareLen * 0.4 * Math.cos(a + 0.3);
      const c1y = cy + flareLen * 0.4 * Math.sin(a + 0.3);
      const c2x = cx + flareLen * 0.8 * Math.cos(a - 0.2);
      const c2y = cy + flareLen * 0.8 * Math.sin(a - 0.2);
      const ex = cx + flareLen * Math.cos(a + 0.4);
      const ey = cy + flareLen * Math.sin(a + 0.4);

      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = S.lt(s, 2) * sc;
      ctx.stroke();
    }
  };

  // 24. Quantum Vortex
  newPatterns.quantumVortex = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const vortices = [
      { x: cx, y: cy, str: 1 },
      { x: cx - 120 * sc, y: cy - 80 * sc, str: -1 },
      { x: cx + 120 * sc, y: cy + 80 * sc, str: 1 },
      { x: cx + 80 * sc, y: cy - 120 * sc, str: -1 },
      { x: cx - 80 * sc, y: cy + 120 * sc, str: 1 }
    ];

    vortices.forEach((v, vi) => {
      const col = cols[(vi % (cols.length - 1)) + 1];
      ctx.strokeStyle = S.alphaColor(col, op * 0.8);
      ctx.lineWidth = lt * sc;
      for (let arm = 0; arm < 4; arm++) {
        const offset = rot + (arm * Math.PI) / 2;
        ctx.beginPath();
        let first = true;
        for (let t = 0; t < 10 * Math.PI; t += 0.08) {
          const r = 4 * sc * t;
          if (r > 220 * sc) break;
          const x = v.x + r * Math.cos(v.str * t + offset);
          const y = v.y + r * Math.sin(v.str * t + offset);
          if (first) { ctx.moveTo(x, y); first = false; }
          else { ctx.lineTo(x, y); }
        }
        ctx.stroke();
      }
    });
  };

  // 25. Infinity Spiral (Lemniscate Spiral)
  newPatterns.infinitySpiral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const layers = Math.max(8, Math.round(S.density(s) * 3));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    for (let l = 1; l <= layers; l++) {
      const a = l * 18 * sc;
      const col = cols[(l % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= 2 * Math.PI + 0.05; t += 0.04) {
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const x = (a * Math.cos(t)) / denom;
        const y = (a * Math.sin(t) * Math.cos(t)) / denom;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 2: 📐 SPIROGRAPHS & ROSE CURVES (25 Patterns)
  // ══════════════════════════════════════════════════════════════════════════

  // 26. Rhodonea Rose (r = a * cos(kθ))
  newPatterns.rhodoneaRose = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const k = Math.max(2, Math.round(S.density(s)));
    const a = Math.min(w, h) * 0.44 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const passes = 3;
    for (let p = 0; p < passes; p++) {
      const col = cols[(p + 1) % cols.length];
      const rad = a * (1 - p * 0.18);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      const maxTheta = k % 2 === 0 ? 2 * Math.PI : Math.PI;
      for (let theta = 0; theta <= maxTheta + 0.02; theta += 0.01) {
        const r = rad * Math.cos(k * theta);
        const x = cx + r * Math.cos(theta + rot + (p * 0.1));
        const y = cy + r * Math.sin(theta + rot + (p * 0.1));
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 27. Maurer Rose
  newPatterns.maurerRose = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const n = Math.max(2, Math.round(S.density(s)));
    const d = 29 + Math.round(S.stripeW(s) * 0.5);
    const rad = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let i = 0; i <= 360; i++) {
      const k = i * d * (Math.PI / 180);
      const r = rad * Math.sin(n * k);
      const x = cx + r * Math.cos(k + rot);
      const y = cy + r * Math.sin(k + rot);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 28. Epitrochoid (Spirograph outer trace)
  newPatterns.epitrochoid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const R = 80 * sc;
    const rVal = 30 * sc;
    const dVal = (40 + S.stripeW(s) * 0.8) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    const limit = 20 * Math.PI;
    for (let t = 0; t <= limit; t += 0.02) {
      const x = cx + ((R + rVal) * Math.cos(t + rot) - dVal * Math.cos(((R + rVal) / rVal) * (t + rot)));
      const y = cy + ((R + rVal) * Math.sin(t + rot) - dVal * Math.sin(((R + rVal) / rVal) * (t + rot)));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 29. Hypotrochoid (Spirograph inner trace)
  newPatterns.hypotrochoid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const R = 140 * sc;
    const rVal = (50 + S.stripeW(s) * 0.4) * sc;
    const dVal = (60 + S.stripeG(s) * 2) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    const limit = 30 * Math.PI;
    for (let t = 0; t <= limit; t += 0.02) {
      const x = cx + ((R - rVal) * Math.cos(t + rot) + dVal * Math.cos(((R - rVal) / rVal) * (t + rot)));
      const y = cy + ((R - rVal) * Math.sin(t + rot) - dVal * Math.sin(((R - rVal) / rVal) * (t + rot)));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 30. Limaçon
  newPatterns.limacon = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const bVal = 80 * sc;
    const aVal = (60 + S.stripeW(s) * 0.8) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const layers = Math.max(3, Math.round(S.density(s)));
    for (let l = 0; l < layers; l++) {
      const col = cols[(l + 1) % cols.length];
      const a = aVal * (1 - l * 0.15);
      const b = bVal * (1 - l * 0.15);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= 2 * Math.PI + 0.04; t += 0.02) {
        const r = b + a * Math.cos(t);
        const x = cx + r * Math.cos(t + rot + l * 0.2);
        const y = cy + r * Math.sin(t + rot + l * 0.2);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 31. Cardioid (Heart Caustic)
  newPatterns.cardioid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const a = Math.min(w, h) * 0.22 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const count = 4;
    for (let c = 0; c < count; c++) {
      const col = cols[(c + 1) % cols.length];
      const rad = a * (1 + c * 0.25);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.02) {
        const r = 2 * rad * (1 - Math.cos(t));
        const x = cx + r * Math.cos(t + rot + c * (Math.PI / 2));
        const y = cy + r * Math.sin(t + rot + c * (Math.PI / 2));
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 32. Nephroid (2-cusp Caustic)
  newPatterns.nephroid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const a = Math.min(w, h) * 0.12 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc * 1.5;

    for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.02) {
      const x = cx + a * (3 * Math.cos(t + rot) - Math.cos(3 * (t + rot)));
      const y = cy + a * (3 * Math.sin(t + rot) - Math.sin(3 * (t + rot)));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 33. Astroid (4-cusp Star)
  newPatterns.astroid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const a = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const layers = Math.max(3, Math.round(S.density(s) * 0.8));
    for (let l = 1; l <= layers; l++) {
      const col = cols[(l % (cols.length - 1)) + 1];
      const rad = a * (l / layers);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.02) {
        const ct = Math.cos(t + rot);
        const st = Math.sin(t + rot);
        const x = cx + rad * Math.pow(ct, 3);
        const y = cy + rad * Math.pow(st, 3);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 34. Deltoid (3-cusp Hypocycloid)
  newPatterns.deltoid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const a = Math.min(w, h) * 0.16 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const count = 5;
    for (let i = 0; i < count; i++) {
      const col = cols[(i + 1) % cols.length];
      const rad = a * (1 + i * 0.2);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.02) {
        const x = cx + rad * (2 * Math.cos(t + rot + i * 0.2) + Math.cos(2 * (t + rot + i * 0.2)));
        const y = cy + rad * (2 * Math.sin(t + rot + i * 0.2) - Math.sin(2 * (t + rot + i * 0.2)));
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 35. Lissajous Curve
  newPatterns.lissajousCurve = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const aFreq = Math.max(1, Math.round(S.density(s)));
    const bFreq = aFreq + 1;
    const delta = rot;
    const ampX = Math.min(w, h) * 0.42 * sc;
    const ampY = ampX;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let t = 0; t <= 2 * Math.PI + 0.01; t += 0.01) {
      const x = cx + ampX * Math.sin(aFreq * t + delta);
      const y = cy + ampY * Math.sin(bFreq * t);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 36. Lissajous Grid
  newPatterns.lissajousGrid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const rot = S.rot(s);
    const cellSize = (80 + S.stripeW(s) * 1.2) * sc;
    const colsCount = Math.ceil(w / cellSize) + 1;
    const rowsCount = Math.ceil(h / cellSize) + 1;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const ox = c * cellSize + cellSize / 2;
        const oy = r * cellSize + cellSize / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];
        const aFreq = (c % 4) + 1;
        const bFreq = (r % 4) + 1;
        const rad = cellSize * 0.4;

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        for (let t = 0; t <= 2 * Math.PI + 0.05; t += 0.05) {
          const x = ox + rad * Math.sin(aFreq * t + rot);
          const y = oy + rad * Math.sin(bFreq * t);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };

  // 37. Guilloché Banknote Rosette
  newPatterns.guillocheBanknote = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(w, h) * 0.44 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const waves = Math.max(12, Math.round(S.density(s) * 3));
    const rings = 28;

    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * maxR;
      const col = cols[(r % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op * 0.75);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.02) {
        const mod = (6 + S.stripeW(s) * 0.15) * sc * Math.sin(t * waves + r * 0.35 + rot);
        const rad = radius + mod;
        const x = cx + rad * Math.cos(t);
        const y = cy + rad * Math.sin(t);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 38. Guilloché Border
  newPatterns.guillocheBorder = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const period = (40 + S.stripeW(s)) * sc;
    const amp = 30 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rows = Math.ceil(h / (amp * 2.5)) + 1;
    for (let r = 0; r < rows; r++) {
      const cy = r * amp * 2.5 + amp;
      for (let wave = 0; wave < 3; wave++) {
        const col = cols[(wave + 1) % cols.length];
        const phase = (wave * Math.PI) / 3;
        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        for (let x = 0; x <= w + 10; x += 3) {
          const y = cy + amp * Math.sin((x / period) * 2 * Math.PI + phase);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };

  // 39. Butterfly Curve
  newPatterns.butterflyCurve = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const a = Math.min(w, h) * 0.08 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let t = 0; t <= 12 * Math.PI; t += 0.02) {
      const r = a * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5));
      const x = cx + r * Math.sin(t + rot);
      const y = cy - r * Math.cos(t + rot);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 40. Superformula
  newPatterns.superformula = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const m = Math.max(3, Math.round(S.density(s)));
    const a = 1, b = 1, n1 = 0.3, n2 = 1, n3 = 1;
    const rad = Math.min(w, h) * 0.4 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const layers = 3;
    for (let l = 0; l < layers; l++) {
      const col = cols[(l + 1) % cols.length];
      const scaleFactor = rad * (1 - l * 0.2);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let phi = 0; phi <= 2 * Math.PI + 0.02; phi += 0.01) {
        const t1 = Math.pow(Math.abs((1 / a) * Math.cos((m * phi) / 4)), n2);
        const t2 = Math.pow(Math.abs((1 / b) * Math.sin((m * phi) / 4)), n3);
        const r = scaleFactor * Math.pow(t1 + t2, -1 / n1);
        const x = cx + r * Math.cos(phi + rot + l * 0.15);
        const y = cy + r * Math.sin(phi + rot + l * 0.15);
        if (phi === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 41. Harmonograph
  newPatterns.harmonograph = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const f1 = 2, f2 = 3, f3 = 3.01, f4 = 2;
    const d1 = 0.002, d2 = 0.002, d3 = 0.002, d4 = 0.002;
    const p1 = rot, p2 = Math.PI / 2, p3 = 0, p4 = Math.PI / 2;
    const a = Math.min(w, h) * 0.2 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let t = 0; t <= 200; t += 0.04) {
      const x = cx + a * (Math.sin(t * f1 + p1) * Math.exp(-d1 * t) + Math.sin(t * f2 + p2) * Math.exp(-d2 * t));
      const y = cy + a * (Math.sin(t * f3 + p3) * Math.exp(-d3 * t) + Math.sin(t * f4 + p4) * Math.exp(-d4 * t));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 42. Spiro Floral
  newPatterns.spiroFloral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const petals = Math.max(6, Math.round(S.density(s) * 2));
    const maxR = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < petals; i++) {
      const angle = rot + (i * 2 * Math.PI) / petals;
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.ellipse(maxR * 0.5, 0, maxR * 0.48, maxR * 0.16, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  };

  // 43. Spiro Star
  newPatterns.spiroStar = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const points = Math.max(5, Math.round(S.density(s)));
    const rOuter = Math.min(w, h) * 0.42 * sc;
    const rInner = rOuter * 0.4;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const layers = 5;
    for (let l = 0; l < layers; l++) {
      const col = cols[(l % (cols.length - 1)) + 1];
      const twist = rot + (l * 0.12);
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0 ? rOuter : rInner) * (1 - l * 0.15);
        const a = twist + (i * Math.PI) / points;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  };

  // 44. Cycloid Wave
  newPatterns.cycloidWave = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const r = (25 + S.stripeW(s) * 0.6) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rows = Math.ceil(h / (r * 2.2)) + 1;
    for (let row = 0; row < rows; row++) {
      const cy = row * r * 2.2;
      const col = cols[(row % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= (w / r) + 4; t += 0.05) {
        const x = r * (t - Math.sin(t));
        const y = cy + r * (1 - Math.cos(t));
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 45. Involute Gear
  newPatterns.involuteGear = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const teeth = Math.max(8, Math.round(S.density(s) * 2));
    const rBase = Math.min(w, h) * 0.3 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let i = 0; i < teeth; i++) {
      const a = (i * 2 * Math.PI) / teeth;
      const toothW = (2 * Math.PI) / teeth;
      ctx.arc(0, 0, rBase, a, a + toothW * 0.3);
      ctx.arc(0, 0, rBase * 1.25, a + toothW * 0.3, a + toothW * 0.7);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };

  // 46. Hypocycloid Matrix
  newPatterns.hypocycloidMatrix = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const rot = S.rot(s);
    const cellSize = (90 + S.stripeW(s)) * sc;
    const colsCount = Math.ceil(w / cellSize) + 1;
    const rowsCount = Math.ceil(h / cellSize) + 1;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const ox = c * cellSize + cellSize / 2;
        const oy = r * cellSize + cellSize / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];
        const rad = cellSize * 0.42;

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        for (let t = 0; t <= 2 * Math.PI + 0.05; t += 0.05) {
          const ct = Math.cos(t + rot);
          const st = Math.sin(t + rot);
          const x = ox + rad * Math.pow(ct, 3);
          const y = oy + rad * Math.pow(st, 3);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };

  // 47. Epicycloid Rosette
  newPatterns.epicycloidRosette = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const k = Math.max(3, Math.round(S.density(s)));
    const rVal = 30 * sc;
    const R = rVal * k;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.02) {
      const x = cx + (R + rVal) * Math.cos(t + rot) - rVal * Math.cos((R + rVal) / rVal * (t + rot));
      const y = cy + (R + rVal) * Math.sin(t + rot) - rVal * Math.sin((R + rVal) / rVal * (t + rot));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 48. Damped Harmonic Acoustic
  newPatterns.dampedHarmonic = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const lines = Math.max(10, Math.round(S.density(s) * 3));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < lines; i++) {
      const cy = (h / (lines + 1)) * (i + 1);
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let x = 0; x <= w; x += 4) {
        const decay = Math.exp(-Math.abs(x - w / 2) / (w * 0.3));
        const y = cy + 40 * sc * Math.sin((x / (20 * sc)) + i * 0.4) * decay;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 49. Trochoid Lattice
  newPatterns.trochoidLattice = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.4);
    const period = (50 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rows = Math.ceil(h / (period * 0.8)) + 1;
    for (let r = 0; r < rows; r++) {
      const cy = r * period * 0.8;
      const col = cols[(r % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let t = 0; t <= w + period; t += 4) {
        const x = t - 15 * sc * Math.sin(t / period * 2 * Math.PI);
        const y = cy + 20 * sc * Math.cos(t / period * 2 * Math.PI);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 50. Clélie Curve
  newPatterns.clelieCurve = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.42 * sc;
    const n = Math.max(2, Math.round(S.density(s)));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let theta = 0; theta <= 2 * Math.PI + 0.02; theta += 0.02) {
      const x = cx + R * Math.cos(n * theta) * Math.cos(theta + rot);
      const y = cy + R * Math.cos(n * theta) * Math.sin(theta + rot);
      if (theta === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 3: 🔯 SACRED GEOMETRY & MYSTIC LATTICES (25 Patterns)
  // ══════════════════════════════════════════════════════════════════════════

  // 51. Flower of Life (19 Sacred Circles)
  newPatterns.flowerOfLife = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const r = (35 + S.stripeW(s) * 0.8) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / (r * 1.5)) + 2;
    const rowsCount = Math.ceil(h / (r * Math.sqrt(3))) + 2;

    for (let row = -1; row <= rowsCount; row++) {
      for (let col = -1; col <= colsCount; col++) {
        const x = col * r * 1.5;
        const y = row * r * Math.sqrt(3) + (col % 2 === 0 ? 0 : (r * Math.sqrt(3)) / 2);
        const color = cols[((row + col) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = S.alphaColor(color, op);
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 52. Seed of Life (7 Genesis Circles)
  newPatterns.seedOfLife = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = (50 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const angle = rot + (i * Math.PI) / 3;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }
  };

  // 53. Fruit of Life (13 Circles Matrix)
  newPatterns.fruitOfLife = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = (30 + S.stripeW(s) * 0.5) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const centers = [{ x: cx, y: cy }];
    for (let arm = 0; arm < 6; arm++) {
      const angle = rot + (arm * Math.PI) / 3;
      centers.push({ x: cx + r * 2 * Math.cos(angle), y: cy + r * 2 * Math.sin(angle) });
      centers.push({ x: cx + r * 4 * Math.cos(angle), y: cy + r * 4 * Math.sin(angle) });
    }

    centers.forEach((pt, i) => {
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    });
  };

  // 54. Metatron's Cube
  newPatterns.metatronCube = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.4);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = 120 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const nodes = [{ x: cx, y: cy }];
    for (let ring = 1; ring <= 2; ring++) {
      const rad = ring * r * 0.5;
      for (let i = 0; i < 6; i++) {
        const a = rot + (i * Math.PI) / 3 + (ring === 2 ? Math.PI / 6 : 0);
        nodes.push({ x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) });
      }
    }

    // Connect all nodes
    ctx.strokeStyle = S.alphaColor(cols[1], op * 0.6);
    ctx.lineWidth = lt * sc * 0.8;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Node circles
    nodes.forEach((n, i) => {
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.arc(n.x, n.y, 14 * sc, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;
      ctx.stroke();
    });
  };

  // 55. Sri Yantra
  newPatterns.sriYantra = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const cx = w / 2, cy = h / 2;
    const size = Math.min(w, h) * 0.38 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const triangles = [
      { up: true,  scale: 1.0, yOff: 0 },
      { up: false, scale: 0.95, yOff: 0.05 },
      { up: true,  scale: 0.82, yOff: -0.05 },
      { up: false, scale: 0.76, yOff: 0.1 },
      { up: true,  scale: 0.65, yOff: -0.1 },
      { up: false, scale: 0.58, yOff: 0.12 },
      { up: true,  scale: 0.46, yOff: -0.14 },
      { up: false, scale: 0.35, yOff: 0.15 },
      { up: true,  scale: 0.22, yOff: -0.16 },
    ];

    triangles.forEach((t, i) => {
      const col = cols[(i % (cols.length - 1)) + 1];
      const sH = size * t.scale;
      const sW = sH * 1.15;
      const yBase = cy + t.yOff * size;

      ctx.beginPath();
      if (t.up) {
        ctx.moveTo(cx, yBase - sH);
        ctx.lineTo(cx + sW / 2, yBase + sH / 2);
        ctx.lineTo(cx - sW / 2, yBase + sH / 2);
      } else {
        ctx.moveTo(cx, yBase + sH);
        ctx.lineTo(cx + sW / 2, yBase - sH / 2);
        ctx.lineTo(cx - sW / 2, yBase - sH / 2);
      }
      ctx.closePath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    });
  };

  // 56. Vesica Piscis
  newPatterns.vesicaPiscis = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const r = (45 + S.stripeW(s) * 0.8) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / r) + 2;
    const rowsCount = Math.ceil(h / r) + 2;

    for (let row = 0; row < rowsCount; row++) {
      for (let col = 0; col < colsCount; col++) {
        const x = col * r;
        const y = row * r;
        const color = cols[((row + col) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = S.alphaColor(color, op);
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 57. Torus Sacred
  newPatterns.torusSacred = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const count = Math.max(12, Math.round(S.density(s) * 3));
    const rTube = 90 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const angle = rot + (i * 2 * Math.PI) / count;
      const col = cols[(i % (cols.length - 1)) + 1];
      const ox = cx + rTube * 0.5 * Math.cos(angle);
      const oy = cy + rTube * 0.5 * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(ox, oy, rTube, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }
  };

  // 58. Celtic Knotwork
  newPatterns.celticKnotwork = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 3);
    const grid = (50 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / grid) + 1;
    const rowsCount = Math.ceil(h / grid) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const ox = c * grid;
        const oy = r * grid;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc * 1.5;

        // Over-under arcs
        ctx.arc(ox + grid / 2, oy, grid / 2, 0, Math.PI);
        ctx.arc(ox, oy + grid / 2, grid / 2, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
    }
  };

  // 59. Endless Knot (Ashtamangala)
  newPatterns.endlessKnot = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const cx = w / 2, cy = h / 2;
    const unit = 28 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(S.rot(s));

    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc * 1.8;

    ctx.beginPath();
    ctx.moveTo(-unit * 2, 0);
    ctx.lineTo(0, -unit * 2);
    ctx.lineTo(unit * 2, 0);
    ctx.lineTo(0, unit * 2);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = S.alphaColor(cols[2 % cols.length], op);
    ctx.beginPath();
    ctx.moveTo(-unit, -unit);
    ctx.lineTo(unit, unit);
    ctx.moveTo(unit, -unit);
    ctx.lineTo(-unit, unit);
    ctx.stroke();

    ctx.restore();
  };

  // 60. Borromean Rings
  newPatterns.borromeanRings = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 3);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = (60 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const offsets = [
      { a: 0 },
      { a: (2 * Math.PI) / 3 },
      { a: (4 * Math.PI) / 3 }
    ];

    offsets.forEach((off, i) => {
      const angle = rot + off.a;
      const ox = cx + r * 0.6 * Math.cos(angle);
      const oy = cy + r * 0.6 * Math.sin(angle);
      const col = cols[(i + 1) % cols.length];

      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 2;
      ctx.stroke();
    });
  };

  // 61. Solomon's Seal
  newPatterns.solomonSeal = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.35 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let t = 0; t < 2; t++) {
      const aOff = rot + (t * Math.PI);
      const col = cols[(t + 1) % cols.length];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;

      for (let i = 0; i < 3; i++) {
        const a = aOff + (i * 2 * Math.PI) / 3;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  };

  // 62. Octagram Star (Rub el Hizb)
  newPatterns.octagramStar = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const size = (60 + S.stripeW(s)) * sc;
    const colsCount = Math.ceil(w / (size * 1.4)) + 1;
    const rowsCount = Math.ceil(h / (size * 1.4)) + 1;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const cx = c * size * 1.4;
        const cy = r * size * 1.4;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        // Two overlapping squares rotated 45 deg
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
    }
  };

  // 63. Decagram Star
  newPatterns.decagramStar = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.4 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let i = 0; i <= 10; i++) {
      const a = rot + ((i * 3) % 10) * ((2 * Math.PI) / 10);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 64. Dodecagram
  newPatterns.dodecagram = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let i = 0; i <= 12; i++) {
      const a = rot + ((i * 5) % 12) * ((2 * Math.PI) / 12);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // 65. Enneagram
  newPatterns.enneagram = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.4 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = S.alphaColor(cols[1], op * 0.7);
    ctx.lineWidth = lt * sc;
    ctx.stroke();

    // Triangle 3-6-9
    const tri = [2, 5, 8];
    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[2 % cols.length], op);
    tri.forEach((pt, idx) => {
      const a = rot + (pt * 2 * Math.PI) / 9 - Math.PI / 2;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Sequence 1-4-2-8-5-7
    const seq = [0, 3, 1, 7, 4, 6, 0];
    ctx.beginPath();
    ctx.strokeStyle = S.alphaColor(cols[(cols.length - 1)], op);
    seq.forEach((pt, idx) => {
      const a = rot + (pt * 2 * Math.PI) / 9 - Math.PI / 2;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  // 66. Kabbalah Tree
  newPatterns.kabbalahTree = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const u = 38 * sc;
    const sefirot = [
      { x: 0, y: -4 * u },     // Keter
      { x: 2 * u, y: -3 * u },  // Chokhmah
      { x: -2 * u, y: -3 * u }, // Binah
      { x: 2 * u, y: -u },      // Chesed
      { x: -2 * u, y: -u },     // Gevurah
      { x: 0, y: 0 },           // Tiferet
      { x: 2 * u, y: 2 * u },   // Netzach
      { x: -2 * u, y: 2 * u },  // Hod
      { x: 0, y: 3 * u },       // Yesod
      { x: 0, y: 5 * u }        // Malkhut
    ];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(S.rot(s));

    // Paths
    ctx.strokeStyle = S.alphaColor(cols[1], op * 0.7);
    ctx.lineWidth = lt * sc;
    for (let i = 0; i < sefirot.length; i++) {
      for (let j = i + 1; j < sefirot.length; j++) {
        const d = Math.hypot(sefirot[i].x - sefirot[j].x, sefirot[i].y - sefirot[j].y);
        if (d < 3.2 * u) {
          ctx.beginPath();
          ctx.moveTo(sefirot[i].x, sefirot[i].y);
          ctx.lineTo(sefirot[j].x, sefirot[j].y);
          ctx.stroke();
        }
      }
    }

    // Circles
    sefirot.forEach((pt, i) => {
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 12 * sc, 0, 2 * Math.PI);
      ctx.fillStyle = S.alphaColor(col, op);
      ctx.fill();
      ctx.strokeStyle = cols[0];
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    });
    ctx.restore();
  };

  // 67. Triquetra Trinity
  newPatterns.triquetra = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const r = (60 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI) / 3;
      const ox = r * 0.55 * Math.cos(a);
      const oy = r * 0.55 * Math.sin(a);
      const col = cols[(i + 1) % cols.length];

      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.8;
      ctx.stroke();
    }
    ctx.restore();
  };

  // 68. Golden Triangle Spiral
  newPatterns.goldenTriangle = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let side = Math.min(w, h) * 0.8 * sc;
    let angle = S.rot(s);

    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < 18; i++) {
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      const hTri = (Math.sqrt(3) / 2) * side;
      ctx.moveTo(0, -hTri * (2 / 3));
      ctx.lineTo(side / 2, hTri / 3);
      ctx.lineTo(-side / 2, hTri / 3);
      ctx.closePath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
      ctx.restore();

      side *= 0.86;
      angle += 0.22;
    }
    ctx.restore();
  };

  // 69. Golden Spiral Grid
  newPatterns.goldenSpiralGrid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let curW = Math.min(w, h) * 0.7 * sc;
    let curH = curW / 1.618;
    let x = cx - curW / 2;
    let y = cy - curH / 2;

    for (let i = 0; i < 8; i++) {
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.strokeRect(x, y, curW, curH);

      // Arc
      ctx.beginPath();
      ctx.arc(x + curW, y + curH, curH, Math.PI, 1.5 * Math.PI);
      ctx.stroke();

      const nextW = curH;
      const nextH = curW - curH;
      curW = nextW;
      curH = nextH;
    }
  };

  // 70. Mandala Lotus (16-petal Sacred)
  newPatterns.mandalaLotus = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const rings = 4;
    const petals = 16;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let r = 1; r <= rings; r++) {
      const rad = r * 35 * sc;
      const col = cols[(r % (cols.length - 1)) + 1];
      for (let p = 0; p < petals; p++) {
        const a = rot + (p * 2 * Math.PI) / petals + (r % 2) * (Math.PI / petals);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(rad, 0, rad * 0.35, rad * 0.15, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  // 71. Sacred Hexagram
  newPatterns.sacredHexagram = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const grid = (70 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / grid) + 1;
    const rowsCount = Math.ceil(h / (grid * 0.866)) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * grid + (r % 2 === 0 ? 0 : grid / 2);
        const y = r * grid * 0.866;
        const col = cols[((r + c) % (cols.length - 1)) + 1];
        const rad = grid * 0.45;

        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        for (let t = 0; t < 2; t++) {
          ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            const a = (i * 2 * Math.PI) / 3 + t * Math.PI;
            const px = x + rad * Math.cos(a);
            const py = y + rad * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  };

  // 72. Islamic Muqarnas
  newPatterns.islamicMuqarnas = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const cell = (50 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / cell) + 1;
    const rowsCount = Math.ceil(h / cell) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * cell;
        const y = r * cell;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        // Arch cusp
        ctx.moveTo(x, y + cell);
        ctx.quadraticCurveTo(x + cell / 2, y, x + cell, y + cell);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell / 4, 0, Math.PI);
        ctx.stroke();
      }
    }
  };

  // 73. Girih Tiling
  newPatterns.girihTiling = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const size = (80 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / size) + 1;
    const rowsCount = Math.ceil(h / size) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const cx = c * size + size / 2;
        const cy = r * size + size / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        // 10-point strapwork lines
        for (let i = 0; i < 5; i++) {
          const a1 = (i * 2 * Math.PI) / 5;
          const a2 = a1 + (2 * Math.PI) / 10;
          ctx.beginPath();
          ctx.moveTo(cx + size * 0.45 * Math.cos(a1), cy + size * 0.45 * Math.sin(a1));
          ctx.lineTo(cx + size * 0.2 * Math.cos(a2), cy + size * 0.2 * Math.sin(a2));
          ctx.stroke();
        }
      }
    }
  };

  // 74. Zellige Tile
  newPatterns.zelligeTile = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const size = (70 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / size) + 1;
    const rowsCount = Math.ceil(h / size) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const cx = c * size + size / 2;
        const cy = r * size + size / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          const rad = i % 2 === 0 ? size * 0.45 : size * 0.22;
          const x = cx + rad * Math.cos(a);
          const y = cy + rad * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(col, op * 0.85);
        ctx.fill();
        ctx.strokeStyle = cols[0];
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 75. Chakra Wheel
  newPatterns.chakraWheel = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const spokes = Math.max(8, Math.round(S.density(s) * 2));
    const rOuter = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Rim
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, 2 * Math.PI);
    ctx.arc(cx, cy, rOuter * 0.85, 0, 2 * Math.PI);
    ctx.arc(cx, cy, rOuter * 0.2, 0, 2 * Math.PI);
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;
    ctx.stroke();

    // Spokes
    for (let i = 0; i < spokes; i++) {
      const a = rot + (i * 2 * Math.PI) / spokes;
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.moveTo(cx + rOuter * 0.2 * Math.cos(a), cy + rOuter * 0.2 * Math.sin(a));
      ctx.lineTo(cx + rOuter * 0.85 * Math.cos(a), cy + rOuter * 0.85 * Math.sin(a));
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;
      ctx.stroke();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 4: 🔬 FRACTALS, PHYSICS & CHAOS (25 Patterns)
  // ══════════════════════════════════════════════════════════════════════════

  // 76. Sierpinski Triangle
  newPatterns.sierpinskiTriangle = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const cx = w / 2, cy = h / 2;
    const depth = Math.max(3, Math.min(6, Math.round(S.density(s) * 0.8)));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const size = Math.min(w, h) * 0.85 * sc;
    const hTri = (Math.sqrt(3) / 2) * size;

    function drawTri(x, y, sVal, d) {
      if (d === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y - (hTri * sVal / size) * (2 / 3));
        ctx.lineTo(x + sVal / 2, y + (hTri * sVal / size) / 3);
        ctx.lineTo(x - sVal / 2, y + (hTri * sVal / size) / 3);
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(cols[1], op);
        ctx.fill();
        ctx.strokeStyle = cols[0];
        ctx.lineWidth = lt * sc;
        ctx.stroke();
        return;
      }
      const half = sVal / 2;
      const subH = (Math.sqrt(3) / 2) * half;
      drawTri(x, y - subH / 2, half, d - 1);
      drawTri(x - half / 2, y + subH / 2, half, d - 1);
      drawTri(x + half / 2, y + subH / 2, half, d - 1);
    }

    drawTri(cx, cy, size, depth);
  };

  // 77. Sierpinski Carpet
  newPatterns.sierpinskiCarpet = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const size = Math.min(w, h) * 0.8 * sc;
    const cx = w / 2, cy = h / 2;
    const depth = Math.max(2, Math.min(4, Math.round(S.density(s) * 0.6)));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = S.alphaColor(cols[1], op);
    ctx.fillRect(cx - size / 2, cy - size / 2, size, size);

    function cutHole(x, y, sVal, d) {
      if (d === 0) return;
      const step = sVal / 3;
      ctx.fillStyle = cols[0];
      ctx.fillRect(x + step, y + step, step, step);

      for (let dx = 0; dx < 3; dx++) {
        for (let dy = 0; dy < 3; dy++) {
          if (dx === 1 && dy === 1) continue;
          cutHole(x + dx * step, y + dy * step, step, d - 1);
        }
      }
    }

    cutHole(cx - size / 2, cy - size / 2, size, depth);
  };

  // 78. Koch Snowflake
  newPatterns.kochSnowflake = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.4);
    const cx = w / 2, cy = h / 2;
    const size = Math.min(w, h) * 0.42 * sc;
    const depth = Math.max(2, Math.min(4, Math.round(S.density(s) * 0.6)));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    function koch(p1, p2, d) {
      if (d === 0) {
        ctx.lineTo(p2.x, p2.y);
        return;
      }
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const a = { x: p1.x + dx / 3, y: p1.y + dy / 3 };
      const c = { x: p1.x + (dx * 2) / 3, y: p1.y + (dy * 2) / 3 };
      const sin60 = Math.sqrt(3) / 2;
      const cos60 = 0.5;
      const b = {
        x: a.x + (dx / 3) * cos60 + (dy / 3) * sin60,
        y: a.y - (dx / 3) * sin60 + (dy / 3) * cos60
      };
      koch(p1, a, d - 1);
      koch(a, b, d - 1);
      koch(b, c, d - 1);
      koch(c, p2, d - 1);
    }

    const pA = { x: cx, y: cy - size };
    const pB = { x: cx + size * (Math.sqrt(3) / 2), y: cy + size / 2 };
    const pC = { x: cx - size * (Math.sqrt(3) / 2), y: cy + size / 2 };

    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    koch(pA, pB, depth);
    koch(pB, pC, depth);
    koch(pC, pA, depth);
    ctx.closePath();
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;
    ctx.stroke();
  };

  // 79. Dragon Curve
  newPatterns.dragonCurve = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const cx = w / 2, cy = h / 2;
    const iters = Math.max(8, Math.min(13, Math.round(S.density(s) * 1.6)));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let turns = [];
    for (let i = 0; i < iters; i++) {
      const next = turns.slice().reverse().map(t => -t);
      turns.push(1);
      turns = turns.concat(next);
    }

    const step = (3.5 * sc);
    let x = cx - 60 * sc, y = cy + 40 * sc;
    let dir = S.rot(s);

    ctx.beginPath();
    ctx.moveTo(x, y);
    turns.forEach((turn, idx) => {
      dir += turn * (Math.PI / 2);
      x += step * Math.cos(dir);
      y += step * Math.sin(dir);
      ctx.lineTo(x, y);
    });
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;
    ctx.stroke();
  };

  // 80. Barnsley Fern
  newPatterns.barnsleyFern = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const points = 8000 * S.density(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let x = 0, y = 0;
    const col = cols[1];
    ctx.fillStyle = S.alphaColor(col, op * 0.6);

    for (let i = 0; i < points; i++) {
      const r = rng();
      let nx, ny;
      if (r < 0.01) {
        nx = 0;
        ny = 0.16 * y;
      } else if (r < 0.86) {
        nx = 0.85 * x + 0.04 * y;
        ny = -0.04 * x + 0.85 * y + 1.6;
      } else if (r < 0.93) {
        nx = 0.2 * x - 0.26 * y;
        ny = 0.23 * x + 0.22 * y + 1.6;
      } else {
        nx = -0.15 * x + 0.28 * y;
        ny = 0.26 * x + 0.24 * y + 0.44;
      }
      x = nx; y = ny;

      const px = w / 2 + x * 55 * sc;
      const py = h - y * 55 * sc - 20;
      ctx.fillRect(px, py, 1.5 * sc, 1.5 * sc);
    }
  };

  // 81. Cantor Dust
  newPatterns.cantorDust = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const depth = Math.max(3, Math.min(6, Math.round(S.density(s))));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = S.alphaColor(cols[1], op);
    function cantor(x, y, len, d) {
      if (d === 0) {
        ctx.fillRect(x, y, len, lt * sc * 2);
        return;
      }
      const third = len / 3;
      cantor(x, y, third, d - 1);
      cantor(x + 2 * third, y, third, d - 1);
    }

    const rows = 16;
    for (let r = 0; r < rows; r++) {
      cantor(40, (h / (rows + 1)) * (r + 1), w - 80, depth);
    }
  };

  // 82. Chladni Acoustics
  newPatterns.chladniAcoustics = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const n = Math.max(2, Math.round(S.density(s)));
    const m = n + 1;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const step = 8;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const nx = (x / w) * 2 - 1;
        const ny = (y / h) * 2 - 1;
        const val = Math.cos(n * Math.PI * nx) * Math.cos(m * Math.PI * ny) - Math.cos(m * Math.PI * nx) * Math.cos(n * Math.PI * ny);
        if (Math.abs(val) < 0.18) {
          ctx.fillStyle = S.alphaColor(cols[1], op);
          ctx.fillRect(x, y, step * sc, step * sc);
        }
      }
    }
  };

  // 83. Moiré Interference
  newPatterns.moireInterference = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const spacing = (8 + S.stripeW(s) * 0.2) * sc;
    const angle = S.rot(s) || 0.08;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Layer 1
    ctx.strokeStyle = S.alphaColor(cols[1], op * 0.7);
    ctx.lineWidth = lt * sc;
    for (let x = 0; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Layer 2 rotated
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);
    ctx.strokeStyle = S.alphaColor(cols[2 % cols.length], op * 0.7);
    const diag = Math.hypot(w, h);
    for (let x = -diag / 2; x < diag / 2; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, -diag / 2);
      ctx.lineTo(x, diag / 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  // 84. Magnetic Field
  newPatterns.magneticField = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.4);
    const cx = w / 2, cy = h / 2;
    const d = 100 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const poles = [
      { x: cx - d, y: cy, q: 1 },
      { x: cx + d, y: cy, q: -1 }
    ];

    const lines = Math.max(12, Math.round(S.density(s) * 3));
    for (let i = 0; i < lines; i++) {
      const a = (i * 2 * Math.PI) / lines;
      let x = poles[0].x + 12 * sc * Math.cos(a);
      let y = poles[0].y + 12 * sc * Math.sin(a);
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.moveTo(x, y);

      for (let step = 0; step < 120; step++) {
        let fx = 0, fy = 0;
        poles.forEach(p => {
          const dx = x - p.x;
          const dy = y - p.y;
          const rSq = dx * dx + dy * dy + 10;
          const f = p.q / rSq;
          fx += f * dx;
          fy += f * dy;
        });
        const len = Math.hypot(fx, fy) || 1;
        x += (fx / len) * 6 * sc;
        y += (fy / len) * 6 * sc;
        ctx.lineTo(x, y);
        if (Math.hypot(x - poles[1].x, y - poles[1].y) < 14 * sc) break;
      }
      ctx.stroke();
    }
  };

  // 85. Electric Potential Contours
  newPatterns.electricPotential = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const charges = [
      { x: cx - 120 * sc, y: cy, q: 1 },
      { x: cx + 120 * sc, y: cy, q: 1 },
      { x: cx, y: cy - 80 * sc, q: -1 }
    ];

    const levels = 20;
    for (let l = 1; l <= levels; l++) {
      const r = l * 18 * sc;
      const col = cols[(l % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  // 86. Voronoi Stained Glass
  newPatterns.voronoiStainedGlass = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const count = Math.max(15, Math.round(S.density(s) * 4));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const pts = [];
    for (let i = 0; i < count; i++) {
      pts.push({ x: rng() * w, y: rng() * h, col: cols[(i % (cols.length - 1)) + 1] });
    }

    const step = 12;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        let minD = Infinity;
        let chosen = pts[0];
        pts.forEach(p => {
          const d = Math.hypot(x - p.x, y - p.y);
          if (d < minD) { minD = d; chosen = p; }
        });
        ctx.fillStyle = S.alphaColor(chosen.col, op);
        ctx.fillRect(x, y, step, step);
      }
    }
  };

  // 87. Voronoi Bubbles
  newPatterns.voronoiBubbles = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const count = Math.max(20, Math.round(S.density(s) * 6));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const bx = rng() * w;
      const by = rng() * h;
      const br = (20 + rng() * 40) * sc;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.arc(bx, by, br, 0, 2 * Math.PI);
      ctx.fillStyle = S.alphaColor(col, op * 0.25);
      ctx.fill();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }
  };

  // 88. Perlin Topography
  newPatterns.perlinTopography = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const lines = Math.max(12, Math.round(S.density(s) * 3));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < lines; i++) {
      const cy = (h / (lines + 1)) * (i + 1);
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let x = 0; x <= w; x += 5) {
        const y = cy + 25 * sc * Math.sin(x * 0.015 + i * 0.5) + 15 * sc * Math.cos(x * 0.03 - i * 0.2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 89. Quantum Wavefunction
  newPatterns.quantumWavefunction = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const bands = 8;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let b = 1; b <= bands; b++) {
      const col = cols[(b % (cols.length - 1)) + 1];
      const y0 = (h / (bands + 1)) * b;
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let x = 0; x <= w; x += 3) {
        const psi = Math.sin((b * Math.PI * x) / w) * 35 * sc;
        const y = y0 + psi;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 90. Reaction Diffusion (Turing Spots)
  newPatterns.reactionDiffusion = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const grid = (30 + S.stripeW(s) * 0.6) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / grid) + 1;
    const rowsCount = Math.ceil(h / grid) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const cx = c * grid + grid / 2;
        const cy = r * grid + grid / 2;
        const rad = grid * 0.35 * (0.4 + 0.6 * rng());
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.fillStyle = S.alphaColor(col, op);
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // 91. Strange Attractor
  newPatterns.strangeAttractor = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const steps = 6000 * S.density(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let x = 0.1, y = 0.1;
    const a = 1.4, b = 0.3;
    const col = cols[1];
    ctx.fillStyle = S.alphaColor(col, op * 0.5);

    for (let i = 0; i < steps; i++) {
      const nx = 1 - a * x * x + y;
      const ny = b * x;
      x = nx; y = ny;

      const px = w / 2 + x * 200 * sc;
      const py = h / 2 + y * 200 * sc;
      ctx.fillRect(px, py, 1.5 * sc, 1.5 * sc);
    }
  };

  // 92. Cellular Automata (Rule 30)
  newPatterns.cellularAutomata = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const cellSize = Math.max(3, Math.round(6 * sc));
    const colsCount = Math.ceil(w / cellSize);
    const rowsCount = Math.ceil(h / cellSize);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let state = new Array(colsCount).fill(0);
    state[Math.floor(colsCount / 2)] = 1;

    ctx.fillStyle = S.alphaColor(cols[1], op);
    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        if (state[c] === 1) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
      const next = new Array(colsCount).fill(0);
      for (let c = 0; c < colsCount; c++) {
        const left = c > 0 ? state[c - 1] : 0;
        const self = state[c];
        const right = c < colsCount - 1 ? state[c + 1] : 0;
        // Rule 30: left ^ (self | right)
        next[c] = left ^ (self | right);
      }
      state = next;
    }
  };

  // 93. Apollonian Gasket
  newPatterns.apollonianGasket = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Outer circle
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;
    ctx.stroke();

    // 3 interior touching circles
    const rIn = R / (1 + 2 / Math.sqrt(3));
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
      const d = R - rIn;
      const col = cols[(i + 1) % cols.length];
      ctx.beginPath();
      ctx.arc(cx + d * Math.cos(a), cy + d * Math.sin(a), rIn, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.stroke();
    }
  };

  // 94. Dendrite Crystal
  newPatterns.dendriteCrystal = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let arm = 0; arm < 6; arm++) {
      const a = rot + (arm * Math.PI) / 3;
      const col = cols[(arm % (cols.length - 1)) + 1];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(160 * sc, 0);
      for (let x = 30 * sc; x < 150 * sc; x += 25 * sc) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 20 * sc, 25 * sc);
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 20 * sc, -25 * sc);
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  // 95. Diffusion Limited Aggregation (DLA)
  newPatterns.diffusionLimited = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const cx = w / 2, cy = h / 2;
    const branches = 800 * S.density(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = S.alphaColor(cols[1], op);
    ctx.beginPath();
    ctx.arc(cx, cy, 5 * sc, 0, 2 * Math.PI);
    ctx.fill();

    for (let i = 0; i < branches; i++) {
      const a = rng() * 2 * Math.PI;
      const r = Math.pow(rng(), 0.5) * 180 * sc;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.fillStyle = S.alphaColor(col, op * 0.7);
      ctx.fillRect(px, py, 2 * sc, 2 * sc);
    }
  };

  // 96. Fractal Tree
  newPatterns.fractalTree = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    function branch(x, y, len, angle, d) {
      if (d === 0) return;
      const x2 = x + len * Math.cos(angle);
      const y2 = y + len * Math.sin(angle);
      const col = cols[(d % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * (d * 0.4);
      ctx.stroke();

      branch(x2, y2, len * 0.72, angle - 0.45, d - 1);
      branch(x2, y2, len * 0.72, angle + 0.45, d - 1);
    }

    branch(w / 2, h - 20, 100 * sc, -Math.PI / 2, 8);
  };

  // 97. Plasma Discharge Lightning
  newPatterns.plasmaDischarge = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const bolts = 12;
    for (let b = 0; b < bolts; b++) {
      const angle = (b * 2 * Math.PI) / bolts;
      const col = cols[(b % (cols.length - 1)) + 1];
      let x = cx, y = cy;

      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.moveTo(x, y);

      for (let step = 0; step < 25; step++) {
        x += 10 * sc * Math.cos(angle) + (rng() - 0.5) * 16 * sc;
        y += 10 * sc * Math.sin(angle) + (rng() - 0.5) * 16 * sc;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 98. Gravitational Lens Photon Rings
  newPatterns.gravitationalLens = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rings = 18;
    for (let r = 1; r <= rings; r++) {
      const rad = r * 15 * sc;
      const col = cols[(r % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op * (1 - r / rings * 0.5));
      ctx.lineWidth = lt * sc * (1 + 3 * Math.exp(-r * 0.2));
      ctx.stroke();
    }
  };

  // 99. Fluid Turbulence Eddies
  newPatterns.fluidTurbulence = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const eddies = 25;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < eddies; i++) {
      const ex = rng() * w;
      const ey = rng() * h;
      const er = (20 + rng() * 60) * sc;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.arc(ex, ey, er, 0, 1.8 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op * 0.6);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }
  };

  // 100. Acoustic Standing Wave Lattice
  newPatterns.acousticLattice = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const k = (25 + S.stripeW(s) * 0.5) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const step = 8;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const val = Math.sin(x / k) * Math.sin(y / k);
        if (Math.abs(val) > 0.6) {
          ctx.fillStyle = S.alphaColor(cols[1], op * Math.abs(val));
          ctx.fillRect(x, y, step, step);
        }
      }
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 5: 🏛 ARCHITECTURAL, TESSELLATIONS & OPTICAL (25 Patterns)
  // ══════════════════════════════════════════════════════════════════════════

  // 101. Penrose Tiling
  newPatterns.penroseTiling = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const size = (40 + S.stripeW(s) * 0.5) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / size) + 1;
    const rowsCount = Math.ceil(h / size) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * size;
        const y = r * size;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);
        ctx.rotate(((c + r) % 5) * ((2 * Math.PI) / 5));

        ctx.beginPath();
        ctx.moveTo(0, -size * 0.45);
        ctx.lineTo(size * 0.35, 0);
        ctx.lineTo(0, size * 0.45);
        ctx.lineTo(-size * 0.35, 0);
        ctx.closePath();

        ctx.fillStyle = S.alphaColor(col, op * 0.7);
        ctx.fill();
        ctx.strokeStyle = cols[0];
        ctx.lineWidth = lt * sc;
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  // 102. Truchet Tiles
  newPatterns.truchetTiles = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const size = (35 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / size) + 1;
    const rowsCount = Math.ceil(h / size) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * size;
        const y = r * size;
        const flip = (r * 13 + c * 37) % 2 === 0;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc * 1.5;

        if (flip) {
          ctx.arc(x, y, size / 2, 0, Math.PI / 2);
          ctx.arc(x + size, y + size, size / 2, Math.PI, 1.5 * Math.PI);
        } else {
          ctx.arc(x + size, y, size / 2, Math.PI / 2, Math.PI);
          ctx.arc(x, y + size, size / 2, 1.5 * Math.PI, 2 * Math.PI);
        }
        ctx.stroke();
      }
    }
  };

  // 103. Truchet Diagonal Maze
  newPatterns.truchetDiagonal = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const size = (30 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / size) + 1;
    const rowsCount = Math.ceil(h / size) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * size;
        const y = r * size;
        const flip = (r * 17 + c * 29) % 2 === 0;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc * 1.5;

        if (flip) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + size, y + size);
        } else {
          ctx.moveTo(x + size, y);
          ctx.lineTo(x, y + size);
        }
        ctx.stroke();
      }
    }
  };

  // 104. Escher Cubes (Isometric Illusion)
  newPatterns.escherCubes = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const a = (30 + S.stripeW(s) * 0.8) * sc;
    const dx = a * Math.sqrt(3);
    const dy = a * 1.5;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / dx) + 2;
    const rowsCount = Math.ceil(h / dy) + 2;

    for (let r = -1; r <= rowsCount; r++) {
      for (let c = -1; c <= colsCount; c++) {
        const cx = c * dx + (r % 2 === 0 ? 0 : dx / 2);
        const cy = r * dy;

        // Top face
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx / 2, cy - a * 0.5);
        ctx.lineTo(cx, cy - a);
        ctx.lineTo(cx - dx / 2, cy - a * 0.5);
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(cols[1], op);
        ctx.fill();

        // Left face
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - dx / 2, cy - a * 0.5);
        ctx.lineTo(cx - dx / 2, cy + a * 0.5);
        ctx.lineTo(cx, cy + a);
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(cols[2 % cols.length], op * 0.8);
        ctx.fill();

        // Right face
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx / 2, cy - a * 0.5);
        ctx.lineTo(cx + dx / 2, cy + a * 0.5);
        ctx.lineTo(cx, cy + a);
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(cols[(cols.length - 1)], op * 0.6);
        ctx.fill();
      }
    }
  };

  // 105. Impossible Triangle
  newPatterns.impossibleTriangle = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;
    const size = 100 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(S.rot(s));

    const vertices = [
      { x: 0, y: -size },
      { x: size * 0.866, y: size * 0.5 },
      { x: -size * 0.866, y: size * 0.5 }
    ];

    vertices.forEach((v, i) => {
      const col = cols[(i + 1) % cols.length];
      const nextV = vertices[(i + 1) % 3];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 2;
      ctx.moveTo(v.x, v.y);
      ctx.lineTo(nextV.x, nextV.y);
      ctx.stroke();
    });
    ctx.restore();
  };

  // 106. Bauhaus Geometric
  newPatterns.bauhausGeo = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const grid = (70 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / grid) + 1;
    const rowsCount = Math.ceil(h / grid) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * grid;
        const y = r * grid;
        const col = cols[((r + c) % (cols.length - 1)) + 1];
        const mode = (r * 7 + c * 11) % 3;

        ctx.fillStyle = S.alphaColor(col, op);
        if (mode === 0) {
          ctx.beginPath();
          ctx.arc(x + grid / 2, y + grid / 2, grid * 0.4, 0, 2 * Math.PI);
          ctx.fill();
        } else if (mode === 1) {
          ctx.beginPath();
          ctx.moveTo(x + 5, y + grid - 5);
          ctx.lineTo(x + grid / 2, y + 5);
          ctx.lineTo(x + grid - 5, y + grid - 5);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(x + 8, y + 8, grid - 16, grid - 16);
        }
      }
    }
  };

  // 107. Art Deco Fan
  newPatterns.artDecoFan = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const r = (50 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / (r * 2)) + 2;
    const rowsCount = Math.ceil(h / r) + 2;

    for (let row = -1; row <= rowsCount; row++) {
      for (let col = -1; col <= colsCount; col++) {
        const ox = col * r * 2 + (row % 2 === 0 ? 0 : r);
        const oy = row * r;

        for (let ring = 1; ring <= 4; ring++) {
          const rad = (ring / 4) * r;
          const color = cols[(ring % (cols.length - 1)) + 1];
          ctx.beginPath();
          ctx.arc(ox, oy, rad, 0, Math.PI);
          ctx.strokeStyle = S.alphaColor(color, op);
          ctx.lineWidth = lt * sc;
          ctx.stroke();
        }
      }
    }
  };

  // 108. Art Deco Chevron
  newPatterns.artDecoChevron = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const stepH = (30 + S.stripeW(s)) * sc;
    const colW = stepH * 1.5;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / colW) + 1;
    const rowsCount = Math.ceil(h / stepH) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * colW;
        const y = r * stepH;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        ctx.moveTo(x, y + stepH);
        ctx.lineTo(x + colW / 2, y);
        ctx.lineTo(x + colW, y + stepH);
        ctx.stroke();
      }
    }
  };

  // 109. Houndstooth Pro
  newPatterns.houndstoothPro = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const u = (25 + S.stripeW(s) * 0.5) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / (u * 4)) + 1;
    const rowsCount = Math.ceil(h / (u * 4)) + 1;

    ctx.fillStyle = S.alphaColor(cols[1], op);
    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const ox = c * u * 4;
        const oy = r * u * 4;

        ctx.fillRect(ox, oy, u * 2, u * 2);
        ctx.fillRect(ox + u * 2, oy + u * 2, u * 2, u * 2);

        // Notches
        ctx.beginPath();
        ctx.moveTo(ox + u * 2, oy);
        ctx.lineTo(ox + u * 4, oy + u * 2);
        ctx.lineTo(ox + u * 2, oy + u * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  };

  // 110. Harlequin Diamond
  newPatterns.harlequinDiamond = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const dw = (35 + S.stripeW(s)) * sc;
    const dh = dw * 1.8;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / dw) + 2;
    const rowsCount = Math.ceil(h / (dh / 2)) + 2;

    for (let r = -1; r <= rowsCount; r++) {
      for (let c = -1; c <= colsCount; c++) {
        const cx = c * dw + (r % 2 === 0 ? 0 : dw / 2);
        const cy = r * (dh / 2);
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.moveTo(cx, cy - dh / 2);
        ctx.lineTo(cx + dw / 2, cy);
        ctx.lineTo(cx, cy + dh / 2);
        ctx.lineTo(cx - dw / 2, cy);
        ctx.closePath();

        ctx.fillStyle = S.alphaColor(col, op);
        ctx.fill();
        ctx.strokeStyle = cols[0];
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 111. Tartaruga Tortoise Shell
  newPatterns.tartarugaTortoise = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rHex = (40 + S.stripeW(s)) * sc;
    const dx = rHex * Math.sqrt(3);
    const dy = rHex * 1.5;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / dx) + 2;
    const rowsCount = Math.ceil(h / dy) + 2;

    for (let r = -1; r <= rowsCount; r++) {
      for (let c = -1; c <= colsCount; c++) {
        const cx = c * dx + (r % 2 === 0 ? 0 : dx / 2);
        const cy = r * dy;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const x = cx + rHex * 0.9 * Math.cos(a);
          const y = cy + rHex * 0.9 * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(col, op * 0.85);
        ctx.fill();
        ctx.strokeStyle = cols[0];
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 112. Fish Scales (Seigaiha Wave)
  newPatterns.fishScales = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const r = (35 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / r) + 2;
    const rowsCount = Math.ceil(h / (r * 0.5)) + 2;

    for (let row = -1; row <= rowsCount; row++) {
      for (let col = -1; col <= colsCount; col++) {
        const cx = col * r + (row % 2 === 0 ? 0 : r / 2);
        const cy = row * (r * 0.5);
        const color = cols[((row + col) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI);
        ctx.strokeStyle = S.alphaColor(color, op);
        ctx.lineWidth = lt * sc * 1.5;
        ctx.stroke();
      }
    }
  };

  // 113. Basket Weave Pro
  newPatterns.basketWeavePro = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const u = (25 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / (u * 2)) + 1;
    const rowsCount = Math.ceil(h / (u * 2)) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * u * 2;
        const y = r * u * 2;
        const col1 = cols[((r + c) % (cols.length - 1)) + 1];
        const col2 = cols[((r + c + 1) % (cols.length - 1)) + 1];

        if ((r + c) % 2 === 0) {
          ctx.fillStyle = S.alphaColor(col1, op);
          ctx.fillRect(x, y, u * 2, u);
          ctx.fillStyle = S.alphaColor(col2, op);
          ctx.fillRect(x, y + u, u * 2, u);
        } else {
          ctx.fillStyle = S.alphaColor(col1, op);
          ctx.fillRect(x, y, u, u * 2);
          ctx.fillStyle = S.alphaColor(col2, op);
          ctx.fillRect(x + u, y, u, u * 2);
        }
      }
    }
  };

  // 114. Honeycomb Lattice
  newPatterns.honeycombLattice = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rHex = (25 + S.stripeW(s)) * sc;
    const dx = rHex * Math.sqrt(3);
    const dy = rHex * 1.5;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / dx) + 2;
    const rowsCount = Math.ceil(h / dy) + 2;

    for (let r = -1; r <= rowsCount; r++) {
      for (let c = -1; c <= colsCount; c++) {
        const cx = c * dx + (r % 2 === 0 ? 0 : dx / 2);
        const cy = r * dy;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const x = cx + rHex * Math.cos(a);
          const y = cy + rHex * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = S.alphaColor(cols[1], op);
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 115. Wireframe Synthwave Terrain
  newPatterns.wireframeTerrain = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const horizon = h * 0.45;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    // Perspective lines
    const rays = 16;
    for (let i = 0; i <= rays; i++) {
      const bottomX = (w / rays) * i;
      ctx.beginPath();
      ctx.moveTo(w / 2, horizon);
      ctx.lineTo(bottomX, h);
      ctx.stroke();
    }

    // Horizontal grids
    for (let y = horizon; y <= h; y += Math.pow((y - horizon + 10) / (h - horizon), 1.6) * 40 * sc) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  // 116. Geodesic Dome
  newPatterns.geodesicDome = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const cx = w / 2, cy = h / 2;
    const rDome = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const nodes = [];
    const rings = 5;
    for (let r = 1; r <= rings; r++) {
      const rad = (r / rings) * rDome;
      const count = r * 6;
      for (let i = 0; i < count; i++) {
        const a = (i * 2 * Math.PI) / count;
        nodes.push({ x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) });
      }
    }

    ctx.strokeStyle = S.alphaColor(cols[1], op * 0.75);
    ctx.lineWidth = lt * sc;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 45 * sc) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // 117. Origami Fold
  newPatterns.origamiFold = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const cell = (60 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / cell) + 1;
    const rowsCount = Math.ceil(h / cell) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * cell;
        const y = r * cell;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell, y);
        ctx.lineTo(x + cell / 2, y + cell / 2);
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(col, op * 0.85);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cell);
        ctx.lineTo(x + cell / 2, y + cell / 2);
        ctx.closePath();
        ctx.fillStyle = S.alphaColor(col, op * 0.6);
        ctx.fill();
      }
    }
  };

  // 118. Op-Art Tunnel
  newPatterns.opArtTunnel = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;
    const maxS = Math.max(w, h);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rects = 24;
    for (let i = rects; i >= 1; i--) {
      const size = (i / rects) * maxS * sc;
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.fillStyle = i % 2 === 0 ? S.alphaColor(col, op) : cols[0];
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      ctx.strokeStyle = cols[0];
      ctx.lineWidth = lt * sc;
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);
    }
  };

  // 119. Op-Art Wave
  newPatterns.opArtWave = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const lines = Math.max(16, Math.round(S.density(s) * 4));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < lines; i++) {
      const cy = (h / lines) * i;
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * (1 + Math.sin((i / lines) * Math.PI) * 2);

      for (let x = 0; x <= w; x += 5) {
        const y = cy + 25 * sc * Math.sin(x * 0.02 + (i * 0.3));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 120. Cuboctahedron
  newPatterns.cuboctahedron = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const size = (50 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / size) + 1;
    const rowsCount = Math.ceil(h / size) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * size;
        const y = r * size;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        ctx.strokeRect(x, y, size, size);
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x + size / 2, y + size);
        ctx.lineTo(x, y + size / 2);
        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  // 121. Kagome Lattice
  newPatterns.kagomeLattice = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const a = (40 + S.stripeW(s)) * sc;
    const dx = a * 2;
    const dy = a * Math.sqrt(3);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / dx) + 2;
    const rowsCount = Math.ceil(h / dy) + 2;

    for (let r = -1; r <= rowsCount; r++) {
      for (let c = -1; c <= colsCount; c++) {
        const x = c * dx + (r % 2 === 0 ? 0 : dx / 2);
        const y = r * dy;

        ctx.strokeStyle = S.alphaColor(cols[1], op);
        ctx.lineWidth = lt * sc;

        // Triangles and hex
        ctx.beginPath();
        ctx.moveTo(x, y - a);
        ctx.lineTo(x + a * 0.866, y + a * 0.5);
        ctx.lineTo(x - a * 0.866, y + a * 0.5);
        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  // 122. Marquetry Wood
  newPatterns.marquetryWood = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const u = (35 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / u) + 1;
    const rowsCount = Math.ceil(h / u) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * u;
        const y = r * u;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.fillStyle = S.alphaColor(col, op * (0.6 + 0.4 * rng()));
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + u, y + u);
        ctx.lineTo(x, y + u);
        ctx.closePath();
        ctx.fill();
      }
    }
  };

  // 123. Arabesque Scroll
  newPatterns.arabesqueScroll = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cell = (60 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / cell) + 1;
    const rowsCount = Math.ceil(h / cell) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * cell;
        const y = r * cell;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.beginPath();
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;

        ctx.moveTo(x, y + cell / 2);
        ctx.bezierCurveTo(x + cell * 0.25, y, x + cell * 0.75, y + cell, x + cell, y + cell / 2);
        ctx.stroke();
      }
    }
  };

  // 124. Greek Key Meander
  newPatterns.greekKeyMeander = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2.5);
    const u = (12 + S.stripeW(s) * 0.3) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const bandH = u * 6;
    const rows = Math.ceil(h / bandH) + 1;
    const colsCount = Math.ceil(w / (u * 6)) + 1;

    for (let r = 0; r < rows; r++) {
      const cy = r * bandH;
      const col = cols[(r % (cols.length - 1)) + 1];
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;

      for (let c = 0; c < colsCount; c++) {
        const ox = c * u * 6;
        ctx.beginPath();
        ctx.moveTo(ox, cy + u * 5);
        ctx.lineTo(ox, cy + u);
        ctx.lineTo(ox + u * 5, cy + u);
        ctx.lineTo(ox + u * 5, cy + u * 5);
        ctx.lineTo(ox + u * 2, cy + u * 5);
        ctx.lineTo(ox + u * 2, cy + u * 3);
        ctx.lineTo(ox + u * 4, cy + u * 3);
        ctx.stroke();
      }
    }
  };

  // 125. Versace Baroque
  newPatterns.versaceBaroque = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;
    const rMax = Math.min(w, h) * 0.42 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(S.rot(s));

    // Greek Key Medallion Ring
    ctx.beginPath();
    ctx.arc(0, 0, rMax, 0, 2 * Math.PI);
    ctx.arc(0, 0, rMax * 0.8, 0, 2 * Math.PI);
    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc * 2;
    ctx.stroke();

    // Medusa Acanthus Leaves
    for (let i = 0; i < 16; i++) {
      const a = (i * 2 * Math.PI) / 16;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(rMax * 0.3, 0);
      ctx.bezierCurveTo(rMax * 0.5, rMax * 0.15, rMax * 0.7, -rMax * 0.1, rMax * 0.8, 0);
      ctx.strokeStyle = S.alphaColor(cols[2 % cols.length], op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 6: ⚡ DIGITAL, FUTURISTIC, COSMIC & ABSTRACT (25 Patterns)
  // ══════════════════════════════════════════════════════════════════════════

  // 126. Cyberpunk Circuit
  newPatterns.cyberpunkCircuit = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const traces = Math.max(20, Math.round(S.density(s) * 5));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < traces; i++) {
      let x = rng() * w;
      let y = rng() * h;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;
      ctx.moveTo(x, y);

      for (let seg = 0; seg < 4; seg++) {
        const dir = Math.floor(rng() * 4);
        const len = (20 + rng() * 60) * sc;
        if (dir === 0) x += len;
        else if (dir === 1) x -= len;
        else if (dir === 2) y += len;
        else y -= len;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Via pad
      ctx.fillStyle = S.alphaColor(col, op);
      ctx.beginPath();
      ctx.arc(x, y, 3 * sc, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // 127. Synthwave Sun
  newPatterns.synthwaveSun = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const cx = w / 2, cy = h * 0.45;
    const rSun = Math.min(w, h) * 0.32 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Sun disk
    ctx.beginPath();
    ctx.arc(cx, cy, rSun, 0, 2 * Math.PI);
    ctx.fillStyle = S.alphaColor(cols[1], op);
    ctx.fill();

    // Horizon line slits
    const slits = 12;
    for (let i = 1; i <= slits; i++) {
      const slitY = cy + (i / slits) * rSun;
      const slitH = Math.pow(i / slits, 1.8) * 12 * sc;
      ctx.fillStyle = cols[0];
      ctx.fillRect(cx - rSun - 10, slitY, (rSun + 10) * 2, slitH);
    }
  };

  // 128. Matrix Rain
  newPatterns.matrixRain = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const colW = 16 * sc;
    const colsCount = Math.floor(w / colW);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${Math.round(12 * sc)}px monospace`;
    for (let c = 0; c < colsCount; c++) {
      const len = 8 + Math.floor(rng() * 15);
      const startY = (rng() * h);
      const col = cols[1];

      for (let i = 0; i < len; i++) {
        const y = (startY + i * 16 * sc) % h;
        const char = String.fromCharCode(0x30A0 + Math.floor(rng() * 96));
        ctx.fillStyle = i === len - 1 ? '#ffffff' : S.alphaColor(col, op * (i / len));
        ctx.fillText(char, c * colW, y);
      }
    }
  };

  // 129. Hologram Hex Shield
  newPatterns.hologramHex = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const rHex = (20 + S.stripeW(s) * 0.4) * sc;
    const dx = rHex * Math.sqrt(3);
    const dy = rHex * 1.5;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / dx) + 2;
    const rowsCount = Math.ceil(h / dy) + 2;

    for (let r = -1; r <= rowsCount; r++) {
      for (let c = -1; c <= colsCount; c++) {
        const cx = c * dx + (r % 2 === 0 ? 0 : dx / 2);
        const cy = r * dy;
        const pulse = 0.3 + 0.7 * Math.sin(r * 0.5 + c * 0.5 + S.rot(s));

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const x = cx + rHex * 0.9 * Math.cos(a);
          const y = cy + rHex * 0.9 * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = S.alphaColor(cols[1], op * pulse);
        ctx.lineWidth = lt * sc;
        ctx.stroke();
      }
    }
  };

  // 130. Audio Spectrum
  newPatterns.audioSpectrum = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const bars = Math.max(32, Math.round(S.density(s) * 8));
    const rBase = 80 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < bars; i++) {
      const a = rot + (i * 2 * Math.PI) / bars;
      const hBar = (10 + Math.abs(Math.sin(i * 0.4)) * 70) * sc;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(cx + rBase * Math.cos(a), cy + rBase * Math.sin(a));
      ctx.lineTo(cx + (rBase + hBar) * Math.cos(a), cy + (rBase + hBar) * Math.sin(a));
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * 1.5;
      ctx.stroke();
    }
  };

  // 131. DNA Helix Lattice
  newPatterns.dnaHelix = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const amp = 60 * sc;
    const period = 80 * sc;

    for (let y = 0; y <= h; y += 12 * sc) {
      const x1 = cx + amp * Math.sin((y / period) * 2 * Math.PI);
      const x2 = cx - amp * Math.sin((y / period) * 2 * Math.PI);

      // Base pair bridge
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = S.alphaColor(cols[1], op * 0.5);
      ctx.lineWidth = lt * sc;
      ctx.stroke();

      // Strand dots
      ctx.fillStyle = S.alphaColor(cols[1], op);
      ctx.beginPath();
      ctx.arc(x1, y, 4 * sc, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = S.alphaColor(cols[2 % cols.length], op);
      ctx.beginPath();
      ctx.arc(x2, y, 4 * sc, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // 132. Quantum Dots
  newPatterns.quantumDots = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const grid = (25 + S.stripeW(s) * 0.5) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / grid) + 1;
    const rowsCount = Math.ceil(h / grid) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * grid + grid / 2;
        const y = r * grid + grid / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];
        const rad = (3 + (Math.sin(r * 0.4) + Math.cos(c * 0.4)) * 2) * sc;

        ctx.fillStyle = S.alphaColor(col, op);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, rad), 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // 133. Glitch Scanlines
  newPatterns.glitchScanlines = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, y, w, 2);
    }

    const glitches = 15;
    for (let i = 0; i < glitches; i++) {
      const gy = rng() * h;
      const gh = (4 + rng() * 16) * sc;
      const gw = (40 + rng() * 200) * sc;
      const gx = rng() * (w - gw);
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.fillStyle = S.alphaColor(col, op * 0.85);
      ctx.fillRect(gx, gy, gw, gh);
    }
  };

  // 134. Fiber Optic
  newPatterns.fiberOptic = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const count = 40 * S.density(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const sx = 0;
      const sy = rng() * h;
      const ex = w;
      const ey = rng() * h;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(w * 0.3, sy + (rng() - 0.5) * 80 * sc, w * 0.7, ey + (rng() - 0.5) * 80 * sc, ex, ey);
      ctx.strokeStyle = S.alphaColor(col, op * 0.4);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }
  };

  // 135. Laser Grid
  newPatterns.laserGrid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const gap = (40 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = S.alphaColor(cols[1], op);
    ctx.lineWidth = lt * sc;

    for (let x = 0; x <= w; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Intersect nodes
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x <= w; x += gap) {
      for (let y = 0; y <= h; y += gap) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5 * sc, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // 136. Warp Speed
  newPatterns.warpSpeed = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const cx = w / 2, cy = h / 2;
    const count = 250;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const a = rng() * 2 * Math.PI;
      const rInner = (20 + rng() * 80) * sc;
      const rOuter = rInner + (20 + rng() * 120) * sc;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(cx + rInner * Math.cos(a), cy + rInner * Math.sin(a));
      ctx.lineTo(cx + rOuter * Math.cos(a), cy + rOuter * Math.sin(a));
      ctx.strokeStyle = S.alphaColor(col, op * rng());
      ctx.lineWidth = (1 + rng() * 2.5) * sc;
      ctx.stroke();
    }
  };

  // 137. Cosmic Constellation
  newPatterns.cosmicConstellation = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.2);
    const stars = 60;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const pts = [];
    for (let i = 0; i < stars; i++) {
      pts.push({ x: rng() * w, y: rng() * h, r: (1.5 + rng() * 3) * sc });
    }

    // Connect close stars
    ctx.strokeStyle = S.alphaColor(cols[1], op * 0.4);
    ctx.lineWidth = lt * sc;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 70 * sc) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // Stars
    pts.forEach(p => {
      ctx.fillStyle = S.alphaColor(cols[2 % cols.length], op);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // 138. Supernova Burst
  newPatterns.supernovaBurst = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const cx = w / 2, cy = h / 2;
    const rays = 120;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < rays; i++) {
      const a = (i * 2 * Math.PI) / rays;
      const len = (40 + rng() * 220) * sc;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + len * Math.cos(a), cy + len * Math.sin(a));
      ctx.strokeStyle = S.alphaColor(col, op * (0.3 + 0.7 * rng()));
      ctx.lineWidth = lt * sc * (0.8 + rng());
      ctx.stroke();
    }
  };

  // 139. Aurora Borealis
  newPatterns.auroraBorealis = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const curtains = 5;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let c = 0; c < curtains; c++) {
      const cy = (h * 0.3) + c * 40 * sc;
      const col = cols[(c % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 10) {
        const y = cy + 40 * sc * Math.sin(x * 0.01 + c) + 20 * sc * Math.cos(x * 0.02 - c);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = S.alphaColor(col, op * 0.25);
      ctx.fill();
    }
  };

  // 140. Black Hole Disk
  newPatterns.blackHoleDisk = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;
    const rEvent = 50 * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    // Accretion disk rings
    const rings = 18;
    for (let r = 1; r <= rings; r++) {
      const rx = rEvent + r * 10 * sc;
      const ry = (rEvent + r * 10 * sc) * 0.35;
      const col = cols[(r % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, S.rot(s), 0, 2 * Math.PI);
      ctx.strokeStyle = S.alphaColor(col, op * (1 - r / rings * 0.6));
      ctx.lineWidth = lt * sc * (1 + (rings - r) * 0.2);
      ctx.stroke();
    }

    // Shadow sphere
    ctx.beginPath();
    ctx.arc(cx, cy, rEvent, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();
  };

  // 141. Carbon Fiber Twill
  newPatterns.carbonFiberTwill = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const u = (12 + S.stripeW(s) * 0.3) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / (u * 4)) + 1;
    const rowsCount = Math.ceil(h / (u * 4)) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * u * 4;
        const y = r * u * 4;

        ctx.fillStyle = S.alphaColor(cols[1], op * 0.85);
        ctx.fillRect(x, y, u * 2, u * 2);
        ctx.fillRect(x + u * 2, y + u * 2, u * 2, u * 2);

        ctx.fillStyle = S.alphaColor(cols[2 % cols.length], op * 0.5);
        ctx.fillRect(x + u * 2, y, u * 2, u * 2);
        ctx.fillRect(x, y + u * 2, u * 2, u * 2);
      }
    }
  };

  // 142. Retrofuturism
  newPatterns.retrofuturism = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cell = (90 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / cell) + 1;
    const rowsCount = Math.ceil(h / cell) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const cx = c * cell + cell / 2;
        const cy = r * cell + cell / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        // Boomerang / Atomic oval
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((c * 45 + r * 30) * (Math.PI / 180));

        ctx.beginPath();
        ctx.ellipse(0, 0, cell * 0.4, cell * 0.15, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;
        ctx.stroke();

        ctx.fillStyle = S.alphaColor(col, op);
        ctx.beginPath();
        ctx.arc(0, 0, 5 * sc, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  // 143. Halftone Pop-Art
  newPatterns.halftonePopArt = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const grid = (18 + S.stripeW(s) * 0.4) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / grid) + 1;
    const rowsCount = Math.ceil(h / grid) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * grid + grid / 2;
        const y = r * grid + grid / 2;
        const col = cols[((r + c) % (cols.length - 1)) + 1];
        const dist = Math.hypot(x - w / 2, y - h / 2);
        const rad = Math.max(1, (grid * 0.45) * (1 - dist / Math.hypot(w / 2, h / 2)));

        ctx.fillStyle = S.alphaColor(col, op);
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // 144. Vector Flow Field
  newPatterns.vectorFlowField = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.4);
    const count = 300 * S.density(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      let x = rng() * w;
      let y = rng() * h;
      const col = cols[(i % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op * 0.6);
      ctx.lineWidth = lt * sc;
      ctx.moveTo(x, y);

      for (let step = 0; step < 15; step++) {
        const angle = Math.sin(x * 0.008) * Math.cos(y * 0.008) * 4;
        x += 6 * sc * Math.cos(angle);
        y += 6 * sc * Math.sin(angle);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 145. Topographic Iso Contour
  newPatterns.topographicIso = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.8);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const levels = 22;
    for (let i = 1; i <= levels; i++) {
      const rad = i * 16 * sc;
      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc;

      for (let theta = 0; theta <= 2 * Math.PI + 0.05; theta += 0.05) {
        const wave = 14 * sc * Math.sin(theta * 4 + i * 0.4);
        const r = rad + wave;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  // 146. Neon City Grid
  newPatterns.neonCityGrid = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cell = (60 + S.stripeW(s)) * sc;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const colsCount = Math.ceil(w / cell) + 1;
    const rowsCount = Math.ceil(h / cell) + 1;

    for (let r = 0; r < rowsCount; r++) {
      for (let c = 0; c < colsCount; c++) {
        const x = c * cell;
        const y = r * cell;
        const col = cols[((r + c) % (cols.length - 1)) + 1];

        ctx.strokeStyle = S.alphaColor(col, op);
        ctx.lineWidth = lt * sc;
        ctx.strokeRect(x + 4, y + 4, cell - 8, cell - 8);

        // Neon corner brackets
        ctx.fillStyle = S.alphaColor(col, op);
        ctx.fillRect(x + 2, y + 2, 6 * sc, 6 * sc);
      }
    }
  };

  // 147. Deep Sea Coral Branch
  newPatterns.deepSeaCoral = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.6);
    const cx = w / 2, cy = h;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    function drawBranch(x, y, len, a, d) {
      if (d === 0) return;
      const x2 = x + len * Math.cos(a);
      const y2 = y + len * Math.sin(a);
      const col = cols[(d % (cols.length - 1)) + 1];

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = S.alphaColor(col, op);
      ctx.lineWidth = lt * sc * (d * 0.35);
      ctx.stroke();

      drawBranch(x2, y2, len * 0.75, a - 0.35, d - 1);
      drawBranch(x2, y2, len * 0.75, a + 0.35, d - 1);
    }

    drawBranch(cx, cy, 90 * sc, -Math.PI / 2, 7);
  };

  // 148. Crystal Geode
  newPatterns.crystalGeode = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const rings = 16;
    for (let r = rings; r >= 1; r--) {
      const radius = r * 14 * sc;
      const col = cols[(r % (cols.length - 1)) + 1];
      ctx.beginPath();
      for (let t = 0; t <= 2 * Math.PI + 0.1; t += 0.1) {
        const jagged = (rng() - 0.5) * 8 * sc;
        const rad = radius + jagged;
        const x = cx + rad * Math.cos(t);
        const y = cy + rad * Math.sin(t);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = S.alphaColor(col, op * 0.8);
      ctx.fill();
      ctx.strokeStyle = cols[0];
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }
  };

  // 149. Liquid Mercury Fluid
  newPatterns.liquidMercury = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const drops = 35;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < drops; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const r = (20 + rng() * 45) * sc;
      const col = cols[(i % (cols.length - 1)) + 1];

      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, S.alphaColor(col, op));
      grad.addColorStop(1, S.alphaColor(col, op * 0.5));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // 150. Kaleidoscope Lens
  newPatterns.kaleidoscopeLens = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const cx = w / 2, cy = h / 2;
    const sectors = 12;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < sectors; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((i * 2 * Math.PI) / sectors + S.rot(s));

      const col = cols[(i % (cols.length - 1)) + 1];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(180 * sc, -30 * sc);
      ctx.lineTo(160 * sc, 30 * sc);
      ctx.closePath();

      ctx.fillStyle = S.alphaColor(col, op * 0.7);
      ctx.fill();
      ctx.strokeStyle = cols[0];
      ctx.lineWidth = lt * sc;
      ctx.stroke();
      ctx.restore();
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // MISSING GENERATORS & ALIASES (Fix for background/pattern data mapping)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Aliases for name mismatches between data files and generators ──────────
  newPatterns.goldSpiral     = newPatterns.goldenSpiral;       // data: goldSpiral
  newPatterns.guilloche      = newPatterns.guillocheBanknote;  // data: guilloche
  newPatterns.metatronsCube  = newPatterns.metatronCube;       // data: metatronsCube
  newPatterns.voronoiCells   = newPatterns.voronoiBubbles;     // data: voronoiCells
  newPatterns.torusMandala   = newPatterns.torusSacred;        // data: torusMandala
  newPatterns.greekKey       = newPatterns.greekKeyMeander;    // data: greekKey
  newPatterns.chladniPlate   = newPatterns.chladniAcoustics;   // data: chladniPlate

  // ── New Generator: gradient (solid gradient background) ───────────────────
  newPatterns.gradient = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const angle = ((s.rotation || 135) * Math.PI) / 180;
    const x1 = w / 2 - Math.cos(angle) * w;
    const y1 = h / 2 - Math.sin(angle) * h;
    const x2 = w / 2 + Math.cos(angle) * w;
    const y2 = h / 2 + Math.sin(angle) * h;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    cols.forEach((c, i) => grad.addColorStop(i / Math.max(1, cols.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // Soft noise overlay for richness
    const op = S.opacity(s) * 0.08;
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = S.alphaColor(cols[i % cols.length], rng() * op);
      ctx.fillRect(rng() * w, rng() * h, 1 + rng() * 2, 1 + rng() * 2);
    }
  };

  // ── New Generator: circle (concentric circles / radial rings) ─────────────
  newPatterns.circle = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const dens = S.density(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.hypot(cx, cy);
    const step = Math.max(8, (30 + S.stripeW(s)) * sc / dens);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    let r = step;
    let idx = 1;
    while (r < maxR * 1.2) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = S.alphaColor(cols[idx % cols.length], op);
      ctx.lineWidth = lt * sc;
      ctx.stroke();
      r += step;
      idx++;
    }
  };

  // ── New Generator: cloud (soft cloud-like blobs) ───────────────────────────
  newPatterns.cloud = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const dens = S.density(s);
    const numClouds = Math.round(6 + dens * 2);

    // Sky background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, cols[0]);
    skyGrad.addColorStop(1, cols[1 % cols.length]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    for (let c = 0; c < numClouds; c++) {
      const cx = rng() * w;
      const cy = rng() * h;
      const baseR = (40 + rng() * 80) * sc;
      const col = cols[(c + 2) % cols.length];
      const numBlobs = 4 + Math.floor(rng() * 5);

      ctx.save();
      for (let b = 0; b < numBlobs; b++) {
        const bx = cx + (rng() - 0.5) * baseR * 1.5;
        const by = cy + (rng() - 0.5) * baseR * 0.6;
        const br = baseR * (0.5 + rng() * 0.7);
        const cloudGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        cloudGrad.addColorStop(0, S.alphaColor(col, op * 0.95));
        cloudGrad.addColorStop(0.5, S.alphaColor(col, op * 0.6));
        cloudGrad.addColorStop(1, S.alphaColor(col, 0));
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };

  // ── New Generator: colorBlock (flat color block grid) ─────────────────────
  newPatterns.colorBlock = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const dens = S.density(s);
    const op = S.opacity(s);
    const cols2 = Math.max(2, Math.round(dens * 1.5));
    const rows2 = Math.max(2, Math.round(cols2 * (h / w)));
    const cw = w / cols2;
    const ch = h / rows2;

    for (let r = 0; r < rows2; r++) {
      for (let c = 0; c < cols2; c++) {
        const idx = (r * cols2 + c + Math.floor(rng() * cols.length)) % cols.length;
        ctx.fillStyle = S.alphaColor(cols[idx], op);
        ctx.fillRect(c * cw, r * ch, cw, ch);
      }
    }

    // Subtle white grid lines
    ctx.strokeStyle = `rgba(255,255,255,${op * 0.15})`;
    ctx.lineWidth = Math.max(1, sc);
    for (let r = 0; r <= rows2; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * ch);
      ctx.lineTo(w, r * ch);
      ctx.stroke();
    }
    for (let c = 0; c <= cols2; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cw, 0);
      ctx.lineTo(c * cw, h);
      ctx.stroke();
    }
  };

  // ── New Generator: meshWireframe (3D wireframe mesh illusion) ─────────────
  newPatterns.meshWireframe = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1);
    const dens = S.density(s);
    const rot = S.rot(s);
    const cols2 = Math.max(4, Math.round(dens * 3));
    const rows2 = Math.max(4, Math.round(cols2 * 0.6));

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rot);

    const perspective = 500 * sc;
    const gridW = w * 1.4;
    const gridH = h * 1.4;
    const stepX = gridW / cols2;
    const stepY = gridH / rows2;

    const project = (x, y, z) => {
      const fac = perspective / (perspective + z);
      return { x: x * fac, y: y * fac };
    };

    const tilt = 0.5;

    for (let r = 0; r <= rows2; r++) {
      ctx.beginPath();
      for (let c2 = 0; c2 <= cols2; c2++) {
        const wx = -gridW / 2 + c2 * stepX;
        const wy = -gridH / 2 + r * stepY;
        const wz = (rng() - 0.5) * 80 * sc;
        const p = project(wx, wy * tilt + wz * 0.5, wz);
        if (c2 === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = S.alphaColor(cols[(r + 1) % cols.length], op * (0.4 + 0.6 * r / rows2));
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }

    for (let c2 = 0; c2 <= cols2; c2++) {
      ctx.beginPath();
      for (let r = 0; r <= rows2; r++) {
        const wx = -gridW / 2 + c2 * stepX;
        const wy = -gridH / 2 + r * stepY;
        const wz = (rng() - 0.5) * 80 * sc;
        const p = project(wx, wy * tilt + wz * 0.5, wz);
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = S.alphaColor(cols[(c2 + 2) % cols.length], op * (0.4 + 0.6 * c2 / cols2));
      ctx.lineWidth = lt * sc * 0.8;
      ctx.stroke();
    }

    ctx.restore();
  };

  // ── New Generator: roseCurve (rhodonea / rose mathematical curve) ──────────
  newPatterns.roseCurve = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 2);
    const dens = S.density(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(cx, cy) * 0.88;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const k = Math.max(2, Math.round(dens * 0.8 + 2));
    const numPetals = k % 2 === 0 ? k : k;

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      const layerRot = rot + (layer * Math.PI) / (numPetals * 3);
      for (let t = 0; t <= 2000; t++) {
        const theta = (t / 2000) * 2 * Math.PI;
        const r = maxR * Math.cos(numPetals * theta) * (0.9 - layer * 0.2);
        const x = cx + r * Math.cos(theta + layerRot);
        const y = cy + r * Math.sin(theta + layerRot);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = S.alphaColor(cols[(layer + 1) % cols.length], op * (1 - layer * 0.25));
      ctx.lineWidth = lt * sc * (2 - layer * 0.5);
      ctx.stroke();

      if (layer === 0) {
        ctx.fillStyle = S.alphaColor(cols[2 % cols.length], op * 0.12);
        ctx.fill();
      }
    }
  };

  // ── New Generator: sineLattice (sine wave grid lattice) ───────────────────
  newPatterns.sineLattice = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const dens = S.density(s);
    const rot = S.rot(s);

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rot);

    const amp = (20 + dens * 5) * sc;
    const freq = (0.005 + dens * 0.002) / sc;
    const numLines = Math.round(12 + dens * 3);
    const spacing = Math.max(h, w) * 1.5 / numLines;

    for (let i = 0; i < numLines; i++) {
      const yOff = -Math.max(h, w) * 0.75 + i * spacing;
      ctx.beginPath();
      for (let x = -w; x <= w; x += 2) {
        const y = yOff + amp * Math.sin(x * freq + i * 0.5);
        if (x === -w) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = S.alphaColor(cols[(i + 1) % cols.length], op * (0.5 + 0.5 * (i / numLines)));
      ctx.lineWidth = lt * sc;
      ctx.stroke();
    }

    // Cross-hatch with perpendicular sine
    ctx.rotate(Math.PI / 2);
    for (let i = 0; i < numLines; i++) {
      const yOff = -Math.max(h, w) * 0.75 + i * spacing;
      ctx.beginPath();
      for (let x = -w; x <= w; x += 2) {
        const y = yOff + amp * Math.sin(x * freq + i * 0.7 + Math.PI / 4);
        if (x === -w) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = S.alphaColor(cols[(i + 2) % cols.length], op * 0.35);
      ctx.lineWidth = lt * sc * 0.6;
      ctx.stroke();
    }

    ctx.restore();
  };

  // ── New Generator: torusMandala (torus-based mandala rings) ───────────────
  newPatterns.torusMandala = function(ctx, w, h, s, rng) {
    const cols = S.colors(s);
    const sc = S.scale(s);
    const op = S.opacity(s);
    const lt = S.lt(s, 1.5);
    const dens = S.density(s);
    const rot = S.rot(s);
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(cx, cy) * 0.9;

    ctx.fillStyle = cols[0];
    ctx.fillRect(0, 0, w, h);

    const numRings = Math.max(3, Math.round(dens * 1.5));
    const numPoints = Math.max(6, Math.round(dens * 3 + 6));

    for (let ring = 0; ring < numRings; ring++) {
      const R = maxR * ((ring + 1) / numRings);
      const r = R * 0.22 * sc;
      const col = cols[(ring + 1) % cols.length];

      for (let p = 0; p < numPoints; p++) {
        const angle = (p / numPoints) * Math.PI * 2 + rot + ring * 0.3;
        const cx2 = cx + R * Math.cos(angle);
        const cy2 = cy + R * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
        ctx.strokeStyle = S.alphaColor(col, op * (0.5 + 0.5 * (ring / numRings)));
        ctx.lineWidth = lt * sc * (1 + ring * 0.3);
        ctx.stroke();

        ctx.fillStyle = S.alphaColor(col, op * 0.1);
        ctx.fill();
      }

      // Ring outline
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = S.alphaColor(cols[(ring + 2) % cols.length], op * 0.2);
      ctx.lineWidth = lt * sc * 0.5;
      ctx.stroke();
    }
  };

  // ─── Register with PatternEngine ──────────────────────────────────────────
  if (typeof window !== 'undefined') {
    window._NEW_SPIRAL_PATTERNS = newPatterns;
    if (window.PatternEngine && typeof window.PatternEngine.registerPatterns === 'function') {
      window.PatternEngine.registerPatterns(newPatterns);
    }
  }
})();
