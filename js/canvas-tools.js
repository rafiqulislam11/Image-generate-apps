'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/canvas-tools.js
 * Viewport Tools: Zoom, Pan, Fit, Grid, Rulers, Guides, Snapping, Center Align, Before/After Slider
 */

const CanvasTools = {
  zoom: 1,
  panX: 0,
  panY: 0,
  isPanning: false,
  panStartX: 0,
  panStartY: 0,
  
  showGrid: false,
  gridSize: 40,
  showRulers: true,
  showGuides: false,
  snapToGrid: false,
  rotationAngle: 0,

  // Before/After Split Comparison
  isBeforeAfterActive: false,
  sliderPos: 0.5,
  beforeCanvas: null,
  isDraggingSlider: false,

  init(viewportEl, previewCanvas, onRenderRequest) {
    this.viewportEl = viewportEl;
    this.canvas = previewCanvas;
    this.onRenderRequest = onRenderRequest;

    this.setupRulersAndOverlay();
    this.bindEvents();
  },

  setupRulersAndOverlay() {
    if (!this.viewportEl) return;

    // Rulers canvas elements
    let rulerTop = document.getElementById('ruler-top');
    let rulerLeft = document.getElementById('ruler-left');
    let gridOverlay = document.getElementById('canvas-grid-overlay');

    if (!rulerTop) {
      rulerTop = document.createElement('canvas');
      rulerTop.id = 'ruler-top';
      rulerTop.className = 'canvas-ruler ruler-top';
      this.viewportEl.appendChild(rulerTop);
    }
    if (!rulerLeft) {
      rulerLeft = document.createElement('canvas');
      rulerLeft.id = 'ruler-left';
      rulerLeft.className = 'canvas-ruler ruler-left';
      this.viewportEl.appendChild(rulerLeft);
    }
    if (!gridOverlay) {
      gridOverlay = document.createElement('div');
      gridOverlay.id = 'canvas-grid-overlay';
      gridOverlay.className = 'canvas-grid-overlay';
      this.viewportEl.appendChild(gridOverlay);
    }

    this.rulerTop = rulerTop;
    this.rulerLeft = rulerLeft;
    this.gridOverlay = gridOverlay;

    this.updateRulers();
  },

  bindEvents() {
    if (!this.viewportEl) return;

    // Mouse wheel zoom
    this.viewportEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.setZoom(this.zoom * zoomFactor);
    }, { passive: false });

    // Middle click or Space + drag to Pan
    this.viewportEl.addEventListener('mousedown', (e) => {
      // If clicking before/after slider handle
      if (this.isBeforeAfterActive && e.target.closest('#before-after-slider-handle')) {
        this.isDraggingSlider = true;
        return;
      }

      if (e.button === 1 || e.spaceKey || e.altKey) {
        this.isPanning = true;
        this.panStartX = e.clientX - this.panX;
        this.panStartY = e.clientY - this.panY;
        this.viewportEl.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingSlider) {
        const rect = this.viewportEl.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        this.sliderPos = x / rect.width;
        this.updateBeforeAfterView();
        return;
      }

      if (this.isPanning) {
        this.panX = e.clientX - this.panStartX;
        this.panY = e.clientY - this.panStartY;
        this.applyTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      this.isDraggingSlider = false;
      if (this.viewportEl) this.viewportEl.style.cursor = '';
    });
  },

  setZoom(newZoom) {
    this.zoom = Math.max(0.1, Math.min(10, newZoom));
    const display = document.getElementById('zoom-level');
    if (display) display.textContent = Math.round(this.zoom * 100) + '%';
    this.applyTransform();
  },

  fitToScreen() {
    if (!this.viewportEl || !this.canvas) return;
    const padding = 40;
    const vW = this.viewportEl.clientWidth - padding;
    const vH = this.viewportEl.clientHeight - padding;
    const cW = this.canvas.width || 800;
    const cH = this.canvas.height || 600;

    const scale = Math.min(vW / cW, vH / cH, 1);
    this.zoom = Math.max(0.1, scale);
    this.panX = 0;
    this.panY = 0;

    const display = document.getElementById('zoom-level');
    if (display) display.textContent = Math.round(this.zoom * 100) + '%';
    this.applyTransform();
  },

  resetTransform() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.rotationAngle = 0;
    const display = document.getElementById('zoom-level');
    if (display) display.textContent = '100%';
    this.applyTransform();
  },

  centerAlignment() {
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  },

  rotateCanvas(degrees = 90) {
    this.rotationAngle = (this.rotationAngle + degrees) % 360;
    this.applyTransform();
  },

  applyTransform() {
    if (!this.canvas) return;
    this.canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom}) rotate(${this.rotationAngle}deg)`;
    this.updateRulers();
    this.updateGrid();
  },

  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.updateGrid();
    return this.showGrid;
  },

  updateGrid() {
    if (!this.gridOverlay) return;
    if (this.showGrid) {
      this.gridOverlay.style.display = 'block';
      const scaledSize = Math.max(10, this.gridSize * this.zoom);
      this.gridOverlay.style.backgroundSize = `${scaledSize}px ${scaledSize}px`;
      this.gridOverlay.style.backgroundPosition = `${this.panX}px ${this.panY}px`;
    } else {
      this.gridOverlay.style.display = 'none';
    }
  },

  toggleRulers() {
    this.showRulers = !this.showRulers;
    if (this.rulerTop) this.rulerTop.style.display = this.showRulers ? 'block' : 'none';
    if (this.rulerLeft) this.rulerLeft.style.display = this.showRulers ? 'block' : 'none';
    if (this.showRulers) this.updateRulers();
    return this.showRulers;
  },

  updateRulers() {
    if (!this.showRulers || !this.rulerTop || !this.rulerLeft || !this.viewportEl) return;

    const w = this.viewportEl.clientWidth;
    const h = this.viewportEl.clientHeight;
    
    // Top ruler
    this.rulerTop.width = w;
    this.rulerTop.height = 20;
    const ctxTop = this.rulerTop.getContext('2d');
    ctxTop.clearRect(0, 0, w, 20);
    ctxTop.fillStyle = '#1e2433';
    ctxTop.fillRect(0, 0, w, 20);
    ctxTop.strokeStyle = '#475569';
    ctxTop.fillStyle = '#94a3b8';
    ctxTop.font = '9px monospace';

    const step = 50 * this.zoom;
    const startX = (w / 2 + this.panX) % step;

    for (let x = startX; x < w; x += step) {
      ctxTop.beginPath();
      ctxTop.moveTo(x, 10);
      ctxTop.lineTo(x, 20);
      ctxTop.stroke();
      const val = Math.round((x - (w / 2 + this.panX)) / this.zoom);
      ctxTop.fillText(val, x + 2, 9);
    }

    // Left ruler
    this.rulerLeft.width = 20;
    this.rulerLeft.height = h;
    const ctxLeft = this.rulerLeft.getContext('2d');
    ctxLeft.clearRect(0, 0, 20, h);
    ctxLeft.fillStyle = '#1e2433';
    ctxLeft.fillRect(0, 0, 20, h);
    ctxLeft.strokeStyle = '#475569';
    ctxLeft.fillStyle = '#94a3b8';
    ctxLeft.font = '9px monospace';

    const startY = (h / 2 + this.panY) % step;
    for (let y = startY; y < h; y += step) {
      ctxLeft.beginPath();
      ctxLeft.moveTo(10, y);
      ctxLeft.lineTo(20, y);
      ctxLeft.stroke();
      const val = Math.round((y - (h / 2 + this.panY)) / this.zoom);
      ctxLeft.save();
      ctxLeft.translate(9, y + 2);
      ctxLeft.rotate(-Math.PI / 2);
      ctxLeft.fillText(val, 0, 0);
      ctxLeft.restore();
    }
  },

  // ─── Before / After Split Slider ────────────────────────────────────────────
  toggleBeforeAfter(currentCanvas, originalState, onRenderOriginal) {
    this.isBeforeAfterActive = !this.isBeforeAfterActive;
    let container = document.getElementById('before-after-overlay');

    if (!this.isBeforeAfterActive) {
      if (container) container.remove();
      return false;
    }

    if (!container) {
      container = document.createElement('div');
      container.id = 'before-after-overlay';
      container.className = 'before-after-overlay';
      container.innerHTML = `
        <div class="ba-slider-line" id="ba-slider-line">
          <div class="ba-handle" id="before-after-slider-handle">⮂ ⮃</div>
        </div>
        <div class="ba-label ba-label-before">Before (Original)</div>
        <div class="ba-label ba-label-after">After (Enhanced)</div>
      `;
      this.viewportEl.appendChild(container);
    }

    // Capture snapshot of original
    if (!this.beforeCanvas) {
      this.beforeCanvas = document.createElement('canvas');
      this.beforeCanvas.width = currentCanvas.width;
      this.beforeCanvas.height = currentCanvas.height;
      const bCtx = this.beforeCanvas.getContext('2d');
      if (typeof onRenderOriginal === 'function') {
        onRenderOriginal(bCtx, this.beforeCanvas.width, this.beforeCanvas.height);
      } else {
        bCtx.drawImage(currentCanvas, 0, 0);
      }
    }

    this.sliderPos = 0.5;
    this.updateBeforeAfterView();
    return true;
  },

  updateBeforeAfterView() {
    const line = document.getElementById('ba-slider-line');
    if (line) {
      line.style.left = `${this.sliderPos * 100}%`;
    }
    if (this.canvas) {
      // Clip path on active canvas
      const pct = Math.round(this.sliderPos * 100);
      this.canvas.style.clipPath = `polygon(${pct}% 0%, 100% 0%, 100% 100%, ${pct}% 100%)`;
    }
  },

  captureBeforeSnapshot(sourceCanvas) {
    this.beforeCanvas = document.createElement('canvas');
    this.beforeCanvas.width = sourceCanvas.width;
    this.beforeCanvas.height = sourceCanvas.height;
    const ctx = this.beforeCanvas.getContext('2d');
    ctx.drawImage(sourceCanvas, 0, 0);
  }
};

if (typeof window !== 'undefined') {
  window.CanvasTools = CanvasTools;
}
if (typeof module !== 'undefined') {
  module.exports = CanvasTools;
}
