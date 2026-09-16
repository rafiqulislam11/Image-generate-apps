'use strict';
/**
 * PatternForge PRO V2 — app.js
 * Main application: State Management, High-Performance Canvas Rendering,
 * Mobile/Tablet/Desktop Responsiveness, 53 Patterns Filter, Color Studio,
 * Resolution Presets (8K/4K/FHD), Batch Generation, Stock Metadata.
 */

// ─── Default State ─────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
    seed: 483920,
    patternType: 'plaid',
    colors: ['#0d1b3e', '#e05c00', '#c24a00'],
    scale: 50,
    stripeWidth: 30,
    stripeGap: 4,
    horizontalWidth: 30,
    verticalWidth: 30,
    diagonalWidth: 15,
    lineThickness: 1,
    density: 5,
    opacity: 0.85,
    rotation: 45,
    spacing: 10,
    randomness: 0,
    contrast: 50,
    blendStrength: 0.6,
    seamless: true,
    effects: {
        blur:       { enabled: false, intensity: 20 },
        grain:      { enabled: false, intensity: 30 },
        noise:      { enabled: false, intensity: 20 },
        paper:      { enabled: false, intensity: 40 },
        fabric:     { enabled: false, intensity: 50 },
        glass:      { enabled: false, intensity: 30 },
        frosted:    { enabled: false, intensity: 40 },
        shadow:     { enabled: false, intensity: 30 },
        glow:       { enabled: false, intensity: 40 },
        vintage:    { enabled: false, intensity: 30 },
        distortion: { enabled: false, intensity: 20 },
        gradient:   { enabled: false, intensity: 50 },
    },
    gradient: {
        enabled: false,
        type: 'linear',
        angle: 135,
        opacity: 50,
        strength: 50,
    },
    canvasWidth: 4000,
    canvasHeight: 2663,
    ppi: 300,
    exportFormat: 'png',
    exportQuality: 90,
};

// ─── App Controller ────────────────────────────────────────────────────────────
const App = {
    state: null,
    history: [],
    historyIndex: -1,
    historyMax: 50,
    favorites: [],
    previewCanvas: null,
    previewCtx: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    currentPlatform: 'adobe',
    tileMode: 1,
    seedLocked: false,
    lockAspectRatio: true,
    renderDebounce: null,
    uploadedImage: null,
    batchResults: [],
    theme: 'dark',
    _toastTimer: null,
    _resizeTimer: null,

    // ─── Initialization ────────────────────────────────────────────────────────
    init() {
        this.previewCanvas = document.getElementById('preview-canvas');
        if (!this.previewCanvas) {
            console.error('PatternForge: preview-canvas element not found');
            return;
        }
        this.previewCtx = this.previewCanvas.getContext('2d');

        if (typeof HistoryManager !== 'undefined') {
            HistoryManager.init(() => this.updateHistoryButtons());
        }
        if (typeof ProjectManager !== 'undefined') {
            ProjectManager.init();
        }

        this.loadTheme();
        this.loadFavorites();

        // Restore last state or initialize with defaults
        const saved = this.loadLastState();
        this.state = saved ? this.mergeState(DEFAULT_STATE, saved) : this.cloneState(DEFAULT_STATE);
        if (typeof setSeed === 'function') setSeed(this.state.seed);

        this.bindAllEvents();
        this.applyStateToUI();
        this.initOnePageMode();
        this.initDockTabs();
        this.initEasyMode();
        this.initPatternCycler();
        this.initQuickHarmonies();
        this.pushHistory();
        this.requestRender();
        this.generateVariations();
        this.updatePatternInfo();
        this.updateResolutionCard();

        // Responsive window resize listener
        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => {
                this.render();
            }, 120);
        });

        // Orientation change for mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.render(), 200);
        });
    },

    cloneState(s) {
        return JSON.parse(JSON.stringify(s));
    },

    mergeState(defaults, saved) {
        const out = this.cloneState(defaults);
        for (const key of Object.keys(defaults)) {
            if (saved[key] === undefined || saved[key] === null) continue;
            if (key === 'effects') {
                for (const fx of Object.keys(defaults.effects)) {
                    if (saved.effects && saved.effects[fx]) {
                        out.effects[fx] = Object.assign({}, defaults.effects[fx], saved.effects[fx]);
                    }
                }
            } else if (key === 'gradient') {
                out.gradient = Object.assign({}, defaults.gradient, saved.gradient || {});
            } else {
                out[key] = saved[key];
            }
        }
        if (!Array.isArray(out.colors) || out.colors.length < 2) {
            out.colors = defaults.colors.slice();
        }
        return out;
    },

    // ─── Rendering Engine (60 FPS Hardware-Accelerated) ──────────────────────
    requestRender() {
        if (this._renderRaf) return;
        if (typeof requestAnimationFrame !== 'undefined') {
            this._renderRaf = requestAnimationFrame(() => {
                this._renderRaf = null;
                this.render();
            });
        } else {
            this.render();
        }
    },

    scheduleAutoSave() {
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(() => {
            this.saveLastState();
        }, 1500);
    },

    render() {
        if (!this.previewCanvas) return;
        const s = this.state;
        const container = document.getElementById('canvas-container');
        if (!container) return;

        // Determine viewport dimensions
        const cw = Math.max(160, container.clientWidth  - 24);
        const ch = Math.max(120, container.clientHeight - 24);

        const aspect = (s.canvasWidth && s.canvasHeight)
            ? s.canvasWidth / s.canvasHeight
            : 4000 / 2663;

        let pw, ph;
        if (cw / ch > aspect) {
            ph = Math.min(ch, 750);
            pw = Math.round(ph * aspect);
        } else {
            pw = Math.min(cw, 960);
            ph = Math.round(pw / aspect);
        }

        pw = Math.max(80, pw);
        ph = Math.max(60, ph);

        const tileMode = this.tileMode || 1;

        // Keep preview canvas memory bounded to container dimensions
        if (this.previewCanvas.width !== pw || this.previewCanvas.height !== ph) {
            this.previewCanvas.width  = pw;
            this.previewCanvas.height = ph;
        }

        if (tileMode === 1) {
            this._renderSingle(this.previewCtx, pw, ph, s);
        } else {
            const tw = Math.max(20, Math.round(pw / tileMode));
            const th = Math.max(20, Math.round(ph / tileMode));
            const tile = document.createElement('canvas');
            tile.width = tw; tile.height = th;
            const tc = tile.getContext('2d');
            this._renderSingle(tc, tw, th, s);
            for (let r = 0; r < tileMode; r++) {
                for (let c = 0; c < tileMode; c++) {
                    this.previewCtx.drawImage(tile, c * tw, r * th);
                }
            }
        }

        this.updateZoomDisplay();
        this.updateStatusBar();
        this.scheduleAutoSave();
    },

    _renderSingle(ctx, w, h, s) {
        if (typeof resetRng === 'function') resetRng();
        const rng = (typeof getRng === 'function') ? getRng() : createSeededRandom(s.seed || 1);
        PatternEngine.generate(ctx, w, h, s, rng);
    },

    // ─── Mobile Drawers & Overlay Management ───────────────────────────────────
    openLeftSidebar() {
        document.getElementById('left-sidebar')?.classList.add('open');
        document.getElementById('right-panel')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.add('active');
    },

    closeLeftSidebar() {
        document.getElementById('left-sidebar')?.classList.remove('open');
        if (!document.getElementById('right-panel')?.classList.contains('open')) {
            document.getElementById('sidebar-overlay')?.classList.remove('active');
        }
    },

    toggleLeftSidebar() {
        const sb = document.getElementById('left-sidebar');
        if (sb?.classList.contains('open')) {
            this.closeLeftSidebar();
        } else {
            this.openLeftSidebar();
        }
    },

    openRightPanel() {
        document.getElementById('right-panel')?.classList.add('open');
        document.getElementById('left-sidebar')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.add('active');
    },

    closeRightPanel() {
        document.getElementById('right-panel')?.classList.remove('open');
        if (!document.getElementById('left-sidebar')?.classList.contains('open')) {
            document.getElementById('sidebar-overlay')?.classList.remove('active');
        }
    },

    toggleRightPanel() {
        const rp = document.getElementById('right-panel');
        if (rp?.classList.contains('open')) {
            this.closeRightPanel();
        } else {
            this.openRightPanel();
        }
    },

    closeAllDrawers() {
        document.getElementById('left-sidebar')?.classList.remove('open');
        document.getElementById('right-panel')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('active');
    },

    // ─── Pattern Filter & Search ──────────────────────────────────────────────
    filterPatterns(category) {
        const btns = document.querySelectorAll('.pattern-btn');
        const query = (document.getElementById('pattern-search')?.value || '').toLowerCase().trim();

        btns.forEach(btn => {
            const cat = btn.dataset.cat || '';
            const type = (btn.dataset.type || '').toLowerCase();
            const text = btn.textContent.toLowerCase();

            const matchCat = (category === 'all' || cat === category);
            const matchQuery = !query || type.includes(query) || text.includes(query);

            btn.classList.toggle('hidden', !(matchCat && matchQuery));
        });
    },

    // ─── History (Undo / Redo) ────────────────────────────────────────────────
    pushHistory() {
        const snapshot = this.cloneState(this.state);
        if (typeof HistoryManager !== 'undefined') {
            HistoryManager.push(snapshot);
        }
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(snapshot);
        if (this.history.length > this.historyMax) this.history.shift();
        this.historyIndex = this.history.length - 1;
        this.updateHistoryButtons();
    },

    undo() {
        if (typeof HistoryManager !== 'undefined' && HistoryManager.canUndo()) {
            const prev = HistoryManager.undo();
            if (prev) {
                this.state = this.cloneState(prev);
                if (typeof setSeed === 'function') setSeed(this.state.seed);
                this.applyStateToUI();
                this.requestRender();
                this.updateHistoryButtons();
                this.showToast('↶ Undo');
                return;
            }
        }
        if (this.historyIndex <= 0) return;
        this.historyIndex--;
        this.state = this.cloneState(this.history[this.historyIndex]);
        if (typeof setSeed === 'function') setSeed(this.state.seed);
        this.applyStateToUI();
        this.requestRender();
        this.updateHistoryButtons();
        this.showToast('↶ Undo');
    },

    redo() {
        if (typeof HistoryManager !== 'undefined' && HistoryManager.canRedo()) {
            const next = HistoryManager.redo();
            if (next) {
                this.state = this.cloneState(next);
                if (typeof setSeed === 'function') setSeed(this.state.seed);
                this.applyStateToUI();
                this.requestRender();
                this.updateHistoryButtons();
                this.showToast('↷ Redo');
                return;
            }
        }
        if (this.historyIndex >= this.history.length - 1) return;
        this.historyIndex++;
        this.state = this.cloneState(this.history[this.historyIndex]);
        if (typeof setSeed === 'function') setSeed(this.state.seed);
        this.applyStateToUI();
        this.requestRender();
        this.updateHistoryButtons();
        this.showToast('↷ Redo');
    },

    updateHistoryButtons() {
        const undoBtn = document.getElementById('btn-undo');
        const redoBtn = document.getElementById('btn-redo');
        const canU = typeof HistoryManager !== 'undefined' ? HistoryManager.canUndo() : (this.historyIndex > 0);
        const canR = typeof HistoryManager !== 'undefined' ? HistoryManager.canRedo() : (this.historyIndex < this.history.length - 1);
        if (undoBtn) undoBtn.disabled = !canU;
        if (redoBtn) redoBtn.disabled = !canR;
    },

    // ─── Favorites ────────────────────────────────────────────────────────────
    saveFavorite() {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            settings: this.cloneState(this.state),
            thumbnail: this.previewCanvas.toDataURL('image/png', 0.35),
        };
        this.favorites.unshift(entry);
        if (this.favorites.length > 50) this.favorites.pop();
        this.persistFavorites();
        this.renderFavorites();
        this.showToast('❤️ Saved to Favorites');
    },

    removeFavorite(id) {
        this.favorites = this.favorites.filter(f => f.id !== id);
        this.persistFavorites();
        this.renderFavorites();
    },

    loadFavorite(id) {
        const fav = this.favorites.find(f => f.id === id);
        if (!fav) return;
        this.state = this.cloneState(fav.settings);
        if (typeof setSeed === 'function') setSeed(this.state.seed);
        this.applyStateToUI();
        this.pushHistory();
        this.requestRender();
        this.showToast('Favorite pattern loaded');
    },

    persistFavorites() {
        try { localStorage.setItem('pf_favorites', JSON.stringify(this.favorites)); } catch(e) {}
    },

    loadFavorites() {
        try { this.favorites = JSON.parse(localStorage.getItem('pf_favorites') || '[]'); } catch(e) { this.favorites = []; }
        this.renderFavorites();
    },

    renderFavorites() {
        const grid = document.getElementById('favorites-grid');
        if (!grid) return;
        if (!this.favorites.length) {
            grid.innerHTML = '<div class="text-xs text-muted" style="grid-column:1/-1;text-align:center;padding:12px;">No favorites saved yet</div>';
            return;
        }
        grid.innerHTML = this.favorites.map(f => `
            <div class="fav-item" data-id="${f.id}">
                <img src="${f.thumbnail}" alt="Favorite pattern" class="fav-thumb" loading="lazy">
                <div class="fav-actions">
                    <button class="btn-icon" onclick="App.loadFavorite(${f.id})" title="Load">↩</button>
                    <button class="btn-icon" onclick="App.removeFavorite(${f.id})" title="Remove">✕</button>
                </div>
            </div>
        `).join('');
    },

    // ─── Local Storage & State Persistence ────────────────────────────────────
    saveLastState() {
        try { localStorage.setItem('pf_last_state', JSON.stringify(this.state)); } catch(e) {}
    },

    loadLastState() {
        try { return JSON.parse(localStorage.getItem('pf_last_state') || 'null'); } catch(e) { return null; }
    },

    // ─── Theme Management ─────────────────────────────────────────────────────
    loadTheme() {
        const saved = localStorage.getItem('pf_theme') || 'dark';
        this.setTheme(saved);
    },

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pf_theme', theme);
        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
    },

    toggleTheme() {
        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    },

    // ─── Randomize ────────────────────────────────────────────────────────────
    randomize() {
        if (!this.seedLocked) {
            this.state.seed = generateRandomSeed();
        }
        if (typeof resetRng === 'function') resetRng();
        const rng = (typeof getRng === 'function') ? getRng() : createSeededRandom(this.state.seed);

        const types = PatternEngine.getPatternTypes();
        this.state.patternType = randomPick(rng, types);
        const nc = randomInt(rng, 2, 5);
        this.state.colors = randomNamedPalette(rng, nc);
        this.state.scale = randomInt(rng, 20, 90);
        this.state.stripeWidth = randomInt(rng, 10, 60);
        this.state.stripeGap = randomInt(rng, 0, 15);
        this.state.lineThickness = randomNumber(rng, 0.5, 3);
        this.state.density = randomNumber(rng, 2, 9);
        this.state.opacity = randomNumber(rng, 0.65, 1.0);
        this.state.rotation = randomInt(rng, 0, 180);
        this.state.blendStrength = randomNumber(rng, 0.35, 0.8);

        this.applyStateToUI();
        this.pushHistory();
        this.requestRender();
        this.updatePatternInfo();
        this.generateVariations();
        this.showToast('🎲 Random pattern generated');
    },

    generateVariation() {
        const rng = createSeededRandom(randomInt(getRng ? getRng() : Math.random, 1, 999999));
        const variation = this.cloneState(this.state);
        variation.seed = randomInt(rng, 1, 999999);
        variation.scale = Math.max(10, this.state.scale + randomInt(rng, -15, 15));
        variation.stripeWidth = Math.max(4, this.state.stripeWidth + randomInt(rng, -12, 12));
        variation.density = Math.max(1, Math.min(10, this.state.density + randomNumber(rng, -2, 2)));
        variation.opacity = Math.max(0.4, Math.min(1, this.state.opacity + randomNumber(rng, -0.2, 0.2)));
        variation.blendStrength = Math.max(0.2, Math.min(0.9, this.state.blendStrength + randomNumber(rng, -0.2, 0.2)));

        variation.colors = this.state.colors.map(c => {
            const { r, g, b } = hexToRgb(c);
            return rgbToHex(
                Math.max(0, Math.min(255, r + randomInt(rng, -20, 20))),
                Math.max(0, Math.min(255, g + randomInt(rng, -20, 20))),
                Math.max(0, Math.min(255, b + randomInt(rng, -20, 20)))
            );
        });

        this.state = variation;
        if (typeof setSeed === 'function') setSeed(variation.seed);
        this.applyStateToUI();
        this.pushHistory();
        this.requestRender();
        this.showToast('🔁 Variation applied');
    },

    generateVariations() {
        const grid = document.getElementById('variations-grid');
        if (!grid) return;
        const base = this.cloneState(this.state);
        grid.innerHTML = '';
        clearTimeout(this._varTimer);

        let i = 0;
        const renderNext = () => {
            if (i >= 6) return;
            const seed = (base.seed + i * 47 + 109) % 999999 || 1;
            const rng = createSeededRandom(seed);
            const vs = this.cloneState(base);
            vs.seed = seed;
            vs.effects = {}; // lightweight for tiny thumbnails
            vs.scale = Math.max(10, base.scale + randomInt(rng, -20, 20));
            vs.density = Math.max(1, Math.min(10, base.density + randomNumber(rng, -2, 2)));
            vs.blendStrength = Math.max(0.2, Math.min(0.9, base.blendStrength + randomNumber(rng, -0.2, 0.2)));

            const thumb = document.createElement('canvas');
            thumb.width = 100; thumb.height = 70;
            const tc = thumb.getContext('2d');
            const vrng = createSeededRandom(seed);
            PatternEngine.generate(tc, 100, 70, vs, vrng);

            const div = document.createElement('div');
            div.className = 'variation-item';
            div.title = `Seed: ${seed}`;
            const captured = vs;
            div.addEventListener('click', () => {
                this.state = this.cloneState(captured);
                if (typeof setSeed === 'function') setSeed(captured.seed);
                this.applyStateToUI();
                this.pushHistory();
                this.requestRender();
                this.showToast('Variation applied');
            });
            div.appendChild(thumb);
            grid.appendChild(div);

            i++;
            if (i < 6) {
                if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(renderNext);
                } else {
                    renderNext();
                }
            }
        };

        this._varTimer = setTimeout(renderNext, 80);
    },

    // ─── UI State Synchronization ─────────────────────────────────────────────
    applyStateToUI() {
        const s = this.state;

        // Seed
        const seedInput = document.getElementById('seed-input');
        if (seedInput) seedInput.value = s.seed;

        // Pattern button active state
        document.querySelectorAll('.pattern-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.type === s.patternType);
        });

        // Color swatches & palette
        this.renderColorSwatches();
        this.renderColorPaletteDisplay();

        // Sliders
        this.setSlider('scale',          s.scale);
        this.setSlider('stripe-width',   s.stripeWidth);
        this.setSlider('stripe-gap',     s.stripeGap);
        this.setSlider('line-thickness', s.lineThickness);
        this.setSlider('density',        s.density);
        this.setSlider('opacity',        Math.round(s.opacity * 100));
        this.setSlider('rotation',       s.rotation);
        this.setSlider('blend-strength', Math.round(s.blendStrength * 100));

        // Seamless toggle
        const st = document.getElementById('seamless-toggle');
        if (st) st.checked = s.seamless;

        // Resolution Inputs
        const wInput = document.getElementById('canvas-w');
        const hInput = document.getElementById('canvas-h');
        if (wInput) wInput.value = s.canvasWidth;
        if (hInput) hInput.value = s.canvasHeight;

        // Resolution Preset Dropdown Sync
        const resSelect = document.getElementById('res-preset-select');
        if (resSelect) {
            const currentRes = `${s.canvasWidth}x${s.canvasHeight}`;
            let hasMatch = false;
            for (const opt of (resSelect.options || [])) {
                if (opt.value === currentRes) {
                    resSelect.value = currentRes;
                    hasMatch = true;
                    break;
                }
            }
            if (!hasMatch) resSelect.value = '';
        }

        // Export Format & Quality
        const fmtSel = document.getElementById('export-format');
        if (fmtSel) fmtSel.value = s.exportFormat;
        const qualSel = document.getElementById('export-quality');
        if (qualSel) qualSel.value = s.exportQuality;

        const curFmt = (s.exportFormat || 'png').toLowerCase();
        document.querySelectorAll('.format-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.format === curFmt);
        });
        if (typeof this.syncEasyFmtResUI === 'function') this.syncEasyFmtResUI();
        if (typeof this.updateEasyMasterLabels === 'function') this.updateEasyMasterLabels();

        // Effects
        Object.entries(s.effects).forEach(([name, cfg]) => {
            const tog = document.getElementById(`fx-${name}-toggle`);
            const sld = document.getElementById(`fx-${name}-intensity`);
            if (tog) {
                tog.checked = cfg.enabled;
                const row = tog.closest('.effect-row, .effect-item');
                if (row) row.classList.toggle('active', cfg.enabled);
            }
            if (sld) {
                sld.value = cfg.intensity;
                this.updateSliderDisplay(sld);
            }
        });

        // Gradient
        const gToggle = document.getElementById('gradient-toggle');
        const gType = document.getElementById('gradient-type');
        const gAngle = document.getElementById('gradient-angle');
        const gOpacity = document.getElementById('gradient-opacity');
        if (gToggle) gToggle.checked = s.gradient.enabled;
        if (gType) gType.value = s.gradient.type;
        if (gAngle) { gAngle.value = s.gradient.angle; this.updateSliderDisplay(gAngle); }
        if (gOpacity) { gOpacity.value = s.gradient.opacity; this.updateSliderDisplay(gOpacity); }

        this.updateHistoryButtons();
        this.updatePatternInfo();
        this.updateResolutionCard();
        if (typeof this.updateCyclerDisplay === 'function') this.updateCyclerDisplay();
        if (typeof this.syncEasySlidersFromState === 'function') this.syncEasySlidersFromState();
    },

    setSlider(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = value;
        this.updateSliderDisplay(el);
    },

    updateSliderDisplay(slider) {
        const display = document.getElementById(slider.id + '-val');
        if (display) {
            let val = parseFloat(slider.value);
            if (slider.step && parseFloat(slider.step) < 1) val = val.toFixed(1);
            else val = Math.round(val);
            display.textContent = val;
        }
    },

    // ─── Color Swatches & Studio ──────────────────────────────────────────────
    renderColorSwatches() {
        const container = document.getElementById('color-swatches');
        if (!container) return;
        container.innerHTML = '';
        const maxColors = 8;

        this.state.colors.forEach((color, i) => {
            const wrap = document.createElement('div');
            wrap.className = 'color-swatch-wrap';

            const picker = document.createElement('input');
            picker.type = 'color';
            picker.value = color;
            picker.className = 'color-picker';
            picker.id = `color-picker-${i}`;
            picker.addEventListener('input', e => {
                this.state.colors[i] = e.target.value;
                this.renderColorPaletteDisplay();
                this.requestRender();
            });
            picker.addEventListener('change', () => {
                this.pushHistory();
                this.updatePatternInfo();
            });

            const hexInput = document.createElement('input');
            hexInput.type = 'text';
            hexInput.value = color;
            hexInput.className = 'hex-input';
            hexInput.maxLength = 7;
            hexInput.addEventListener('input', e => {
                const v = e.target.value.trim();
                if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    this.state.colors[i] = v;
                    picker.value = v;
                    this.renderColorPaletteDisplay();
                    this.requestRender();
                }
            });
            picker.addEventListener('input', e => { hexInput.value = e.target.value; });

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-icon remove-color';
            removeBtn.textContent = '✕';
            removeBtn.title = 'Remove color';
            removeBtn.disabled = this.state.colors.length <= 2;
            removeBtn.addEventListener('click', () => {
                if (this.state.colors.length <= 2) return;
                this.state.colors.splice(i, 1);
                this.renderColorSwatches();
                this.renderColorPaletteDisplay();
                this.pushHistory();
                this.requestRender();
            });

            wrap.appendChild(picker);
            wrap.appendChild(hexInput);
            wrap.appendChild(removeBtn);
            container.appendChild(wrap);
        });

        if (this.state.colors.length < maxColors) {
            const addBtn = document.createElement('button');
            addBtn.className = 'btn-secondary w-full mt-1';
            addBtn.textContent = '+ Add Color';
            addBtn.addEventListener('click', () => {
                const rng = createSeededRandom(Date.now() % 999999);
                this.state.colors.push(randomColor(rng));
                this.renderColorSwatches();
                this.renderColorPaletteDisplay();
                this.pushHistory();
                this.requestRender();
            });
            container.appendChild(addBtn);
        }
    },

    renderColorPaletteDisplay() {
        const display = document.getElementById('palette-display');
        if (!display) return;
        display.innerHTML = this.state.colors.map(c => {
            const txtColor = contrastColor(c);
            return `<div class="palette-swatch" style="background:${c};color:${txtColor}" title="${c} (Click to copy)" onclick="navigator.clipboard.writeText('${c}');App.showToast('Copied ${c}')">${c.slice(1)}</div>`;
        }).join('');
    },

    applyHarmony(harmonyType) {
        if (typeof ColorEngine !== 'undefined' && ColorEngine.generateHarmony) {
            const base = this.state.colors[0] || '#4f80e1';
            const count = Math.max(2, Math.min(6, this.state.colors.length));
            const newCols = ColorEngine.generateHarmony(base, harmonyType, count);
            if (newCols && newCols.length) {
                this.state.colors = newCols;
                this.renderColorSwatches();
                this.renderColorPaletteDisplay();
                this.pushHistory();
                this.requestRender();
                this.showToast(`✨ ${harmonyType} harmony applied`);
            }
        }
    },

    applyPalette(paletteName) {
        const pal = PALETTES ? PALETTES[paletteName] : null;
        if (!pal) return;
        this.state.colors = pal.slice(0, Math.max(2, Math.min(this.state.colors.length, pal.length)));
        this.renderColorSwatches();
        this.renderColorPaletteDisplay();
        this.pushHistory();
        this.requestRender();
        this.showToast('Palette: ' + paletteName);
    },

    applyPremiumPalette(type) {
        if (typeof resetRng === 'function') resetRng();
        const rng = typeof getRng === 'function' ? getRng() : createSeededRandom(Date.now());
        const pal = randomPremiumPalette(rng, type, this.state.colors.length || 4);
        this.state.colors = pal;
        this.renderColorSwatches();
        this.renderColorPaletteDisplay();
        this.pushHistory();
        this.requestRender();
        this.showToast(type + ' palette applied');
    },

    // ─── Resolution & PPI Studio ──────────────────────────────────────────────
    setResolutionPreset(preset) {
        if (!preset || preset === 'custom') return;
        const [w, h] = preset.split('x').map(Number);
        if (!w || !h) return;

        this.state.canvasWidth = w;
        this.state.canvasHeight = h;

        const wInput = document.getElementById('canvas-w');
        const hInput = document.getElementById('canvas-h');
        if (wInput) wInput.value = w;
        if (hInput) hInput.value = h;

        this.updateResolutionCard();
        this.updateEasyMasterLabels();
        this.syncEasyFmtResUI();
        this.requestRender();
        this.updatePatternInfo();
        this.showToast(`Resolution: ${w} × ${h}`);
    },

    updateResolutionCard() {
        const s = this.state;
        const w = s.canvasWidth;
        const h = s.canvasHeight;

        // Ratio calculation
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(w, h);
        const ratioText = `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;

        // Memory estimation (W * H * 4 bytes RGBA)
        const memBytes = w * h * 4;
        const memMB = (memBytes / (1024 * 1024)).toFixed(1);

        // Realistic lossless PNG file size estimation based on resolution
        const pixels = w * h;
        let quality = 'Custom';
        let estFileText = '~4.5 MB';

        if (pixels >= 11520 * 6480 * 0.9) {
            quality = '12K Museum Master';
            estFileText = '~35 – 65 MB (১০MB+ নিশ্চিত)';
        } else if (pixels >= 8192 * 8192 * 0.9) {
            quality = '8K Square Master';
            estFileText = '~20 – 40 MB (১০MB+ নিশ্চিত)';
        } else if (pixels >= 7680 * 4320 * 0.9) {
            quality = '8K UHD Master';
            estFileText = '~15 – 28 MB (১০MB+ নিশ্চিত)';
        } else if (pixels >= 6000 * 4000 * 0.9) {
            quality = '6K Print';
            estFileText = '~10 – 16 MB (১০MB+ নিশ্চিত)';
        } else if (pixels >= 3840 * 2160 * 0.8) {
            quality = '4K UHD';
            estFileText = '~6 – 10 MB';
        } else if (pixels >= 2560 * 1440 * 0.8) {
            quality = '2K QHD';
            estFileText = '~3.5 – 5.5 MB';
        } else if (pixels >= 1920 * 1080 * 0.8) {
            quality = 'FHD 1080p';
            estFileText = '~2 – 3.5 MB';
        } else {
            quality = 'HD';
            estFileText = '~1 – 2 MB';
        }

        const qEl = document.getElementById('res-info-quality');
        const rEl = document.getElementById('res-info-aspect');
        const mEl = document.getElementById('res-info-mem');
        const badge = document.getElementById('canvas-res-badge');
        const fileSizeBadge = document.getElementById('master-size-indicator');

        if (qEl) qEl.textContent = quality;
        if (rEl) rEl.textContent = ratioText;
        if (mEl) mEl.textContent = estFileText;
        if (badge) badge.textContent = `${w} × ${h} (${s.ppi || 300} PPI) • ${quality}`;
        if (fileSizeBadge) fileSizeBadge.textContent = estFileText;
    },

    // ─── Zoom & Canvas Controls ───────────────────────────────────────────────
    setZoom(z) {
        this.zoom = Math.max(0.25, Math.min(4, z));
        if (this.zoom <= 1) {
            this.panX = 0;
            this.panY = 0;
        }
        this.applyCanvasTransform();
        this.updateZoomDisplay();
    },

    applyCanvasTransform() {
        if (!this.previewCanvas) return;
        this.previewCanvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
        const container = document.getElementById('canvas-container');
        if (container) {
            if (this.zoom > 1) {
                container.classList.add('can-pan');
                container.style.cursor = this.isPanning ? 'grabbing' : 'grab';
            } else {
                container.classList.remove('can-pan');
                container.style.cursor = 'default';
            }
        }
    },

    updateZoomDisplay() {
        const el = document.getElementById('zoom-level');
        if (el) {
            el.textContent = `${Math.round(this.zoom * 100)}%`;
        }
    },

    fitToScreen() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.applyCanvasTransform();
        this.updateZoomDisplay();
        this.requestRender();
    },

    toggleFullscreen() {
        const area = document.getElementById('canvas-area');
        if (!document.fullscreenElement) {
            area?.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
        }
    },

    // ─── Status Bar ───────────────────────────────────────────────────────────
    updateStatusBar(statusText) {
        const s = this.state;
        const pEl = document.getElementById('status-pattern');
        const rEl = document.getElementById('status-res');
        const sdEl = document.getElementById('status-seed');
        const tEl = document.getElementById('status-text');

        if (pEl) pEl.textContent = s.patternType;
        if (rEl) rEl.textContent = `${s.canvasWidth} × ${s.canvasHeight}`;
        if (sdEl) sdEl.textContent = s.seed;
        if (tEl) tEl.textContent = statusText || 'Ready';
    },

    updatePatternInfo() {
        const info = document.getElementById('pattern-info');
        if (!info) return;
        const s = this.state;
        const activeBtn = document.querySelector(`.pattern-btn[data-type="${s.patternType}"]`);
        const typeLabel = activeBtn ? activeBtn.textContent : s.patternType;

        info.innerHTML = `
            <div class="info-row"><span>Pattern:</span><span>${typeLabel}</span></div>
            <div class="info-row"><span>Dimensions:</span><span>${s.canvasWidth} × ${s.canvasHeight} px</span></div>
            <div class="info-row"><span>Print PPI:</span><span>${s.ppi || 300} PPI</span></div>
            <div class="info-row"><span>Color Count:</span><span>${s.colors.length}</span></div>
            <div class="info-row"><span>Scale / Density:</span><span>${s.scale} / ${s.density}</span></div>
            <div class="info-row"><span>Seed:</span><span>${s.seed}</span></div>
            <div class="info-row"><span>Seamless:</span><span>${s.seamless ? '✓ Enabled' : '✗ Disabled'}</span></div>
        `;
    },

    setDownloadButtonsLoading(isLoading, text) {
        const ids = [
            'btn-download',
            'btn-download-canvas',
            'btn-download-panel',
            'btn-easy-download-direct',
            'nav-btn-download'
        ];
        ids.forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            if (isLoading) {
                if (!btn.dataset.origHtml) btn.dataset.origHtml = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = `<span class="spin-icon">⏳</span> ${text || 'Exporting…'}`;
            } else {
                btn.disabled = false;
                if (btn.dataset.origHtml) {
                    btn.innerHTML = btn.dataset.origHtml;
                    delete btn.dataset.origHtml;
                }
            }
        });
    },

    // ─── Single Download ──────────────────────────────────────────────────────
    async download() {
        this.setDownloadButtonsLoading(true, 'Exporting…');
        this.updateStatusBar('Rendering export…');

        try {
            const renderSettings = Object.assign({}, this.state, {
                tileMode: this.tileMode || 1
            });
            const exportCanvas = renderFullResPattern(renderSettings);
            await downloadCanvas(exportCanvas, renderSettings);
            this.showToast('⬇ Pattern download started!');
            this.updateStatusBar('Download complete');
        } catch(err) {
            console.error('Export error:', err);
            this.showError('Export error: ' + err.message);
            this.updateStatusBar('Export failed');
        } finally {
            this.setDownloadButtonsLoading(false);
        }
    },

    // ─── 💎 Guaranteed 10MB+ Ultra-HD Master Download ──────────────────────────
    async downloadMaster10MB() {
        const btns = [
            document.getElementById('btn-download-master-10mb'),
            document.getElementById('btn-easy-download-master'),
            document.getElementById('btn-canvas-dl-master'),
            document.getElementById('btn-download-master-panel')
        ].filter(Boolean);

        const fmt = (this.state.exportFormat || 'png').toLowerCase();
        const fmtUpper = (fmt === 'jpeg' ? 'jpg' : fmt).toUpperCase();
        const w = this.state.canvasWidth || 7680;
        const resTag = w >= 7680 ? '8K' : w >= 6000 ? '6K' : w >= 3840 ? '4K' : w >= 2560 ? '2K' : 'HD';

        btns.forEach(b => {
            b.disabled = true;
            b.dataset.origHtml = b.innerHTML;
            b.innerHTML = `<span class="spin-icon">⏳</span> ${resTag} ${fmtUpper} Exporting…`;
        });

        this.updateStatusBar(`💎 Rendering ${resTag} Master (${fmtUpper})…`);
        this.showToast(`🚀 ${resTag} (${fmtUpper}) মাস্টার ইমেজ রেন্ডার হচ্ছে…`);

        try {
            const masterSettings = Object.assign({}, this.state, {
                tileMode: this.tileMode || 1
            });
            const res = await exportMasterUltra10MB(masterSettings);
            if (fmt === 'svg') {
                this.showToast(`🎉 ${resTag} ভেক্টর SVG মাস্টার তৈরি হয়েছে! (সাইজ: ${res.sizeMB})`);
            } else if (fmt === 'jpg' || fmt === 'jpeg') {
                this.showToast(`🎉 ${resTag} হাই-কোয়ালিটি JPEG সেভ হয়েছে! (সাইজ: ${res.sizeMB})`);
            } else {
                this.showToast(`🎉 ১০MB+ মাস্টার PNG ইমেজ সেভ হয়েছে! (সাইজ: ${res.sizeMB})`);
            }
            this.updateStatusBar(`${resTag} ${fmtUpper} Master Downloaded: ${res.sizeMB}`);
        } catch (err) {
            console.error('Master export error:', err);
            this.showError('Master export error: ' + err.message);
            this.updateStatusBar('Master export failed');
        } finally {
            btns.forEach(b => {
                b.disabled = false;
                b.innerHTML = b.dataset.origHtml || '<span>💎</span> Download Master';
            });
        }
    },

    // ─── Batch Generator ──────────────────────────────────────────────────────
    openBatchModal() {
        document.getElementById('modal-batch')?.classList.add('open');
    },

    closeBatchModal() {
        document.getElementById('modal-batch')?.classList.remove('open');
    },

    async runBatch() {
        const count = parseInt(document.getElementById('batch-count')?.value || '20');
        const type  = document.getElementById('batch-type')?.value || 'all';
        const mode  = document.getElementById('batch-color-mode')?.value || 'random';

        const progressEl = document.getElementById('batch-progress');
        const gridEl = document.getElementById('batch-results-grid');
        if (progressEl) progressEl.textContent = 'Generating 0 / ' + count;
        if (gridEl) gridEl.innerHTML = '<div class="text-xs text-muted" style="padding:20px;text-align:center;">Rendering patterns…</div>';

        const types = PatternEngine.getPatternTypes();
        this.batchResults = [];

        for (let i = 0; i < count; i++) {
            const seed = (Math.random() * 999999) | 0 || 1;
            const rng  = createSeededRandom(seed);
            const s    = this.cloneState(this.state);

            s.seed = seed;
            s.patternType = (type === 'all') ? randomPick(rng, types) : type;

            if (mode === 'random') {
                s.colors = randomNamedPalette(rng, randomInt(rng, 2, 5));
            } else if (mode === 'premium') {
                const palTypes = ['luxury', 'vibrant', 'earth', 'autumn', 'winter'];
                s.colors = randomPremiumPalette(rng, randomPick(rng, palTypes), randomInt(rng, 3, 5));
            }

            s.scale         = randomInt(rng, 20, 85);
            s.density       = randomNumber(rng, 2, 9);
            s.blendStrength = randomNumber(rng, 0.3, 0.8);
            s.opacity       = randomNumber(rng, 0.65, 1.0);

            this.batchResults.push(s);
            if (progressEl) progressEl.textContent = `Generated ${i + 1} / ${count}`;
        }

        this.renderBatchGrid();
    },

    renderBatchGrid() {
        const gridEl = document.getElementById('batch-results-grid');
        if (!gridEl) return;
        gridEl.innerHTML = '';

        this.batchResults.forEach((s, i) => {
            const card = document.createElement('div');
            card.className = 'batch-card';

            const thumb = document.createElement('canvas');
            thumb.width = 160; thumb.height = 100;
            const tc = thumb.getContext('2d');
            const rng = createSeededRandom(s.seed);
            PatternEngine.generate(tc, 160, 100, s, rng);

            const label = document.createElement('div');
            label.className = 'batch-label';
            label.textContent = `${i + 1}. ${s.patternType} | #${s.seed}`;

            const actions = document.createElement('div');
            actions.className = 'batch-actions';

            const dlBtn = document.createElement('button');
            dlBtn.className = 'btn-small';
            dlBtn.textContent = '⬇ Save';
            dlBtn.addEventListener('click', async () => {
                const ec = renderFullResPattern(s);
                await downloadCanvas(ec, { ...s, exportFormat: 'png', exportQuality: 90 });
            });

            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn-small';
            loadBtn.textContent = '↩ Load';
            loadBtn.addEventListener('click', () => {
                this.state = this.cloneState(s);
                if (typeof setSeed === 'function') setSeed(s.seed);
                this.applyStateToUI();
                this.pushHistory();
                this.requestRender();
                this.closeBatchModal();
                this.showToast('Pattern loaded from batch');
            });

            actions.appendChild(dlBtn);
            actions.appendChild(loadBtn);
            card.appendChild(thumb);
            card.appendChild(label);
            card.appendChild(actions);
            gridEl.appendChild(card);
        });
    },

    async batchDownloadZip() {
        if (!this.batchResults || !this.batchResults.length) {
            this.showToast('No batch results to download. Click "Generate Batch" first!');
            return;
        }
        const btn = document.getElementById('btn-batch-dl-zip');
        const origText = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span>⏳</span> Archiving ZIP…';
        }
        const pr = document.getElementById('batch-progress');
        if (pr) pr.textContent = 'Rendering & packing ZIP archive…';

        try {
            const format = this.state.exportFormat || 'png';
            const quality = this.state.exportQuality || 90;
            await batchExportZip(
                this.batchResults.map(s => ({
                    ...s,
                    exportFormat: format,
                    exportQuality: quality,
                    tileMode: this.tileMode || 1
                })),
                (done, total) => {
                    if (pr) pr.textContent = `Packing: ${done} / ${total}`;
                }
            );
            this.showToast('📦 Batch ZIP downloaded successfully!');
            if (pr) pr.textContent = `Complete! ${this.batchResults.length} patterns packed in ZIP`;
        } catch (err) {
            console.error('Batch ZIP export error:', err);
            this.showError('ZIP export error: ' + err.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origText || '📦 Download ZIP (Images + CSV)';
            }
        }
    },

    async batchDownloadAll() {
        if (!this.batchResults || !this.batchResults.length) {
            this.showToast('No batch results to download. Click "Generate Batch" first!');
            return;
        }
        const btn = document.getElementById('btn-batch-dl-all');
        if (btn) btn.disabled = true;

        const format = this.state.exportFormat || 'png';
        const quality = this.state.exportQuality || 90;

        const metaList = await batchExport(
            this.batchResults.map(s => ({
                ...s,
                exportFormat: format,
                exportQuality: quality,
                tileMode: this.tileMode || 1
            })),
            (done, total) => {
                const pr = document.getElementById('batch-progress');
                if (pr) pr.textContent = `Downloading: ${done} / ${total}`;
            }
        );
        generateCSV(metaList);
        if (btn) btn.disabled = false;
        this.showToast('✅ All batch patterns + CSV exported!');
    },

    async createUnique20() {
        this.openBatchModal();
        const countEl = document.getElementById('batch-count');
        const typeEl  = document.getElementById('batch-type');
        const modeEl  = document.getElementById('batch-color-mode');
        if (countEl) countEl.value = '20';
        if (typeEl)  typeEl.value  = 'all';
        if (modeEl)  modeEl.value  = 'random';
        await this.runBatch();
    },

    // ─── AI Prompt Studio ─────────────────────────────────────────────────────
    handleAIPrompt(overrideText) {
        const input = document.getElementById('ai-prompt-input');
        const prompt = (overrideText || (input ? input.value : '') || '').trim();
        if (!prompt) {
            this.showToast('💡 Please type a prompt or click an idea chip');
            return;
        }

        if (input) input.value = prompt;

        if (typeof AIParser === 'undefined' || !AIParser.parsePrompt) {
            this.showError('AI Parser engine not loaded');
            return;
        }

        const parsed = AIParser.parsePrompt(prompt);
        if (!parsed) {
            this.showError('Could not understand prompt. Try: "luxury gold and navy geometric"');
            return;
        }

        if (parsed.patternType) this.state.patternType = parsed.patternType;
        if (parsed.colors && parsed.colors.length >= 2) this.state.colors = parsed.colors;
        if (parsed.scale !== undefined) this.state.scale = parsed.scale;
        if (parsed.density !== undefined) this.state.density = parsed.density;
        if (parsed.lineThickness !== undefined) this.state.lineThickness = parsed.lineThickness;
        if (parsed.blendStrength !== undefined) this.state.blendStrength = parsed.blendStrength;
        if (parsed.seamless !== undefined) this.state.seamless = parsed.seamless;

        if (!this.seedLocked) {
            this.state.seed = generateRandomSeed();
        }

        if (typeof setSeed === 'function') setSeed(this.state.seed);
        this.applyStateToUI();
        this.pushHistory();
        this.requestRender();
        this.updatePatternInfo();
        this.generateVariations();
        this.showToast(`✨ Generated: ${this.state.patternType} (${this.state.colors.length} colors)`);
    },

    // ─── Project Management Studio ────────────────────────────────────────────
    openProjectsModal() {
        this.renderProjectsList();
        document.getElementById('modal-projects')?.classList.add('open');
    },

    closeProjectsModal() {
        document.getElementById('modal-projects')?.classList.remove('open');
    },

    saveCurrentProject() {
        if (typeof ProjectManager === 'undefined') return;
        const nameInput = document.getElementById('project-save-name');
        let name = (nameInput?.value || '').trim();
        if (!name) {
            name = `${this.state.patternType.charAt(0).toUpperCase() + this.state.patternType.slice(1)} Design #${this.state.seed}`;
        }

        let thumb = '';
        try {
            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = 160;
            thumbCanvas.height = 100;
            const tCtx = thumbCanvas.getContext('2d');
            if (tCtx && this.previewCanvas) {
                tCtx.drawImage(this.previewCanvas, 0, 0, 160, 100);
                thumb = thumbCanvas.toDataURL('image/jpeg', 0.75);
            }
        } catch(e) {}

        const entry = ProjectManager.save(null, name, this.state, thumb);
        if (entry) {
            if (nameInput) nameInput.value = '';
            this.renderProjectsList();
            this.showToast(`💾 Saved: "${name}"`);
        } else {
            this.showError('Could not save project');
        }
    },

    loadProject(id) {
        if (typeof ProjectManager === 'undefined') return;
        const p = ProjectManager.load(id);
        if (!p || !p.state) {
            this.showError('Project data not found');
            return;
        }
        this.state = this.cloneState(p.state);
        if (typeof setSeed === 'function') setSeed(this.state.seed);
        this.applyStateToUI();
        this.pushHistory();
        this.requestRender();
        this.closeProjectsModal();
        this.showToast(`📂 Loaded: "${p.name}"`);
    },

    duplicateProject(id) {
        if (typeof ProjectManager === 'undefined') return;
        const dup = ProjectManager.duplicate(id);
        if (dup) {
            this.renderProjectsList();
            this.showToast('📋 Duplicated project');
        }
    },

    renameProject(id) {
        if (typeof ProjectManager === 'undefined') return;
        const p = ProjectManager.load(id);
        if (!p) return;
        const newName = prompt('Enter new project name:', p.name);
        if (newName && newName.trim()) {
            ProjectManager.rename(id, newName.trim());
            this.renderProjectsList();
            this.showToast('Project renamed');
        }
    },

    deleteProject(id) {
        if (typeof ProjectManager === 'undefined') return;
        if (confirm('Delete this saved project?')) {
            ProjectManager.delete(id);
            this.renderProjectsList();
            this.showToast('Project deleted');
        }
    },

    exportProjectJSON() {
        if (typeof ProjectManager === 'undefined') return;
        const name = `${this.state.patternType}_pattern`;
        ProjectManager.exportJSON(this.state, name);
        this.showToast('📤 Project JSON downloaded');
    },

    async handleProjectImport(file) {
        if (typeof ProjectManager === 'undefined') return;
        try {
            const data = await ProjectManager.importJSON(file);
            if (data && data.state) {
                this.state = this.cloneState(data.state);
                if (typeof setSeed === 'function') setSeed(this.state.seed);
                const projName = data.name || 'Imported Project';
                ProjectManager.save(null, projName, this.state, '');
                this.renderProjectsList();
                this.applyStateToUI();
                this.pushHistory();
                this.requestRender();
                this.closeProjectsModal();
                this.showToast(`📥 Imported & Saved: "${projName}"`);
            }
        } catch(err) {
            this.showError('Import error: ' + err.message);
        }
    },

    renderProjectsList() {
        const grid = document.getElementById('projects-grid');
        const countEl = document.getElementById('projects-count');
        if (!grid || typeof ProjectManager === 'undefined') return;

        const projects = ProjectManager.getAll();
        if (countEl) countEl.textContent = projects.length;

        if (!projects.length) {
            grid.innerHTML = '<div class="no-projects-msg" style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted);">No saved projects yet. Type a name above and click "Save Current Design"!</div>';
            return;
        }

        grid.innerHTML = projects.map(p => {
            const dateStr = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '';
            const thumbSrc = p.thumbnail || '';
            const pType = p.state?.patternType || 'Pattern';
            return `
                <div class="project-card" data-id="${p.id}">
                    <div class="project-thumb-wrap">
                        ${thumbSrc ? `<img src="${thumbSrc}" alt="${p.name}" class="project-thumb" loading="lazy">` : '<div class="project-thumb-placeholder">🎨</div>'}
                        <span class="project-tag">${pType}</span>
                    </div>
                    <div class="project-info">
                        <div class="project-name" title="${p.name}">${p.name}</div>
                        <div class="project-date">${dateStr}</div>
                    </div>
                    <div class="project-actions">
                        <button class="btn-sm btn-load-proj" onclick="App.loadProject('${p.id}')" title="Load this project">Load</button>
                        <button class="btn-sm-icon" onclick="App.duplicateProject('${p.id}')" title="Duplicate">📋</button>
                        <button class="btn-sm-icon" onclick="App.renameProject('${p.id}')" title="Rename">✏️</button>
                        <button class="btn-sm-icon btn-danger-icon" onclick="App.deleteProject('${p.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ─── Stock Metadata Modal ─────────────────────────────────────────────────
    openStockModal() {
        this.updateStockMetadataDisplay();
        document.getElementById('modal-stock')?.classList.add('open');
    },

    closeStockModal() {
        document.getElementById('modal-stock')?.classList.remove('open');
    },

    setStockPlatform(platform) {
        this.currentPlatform = platform;
        document.querySelectorAll('.platform-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.platform === platform);
        });

        if (typeof MetadataEngine !== 'undefined' && MetadataEngine.CATEGORIES) {
            const cats = MetadataEngine.CATEGORIES[platform] || [];
            const catInput = document.getElementById('stock-category');
            if (catInput && cats.length) {
                catInput.value = cats[0];
            }
        }
        this.updateStockMetadataDisplay();
    },

    updateStockMetadataDisplay() {
        const meta = (typeof MetadataEngine !== 'undefined' && MetadataEngine.generate)
            ? MetadataEngine.generate(this.state, 1)
            : generateMetadata(this.state, 1);

        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
        setVal('stock-title',    meta.title);
        setVal('stock-desc',     meta.description);
        setVal('stock-keywords', Array.isArray(meta.keywords) ? meta.keywords.join(', ') : meta.keywords);
        setVal('stock-category', meta.category || 'Backgrounds/Textures');
        setVal('stock-design-type', meta.designType || 'Digital Artwork / Pattern');

        // Character and count badges
        const titleCount = document.getElementById('stock-title-count');
        const descCount  = document.getElementById('stock-desc-count');
        const kwCount    = document.getElementById('stock-keywords-count');
        const seoScoreEl = document.getElementById('stock-seo-score');
        const seoGradeEl = document.getElementById('stock-seo-grade');

        const titleLen = (meta.title || '').length;
        const descLen  = (meta.description || '').length;
        const kwArr    = Array.isArray(meta.keywords) ? meta.keywords : (meta.keywords || '').split(',').map(k => k.trim()).filter(Boolean);

        if (titleCount) titleCount.textContent = `${titleLen} / 120`;
        if (descCount)  descCount.textContent  = `${descLen} / 250`;
        if (kwCount)    kwCount.textContent    = `${kwArr.length} tags`;

        const score = meta.stats?.seoScore || 88;
        if (seoScoreEl) seoScoreEl.textContent = `${score}%`;
        if (seoGradeEl) {
            seoGradeEl.textContent = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Keywords';
            seoGradeEl.className = 'seo-score-tag ' + (score >= 85 ? 'grade-high' : 'grade-mid');
        }

        // Render Keyword Pills
        const tagsContainer = document.getElementById('stock-keywords-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = kwArr.slice(0, 30).map(tag => `
                <span class="kw-tag" title="Click to copy tag" onclick="navigator.clipboard.writeText('${tag}');App.showToast('Copied: ${tag}')">
                    ${tag}
                </span>
            `).join('');
        }
    },

    copyStockField(fieldId, label) {
        const el = document.getElementById(fieldId);
        if (!el || !el.value) return;
        navigator.clipboard.writeText(el.value).then(
            () => this.showToast(`📋 Copied ${label}`),
            () => this.showToast(`Selected ${label}`)
        );
    },

    downloadStockCSV() {
        const platform = this.currentPlatform || 'adobe';
        const kwRaw = document.getElementById('stock-keywords')?.value || '';
        const kwArr = kwRaw.split(',').map(s => s.trim()).filter(Boolean);
        const meta = {
            filename: generateFilename(this.state.patternType, 1, this.state.exportFormat || 'png', this.state.seed, this.state.canvasWidth, this.state.canvasHeight),
            title: document.getElementById('stock-title')?.value || '',
            description: document.getElementById('stock-desc')?.value || '',
            keywords: kwArr,
            keywordsString: kwRaw,
            category: document.getElementById('stock-category')?.value || 'Backgrounds/Textures',
            designType: document.getElementById('stock-design-type')?.value || 'Digital Artwork',
            patternType: this.state.patternType,
            colorPalette: this.state.colors.join(' | '),
            seed: String(this.state.seed),
            width: String(this.state.canvasWidth),
            height: String(this.state.canvasHeight),
        };

        if (typeof MetadataEngine !== 'undefined' && typeof MetadataEngine.exportCSV === 'function') {
            MetadataEngine.exportCSV([meta], platform);
        } else {
            generateCSV([meta]);
        }
        this.showToast(`📄 ${platform.toUpperCase()} stock metadata CSV exported`);
    },

    // ─── Image Upload & Extraction ────────────────────────────────────────────
    handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Please upload an image file (PNG, JPG, WebP)');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            this.showError('Image size exceeds 20 MB limit');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                const preview = document.getElementById('upload-preview');
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
                this.showToast('Image uploaded! Click Extract Palette.');
            };
            img.onerror = () => this.showError('Failed to load image');
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    extractPaletteFromImage() {
        if (!this.uploadedImage) {
            this.showError('Please choose or drop an image first');
            return;
        }
        const tmp = document.createElement('canvas');
        const scale = Math.min(1, 200 / Math.max(this.uploadedImage.width, this.uploadedImage.height));
        tmp.width  = Math.max(10, Math.round(this.uploadedImage.width  * scale));
        tmp.height = Math.max(10, Math.round(this.uploadedImage.height * scale));
        const tc = tmp.getContext('2d');
        tc.drawImage(this.uploadedImage, 0, 0, tmp.width, tmp.height);
        const id = tc.getImageData(0, 0, tmp.width, tmp.height);
        const colors = extractDominantColors(id, 5);
        if (colors && colors.length) {
            this.state.colors = colors;
            this.renderColorSwatches();
            this.renderColorPaletteDisplay();
            this.pushHistory();
            this.requestRender();
            this.showToast(`🎨 Extracted ${colors.length} colors from image`);
        }
    },

    // ─── Toast / Notifications ────────────────────────────────────────────────
    showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.remove('error');
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    },

    showError(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = '⚠ ' + msg;
        toast.classList.add('show', 'error');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('show', 'error'), 3600);
    },

    copySettings() {
        const json = JSON.stringify(this.state, null, 2);
        navigator.clipboard.writeText(json).then(
            () => this.showToast('📋 Settings copied to clipboard'),
            () => this.showToast('JSON: ' + json.slice(0, 40) + '…')
        );
    },

    // ─── Event Binding ────────────────────────────────────────────────────────
    bindAllEvents() {
        const on = (id, evt, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(evt, fn);
        };

        // Header controls
        on('btn-new',          'click', () => {
            this.state = this.cloneState(DEFAULT_STATE);
            if (typeof setSeed === 'function') setSeed(DEFAULT_STATE.seed);
            this.applyStateToUI();
            this.pushHistory();
            this.requestRender();
            this.showToast('New pattern created');
        });
        on('btn-projects',     'click', () => this.openProjectsModal());
        on('btn-randomize',    'click', () => this.randomize());
        on('btn-undo',         'click', () => this.undo());
        on('btn-redo',         'click', () => this.redo());
        on('btn-download',     'click', () => this.download());
        on('btn-theme',        'click', () => this.toggleTheme());
        on('btn-view-mode',    'click', () => this.toggleOnePageMode());
        on('btn-hotkeys',      'click', () => this.openHotkeysModal());
        on('modal-hotkeys-close',     'click', () => this.closeHotkeysModal());
        on('modal-hotkeys-close2',    'click', () => this.closeHotkeysModal());
        on('modal-hotkeys-backdrop',  'click', () => this.closeHotkeysModal());
        on('btn-copy-settings','click', () => this.copySettings());
        on('btn-export-csv',   'click', () => { generateCSV([generateMetadata(this.state, 1)]); this.showToast('📄 CSV exported'); });
        on('btn-export-csv2',  'click', () => { generateCSV([generateMetadata(this.state, 1)]); this.showToast('📄 CSV exported'); });
        on('btn-stock-export', 'click', () => this.openStockModal());
        on('btn-stock-export2','click', () => this.openStockModal());

        // Mobile drawer toggles
        on('btn-toggle-left',  'click', () => this.toggleLeftSidebar());
        on('btn-close-left',   'click', () => this.closeLeftSidebar());
        on('btn-toggle-right', 'click', () => this.toggleRightPanel());
        on('btn-close-right',  'click', () => this.closeRightPanel());
        on('sidebar-overlay',  'click', () => this.closeAllDrawers());

        // Mobile bottom navigation bar
        on('nav-btn-controls', 'click', () => this.toggleLeftSidebar());
        on('nav-btn-palette',  'click', () => this.toggleRightPanel());
        on('nav-btn-generate', 'click', () => { this.pushHistory(); this.requestRender(); this.showToast('⚡ Generated'); });
        on('nav-btn-random',   'click', () => this.randomize());
        on('nav-btn-download', 'click', () => this.download());

        // Canvas action buttons
        on('btn-generate-20',     'click', () => this.createUnique20());
        on('btn-generate',        'click', () => { this.pushHistory(); this.requestRender(); this.showToast('⚡ Generated'); });
        on('btn-randomize-canvas','click', () => this.randomize());
        on('btn-variation',       'click', () => this.generateVariation());
        on('btn-favorite',        'click', () => this.saveFavorite());
        on('btn-batch',           'click', () => this.openBatchModal());
        on('btn-batch-canvas',    'click', () => this.openBatchModal());
        on('btn-projects-canvas', 'click', () => this.openProjectsModal());
        on('btn-download-canvas', 'click', () => this.download());
        on('btn-quick-download',  'click', () => this.download());
        on('btn-download-panel',  'click', () => this.download());
        on('btn-download-master-panel', 'click', () => this.downloadMaster10MB());
        on('btn-batch-dl-zip',    'click', () => this.batchDownloadZip());

        // Format pills in bottom action bar
        document.querySelectorAll('.format-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.format-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.state.exportFormat = pill.dataset.format || 'png';
                const sel = document.getElementById('export-format');
                if (sel) sel.value = this.state.exportFormat;
                this.updateEasyMasterLabels();
                this.syncEasyFmtResUI();
                this.showToast(`Export format: ${this.state.exportFormat.toUpperCase()}`);
            });
        });

        // Pattern search & category filter chips
        on('pattern-search', 'input', () => {
            const activeChip = document.querySelector('.category-chip.active');
            this.filterPatterns(activeChip ? activeChip.dataset.cat : 'all');
        });

        document.querySelectorAll('.category-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.filterPatterns(chip.dataset.cat);
            });
        });

        // Pattern selection buttons (all 53 patterns)
        document.querySelectorAll('.pattern-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.patternType = btn.dataset.type;
                document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.pushHistory();
                this.requestRender();
                this.updatePatternInfo();
                this.generateVariations();
                this.updateStatusBar();
                // On mobile, auto-close drawer to view canvas immediately
                if (window.innerWidth <= 768) {
                    this.closeLeftSidebar();
                }
            });
        });

        // Color harmony generator buttons
        document.querySelectorAll('.harmony-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyHarmony(btn.dataset.harmony);
            });
        });

        // Sliders
        this.bindSlider('scale',          v => this.state.scale = parseFloat(v));
        this.bindSlider('stripe-width',   v => this.state.stripeWidth = parseFloat(v));
        this.bindSlider('stripe-gap',     v => this.state.stripeGap = parseFloat(v));
        this.bindSlider('line-thickness', v => this.state.lineThickness = parseFloat(v));
        this.bindSlider('density',        v => this.state.density = parseFloat(v));
        this.bindSlider('opacity',        v => this.state.opacity = parseFloat(v) / 100);
        this.bindSlider('rotation',       v => this.state.rotation = parseFloat(v));
        this.bindSlider('blend-strength', v => this.state.blendStrength = parseFloat(v) / 100);

        // Effects toggles and sliders
        const effectsList = ['blur','grain','noise','paper','fabric','glass','frosted','shadow','glow','vintage','distortion','gradient'];
        effectsList.forEach(fx => {
            on(`fx-${fx}-toggle`, 'change', e => {
                this.state.effects[fx].enabled = e.target.checked;
                const row = e.target.closest('.effect-row, .effect-item');
                if (row) row.classList.toggle('active', e.target.checked);
                this.requestRender();
            });
            const sld = document.getElementById(`fx-${fx}-intensity`);
            if (sld) {
                sld.addEventListener('input', e => {
                    this.state.effects[fx].intensity = parseFloat(e.target.value);
                    this.updateSliderDisplay(sld);
                    this.requestRender();
                });
                sld.addEventListener('change', () => this.pushHistory());
            }
        });

        // Gradient controls
        on('gradient-toggle', 'change', e => { this.state.gradient.enabled = e.target.checked; this.requestRender(); });
        on('gradient-type',   'change', e => { this.state.gradient.type = e.target.value; this.requestRender(); });
        this.bindSlider('gradient-angle',   v => this.state.gradient.angle = parseFloat(v));
        this.bindSlider('gradient-opacity', v => this.state.gradient.opacity = parseFloat(v));

        // Seamless toggle
        on('seamless-toggle', 'change', e => { this.state.seamless = e.target.checked; this.requestRender(); });

        // Tile mode
        on('tile-mode', 'change', e => { this.tileMode = parseInt(e.target.value); this.requestRender(); });

        // Resolution preset selector
        on('res-preset-select', 'change', e => this.setResolutionPreset(e.target.value));

        // Aspect ratio lock toggle
        on('lock-aspect-ratio', 'change', e => {
            this.lockAspectRatio = e.target.checked;
        });

        // Custom resolution inputs with aspect ratio maintenance
        on('canvas-w', 'change', e => {
            const newW = Math.max(100, Math.min(8000, parseInt(e.target.value) || 4000));
            if (this.lockAspectRatio && this.state.canvasWidth && this.state.canvasHeight) {
                const ratio = this.state.canvasHeight / this.state.canvasWidth;
                const newH = Math.round(newW * ratio);
                this.state.canvasHeight = Math.max(100, Math.min(8000, newH));
                const hEl = document.getElementById('canvas-h');
                if (hEl) hEl.value = this.state.canvasHeight;
            }
            this.state.canvasWidth = newW;
            this.updateResolutionCard();
            this.requestRender();
        });

        on('canvas-h', 'change', e => {
            const newH = Math.max(100, Math.min(8000, parseInt(e.target.value) || 2663));
            if (this.lockAspectRatio && this.state.canvasWidth && this.state.canvasHeight) {
                const ratio = this.state.canvasWidth / this.state.canvasHeight;
                const newW = Math.round(newH * ratio);
                this.state.canvasWidth = Math.max(100, Math.min(8000, newW));
                const wEl = document.getElementById('canvas-w');
                if (wEl) wEl.value = this.state.canvasWidth;
            }
            this.state.canvasHeight = newH;
            this.updateResolutionCard();
            this.requestRender();
        });

        // Quick size preset chips
        document.querySelectorAll('.size-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setResolutionPreset(btn.dataset.size);
            });
        });

        // PPI buttons
        document.querySelectorAll('.ppi-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ppi-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.ppi = parseInt(btn.dataset.ppi || '300');
                const ppiVal = document.getElementById('current-ppi-val');
                if (ppiVal) ppiVal.textContent = `${this.state.ppi} PPI`;
                this.updateResolutionCard();
                this.updatePatternInfo();
                this.showToast(`Print Resolution: ${this.state.ppi} PPI`);
            });
        });

        // Export format / quality
        on('export-format',  'change', e => { 
            this.state.exportFormat  = e.target.value; 
            document.querySelectorAll('.format-pill').forEach(p => {
                p.classList.toggle('active', p.dataset.format === this.state.exportFormat);
            });
            this.updateEasyMasterLabels();
            this.syncEasyFmtResUI();
        });
        on('export-quality', 'change', e => { this.state.exportQuality = parseInt(e.target.value); });

        // Zoom controls
        on('btn-zoom-in',   'click', () => this.setZoom(this.zoom * 1.25));
        on('btn-zoom-out',  'click', () => this.setZoom(this.zoom * 0.8));
        on('btn-fit',       'click', () => this.fitToScreen());
        on('btn-fullscreen','click', () => this.toggleFullscreen());

        // Seed controls
        on('seed-input', 'change', e => {
            const v = parseInt(e.target.value);
            if (v > 0) {
                this.state.seed = v;
                if (typeof setSeed === 'function') setSeed(v);
                this.requestRender();
                this.updatePatternInfo();
            }
        });
        on('btn-random-seed', 'click', () => {
            if (this.seedLocked) { this.showToast('🔒 Seed is locked'); return; }
            const s = generateRandomSeed();
            this.state.seed = s;
            const el = document.getElementById('seed-input');
            if (el) el.value = s;
            if (typeof setSeed === 'function') setSeed(s);
            this.requestRender();
            this.updatePatternInfo();
        });
        on('btn-copy-seed', 'click', () => {
            navigator.clipboard.writeText(String(this.state.seed)).then(
                () => this.showToast('📋 Seed copied: ' + this.state.seed),
                () => this.showToast('Seed: ' + this.state.seed)
            );
        });
        on('btn-lock-seed', 'click', () => {
            this.seedLocked = !this.seedLocked;
            const btn = document.getElementById('btn-lock-seed');
            if (btn) {
                btn.textContent = this.seedLocked ? '🔒' : '🔓';
                btn.classList.toggle('active', this.seedLocked);
            }
            this.showToast(this.seedLocked ? '🔒 Seed locked' : '🔓 Seed unlocked');
        });

        // Palette presets dropdown
        on('palette-select', 'change', e => {
            if (e.target.value) { this.applyPalette(e.target.value); e.target.value = ''; }
        });
        on('premium-palette-select', 'change', e => {
            if (e.target.value) { this.applyPremiumPalette(e.target.value); e.target.value = ''; }
        });
        on('btn-random-palette', 'click', () => {
            const rng = createSeededRandom((Date.now() % 999999) || 1);
            this.state.colors = randomNamedPalette(rng, this.state.colors.length || 4);
            this.renderColorSwatches();
            this.renderColorPaletteDisplay();
            this.pushHistory();
            this.requestRender();
            this.showToast('🎲 Random palette applied');
        });

        // Batch modal events
        on('modal-batch-close',  'click', () => this.closeBatchModal());
        on('modal-batch-close2', 'click', () => this.closeBatchModal());
        on('btn-batch-generate', 'click', () => this.runBatch());
        on('btn-batch-dl-all',   'click', () => this.batchDownloadAll());
        on('modal-batch-backdrop', 'click', () => this.closeBatchModal());

        // Projects modal events
        on('modal-projects-close',     'click', () => this.closeProjectsModal());
        on('modal-projects-close2',    'click', () => this.closeProjectsModal());
        on('modal-projects-backdrop',  'click', () => this.closeProjectsModal());
        on('btn-save-project-action',  'click', () => this.saveCurrentProject());
        on('btn-export-project-json',  'click', () => this.exportProjectJSON());
        on('btn-import-project-trigger','click', () => document.getElementById('project-file-input')?.click());
        on('project-file-input', 'change', e => {
            if (e.target.files && e.target.files[0]) this.handleProjectImport(e.target.files[0]);
        });

        // AI Prompt Bar events
        on('btn-ai-generate', 'click', () => this.handleAIPrompt());
        const promptInput = document.getElementById('ai-prompt-input');
        if (promptInput) {
            promptInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleAIPrompt();
                }
            });
        }
        document.querySelectorAll('.ai-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.handleAIPrompt(chip.dataset.prompt);
            });
        });

        // Stock modal events
        on('modal-stock-close',    'click', () => this.closeStockModal());
        on('modal-stock-backdrop', 'click', () => this.closeStockModal());
        on('btn-stock-csv',        'click', () => this.downloadStockCSV());
        on('btn-regen-meta',       'click', () => this.updateStockMetadataDisplay());
        on('btn-copy-stock-title', 'click', () => this.copyStockField('stock-title', 'Title'));
        on('btn-copy-stock-desc',  'click', () => this.copyStockField('stock-desc', 'Description'));
        on('btn-copy-stock-keywords','click', () => this.copyStockField('stock-keywords', 'Keywords'));

        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.setStockPlatform(tab.dataset.platform);
            });
        });

        // Canvas Interactive Pan & Wheel Zoom
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            canvasContainer.addEventListener('mousedown', e => {
                if (this.zoom > 1) {
                    this.isPanning = true;
                    this.panStartX = e.clientX - this.panX;
                    this.panStartY = e.clientY - this.panY;
                    this.applyCanvasTransform();
                }
            });

            window.addEventListener('mousemove', e => {
                if (!this.isPanning) return;
                this.panX = e.clientX - this.panStartX;
                this.panY = e.clientY - this.panStartY;
                this.applyCanvasTransform();
            });

            window.addEventListener('mouseup', () => {
                if (this.isPanning) {
                    this.isPanning = false;
                    this.applyCanvasTransform();
                }
            });

            // Touch pan for mobile/tablet
            let touchStartX = 0, touchStartY = 0;
            canvasContainer.addEventListener('touchstart', e => {
                if (this.zoom > 1 && e.touches.length === 1) {
                    this.isPanning = true;
                    touchStartX = e.touches[0].clientX - this.panX;
                    touchStartY = e.touches[0].clientY - this.panY;
                }
            }, { passive: true });

            canvasContainer.addEventListener('touchmove', e => {
                if (this.isPanning && e.touches.length === 1) {
                    this.panX = e.touches[0].clientX - touchStartX;
                    this.panY = e.touches[0].clientY - touchStartY;
                    this.applyCanvasTransform();
                }
            }, { passive: true });

            canvasContainer.addEventListener('touchend', () => {
                this.isPanning = false;
            });

            // Wheel zoom over canvas area
            canvasContainer.addEventListener('wheel', e => {
                e.preventDefault();
                const factor = e.deltaY < 0 ? 1.12 : 0.89;
                this.setZoom(this.zoom * factor);
            }, { passive: false });

            // Double click to fit
            canvasContainer.addEventListener('dblclick', () => {
                this.fitToScreen();
            });
        }

        // Image upload events
        on('upload-btn', 'click', () => document.getElementById('upload-input')?.click());
        on('upload-input', 'change', e => {
            if (e.target.files && e.target.files[0]) this.handleImageUpload(e.target.files[0]);
        });
        on('btn-extract-palette', 'click', () => this.extractPaletteFromImage());

        const dropZone = document.getElementById('upload-dropzone');
        if (dropZone) {
            dropZone.addEventListener('click', () => document.getElementById('upload-input')?.click());
            dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
            dropZone.addEventListener('drop', e => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                const file = e.dataTransfer.files[0];
                if (file) this.handleImageUpload(file);
            });
        }

        // Panel collapse event delegation
        document.querySelectorAll('.panel-header, .panel-section-header').forEach(ph => {
            ph.addEventListener('click', () => {
                const panel = ph.closest('.panel, .panel-section');
                panel?.classList.toggle('collapsed');
            });
            ph.setAttribute('tabindex', '0');
            ph.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ph.click();
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); this.undo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); this.redo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); this.download(); }
            if (e.key === ' ' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); this.randomize(); }
            if (e.key === 'r' && !e.ctrlKey && !e.metaKey) this.randomize();
            if (e.key === 'g' && !e.ctrlKey && !e.metaKey) { this.pushHistory(); this.requestRender(); this.showToast('⚡ Generated'); }
            if (e.key === 'v' && !e.ctrlKey && !e.metaKey) this.generateVariation();
            if (e.key === 'f' && !e.ctrlKey && !e.metaKey) this.saveFavorite();
            if (e.key === 'b' && !e.ctrlKey && !e.metaKey) this.openBatchModal();
            if (e.key === 'p' && !e.ctrlKey && !e.metaKey) this.openProjectsModal();
            if (e.key === '[' || e.key === 'ArrowLeft') { e.preventDefault(); this.cyclePattern(-1); }
            if (e.key === ']' || e.key === 'ArrowRight') { e.preventDefault(); this.cyclePattern(1); }
            if (e.key === '?') { this.toggleHotkeysModal(); }
            if (e.key === 'Escape') {
                this.closeAllDrawers();
                this.closeBatchModal();
                this.closeStockModal();
                this.closeProjectsModal();
                this.closeHotkeysModal();
            }
        });
    },

    bindSlider(id, setter) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', e => {
            setter(e.target.value);
            this.updateSliderDisplay(el);
            this.requestRender();
        });
        el.addEventListener('change', () => {
            this.pushHistory();
            this.generateVariations();
        });
    },

    // ─── Studio Dock Tabs (Instant 1-Click Panel Switcher) ─────────────────────
    initDockTabs() {
        const setupTabs = (containerId, contentSelector, panelMap, defaultTab) => {
            const container = document.getElementById(containerId);
            const content = document.querySelector(contentSelector);
            if (!container || !content) return;

            const tabBtns = container.querySelectorAll('.dock-tab-btn');
            const panels = content.querySelectorAll('.panel, .panel-section');

            const activateTab = (tabName) => {
                tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));

                if (tabName === 'all') {
                    content.classList.remove('tabbed-mode');
                    content.classList.add('all-mode');
                    panels.forEach(p => p.classList.remove('dock-active'));
                } else {
                    content.classList.add('tabbed-mode');
                    content.classList.remove('all-mode');
                    const targetIds = panelMap[tabName] || [];
                    panels.forEach(p => {
                        p.classList.toggle('dock-active', targetIds.includes(p.id));
                    });
                }
                content.scrollTop = 0;
            };

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => activateTab(btn.dataset.tab));
            });

            activateTab(defaultTab);
        };

        setupTabs('left-dock-tabs', '#left-sidebar .sidebar-scroll-content', {
            easy:       ['panel-easy'],
            patterns:   ['panel-patterns'],
            colors:     ['panel-colors'],
            controls:   ['panel-controls'],
            effects:    ['panel-effects', 'panel-gradient'],
            resolution: ['panel-resolution'],
            export:     ['panel-export'],
        }, 'easy');

        setupTabs('right-dock-tabs', '#right-panel .sidebar-scroll-content', {
            palette:    ['panel-right-palette'],
            info:       ['panel-right-info'],
            seed:       ['panel-right-seed'],
            variations: ['panel-right-variations'],
            favorites:  ['panel-right-favorites'],
            upload:     ['panel-right-upload'],
        }, 'palette');
    },

    // ─── One-Page Mode ────────────────────────────────────────────────────────
    initOnePageMode() {
        const saved = localStorage.getItem('pf_one_page_mode');
        const isOnePage = saved !== null ? saved === 'true' : true;
        document.body.classList.toggle('one-page-mode', isOnePage);
        this.updateOnePageBtnDisplay(isOnePage);
    },

    toggleOnePageMode() {
        const active = document.body.classList.toggle('one-page-mode');
        localStorage.setItem('pf_one_page_mode', String(active));
        this.updateOnePageBtnDisplay(active);
        this.render();
        this.showToast(active ? '🖥 One-Page Mode Enabled' : '📜 Scroll Mode Enabled');
    },

    updateOnePageBtnDisplay(isActive) {
        const btn = document.getElementById('btn-view-mode');
        if (!btn) return;
        btn.innerHTML = isActive 
            ? '<span class="icon">🖥</span> <span class="btn-text">One-Page Mode</span>'
            : '<span class="icon">📜</span> <span class="btn-text">Scroll Mode</span>';
        btn.classList.toggle('active', isActive);
    },

    // ─── Hotkeys Modal ────────────────────────────────────────────────────────
    openHotkeysModal() {
        const m = document.getElementById('modal-hotkeys');
        if (m) m.classList.add('active');
    },

    closeHotkeysModal() {
        const m = document.getElementById('modal-hotkeys');
        if (m) m.classList.remove('active');
    },

    toggleHotkeysModal() {
        const m = document.getElementById('modal-hotkeys');
        if (m) m.classList.toggle('active');
    },

    // ─── Pattern Quick-Cycler Ribbon ──────────────────────────────────────────
    initPatternCycler() {
        this.patternList = (typeof PatternEngine !== 'undefined' && PatternEngine.getPatternTypes)
            ? PatternEngine.getPatternTypes()
            : [];

        const prevBtn = document.getElementById('btn-cycler-prev');
        const nextBtn = document.getElementById('btn-cycler-next');
        const rndBtn  = document.getElementById('btn-cycler-rnd');

        if (prevBtn) prevBtn.addEventListener('click', () => this.cyclePattern(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.cyclePattern(1));
        if (rndBtn)  rndBtn.addEventListener('click',  () => this.randomCyclerPattern());

        this.updateCyclerDisplay();
    },

    cyclePattern(direction) {
        if (!this.patternList || !this.patternList.length) {
            this.patternList = (typeof PatternEngine !== 'undefined' && PatternEngine.getPatternTypes)
                ? PatternEngine.getPatternTypes()
                : [];
        }
        let curIdx = this.patternList.indexOf(this.state.patternType);
        if (curIdx === -1) curIdx = 0;
        const nextIdx = (curIdx + direction + this.patternList.length) % this.patternList.length;
        this.selectPattern(this.patternList[nextIdx]);
    },

    randomCyclerPattern() {
        if (!this.patternList || !this.patternList.length) {
            this.patternList = (typeof PatternEngine !== 'undefined' && PatternEngine.getPatternTypes)
                ? PatternEngine.getPatternTypes()
                : [];
        }
        const rndIdx = Math.floor(Math.random() * this.patternList.length);
        this.selectPattern(this.patternList[rndIdx]);
    },

    selectPattern(type) {
        this.state.patternType = type;
        document.querySelectorAll('.pattern-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        // Ensure active pattern button is visible in scroll container
        const activeBtn = document.querySelector(`.pattern-btn[data-type="${type}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        this.updateCyclerDisplay();
        this.pushHistory();
        this.requestRender();
        this.updatePatternInfo();
        this.generateVariations();
        this.updateStatusBar();
    },

    updateCyclerDisplay() {
        if (!this.patternList || !this.patternList.length) {
            this.patternList = (typeof PatternEngine !== 'undefined' && PatternEngine.getPatternTypes)
                ? PatternEngine.getPatternTypes()
                : [];
        }
        const nameEl = document.getElementById('cycler-name');
        const numEl  = document.getElementById('cycler-num');
        const curType = this.state?.patternType || 'plaid';
        const curIdx  = this.patternList.indexOf(curType);

        if (nameEl) {
            nameEl.textContent = curType.replace(/-/g, ' ');
        }
        if (numEl) {
            numEl.textContent = `${(curIdx >= 0 ? curIdx + 1 : 1)}/${this.patternList.length || 203}`;
        }
    },

    // ─── Quick Harmonies ──────────────────────────────────────────────────────
    initQuickHarmonies() {
        document.querySelectorAll('.quick-h-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const harmony = chip.dataset.harmony;
                if (harmony) {
                    this.applyHarmony(harmony);
                }
            });
        });
    },

    // ─── EASY MODE (সহজ মোড) ──────────────────────────────────────────────────
    initEasyMode() {
        // Easy Mode Toggle in Header
        const easyToggle = document.getElementById('btn-easy-mode');
        if (easyToggle) {
            easyToggle.addEventListener('click', () => {
                const easyTabBtn = document.querySelector('.dock-tab-btn[data-tab="easy"]');
                if (easyTabBtn) {
                    easyTabBtn.click();
                    this.showToast('✨ সহজ মোড চালু হয়েছে!');
                }
            });
        }

        // Magic Themes configuration - Featuring 8 "মারাত্মক" Master Art Engines
        this.easyThemes = {
            'cyberpunk': {
                name: '⚡ সাইবারপাঙ্ক ২০৯৯ (Cyberpunk Godcore)',
                pattern: 'cyberpunkQuantumMatrix',
                colors: ['#0a0718', '#00f0ff', '#ff0055', '#7928ca', '#ffe600'],
                scale: 60, rotation: 45, density: 6.5, blendStrength: 0.85,
            },
            'royal-gold': {
                name: '👑 রয়্যাল ২৪কে গোল্ড (Royal 24K Liquid Gold)',
                pattern: 'royal24kLiquidGold',
                colors: ['#08080a', '#d4af37', '#f3e5ab', '#aa7c11', '#fff2b2', '#221c10'],
                scale: 50, rotation: 30, density: 5.5, blendStrength: 0.7,
            },
            'cosmic-galaxy': {
                name: '🌌 কসমিক হাইপার নেবুলা (Cosmic Hyper-Nebula)',
                pattern: 'cosmicHyperNebula',
                colors: ['#030308', '#ff007f', '#4a00e0', '#00f0ff', '#ffd700'],
                scale: 55, rotation: 60, density: 6, blendStrength: 0.8,
            },
            'sacred-neon': {
                name: '🔯 সেক্রেড মাল্টিভার্স (Multiverse Sacred Portal)',
                pattern: 'multiverseSacredPortal',
                colors: ['#05020f', '#00f5d4', '#7b2cbf', '#f72585', '#ffd166', '#ffffff'],
                scale: 55, rotation: 30, density: 6, blendStrength: 0.75,
            },
            'prismatic-aurora': {
                name: '🔮 প্রিজমেটিক ডায়মন্ড (Diamond Aurora Prism)',
                pattern: 'prismaticDiamondAurora',
                colors: ['#020b14', '#00ffff', '#ff00aa', '#ffff00', '#00ff66', '#ffffff'],
                scale: 50, rotation: 15, density: 5.5, blendStrength: 0.7,
            },
            'volcanic-magma': {
                name: '🌋 ভলক্যানিক ম্যাগমা (Volcanic Solar Corona)',
                pattern: 'volcanicMagmaCore',
                colors: ['#080202', '#ff2200', '#ff7700', '#ffcc00', '#ffffff', '#3d0505'],
                scale: 50, rotation: 45, density: 6, blendStrength: 0.8,
            },
            'bioluminescent': {
                name: '🧬 বায়োলুমিনেসেন্ট অ্যাবিস (Deep Sea Glow)',
                pattern: 'bioluminescentAbyss',
                colors: ['#01060f', '#00f5d4', '#00bbf9', '#7209b7', '#f72585', '#ffffff'],
                scale: 52, rotation: 0, density: 5.5, blendStrength: 0.7,
            },
            'quantum-storm': {
                name: '🌀 কোয়ান্টাম পার্টিকেল স্টর্ম (Quantum Particle Storm)',
                pattern: 'quantumParticleStorm',
                colors: ['#04020a', '#9d4edd', '#00f0ff', '#ff007f', '#ffffff'],
                scale: 55, rotation: 0, density: 6.5, blendStrength: 0.75,
            },
            'pastel-dream': {
                name: '🌸 সফট পেস্টেল (Pastel Dream)',
                pattern: 'rhodoneaRose',
                colors: ['#ffb7b2', '#b5ead7', '#c7ceea', '#fff1f0', '#957dad'],
                scale: 45, rotation: 15, density: 4.5, blendStrength: 0.6,
            },
            'minimal-black': {
                name: '⚪ মিনিমালিস্ট (Clean Minimal)',
                pattern: 'archimedeanSpiral',
                colors: ['#ffffff', '#888888', '#111111', '#000000'],
                scale: 40, rotation: 0, density: 4, blendStrength: 0.5,
            }
        };

        // Theme card clicks
        document.querySelectorAll('.easy-theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const themeKey = card.dataset.theme;
                if (themeKey && this.easyThemes[themeKey]) {
                    document.querySelectorAll('.easy-theme-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    this.applyEasyTheme(themeKey);
                }
            });
        });

        // 1-Click Magic Auto-Generate Button
        const magicGenBtn = document.getElementById('btn-easy-magic-gen');
        if (magicGenBtn) {
            magicGenBtn.addEventListener('click', () => this.easyMagicGenerate());
        }

        // Easy Category select
        const catSelect = document.getElementById('easy-category-select');
        if (catSelect) {
            catSelect.addEventListener('change', e => {
                const cat = e.target.value;
                const catBtns = document.querySelectorAll(`.pattern-btn[data-cat="${cat}"]`);
                if (catBtns.length > 0) {
                    const chosen = catBtns[0].dataset.type;
                    this.selectPattern(chosen);
                    this.showToast(`Category: ${cat.toUpperCase()}`);
                }
            });
        }

        // Surprise Me button
        const surpriseBtn = document.getElementById('btn-easy-surprise');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => this.randomCyclerPattern());
        }

        // Easy Direct Download (Standard)
        const directDl = document.getElementById('btn-easy-download-direct');
        if (directDl) {
            directDl.addEventListener('click', () => this.download());
        }

        // 💎 Guaranteed 10MB+ Master Download Buttons (Header, Easy Mode, Canvas, Panel)
        const masterDls = [
            document.getElementById('btn-download-master-10mb'),
            document.getElementById('btn-easy-download-master'),
            document.getElementById('btn-canvas-dl-master'),
            document.getElementById('btn-download-master-panel')
        ].filter(Boolean);

        masterDls.forEach(btn => {
            btn.addEventListener('click', () => this.downloadMaster10MB());
        });

        // 📁 Easy Mode Format Chips (PNG, JPEG, SVG)
        document.querySelectorAll('.easy-fmt-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.easy-fmt-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const fmt = chip.dataset.fmt || 'png';
                this.state.exportFormat = fmt;

                // Sync main export format select
                const sel = document.getElementById('export-format');
                if (sel) sel.value = fmt;

                // Sync format pills in canvas toolbar
                document.querySelectorAll('.format-pill').forEach(pill => {
                    pill.classList.toggle('active', pill.dataset.format === fmt);
                });

                this.updateEasyMasterLabels();
                const fmtName = fmt === 'svg' ? 'SVG ভেক্টর গ্রাফিক' : fmt === 'png' ? 'PNG লসলেস (১০MB+ নিশ্চিত)' : 'JPEG হাই-কোয়ালিটি';
                this.showToast(`📁 ফরম্যাট: ${fmtName}`);
            });
        });

        // 📐 Easy Mode Resolution Chips (2K, 4K, 6K, 8K)
        document.querySelectorAll('.easy-res-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.easy-res-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const res = chip.dataset.res;
                const label = chip.dataset.label || 'Master';
                if (res) {
                    this.setResolutionPreset(res);
                    const resSelect = document.getElementById('res-preset-select');
                    if (resSelect) resSelect.value = res;
                    this.updateEasyMasterLabels();
                    this.showToast(`📐 রেজোলিউশন: ${label} (${res})`);
                }
            });
        });

        // Easy Sliders (Scale, Rotation, Density, Blend)
        const bindEasySlider = (sliderId, displayId, stateKey, unit = '', isDiv100 = false) => {
            const slider = document.getElementById(sliderId);
            const display = document.getElementById(displayId);
            if (!slider) return;

            slider.addEventListener('input', e => {
                const val = parseFloat(e.target.value);
                if (display) display.textContent = val + unit;
                this.state[stateKey] = isDiv100 ? (val / 100) : val;

                // Also sync with main slider if present
                const mainSliderId = stateKey === 'stripeWidth' ? 'stripe-width' : stateKey;
                const mainSlider = document.getElementById(mainSliderId);
                if (mainSlider) {
                    mainSlider.value = val;
                    const mainDisp = document.getElementById(mainSliderId + '-val');
                    if (mainDisp) mainDisp.textContent = val;
                }
                this.requestRender();
            });
            slider.addEventListener('change', () => {
                this.pushHistory();
                this.generateVariations();
            });
        };

        bindEasySlider('easy-scale', 'easy-scale-val', 'scale');
        bindEasySlider('easy-rotation', 'easy-rotation-val', 'rotation', '°');
        bindEasySlider('easy-density', 'easy-density-val', 'density');
        bindEasySlider('easy-blend', 'easy-blend-val', 'blendStrength', '%', true);

        this.syncEasySlidersFromState();
        this.updateEasyMasterLabels();
        this.syncEasyFmtResUI();
    },

    updateEasyMasterLabels() {
        const fmt = (this.state?.exportFormat || 'png').toLowerCase();
        const w = this.state?.canvasWidth || 7680;
        const resTag = w >= 7680 ? '8K' : w >= 6000 ? '6K' : w >= 3840 ? '4K' : w >= 2560 ? '2K' : 'HD';
        const titleEl = document.getElementById('easy-master-dl-title');
        const subEl = document.getElementById('easy-master-dl-sub');
        if (!titleEl) return;

        if (fmt === 'png') {
            titleEl.textContent = `১০ MB+ মাস্টার ইমেজ ডাউনলোড (${resTag} PNG)`;
            if (subEl) subEl.textContent = 'Guaranteed 10MB+ Lossless Masterpiece';
        } else if (fmt === 'svg') {
            titleEl.textContent = `ভেক্টর মাস্টার ডাউনলোড (${resTag} SVG)`;
            if (subEl) subEl.textContent = 'Scalable Vector Graphic (Illustrator / Figma Ready)';
        } else if (fmt === 'jpg' || fmt === 'jpeg') {
            titleEl.textContent = `আল্ট্রা ফটো ডাউনলোড (${resTag} JPEG)`;
            if (subEl) subEl.textContent = 'High Quality Compressed Photo Export';
        } else {
            titleEl.textContent = `মাস্টার ডাউনলোড (${resTag} ${fmt.toUpperCase()})`;
            if (subEl) subEl.textContent = 'Ultra High Definition Export';
        }
    },

    syncEasyFmtResUI() {
        if (!this.state) return;
        const curFmt = (this.state.exportFormat || 'png').toLowerCase();
        const curRes = `${this.state.canvasWidth}x${this.state.canvasHeight}`;

        document.querySelectorAll('.easy-fmt-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.fmt === curFmt);
        });

        document.querySelectorAll('.easy-res-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.res === curRes);
        });
    },

    syncEasySlidersFromState() {
        const setEasy = (sliderId, displayId, val, unit = '') => {
            const sld = document.getElementById(sliderId);
            const dsp = document.getElementById(displayId);
            if (sld) sld.value = val;
            if (dsp) dsp.textContent = Math.round(val) + unit;
        };
        if (this.state) {
            setEasy('easy-scale', 'easy-scale-val', this.state.scale);
            setEasy('easy-rotation', 'easy-rotation-val', this.state.rotation, '°');
            setEasy('easy-density', 'easy-density-val', this.state.density);
            setEasy('easy-blend', 'easy-blend-val', Math.round((this.state.blendStrength || 0.6) * 100), '%');
        }
    },

    applyEasyTheme(themeKey) {
        const t = this.easyThemes[themeKey];
        if (!t) return;
        this.state.patternType = t.pattern;
        this.state.colors = t.colors.slice();
        this.state.scale = t.scale;
        this.state.rotation = t.rotation;
        this.state.density = t.density;
        this.state.blendStrength = t.blendStrength;

        this.applyStateToUI();
        this.syncEasySlidersFromState();
        this.pushHistory();
        this.requestRender();
        this.updatePatternInfo();
        this.generateVariations();
        this.showToast(`✨ ${t.name} থিম চালু হয়েছে!`);
    },

    easyMagicGenerate() {
        // Picks high-impact master art patterns and intricate sacred/spiral geometries
        const curated = [
            'cosmicHyperNebula', 'cyberpunkQuantumMatrix', 'royal24kLiquidGold',
            'multiverseSacredPortal', 'prismaticDiamondAurora', 'volcanicMagmaCore',
            'bioluminescentAbyss', 'quantumParticleStorm',
            'goldenSpiral', 'rhodoneaRose', 'spiralGalaxy', 'metatronCube', 'sriYantra', 'torusSacred'
        ];
        const rng = createSeededRandom(Date.now() % 999999);
        const randomPattern = curated[Math.floor(Math.random() * curated.length)];
        this.state.patternType = randomPattern;

        // Apply vibrant / luxury master palette
        if (typeof randomPremiumPalette === 'function') {
            const types = ['luxury', 'vibrant', 'dark', 'neon', 'earth'];
            const pType = types[Math.floor(Math.random() * types.length)];
            this.state.colors = randomPremiumPalette(rng, pType, 4);
        }

        this.state.scale = 40 + Math.floor(Math.random() * 35);
        this.state.rotation = Math.floor(Math.random() * 180);
        this.state.density = 5 + Math.floor(Math.random() * 4);
        this.state.blendStrength = 0.65 + Math.random() * 0.25;
        this.state.seed = Math.floor(Math.random() * 899999) + 100000;

        this.applyStateToUI();
        this.syncEasySlidersFromState();
        this.pushHistory();
        this.requestRender();
        this.updatePatternInfo();
        this.generateVariations();
        this.showToast('✨ নতুন ম্যাজিক ডিজাইন তৈরি হয়েছে!');
    },
};

// ─── DOM Ready Boot ────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
    window.App = App;
}
if (typeof module !== 'undefined') {
    module.exports = App;
}
document.addEventListener('DOMContentLoaded', () => App.init());
