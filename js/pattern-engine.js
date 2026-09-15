'use strict';
/**
 * Pattern Generator PRO V2 — pattern-engine.js
 * 50+ canvas pattern generators + advanced effects + gradient overlay
 * Depends on: random.js
 */

const PatternEngine = {

  // ─── Entry Point ──────────────────────────────────────────
  generate(ctx, w, h, settings, rng) {
    ctx.clearRect(0, 0, w, h);
    const type = settings.patternType || 'plaid';
    const gen  = this._getGenerator(type);
    gen.call(this, ctx, w, h, settings, rng);
    this._applyEffects(ctx, w, h, settings, rng);
    if (settings.gradient && settings.gradient.enabled) {
      this._applyGradient(ctx, w, h, settings.gradient, settings.colors);
    }
  },

  // ─── Generator Registry ───────────────────────────────────
  _genMap: null,

  _getGenerator(type) {
    if (!this._genMap) {
      this._genMap = {
        // ── Original 20 ──
        plaid:            this.generatePlaid,
        tartan:           this.generateTartan,
        checkered:        this.generateCheckered,
        gingham:          this.generateGingham,
        grid:             this.generateGrid,
        stripe:           this.generateStripe,
        diagonalStripe:   this.generateDiagonalStripe,
        crossStripe:      this.generateCrossStripe,
        woven:            this.generateWoven,
        geometric:        this.generateGeometric,
        squareGrid:       this.generateSquareGrid,
        multiStripe:      this.generateMultiStripe,
        herringbone:      this.generateHerringbone,
        interlockingGrid: this.generateInterlockingGrid,
        abstractTextile:  this.generateAbstractTextile,
        minimalLine:      this.generateMinimalLine,
        diamond:          this.generateDiamond,
        hexagonal:        this.generateHexagonal,
        wave:             this.generateWave,
        randomGeometric:  this.generateRandomGeometric,
        // ── New 30+ ──
        mandala:          this.generateMandala,
        moroccan:         this.generateMoroccan,
        islamic:          this.generateIslamic,
        memphis:          this.generateMemphis,
        polkaDot:         this.generatePolkaDot,
        chevron:          this.generateChevron,
        zigzag:           this.generateZigzag,
        spiral:           this.generateSpiral,
        triangle:         this.generateTriangle,
        hexStar:          this.generateHexStar,
        cross:            this.generateCross,
        isometric:        this.generateIsometric,
        lineart:          this.generateLineArt,
        doodle:           this.generateDoodle,
        retro:            this.generateRetro,
        marble:           this.generateMarble,
        gridNoise:        this.generateGridNoise,
        abstractLine:     this.generateAbstractLine,
        organic:          this.generateOrganic,
        organicFlow:      this.generateOrganicFlow,
        floral:           this.generateFloral,
        botanical:        this.generateBotanical,
        leaves:           this.generateLeaves,
        pixel:            this.generatePixel,
        luxury:           this.generateLuxury,
        kids:             this.generateKids,
        technology:       this.generateTechnology,
        futuristic:       this.generateFuturistic,
        christmas:        this.generateChristmas,
        halloween:        this.generateHalloween,
        wedding:          this.generateWedding,
        valentine:        this.generateValentine,
        business:         this.generateBusiness,
      };
    }
    return (this._customMap && this._customMap[type]) || this._genMap[type] || this._genMap.plaid;
  },

  _customMap: {},

  registerPatterns(patternsObj) {
    if (!this._customMap) this._customMap = {};
    Object.assign(this._customMap, patternsObj);
    return this;
  },

  getPatternTypes() {
    const baseTypes = [
      'plaid','tartan','checkered','gingham','grid','stripe',
      'diagonalStripe','crossStripe','woven','geometric','squareGrid',
      'multiStripe','herringbone','interlockingGrid','abstractTextile',
      'minimalLine','diamond','hexagonal','wave','randomGeometric',
      'mandala','moroccan','islamic','memphis','polkaDot','chevron',
      'zigzag','spiral','triangle','hexStar','cross','isometric',
      'lineart','doodle','retro','marble','gridNoise','abstractLine',
      'organic','organicFlow','floral','botanical','leaves','pixel',
      'luxury','kids','technology','futuristic','christmas','halloween',
      'wedding','valentine','business',
    ];
    if (this._customMap) {
      return baseTypes.concat(Object.keys(this._customMap));
    }
    return baseTypes;
  },

  // ─── Helpers ──────────────────────────────────────────────
  _colors(s, fallback) {
    return (s.colors && s.colors.length >= 2) ? s.colors : (fallback || ['#0d1b3e','#e05c00','#c24a00']);
  },
  _scale(s)   { return Math.max(0.05, (s.scale || 50) / 50); },
  _opacity(s) { return s.opacity !== undefined ? Math.max(0, Math.min(1, s.opacity)) : 0.85; },
  _blend(s)   { return s.blendStrength !== undefined ? Math.max(0, Math.min(1, s.blendStrength)) : 0.6; },
  _lt(s, def) { return Math.max(0, s.lineThickness !== undefined ? s.lineThickness : (def || 1)); },
  _density(s) { return Math.max(1, s.density || 5); },
  _rotation(s){ return (s.rotation || 0) * Math.PI / 180; },

  // ─── SETT BUILDER (plaid/tartan helper) ──────────────────
  _buildSett(colors, base, density) {
    const sett = [];
    const nc = colors.length;
    const count = Math.max(2, Math.round(density));
    for (let i = 0; i < count; i++) {
      sett.push({ color: colors[i % nc], w: Math.max(4, base + (i % 2 === 0 ? 0 : -base * 0.3)) });
    }
    return sett;
  },

  // ══════════════════════════════════════════════════════════
  // ORIGINAL 20 PATTERNS (preserved + improved)
  // ══════════════════════════════════════════════════════════

  // 1. PLAID
  generatePlaid(ctx, w, h, s, rng) {
    const colors   = this._colors(s);
    const scale    = this._scale(s);
    const base     = Math.max(8, Math.round(40 * scale));
    const density  = this._density(s);
    const opacity  = this._opacity(s);
    const blendStr = this._blend(s);
    const lt       = this._lt(s);
    const sett     = this._buildSett(colors, base, density);
    const period   = sett.reduce((acc, st) => acc + st.w, 0);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let tile = -1; tile <= Math.ceil(w / period) + 1; tile++) {
      let cx = tile * period;
      for (const st of sett) {
        ctx.fillStyle = hexWithAlpha(st.color, opacity);
        ctx.fillRect(cx, 0, st.w, h);
        cx += st.w;
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = blendStr;
    for (let tile = -1; tile <= Math.ceil(h / period) + 1; tile++) {
      let cy = tile * period;
      for (const st of sett) {
        ctx.fillStyle = hexWithAlpha(st.color, opacity);
        ctx.fillRect(0, cy, w, st.w);
        cy += st.w;
      }
    }
    ctx.restore();

    if (lt > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = hexWithAlpha(colors[colors.length > 2 ? 2 : 1], 0.5);
      ctx.lineWidth = lt;
      let px = 0;
      for (const st of sett) {
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
        px += st.w;
      }
      let py = 0;
      for (const st of sett) {
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
        py += st.w;
      }
      ctx.restore();
    }
  },

  // 2. TARTAN
  generateTartan(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const base    = Math.max(6, Math.round(30 * scale));
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 2);

    const sett  = this._buildSett(colors, base, Math.max(3, Math.round(density * 1.4)));
    const period = sett.reduce((acc, st) => acc + st.w, 0);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Vertical stripes
    for (let tile = -1; tile <= Math.ceil(w / period) + 1; tile++) {
      let cx = tile * period;
      for (const st of sett) {
        ctx.fillStyle = hexWithAlpha(st.color, opacity);
        ctx.fillRect(cx, 0, st.w, h);
        cx += st.w;
      }
    }

    // Horizontal stripes (multiply)
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    for (let tile = -1; tile <= Math.ceil(h / period) + 1; tile++) {
      let cy = tile * period;
      for (const st of sett) {
        ctx.fillStyle = hexWithAlpha(st.color, opacity * 0.8);
        ctx.fillRect(0, cy, w, st.w);
        cy += st.w;
      }
    }
    ctx.restore();

    // Hairlines
    if (lt > 0) {
      ctx.save();
      ctx.strokeStyle = hexWithAlpha(colors[colors.length - 1], 0.6);
      ctx.lineWidth = lt;
      let p = 0;
      for (const st of sett) {
        ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(w, p); ctx.stroke();
        p += st.w;
      }
      ctx.restore();
    }
  },

  // 3. CHECKERED
  generateCheckered(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(4, Math.round(50 * scale));
    const opacity = this._opacity(s);
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);
    const cols = Math.ceil(w / size) + 1;
    const rows = Math.ceil(h / size) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r + c) % 2 === 1) {
          ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity);
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
    }
  },

  // 4. GINGHAM
  generateGingham(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(4, Math.round(40 * scale));
    const opacity = this._opacity(s);
    const blend   = this._blend(s);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 1;
    const rows = Math.ceil(h / size) + 1;

    ctx.save();
    ctx.globalAlpha = opacity * 0.7;
    for (let r = 0; r < rows; r++) {
      ctx.fillStyle = r % 2 === 0 ? colors[0] : (colors[1] || colors[0]);
      ctx.fillRect(0, r * size, w, size);
    }
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = opacity * 0.6;
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = c % 2 === 0 ? colors[0] : (colors[1] || colors[0]);
      ctx.fillRect(c * size, 0, size, h);
    }
    ctx.restore();
  },

  // 5. GRID
  generateGrid(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(8, Math.round(60 * scale));
    const lt      = this._lt(s, 1);
    const opacity = this._opacity(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity);
    ctx.lineWidth   = Math.max(0.5, lt);

    for (let x = 0; x <= w; x += size) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += size) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  },

  // 6. STRIPE
  generateStripe(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const sw      = Math.max(2, Math.round((s.stripeWidth || 30) * scale));
    const gap     = Math.max(0, Math.round((s.stripeGap  || 4)  * scale));
    const opacity = this._opacity(s);
    const period  = sw + gap;

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const nc = colors.length;
    let x = 0, ci = 1;
    while (x < w + period) {
      ctx.fillStyle = hexWithAlpha(colors[ci % nc], opacity);
      ctx.fillRect(x, 0, sw, h);
      x += period;
      ci++;
    }
  },

  // 7. DIAGONAL STRIPE
  generateDiagonalStripe(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const sw      = Math.max(2, Math.round((s.stripeWidth || 30) * scale));
    const gap     = Math.max(0, s.stripeGap || 4);
    const opacity = this._opacity(s);
    const period  = sw + gap;
    const angle   = (s.rotation || 45) * Math.PI / 180;

    ctx.save();
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);
    const diag = Math.sqrt(w * w + h * h);
    const nc   = colors.length;
    let x = -diag, ci = 1;
    while (x < diag) {
      ctx.fillStyle = hexWithAlpha(colors[ci % nc], opacity);
      ctx.fillRect(x, -diag, sw, diag * 2);
      x += period;
      ci++;
    }
    ctx.restore();
  },

  // 8. CROSS STRIPE
  generateCrossStripe(ctx, w, h, s, rng) {
    this.generateStripe(ctx, w, h, s, rng);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = this._blend(s);
    const s2 = { ...s, rotation: (s.rotation || 0) + 90 };
    this.generateDiagonalStripe(ctx, w, h, s2, rng);
    ctx.restore();
  },

  // 9. WOVEN
  generateWoven(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(4, Math.round(20 * scale));
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1.5);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    // Horizontal threads
    for (let r = 0; r < rows; r++) {
      const y = r * size;
      const ci = r % colors.length;
      ctx.strokeStyle = hexWithAlpha(colors[ci], opacity);
      ctx.lineWidth = size * 0.65;
      ctx.lineCap = 'butt';
      for (let c = 0; c < cols; c++) {
        const x = c * size;
        if ((r + c) % 2 === 0) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + size, y); ctx.stroke();
        }
      }
    }

    // Vertical threads (on top of horizontal)
    for (let c = 0; c < cols; c++) {
      const x = c * size;
      const ci = (c + 1) % colors.length;
      ctx.strokeStyle = hexWithAlpha(colors[ci], opacity);
      ctx.lineWidth = size * 0.65;
      for (let r = 0; r < rows; r++) {
        const y = r * size;
        if ((r + c) % 2 !== 0) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + size); ctx.stroke();
        }
      }
    }
  },

  // 10. GEOMETRIC
  generateGeometric(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(10, Math.round(60 * scale));
    const opacity = this._opacity(s);
    const density = this._density(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * size + (r % 2 === 0 ? 0 : size / 2);
        const y = r * size * 0.866;
        const shape = Math.floor(rng() * 3);
        const ci = (r * cols + c) % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.9);
        ctx.beginPath();
        if (shape === 0) {
          // Triangle
          ctx.moveTo(x, y);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x + size / 2, y + size * 0.866);
        } else if (shape === 1) {
          // Diamond
          ctx.moveTo(x + size / 2, y);
          ctx.lineTo(x + size, y + size / 2);
          ctx.lineTo(x + size / 2, y + size);
          ctx.lineTo(x, y + size / 2);
        } else {
          // Square
          ctx.rect(x + 2, y + 2, size - 4, size - 4);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  // 11. SQUARE GRID
  generateSquareGrid(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(6, Math.round(50 * scale));
    const lt      = this._lt(s, 2);
    const opacity = this._opacity(s);
    const blend   = this._blend(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ci = (r + c) % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity * blend);
        ctx.fillRect(c * size, r * size, size - (lt > 0 ? lt : 0), size - (lt > 0 ? lt : 0));
      }
    }

    if (lt > 0) {
      ctx.strokeStyle = hexWithAlpha(colors[colors.length - 1], 0.4);
      ctx.lineWidth   = lt;
      for (let x = 0; x <= w + size; x += size) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h + size; y += size) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }
  },

  // 12. MULTI STRIPE
  generateMultiStripe(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const widths = colors.map((_, i) => Math.max(2, Math.round((10 + i * 5) * scale)));
    const period = widths.reduce((a, b) => a + b, 0);

    let x = 0;
    while (x < w + period) {
      let cx = x;
      colors.forEach((c, i) => {
        ctx.fillStyle = hexWithAlpha(c, opacity);
        ctx.fillRect(cx, 0, widths[i], h);
        cx += widths[i];
      });
      x += period;
    }
  },

  // 13. HERRINGBONE
  generateHerringbone(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(6, Math.round(30 * scale));
    const lt      = this._lt(s, 3);
    const opacity = this._opacity(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 4;
    const rows = Math.ceil(h / size) + 4;

    ctx.lineWidth = Math.max(1, lt);
    ctx.lineCap   = 'butt';

    for (let r = -2; r < rows; r++) {
      for (let c = -2; c < cols; c++) {
        const x = c * size * 2;
        const y = r * size;
        const ci = (r + c) % colors.length;
        ctx.strokeStyle = hexWithAlpha(colors[ci], opacity);

        // Left-leaning
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.stroke();

        // Right-leaning
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size * 2, y + size);
        ctx.stroke();
      }
    }
  },

  // 14. INTERLOCKING GRID
  generateInterlockingGrid(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(8, Math.round(40 * scale));
    const lt      = this._lt(s, 2);
    const opacity = this._opacity(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * size;
        const y = r * size;
        const ci = ((r % 2) + c) % colors.length;
        ctx.strokeStyle = hexWithAlpha(colors[ci], opacity);
        ctx.lineWidth   = lt;
        ctx.strokeRect(x + lt / 2, y + lt / 2, size - lt, size - lt);
        // Inner cross
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y + size / 2);
        ctx.stroke();
      }
    }
  },

  // 15. ABSTRACT TEXTILE
  generateAbstractTextile(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(5, Math.round(25 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const count = Math.round(density * 80 * scale * scale);
    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const ci = Math.floor(rng() * colors.length);
      const t  = Math.floor(rng() * 3);
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.7);
      if (t === 0) {
        ctx.fillRect(x, y, size * (0.3 + rng() * 0.7), size * 0.15);
      } else if (t === 1) {
        ctx.fillRect(x, y, size * 0.15, size * (0.3 + rng() * 0.7));
      } else {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // 16. MINIMAL LINE
  generateMinimalLine(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const lt      = this._lt(s, 0.5);
    const opacity = this._opacity(s);
    const spacing = Math.max(4, Math.round(40 / density * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity);
    ctx.lineWidth   = Math.max(0.3, lt);

    for (let x = 0; x <= w; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
  },

  // 17. DIAMOND
  generateDiamond(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const size    = Math.max(10, Math.round(50 * scale));
    const lt      = this._lt(s, 1);
    const opacity = this._opacity(s);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 4;
    const rows = Math.ceil(h / size) + 4;

    for (let r = -2; r < rows; r++) {
      for (let c = -2; c < cols; c++) {
        const cx = c * size + (r % 2 === 0 ? 0 : size / 2);
        const cy = r * size * 0.5;
        const ci = (r + c) % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
        ctx.beginPath();
        ctx.moveTo(cx + size / 2, cy);
        ctx.lineTo(cx + size, cy + size * 0.5);
        ctx.lineTo(cx + size / 2, cy + size);
        ctx.lineTo(cx, cy + size * 0.5);
        ctx.closePath();
        ctx.fill();
        if (lt > 0) {
          ctx.strokeStyle = hexWithAlpha(colors[0], 0.3);
          ctx.lineWidth   = lt;
          ctx.stroke();
        }
      }
    }
  },

  // 18. HEXAGONAL
  generateHexagonal(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const r       = Math.max(8, Math.round(30 * scale));
    const lt      = this._lt(s, 1);
    const opacity = this._opacity(s);
    const hx      = r * 2;
    const hy      = r * Math.sqrt(3);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / hx) + 3;
    const rows = Math.ceil(h / hy) + 3;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * hx * 1.5 + (row % 2 === 0 ? 0 : hx * 0.75);
        const cy = row * hy;
        const ci = (row + col) % colors.length;
        ctx.fillStyle   = hexWithAlpha(colors[ci], opacity);
        ctx.strokeStyle = hexWithAlpha(colors[0], 0.3);
        ctx.lineWidth   = Math.max(0.5, lt);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                  : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();
        if (lt > 0) ctx.stroke();
      }
    }
  },

  // 19. WAVE
  generateWave(ctx, w, h, s, rng) {
    const colors   = this._colors(s);
    const scale    = this._scale(s);
    const density  = this._density(s);
    const opacity  = this._opacity(s);
    const amp      = Math.max(5, Math.round(30 * scale));
    const freq     = density / (w / Math.PI / 2);
    const spacing  = Math.max(4, Math.round(30 * scale / density));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    let y0 = 0;
    let ci = 1;
    const xStep = Math.max(2, Math.round(w / 350));
    while (y0 < h + amp) {
      ctx.fillStyle = hexWithAlpha(colors[ci % colors.length], opacity);
      ctx.beginPath();
      ctx.moveTo(0, h + amp);
      ctx.lineTo(0, y0);
      for (let x = xStep; x <= w; x += xStep) {
        ctx.lineTo(x, y0 + amp * Math.sin(x * freq));
      }
      ctx.lineTo(w, y0 + amp * Math.sin(w * freq));
      ctx.lineTo(w, h + amp);
      ctx.closePath();
      ctx.fill();
      y0 += spacing;
      ci++;
    }
  },

  // 20. RANDOM GEOMETRIC
  generateRandomGeometric(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(8, Math.round(60 * scale));
    const count   = Math.round(density * 40);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const sz = size * (0.3 + rng() * 0.7);
      const ci = Math.floor(rng() * colors.length);
      const t  = Math.floor(rng() * 4);
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.8);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rng() * Math.PI * 2);
      ctx.beginPath();
      if (t === 0) ctx.rect(-sz/2, -sz/2, sz, sz);
      else if (t === 1) { ctx.moveTo(0,-sz/2); ctx.lineTo(sz/2,sz/2); ctx.lineTo(-sz/2,sz/2); }
      else if (t === 2) { ctx.moveTo(-sz/2,-sz/2); ctx.lineTo(sz/2,0); ctx.lineTo(-sz/2,sz/2); }
      else { for(let j=0;j<6;j++){const a=j*Math.PI/3;j===0?ctx.moveTo(sz/2*Math.cos(a),sz/2*Math.sin(a)):ctx.lineTo(sz/2*Math.cos(a),sz/2*Math.sin(a));} }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  },

  // ══════════════════════════════════════════════════════════
  // NEW PATTERNS (30+)
  // ══════════════════════════════════════════════════════════

  // 21. MANDALA
  generateMandala(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const r0      = Math.max(20, Math.round(80 * scale));
    const rings   = Math.round(3 + density * 0.7);
    const petals  = Math.round(6 + density);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawMandala = (cx, cy, maxR) => {
      for (let ring = 0; ring < rings; ring++) {
        const r = maxR * (ring + 1) / rings;
        const ci = (ring + 1) % colors.length;
        ctx.save();
        ctx.strokeStyle = hexWithAlpha(colors[ci], opacity);
        ctx.lineWidth = Math.max(0.5, 2 - ring * 0.2);
        for (let p = 0; p < petals; p++) {
          const angle = (p / petals) * Math.PI * 2;
          const x1 = cx + r * Math.cos(angle);
          const y1 = cy + r * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          // Petal circles
          if (ring % 2 === 0) {
            ctx.fillStyle = hexWithAlpha(colors[(ci + 1) % colors.length], opacity * 0.5);
            ctx.beginPath();
            ctx.arc(x1, y1, r / (petals * 0.7), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Concentric ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    const step = r0 * 2.2;
    const cols = Math.ceil(w / step) + 2;
    const rows = Math.ceil(h / step) + 2;
    for (let r = -1; r <= rows; r++) {
      for (let c = -1; c <= cols; c++) {
        drawMandala(c * step + (r % 2 === 0 ? 0 : step / 2), r * step, r0);
      }
    }
  },

  // 22. MOROCCAN
  generateMoroccan(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1.5);
    const size    = Math.max(20, Math.round(70 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawStar = (cx, cy, r, pts) => {
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const angle = (i * Math.PI) / pts - Math.PI / 2;
        const rad   = i % 2 === 0 ? r : r * 0.4;
        i === 0 ? ctx.moveTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle))
                : ctx.lineTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle));
      }
      ctx.closePath();
    };

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;
    const pts  = 8;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const cx = c * size + size / 2;
        const cy = r * size + size / 2;
        const ci = (r + c) % colors.length;

        ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.8);
        drawStar(cx, cy, size * 0.48, pts);
        ctx.fill();

        ctx.strokeStyle = hexWithAlpha(colors[(ci + 1) % colors.length], opacity);
        ctx.lineWidth   = Math.max(0.5, lt);
        drawStar(cx, cy, size * 0.48, pts);
        ctx.stroke();
      }
    }
  },

  // 23. ISLAMIC GEOMETRIC
  generateIslamic(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const opacity = this._opacity(s);
    const size    = Math.max(20, Math.round(60 * scale));
    const lt      = this._lt(s, 1);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const draw8Star = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8 - Math.PI / 8;
        const rad   = i % 2 === 0 ? r : r * 0.414;
        i === 0 ? ctx.moveTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle))
                : ctx.lineTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle));
      }
      ctx.closePath();
    };

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const cx = c * size + size / 2;
        const cy = r * size + size / 2;
        const ci = (r + c + 1) % colors.length;

        ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
        draw8Star(cx, cy, size * 0.45);
        ctx.fill();

        ctx.strokeStyle = hexWithAlpha(colors[0], 0.4);
        ctx.lineWidth   = Math.max(0.5, lt);
        draw8Star(cx, cy, size * 0.45);
        ctx.stroke();

        // Connecting squares
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = hexWithAlpha(colors[(ci + 1) % colors.length], opacity * 0.6);
        ctx.fillRect(-size * 0.22, -size * 0.22, size * 0.44, size * 0.44);
        ctx.restore();
      }
    }
  },

  // 24. MEMPHIS
  generateMemphis(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(10, Math.round(40 * scale));
    const count   = Math.round(density * 50);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const sz = size * (0.2 + rng() * 0.8);
      const ci = Math.floor(rng() * colors.length);
      const t  = Math.floor(rng() * 6);
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.85);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rng() * Math.PI * 2);
      ctx.beginPath();
      switch (t) {
        case 0: ctx.arc(0, 0, sz / 2, 0, Math.PI * 2); break;
        case 1: ctx.rect(-sz/2, -sz/2, sz, sz); break;
        case 2: ctx.moveTo(0,-sz/2); ctx.lineTo(sz/2,sz/2); ctx.lineTo(-sz/2,sz/2); break;
        case 3: // Zigzag line
          ctx.lineWidth = 2;
          ctx.strokeStyle = hexWithAlpha(colors[ci], opacity);
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(-sz/2 + j * sz/4, j % 2 === 0 ? -sz/4 : sz/4);
          }
          ctx.stroke(); ctx.restore(); continue;
        case 4: // Plus
          ctx.rect(-sz/6,-sz/2,sz/3,sz);
          ctx.rect(-sz/2,-sz/6,sz,sz/3);
          break;
        case 5: ctx.arc(0, 0, sz / 2, 0, Math.PI); break;
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  },

  // 25. POLKA DOT
  generatePolkaDot(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const r       = Math.max(3, Math.round(20 * scale));
    const spacing = Math.max(r * 2 + 2, Math.round(r * (4 - density * 0.2)));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / spacing) + 2;
    const rows = Math.ceil(h / spacing) + 2;
    let ci = 0;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * spacing + (row % 2 === 0 ? 0 : spacing / 2);
        const cy = row * spacing;
        ctx.fillStyle = hexWithAlpha(colors[ci % colors.length], opacity);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ci++;
      }
    }
  },

  // 26. CHEVRON
  generateChevron(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const height  = Math.max(10, Math.round(40 * scale));
    const amp     = Math.max(5, Math.round(25 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    let y0 = -height * 2;
    let ci = 1;

    const xStep = Math.max(2, Math.round(w / 350));
    const factor = w / (density * Math.PI);
    while (y0 < h + height * 2) {
      ctx.fillStyle = hexWithAlpha(colors[ci % colors.length], opacity);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      for (let x = 0; x <= w; x += xStep) {
        const yy = y0 + amp * Math.abs(Math.sin(x / factor));
        ctx.lineTo(x, yy);
      }
      for (let x = w; x >= 0; x -= xStep) {
        const yy = y0 + height + amp * Math.abs(Math.sin(x / factor));
        ctx.lineTo(x, yy);
      }
      ctx.closePath();
      ctx.fill();
      y0 += height;
      ci++;
    }
  },

  // 27. ZIGZAG
  generateZigzag(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 3);
    const height  = Math.max(8, Math.round(30 * scale));
    const step    = Math.max(4, Math.round(20 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    let y = 0, ci = 1;
    while (y < h + height) {
      ctx.strokeStyle = hexWithAlpha(colors[ci % colors.length], opacity);
      ctx.lineWidth   = Math.max(1, lt);
      ctx.beginPath();
      let x = 0, up = true;
      ctx.moveTo(x, y);
      while (x <= w + step) {
        x += step;
        ctx.lineTo(x, up ? y - height : y);
        up = !up;
      }
      ctx.stroke();
      y += height * 1.5;
      ci++;
    }
  },

  // 28. SPIRAL
  generateSpiral(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1.5);
    const turns   = Math.max(2, Math.round(density * 1.5));
    const maxR    = Math.max(30, Math.round(100 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawSpiral = (cx, cy) => {
      for (let c = 0; c < colors.length; c++) {
        ctx.strokeStyle = hexWithAlpha(colors[c], opacity);
        ctx.lineWidth   = Math.max(0.5, lt);
        ctx.beginPath();
        const offset = (c / colors.length) * maxR;
        for (let t = 0; t <= turns * Math.PI * 2; t += 0.16) {
          const r = (t / (turns * Math.PI * 2)) * maxR + offset;
          const x = cx + r * Math.cos(t);
          const y = cy + r * Math.sin(t);
          t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const step = maxR * 2.2;
    const cols = Math.ceil(w / step) + 2;
    const rows = Math.ceil(h / step) + 2;

    for (let r = -1; r <= rows; r++) {
      for (let c = -1; c <= cols; c++) {
        drawSpiral(c * step + step / 2, r * step + step / 2);
      }
    }
  },

  // 29. TRIANGLE
  generateTriangle(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const opacity = this._opacity(s);
    const size    = Math.max(10, Math.round(50 * scale));
    const th      = size * Math.sqrt(3) / 2;

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / th) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x  = c * size + (r % 2 === 0 ? 0 : size / 2);
        const y  = r * th;
        const ci = (r * 3 + c) % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + th);
        ctx.lineTo(x, y + th);
        ctx.closePath();
        ctx.fill();

        // Inverted triangle
        const ci2 = (ci + 1) % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci2], opacity * 0.8);
        ctx.beginPath();
        ctx.moveTo(x + size, y + th);
        ctx.lineTo(x + size / 2, y + th * 2);
        ctx.lineTo(x, y + th);
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  // 30. HEX STAR
  generateHexStar(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1);
    const r       = Math.max(12, Math.round(35 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const hx = r * 2;
    const hy = r * Math.sqrt(3);
    const cols = Math.ceil(w / hx) + 3;
    const rows = Math.ceil(h / hy) + 3;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * hx * 1.5 + (row % 2 === 0 ? 0 : hx * 0.75);
        const cy = row * hy;
        const ci = (row + col) % colors.length;

        // Hex star (Star of David shape)
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6 - Math.PI / 6;
          const rad   = i % 2 === 0 ? r * 0.9 : r * 0.4;
          i === 0 ? ctx.moveTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle))
                  : ctx.lineTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();

        if (lt > 0) {
          ctx.strokeStyle = hexWithAlpha(colors[0], 0.25);
          ctx.lineWidth   = lt;
          ctx.stroke();
        }
      }
    }
  },

  // 31. CROSS
  generateCross(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const opacity = this._opacity(s);
    const size    = Math.max(10, Math.round(50 * scale));
    const arm     = Math.round(size * 0.35);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const cx = c * size + size / 2;
        const cy = r * size + size / 2;
        const ci = (r + c + 1) % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
        ctx.beginPath();
        ctx.rect(cx - arm / 2, cy - size / 2, arm, size);
        ctx.rect(cx - size / 2, cy - arm / 2, size, arm);
        ctx.fill();
      }
    }
  },

  // 32. ISOMETRIC
  generateIsometric(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const opacity = this._opacity(s);
    const size    = Math.max(10, Math.round(50 * scale));
    const cols    = Math.ceil(w / size) + 3;
    const rows    = Math.ceil(h / (size * 0.866)) + 3;

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let r = -2; r < rows; r++) {
      for (let c = -2; c < cols; c++) {
        const x = c * size + (r % 2 === 0 ? 0 : size / 2);
        const y = r * size * 0.866;

        // Top face
        ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity);
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + size * 0.433);
        ctx.lineTo(x + size / 2, y + size * 0.866);
        ctx.lineTo(x, y + size * 0.433);
        ctx.closePath();
        ctx.fill();

        // Left face
        ctx.fillStyle = hexWithAlpha(colors[2 % colors.length], opacity * 0.7);
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.433);
        ctx.lineTo(x + size / 2, y + size * 0.866);
        ctx.lineTo(x + size / 2, y + size * 1.3);
        ctx.lineTo(x, y + size * 0.866);
        ctx.closePath();
        ctx.fill();

        // Right face
        ctx.fillStyle = hexWithAlpha(colors[(colors.length > 3 ? 3 : 0)], opacity * 0.5);
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y + size * 0.866);
        ctx.lineTo(x + size, y + size * 0.433);
        ctx.lineTo(x + size, y + size * 0.866);
        ctx.lineTo(x + size / 2, y + size * 1.3);
        ctx.closePath();
        ctx.fill();
      }
    }
  },

  // 33. LINE ART
  generateLineArt(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 0.8);
    const spacing = Math.max(3, Math.round(20 * scale / density));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Fine diagonal lines
    ctx.save();
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.8);
    ctx.lineWidth   = Math.max(0.3, lt);
    const diag = Math.sqrt(w * w + h * h);
    for (let x = -diag; x < diag; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + diag, diag);
      ctx.stroke();
    }
    // Cross lines
    if (colors.length > 2) {
      ctx.strokeStyle = hexWithAlpha(colors[2], opacity * 0.5);
      for (let x = -diag; x < diag; x += spacing * 2) {
        ctx.beginPath();
        ctx.moveTo(x + diag, 0);
        ctx.lineTo(x, diag);
        ctx.stroke();
      }
    }
    ctx.restore();
  },

  // 34. DOODLE
  generateDoodle(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1.5);
    const count   = Math.round(density * 30 * scale);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = Math.max(0.5, lt);
    ctx.lineCap   = 'round';
    ctx.lineJoin  = 'round';

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const sz = 10 + rng() * 40 * scale;
      const ci = Math.floor(rng() * colors.length);
      const t  = Math.floor(rng() * 5);
      ctx.strokeStyle = hexWithAlpha(colors[ci], opacity * 0.8);
      ctx.save();
      ctx.translate(x, y);

      switch (t) {
        case 0: // Star
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            const a1 = (p * 2 * Math.PI / 5) - Math.PI / 2;
            const a2 = a1 + Math.PI / 5;
            ctx.lineTo(sz / 2 * Math.cos(a1), sz / 2 * Math.sin(a1));
            ctx.lineTo(sz / 4 * Math.cos(a2), sz / 4 * Math.sin(a2));
          }
          ctx.closePath();
          ctx.stroke();
          break;
        case 1: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 2: // Squiggle
          ctx.beginPath();
          ctx.moveTo(-sz / 2, 0);
          for (let p = 0; p <= 5; p++) {
            ctx.quadraticCurveTo(-sz / 2 + p * sz / 5, p % 2 === 0 ? -sz / 4 : sz / 4, -sz / 2 + (p + 1) * sz / 5, 0);
          }
          ctx.stroke();
          break;
        case 3: // Square spiral
          ctx.beginPath();
          for (let p = 0; p < 4; p++) {
            const ps = sz / 2 - p * sz / 8;
            ctx.moveTo(-ps, -ps);
            ctx.lineTo(ps, -ps);
            ctx.lineTo(ps, ps);
            ctx.lineTo(-ps, ps);
          }
          ctx.stroke();
          break;
        case 4: // Flower
          for (let p = 0; p < 6; p++) {
            const angle = p * Math.PI / 3;
            ctx.beginPath();
            ctx.arc(sz / 4 * Math.cos(angle), sz / 4 * Math.sin(angle), sz / 5, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
      }
      ctx.restore();
    }
  },

  // 35. RETRO
  generateRetro(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(15, Math.round(60 * scale));
    const count   = Math.round(density * 25);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Retro circles
    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const r  = size * (0.3 + rng() * 0.7);
      const ci = Math.floor(rng() * colors.length);
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.7);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Concentric rings
      ctx.strokeStyle = hexWithAlpha(colors[(ci + 1) % colors.length], opacity * 0.5);
      ctx.lineWidth   = 1.5;
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.arc(x, y, r + ring * 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Retro lines
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.3);
    ctx.lineWidth   = 1;
    for (let y = 0; y < h; y += size * 0.6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },

  // 36. MARBLE
  generateMarble(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const freq    = density * 0.005;

    // Base
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // High performance marble: compute noise at downsampled grid and upscale with smooth interpolation
    const downscale = Math.max(2, Math.min(4, Math.round(Math.max(w, h) / 320)));
    const dw = Math.max(40, Math.round(w / downscale));
    const dh = Math.max(30, Math.round(h / downscale));

    const c1 = hexToRgb(colors[0]);
    const c2 = hexToRgb(colors[1 % colors.length]);

    let smallCanvas;
    if (typeof document !== 'undefined') {
      smallCanvas = document.createElement('canvas');
      smallCanvas.width = dw;
      smallCanvas.height = dh;
    }
    const sCtx = smallCanvas ? smallCanvas.getContext('2d') : null;
    const imgData = sCtx ? sCtx.createImageData(dw, dh) : ctx.createImageData(dw, dh);
    const d = imgData.data;

    const effFreq = freq * downscale;
    const piDensity = Math.PI * density;
    const opVal = Math.round(opacity * 255);

    let idx = 0;
    for (let y = 0; y < dh; y++) {
      const sinYTerm = Math.sin(y * effFreq * 2.1) * 2;
      for (let x = 0; x < dw; x++) {
        const n = Math.sin((x + y) * effFreq + Math.sin(x * effFreq * 1.7) * 3 + sinYTerm);
        const t2 = Math.abs(Math.sin(((n + 1) * 0.5) * piDensity));

        d[idx]     = (c1.r + (c2.r - c1.r) * t2) | 0;
        d[idx + 1] = (c1.g + (c2.g - c1.g) * t2) | 0;
        d[idx + 2] = (c1.b + (c2.b - c1.b) * t2) | 0;
        d[idx + 3] = opVal;
        idx += 4;
      }
    }

    if (sCtx && smallCanvas) {
      sCtx.putImageData(imgData, 0, 0);
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(smallCanvas, 0, 0, w, h);
      ctx.restore();
    } else {
      ctx.putImageData(imgData, 0, 0);
    }
  },

  // 37. GRID NOISE
  generateGridNoise(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1);
    const size    = Math.max(8, Math.round(40 * scale));
    const distort = density * 5 * scale;

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity);
    ctx.lineWidth   = Math.max(0.5, lt);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x  = c * size;
        const y  = r * size;
        const dx = (rng() - 0.5) * distort;
        const dy = (rng() - 0.5) * distort;
        ctx.strokeRect(x + dx, y + dy, size - 1, size - 1);
      }
    }
  },

  // 38. ABSTRACT LINE
  generateAbstractLine(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 2);
    const count   = Math.round(density * 20);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    ctx.lineCap = 'round';
    for (let i = 0; i < count; i++) {
      const ci = i % colors.length;
      ctx.strokeStyle = hexWithAlpha(colors[ci], opacity * 0.8);
      ctx.lineWidth   = Math.max(0.5, lt * (0.5 + rng() * 0.5));
      ctx.beginPath();

      const x1 = rng() * w, y1 = rng() * h;
      const x2 = rng() * w, y2 = rng() * h;
      const cx1 = rng() * w, cy1 = rng() * h;
      const cx2 = rng() * w, cy2 = rng() * h;

      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
      ctx.stroke();
    }
  },

  // 39. ORGANIC
  generateOrganic(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(15, Math.round(60 * scale));
    const count   = Math.round(density * 20);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const r  = size * (0.4 + rng() * 0.6);
      const ci = i % colors.length;
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.75);
      ctx.beginPath();
      // Organic blob using sine distortion
      const pts = 8;
      for (let p = 0; p < pts; p++) {
        const angle   = (p / pts) * Math.PI * 2;
        const distort = r * (0.7 + 0.3 * rng());
        const px = x + distort * Math.cos(angle);
        const py = y + distort * Math.sin(angle);
        p === 0 ? ctx.moveTo(px, py) : ctx.quadraticCurveTo(
          x + r * 1.1 * Math.cos(angle - Math.PI / pts),
          y + r * 1.1 * Math.sin(angle - Math.PI / pts),
          px, py
        );
      }
      ctx.closePath();
      ctx.fill();
    }
  },

  // 40. ORGANIC FLOW
  generateOrganicFlow(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 2);
    const lines   = Math.round(density * 15);
    const pts     = 20;

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let l = 0; l < lines; l++) {
      const ci = l % colors.length;
      ctx.strokeStyle = hexWithAlpha(colors[ci], opacity * 0.7);
      ctx.lineWidth   = Math.max(0.5, lt * (0.5 + rng()));
      ctx.lineCap     = 'round';
      ctx.beginPath();

      let x = rng() * w;
      const startY = rng() * h;
      ctx.moveTo(x, startY);

      for (let p = 0; p < pts; p++) {
        x += (rng() - 0.3) * w / pts;
        const y = startY + (p / pts) * h * 0.6 + (rng() - 0.5) * h * 0.3;
        const cpx = x + (rng() - 0.5) * 60 * scale;
        const cpy = y - (rng() * 40 * scale);
        ctx.quadraticCurveTo(cpx, cpy, Math.max(0, Math.min(w, x)), Math.max(0, Math.min(h, y)));
      }
      ctx.stroke();
    }
  },

  // 41. FLORAL
  generateFloral(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const r0      = Math.max(12, Math.round(40 * scale));
    const petals  = Math.round(5 + density * 0.5);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawFlower = (cx, cy, r) => {
      // Petals
      for (let p = 0; p < petals; p++) {
        const angle = (p / petals) * Math.PI * 2;
        const px = cx + r * 0.7 * Math.cos(angle);
        const py = cy + r * 0.7 * Math.sin(angle);
        const ci = p % colors.length;
        ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
        ctx.beginPath();
        ctx.ellipse(px, py, r * 0.45, r * 0.25, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      // Center
      ctx.fillStyle = hexWithAlpha(colors[(petals) % colors.length], opacity);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    };

    const step = r0 * 2.3;
    const cols = Math.ceil(w / step) + 2;
    const rows = Math.ceil(h / step) + 2;

    for (let r = -1; r <= rows; r++) {
      for (let c = -1; c <= cols; c++) {
        drawFlower(c * step + (r % 2 === 0 ? 0 : step / 2), r * step, r0);
      }
    }
  },

  // 42. BOTANICAL
  generateBotanical(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1.5);
    const size    = Math.max(15, Math.round(60 * scale));
    const count   = Math.round(density * 15);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawLeaf = (cx, cy, angle, l) => {
      const ci = Math.floor(rng() * colors.length);
      ctx.fillStyle   = hexWithAlpha(colors[ci], opacity);
      ctx.strokeStyle = hexWithAlpha(colors[0], opacity * 0.3);
      ctx.lineWidth   = Math.max(0.3, lt * 0.5);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(l * 0.3, -l * 0.2, l * 0.7, -l * 0.2, l, 0);
      ctx.bezierCurveTo(l * 0.7,  l * 0.2, l * 0.3,  l * 0.2, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Midrib
      ctx.strokeStyle = hexWithAlpha(colors[0], opacity * 0.4);
      ctx.lineWidth   = lt * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(l, 0);
      ctx.stroke();
      ctx.restore();
    };

    for (let i = 0; i < count; i++) {
      const cx = rng() * w;
      const cy = rng() * h;
      const leaves = 3 + Math.floor(rng() * 5);
      for (let l = 0; l < leaves; l++) {
        const angle = (l / leaves) * Math.PI * 2 + rng() * 0.3;
        drawLeaf(cx, cy, angle, size * (0.4 + rng() * 0.6));
      }
    }
  },

  // 43. LEAVES
  generateLeaves(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(15, Math.round(50 * scale));
    const count   = Math.round(density * 30);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const x     = rng() * w;
      const y     = rng() * h;
      const angle = rng() * Math.PI * 2;
      const l     = size * (0.5 + rng() * 0.5);
      const ci    = Math.floor(rng() * colors.length);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.85);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(l * 0.3, -l * 0.35, l * 0.7, -l * 0.35, l, 0);
      ctx.bezierCurveTo(l * 0.7,  l * 0.35, l * 0.3,  l * 0.35, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  },

  // 44. PIXEL
  generatePixel(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(4, Math.round(20 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / size);
    const rows = Math.ceil(h / size);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ci = Math.floor(rng() * colors.length);
        if (rng() < 0.6) {
          ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
          ctx.fillRect(c * size, r * size, size, size);
        }
      }
    }
  },

  // 45. LUXURY
  generateLuxury(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#111111','#c9a84c','#8b6914']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 0.5);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Fine crosshatch
    const spacing = Math.max(3, Math.round(15 * scale / density));
    ctx.save();
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.6);
    ctx.lineWidth   = Math.max(0.2, lt);
    const diag = Math.sqrt(w * w + h * h);
    for (let x = -diag; x < diag; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + diag, diag);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + diag, 0);
      ctx.lineTo(x, diag);
      ctx.stroke();
    }
    ctx.restore();

    // Diamond dots
    const dotSize = Math.max(2, Math.round(8 * scale));
    const dotSpacing = dotSize * 4;
    for (let y = dotSpacing / 2; y < h + dotSpacing; y += dotSpacing) {
      for (let x = dotSpacing / 2 + (Math.round(y / dotSpacing) % 2 === 0 ? 0 : dotSpacing / 2); x < w + dotSpacing; x += dotSpacing) {
        ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.8);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-dotSize / 2, -dotSize / 2, dotSize, dotSize);
        ctx.restore();
      }
    }
  },

  // 46. KIDS
  generateKids(ctx, w, h, s, rng) {
    const colors  = this._colors(s);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(12, Math.round(40 * scale));
    const count   = Math.round(density * 25);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const sz = size * (0.5 + rng() * 0.5);
      const ci = Math.floor(rng() * colors.length);
      const t  = Math.floor(rng() * 5);
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity * 0.9);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rng() * 0.5 - 0.25);

      switch (t) {
        case 0: // Star
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            const a = (p * 2 * Math.PI / 5) - Math.PI / 2;
            p === 0 ? ctx.moveTo(sz/2 * Math.cos(a), sz/2 * Math.sin(a)) : ctx.lineTo(sz/2 * Math.cos(a), sz/2 * Math.sin(a));
            const a2 = a + Math.PI / 5;
            ctx.lineTo(sz/4 * Math.cos(a2), sz/4 * Math.sin(a2));
          }
          ctx.closePath();
          ctx.fill();
          break;
        case 1: // Heart
          ctx.beginPath();
          ctx.moveTo(0, sz * 0.15);
          ctx.bezierCurveTo(0, -sz * 0.1, -sz / 2, -sz * 0.15, -sz / 2, sz * 0.1);
          ctx.bezierCurveTo(-sz / 2, sz * 0.4, 0, sz * 0.5, 0, sz * 0.5);
          ctx.bezierCurveTo(0, sz * 0.5, sz / 2, sz * 0.4, sz / 2, sz * 0.1);
          ctx.bezierCurveTo(sz / 2, -sz * 0.15, 0, -sz * 0.1, 0, sz * 0.15);
          ctx.closePath();
          ctx.fill();
          break;
        case 2: // Cloud
          ctx.beginPath();
          ctx.arc(-sz * 0.2, 0, sz * 0.25, 0, Math.PI * 2);
          ctx.arc(sz * 0.1, -sz * 0.15, sz * 0.3, 0, Math.PI * 2);
          ctx.arc(sz * 0.35, 0, sz * 0.2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 3: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 4: // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -sz / 2); ctx.lineTo(sz / 2, 0);
          ctx.lineTo(0, sz / 2);  ctx.lineTo(-sz / 2, 0);
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();
    }
  },

  // 47. TECHNOLOGY
  generateTechnology(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#050a14','#0a5f9e','#00d4ff']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1);
    const size    = Math.max(20, Math.round(60 * scale));

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.6);
    ctx.lineWidth   = Math.max(0.3, lt * 0.5);

    // Circuit grid lines
    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath(); ctx.moveTo(c * size, 0); ctx.lineTo(c * size, h); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * size); ctx.lineTo(w, r * size); ctx.stroke();
    }

    // Nodes and traces
    const nodeCount = Math.round(density * 12);
    for (let i = 0; i < nodeCount; i++) {
      const col = Math.floor(rng() * cols);
      const row = Math.floor(rng() * rows);
      const cx  = col * size;
      const cy  = row * size;
      const ci  = (i % 2 === 0) ? 1 : 2;
      const nc  = colors.length;

      // Node
      ctx.fillStyle = hexWithAlpha(colors[ci % nc], opacity * 0.9);
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Trace
      ctx.strokeStyle = hexWithAlpha(colors[ci % nc], opacity * 0.7);
      ctx.lineWidth   = Math.max(1, lt);
      const dir = Math.floor(rng() * 4);
      const len = Math.floor(rng() * 3 + 1) * size;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      if (dir === 0) ctx.lineTo(cx + len, cy);
      else if (dir === 1) ctx.lineTo(cx - len, cy);
      else if (dir === 2) ctx.lineTo(cx, cy + len);
      else ctx.lineTo(cx, cy - len);
      ctx.stroke();
    }
  },

  // 48. FUTURISTIC
  generateFuturistic(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#020412','#0a0a2e','#6600ff']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 1);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Hexagonal grid
    const r     = Math.max(15, Math.round(35 * scale));
    const hx    = r * 2;
    const hy    = r * Math.sqrt(3);
    const cols  = Math.ceil(w / hx) + 3;
    const rows  = Math.ceil(h / hy) + 3;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * hx * 1.5 + (row % 2 === 0 ? 0 : hx * 0.75);
        const cy = row * hy;

        ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.4);
        ctx.lineWidth   = Math.max(0.3, lt * 0.4);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                  : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.stroke();

        // Random glow dots
        if (rng() < 0.15) {
          const ci = Math.floor(rng() * colors.length);
          ctx.fillStyle = hexWithAlpha(colors[ci % colors.length], opacity * 0.9);
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.1, 0, Math.PI * 2);
          ctx.fill();
          // Glow
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.5);
          grad.addColorStop(0, hexWithAlpha(colors[ci % colors.length], 0.4));
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  },

  // 49. CHRISTMAS
  generateChristmas(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#0a2010','#cc0010','#c8a800']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(15, Math.round(50 * scale));
    const count   = Math.round(density * 20);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawSnowflake = (cx, cy, r) => {
      ctx.strokeStyle = hexWithAlpha(colors[2 % colors.length], opacity);
      ctx.lineWidth   = Math.max(0.5, 1.5);
      for (let a = 0; a < 6; a++) {
        const angle = (a / 6) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(r, 0);
        // Branches
        ctx.moveTo(r * 0.4, 0); ctx.lineTo(r * 0.6, -r * 0.2);
        ctx.moveTo(r * 0.4, 0); ctx.lineTo(r * 0.6, r * 0.2);
        ctx.moveTo(r * 0.65, 0); ctx.lineTo(r * 0.85, -r * 0.18);
        ctx.moveTo(r * 0.65, 0); ctx.lineTo(r * 0.85, r * 0.18);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawStar = (cx, cy, r) => {
      ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity);
      ctx.beginPath();
      for (let p = 0; p < 10; p++) {
        const angle = (p * Math.PI / 5) - Math.PI / 2;
        const rad   = p % 2 === 0 ? r : r * 0.4;
        p === 0 ? ctx.moveTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle))
                : ctx.lineTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    };

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const r  = size * (0.3 + rng() * 0.5);
      if (rng() < 0.5) drawSnowflake(x, y, r);
      else drawStar(x, y, r * 0.8);
    }
  },

  // 50. HALLOWEEN
  generateHalloween(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#0a0005','#7f0a00','#e05c00']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(15, Math.round(50 * scale));
    const count   = Math.round(density * 20);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawSpider = (cx, cy, r) => {
      ctx.strokeStyle = hexWithAlpha(colors[2 % colors.length], opacity * 0.6);
      ctx.lineWidth   = 0.8;
      // Web lines
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        ctx.stroke();
      }
      // Web arcs
      for (let ring = 1; ring <= 4; ring++) {
        const rr = (ring / 4) * r;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Spider body
      ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBat = (cx, cy, r) => {
      ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.8);
      ctx.beginPath();
      // Wings
      ctx.moveTo(cx, cy);
      ctx.bezierCurveTo(cx - r, cy - r * 0.5, cx - r * 1.5, cy - r * 0.2, cx - r * 1.2, cy + r * 0.3);
      ctx.bezierCurveTo(cx - r * 0.8, cy + r * 0.5, cx - r * 0.3, cy + r * 0.3, cx, cy);
      ctx.bezierCurveTo(cx + r * 0.3, cy + r * 0.3, cx + r * 0.8, cy + r * 0.5, cx + r * 1.2, cy + r * 0.3);
      ctx.bezierCurveTo(cx + r * 1.5, cy - r * 0.2, cx + r, cy - r * 0.5, cx, cy);
      ctx.closePath();
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.1, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    };

    for (let i = 0; i < count; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const r = size * (0.3 + rng() * 0.5);
      if (rng() < 0.5) drawSpider(x, y, r);
      else drawBat(x, y, r * 0.6);
    }
  },

  // 51. WEDDING
  generateWedding(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#fafafa','#c8a0b8','#e8d4e0']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(15, Math.round(50 * scale));
    const count   = Math.round(density * 20);
    const lt      = this._lt(s, 0.8);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Fine filigree background
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.3);
    ctx.lineWidth   = 0.5;
    const step = Math.max(20, size * 1.5);
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        const yy = y + Math.sin(x / (w / Math.PI / 4)) * 5;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // Interlocking rings
    const drawRings = (cx, cy, r) => {
      const ci = rng() < 0.5 ? 1 : 2;
      ctx.strokeStyle = hexWithAlpha(colors[ci % colors.length], opacity);
      ctx.lineWidth   = Math.max(0.5, lt);
      ctx.beginPath();
      ctx.arc(cx - r * 0.3, cy, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + r * 0.3, cy, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawHeart = (cx, cy, sz) => {
      ctx.fillStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.4);
      ctx.beginPath();
      ctx.moveTo(cx, cy + sz * 0.2);
      ctx.bezierCurveTo(cx, cy, cx - sz / 2, cy - sz * 0.1, cx - sz / 2, cy + sz * 0.15);
      ctx.bezierCurveTo(cx - sz / 2, cy + sz * 0.45, cx, cy + sz * 0.6, cx, cy + sz * 0.6);
      ctx.bezierCurveTo(cx, cy + sz * 0.6, cx + sz / 2, cy + sz * 0.45, cx + sz / 2, cy + sz * 0.15);
      ctx.bezierCurveTo(cx + sz / 2, cy - sz * 0.1, cx, cy, cx, cy + sz * 0.2);
      ctx.closePath();
      ctx.fill();
    };

    for (let i = 0; i < count; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const r = size * (0.3 + rng() * 0.4);
      if (rng() < 0.5) drawRings(x, y, r);
      else drawHeart(x, y - r / 2, r);
    }
  },

  // 52. VALENTINE
  generateValentine(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#fff0f5','#e91e8c','#ff6b9d']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const size    = Math.max(12, Math.round(45 * scale));
    const count   = Math.round(density * 30);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const drawHeart = (cx, cy, sz, ci) => {
      ctx.fillStyle = hexWithAlpha(colors[ci], opacity);
      ctx.save();
      ctx.translate(cx, cy - sz * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, sz * 0.35);
      ctx.bezierCurveTo(0, sz * 0.1, -sz / 2, 0, -sz / 2, sz * 0.3);
      ctx.bezierCurveTo(-sz / 2, sz * 0.6, 0, sz * 0.75, 0, sz * 0.75);
      ctx.bezierCurveTo(0, sz * 0.75, sz / 2, sz * 0.6, sz / 2, sz * 0.3);
      ctx.bezierCurveTo(sz / 2, 0, 0, sz * 0.1, 0, sz * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    for (let i = 0; i < count; i++) {
      const x  = rng() * w;
      const y  = rng() * h;
      const sz = size * (0.3 + rng() * 0.7);
      const ci = Math.floor(rng() * colors.length);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rng() - 0.5) * 0.5);
      drawHeart(0, 0, sz, ci);
      ctx.restore();
    }
  },

  // 53. BUSINESS
  generateBusiness(ctx, w, h, s, rng) {
    const colors  = this._colors(s, ['#f8fafc','#1a2a4a','#3b6fd4']);
    const scale   = this._scale(s);
    const density = this._density(s);
    const opacity = this._opacity(s);
    const lt      = this._lt(s, 0.5);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    const size = Math.max(20, Math.round(60 * scale));
    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;

    // Fine professional grid
    ctx.strokeStyle = hexWithAlpha(colors[1 % colors.length], opacity * 0.15);
    ctx.lineWidth   = Math.max(0.3, lt * 0.5);
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath(); ctx.moveTo(c * size, 0); ctx.lineTo(c * size, h); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * size); ctx.lineTo(w, r * size); ctx.stroke();
    }

    // Accent corners
    const dotSpacing = size * 2;
    ctx.fillStyle = hexWithAlpha(colors[2 % colors.length], opacity * 0.4);
    for (let y = dotSpacing / 2; y < h + dotSpacing; y += dotSpacing) {
      for (let x = dotSpacing / 2; x < w + dotSpacing; x += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Diagonal accent lines
    ctx.strokeStyle = hexWithAlpha(colors[2 % colors.length], opacity * 0.08);
    ctx.lineWidth   = Math.max(0.3, lt);
    const diag = Math.sqrt(w * w + h * h);
    for (let x = -diag; x < diag; x += size * 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + diag, diag);
      ctx.stroke();
    }
  },

  // ══════════════════════════════════════════════════════════
  // EFFECTS ENGINE
  // ══════════════════════════════════════════════════════════

  _applyEffects(ctx, w, h, s, rng) {
    const fx = s.effects || {};

    if (fx.blur?.enabled)      this._fxBlur(ctx, w, h, fx.blur.intensity);
    if (fx.grain?.enabled)     this._fxGrain(ctx, w, h, fx.grain.intensity, rng);
    if (fx.noise?.enabled)     this._fxNoise(ctx, w, h, fx.noise.intensity, rng);
    if (fx.paper?.enabled)     this._fxPaper(ctx, w, h, fx.paper.intensity, rng);
    if (fx.fabric?.enabled)    this._fxFabric(ctx, w, h, fx.fabric.intensity, rng);
    if (fx.glass?.enabled)     this._fxGlass(ctx, w, h, fx.glass.intensity);
    if (fx.frosted?.enabled)   this._fxFrosted(ctx, w, h, fx.frosted.intensity);
    if (fx.shadow?.enabled)    this._fxShadow(ctx, w, h, fx.shadow.intensity);
    if (fx.glow?.enabled)      this._fxGlow(ctx, w, h, fx.glow.intensity, s.colors);
    if (fx.vintage?.enabled)   this._fxVintage(ctx, w, h, fx.vintage.intensity);
    if (fx.distortion?.enabled) this._fxDistortion(ctx, w, h, fx.distortion.intensity, rng);
    if (fx.gradient?.enabled)  this._fxGradientOverlay(ctx, w, h, fx.gradient.intensity, s.colors);
    if (fx.canvas?.enabled)    this._fxCanvas(ctx, w, h, fx.canvas.intensity, rng);
    if (fx.leather?.enabled)   this._fxLeather(ctx, w, h, fx.leather.intensity, rng);
  },

  _fxBlur(ctx, w, h, intensity) {
    const radius = Math.max(0, intensity * 0.05);
    if (radius > 0 && typeof document !== 'undefined' && ctx.canvas) {
      try {
        const temp = document.createElement('canvas');
        temp.width = w;
        temp.height = h;
        const tCtx = temp.getContext('2d');
        if (tCtx) {
          tCtx.drawImage(ctx.canvas, 0, 0);
          ctx.save();
          ctx.filter = `blur(${radius.toFixed(1)}px)`;
          ctx.drawImage(temp, 0, 0);
          ctx.restore();
        }
      } catch(e) {}
    }
  },

  _fxGrain(ctx, w, h, intensity, rng) {
    const alpha = Math.max(0, intensity * 0.003);
    const img   = ctx.getImageData(0, 0, w, h);
    const d     = img.data;
    const scale = intensity * 0.8;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rng() - 0.5) * scale;
      d[i]     = Math.max(0, Math.min(255, d[i]     + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
  },

  _fxNoise(ctx, w, h, intensity, rng) {
    const a = intensity / 200;
    if (a <= 0) return;
    if (typeof document !== 'undefined') {
      const tile = document.createElement('canvas');
      tile.width = 128; tile.height = 128;
      const tCtx = tile.getContext('2d');
      if (tCtx) {
        const id = tCtx.createImageData(128, 128);
        const data = id.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = (rng() * 255) | 0;
          data[i] = v; data[i+1] = v; data[i+2] = v; data[i+3] = 255;
        }
        tCtx.putImageData(id, 0, 0);
        ctx.save();
        ctx.globalAlpha = a;
        const pat = ctx.createPattern(tile, 'repeat');
        if (pat) {
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();
      }
    }
  },

  _fxPaper(ctx, w, h, intensity, rng) {
    const alpha = intensity / 400;
    if (alpha <= 0) return;
    if (typeof document !== 'undefined') {
      const tile = document.createElement('canvas');
      tile.width = 128; tile.height = 128;
      const tCtx = tile.getContext('2d');
      if (tCtx) {
        const id = tCtx.createImageData(128, 128);
        const data = id.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = 180 + ((rng() * 75) | 0);
          data[i] = v; data[i+1] = Math.max(0, v - 5); data[i+2] = Math.max(0, v - 15); data[i+3] = 255;
        }
        tCtx.putImageData(id, 0, 0);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = 'overlay';
        const pat = ctx.createPattern(tile, 'repeat');
        if (pat) {
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();
      }
    }
  },

  _fxFabric(ctx, w, h, intensity, rng) {
    const a = intensity / 500;
    if (a <= 0) return;
    if (typeof document !== 'undefined') {
      const tile = document.createElement('canvas');
      tile.width = 4; tile.height = 4;
      const tCtx = tile.getContext('2d');
      if (tCtx) {
        tCtx.fillStyle = 'rgb(220,220,220)';
        tCtx.fillRect(0, 0, 4, 4);
        tCtx.fillStyle = 'rgb(200,200,200)';
        tCtx.fillRect(2, 0, 2, 2);
        tCtx.fillRect(0, 2, 2, 2);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.globalCompositeOperation = 'multiply';
        const pat = ctx.createPattern(tile, 'repeat');
        if (pat) {
          ctx.fillStyle = pat;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();
      }
    }
  },

  _fxGlass(ctx, w, h, intensity) {
    ctx.save();
    ctx.globalAlpha = intensity / 400;
    ctx.globalCompositeOperation = 'screen';
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  _fxFrosted(ctx, w, h, intensity) {
    ctx.save();
    ctx.globalAlpha = intensity / 300;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  _fxShadow(ctx, w, h, intensity) {
    const a = intensity / 200;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.5);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, `rgba(0,0,0,${a})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  _fxGlow(ctx, w, h, intensity, colors) {
    const a = intensity / 400;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = a;
    const c = colors && colors[0] ? colors[0] : '#ffffff';
    const { r, g, b } = hexToRgb(c);
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.8)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  _fxVintage(ctx, w, h, intensity) {
    const a = intensity / 300;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = a;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,240,200,0.8)');
    grad.addColorStop(1, 'rgba(200,180,150,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  _fxDistortion(ctx, w, h, intensity, rng) {
    const snap = ctx.getImageData(0, 0, w, h);
    const out  = ctx.createImageData(w, h);
    const src  = snap.data;
    const dst  = out.data;
    const amp  = intensity * 0.5;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sx = Math.max(0, Math.min(w - 1, Math.round(x + Math.sin(y * 0.03) * amp)));
        const sy = Math.max(0, Math.min(h - 1, Math.round(y + Math.sin(x * 0.03) * amp)));
        const si = (sy * w + sx) * 4;
        const di = (y  * w + x)  * 4;
        dst[di]     = src[si];
        dst[di + 1] = src[si + 1];
        dst[di + 2] = src[si + 2];
        dst[di + 3] = src[si + 3];
      }
    }
    ctx.putImageData(out, 0, 0);
  },

  _fxGradientOverlay(ctx, w, h, intensity, colors) {
    if (!colors || !colors.length) return;
    const a = intensity / 200;
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = a;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    const denom = Math.max(1, colors.length - 1);
    colors.forEach((c, i) => grad.addColorStop(i / denom, c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  _fxCanvas(ctx, w, h, intensity, rng) {
    const a = intensity / 600;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.globalCompositeOperation = 'multiply';
    const size = 4;
    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        const v = 160 + Math.floor(rng() * 60);
        ctx.fillStyle = `rgb(${v},${Math.max(v - 10, 0)},${Math.max(v - 20, 0)})`;
        ctx.fillRect(x, y, size, size);
      }
    }
    ctx.restore();
  },

  _fxLeather(ctx, w, h, intensity, rng) {
    const a = intensity / 500;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.globalCompositeOperation = 'multiply';
    for (let y = 0; y < h; y += 4) {
      const v = 120 + Math.floor(rng() * 40);
      ctx.fillStyle = `rgb(${v},${Math.max(v - 15, 0)},${Math.max(v - 30, 0)})`;
      ctx.fillRect(0, y, w, 2 + Math.floor(rng() * 2));
    }
    ctx.restore();
  },

  // ─── GRADIENT OVERLAY ────────────────────────────────────
  _applyGradient(ctx, w, h, gradConfig, colors) {
    if (!colors || !colors.length) return;
    const type    = gradConfig.type    || 'linear';
    const angle   = (gradConfig.angle  || 135) * Math.PI / 180;
    const opacity = Math.max(0, Math.min(1, (gradConfig.opacity || 50) / 100));

    ctx.save();
    ctx.globalAlpha               = opacity;
    ctx.globalCompositeOperation  = 'source-over';

    let grad;
    if (type === 'radial') {
      grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.5);
    } else if (type === 'conic') {
      // Simulate conic with linear
      grad = ctx.createLinearGradient(w / 2 + Math.cos(angle) * w, h / 2 + Math.sin(angle) * h,
                                       w / 2 - Math.cos(angle) * w, h / 2 - Math.sin(angle) * h);
    } else {
      // linear / diagonal
      const x1 = w / 2 - Math.cos(angle) * w;
      const y1 = h / 2 - Math.sin(angle) * h;
      const x2 = w / 2 + Math.cos(angle) * w;
      const y2 = h / 2 + Math.sin(angle) * h;
      grad = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    const nc = colors.length;
    colors.forEach((c, i) => grad.addColorStop(i / Math.max(1, nc - 1), c));

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },
};

if (typeof window !== 'undefined') window.PatternEngine = PatternEngine;
if (typeof module !== 'undefined') module.exports = PatternEngine;
