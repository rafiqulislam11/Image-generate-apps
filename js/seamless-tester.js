'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/seamless-tester.js
 * Dedicated Seamless Pattern Tester with Mathematical Edge-Verification Algorithm
 * Supports 2x2, 3x3, 4x4, 5x5 repeating tile matrix with seam inspection
 */

const SeamlessTester = {
  currentGridSize: 3,
  activePatternCanvas: null,
  verificationResult: null,

  openModal(sourceCanvas, patternSettings) {
    this.activePatternCanvas = sourceCanvas;
    let modal = document.getElementById('modal-seamless-test');
    if (!modal) {
      this._createModalDOM();
      modal = document.getElementById('modal-seamless-test');
    }

    modal.classList.add('active');
    this.renderTestMatrix();
    this.runEdgeVerification();
  },

  closeModal() {
    const modal = document.getElementById('modal-seamless-test');
    if (modal) modal.classList.remove('active');
  },

  setGridSize(size) {
    this.currentGridSize = Math.max(2, Math.min(5, size));
    // Update active tab buttons
    document.querySelectorAll('.grid-size-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.size, 10) === this.currentGridSize);
    });
    this.renderTestMatrix();
  },

  renderTestMatrix() {
    const previewContainer = document.getElementById('seamless-matrix-container');
    if (!previewContainer || !this.activePatternCanvas) return;

    const N = this.currentGridSize;
    const canvas = document.createElement('canvas');
    const targetSize = Math.min(previewContainer.clientWidth || 600, 600);
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    const tileSize = targetSize / N;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        ctx.drawImage(this.activePatternCanvas, c * tileSize, r * tileSize, tileSize, tileSize);
      }
    }

    // Draw subtle seam grid lines if enabled
    const showSeams = document.getElementById('toggle-seam-lines')?.checked ?? true;
    if (showSeams) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (let i = 1; i < N; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, targetSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(targetSize, i * tileSize);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    previewContainer.innerHTML = '';
    previewContainer.appendChild(canvas);
  },

  // ─── Mathematical Edge-Verification Algorithm ──────────────────────────────
  runEdgeVerification() {
    const badge = document.getElementById('seamless-result-badge');
    const detailEl = document.getElementById('seamless-result-details');
    if (!this.activePatternCanvas || !badge) return;

    badge.className = 'seamless-badge checking';
    badge.textContent = 'Analyzing edge symmetry & pixel continuity…';

    setTimeout(() => {
      const w = this.activePatternCanvas.width;
      const h = this.activePatternCanvas.height;

      // Sample a scaled down 256x256 test canvas to execute fast and reliable pixel comparison
      const testCanvas = document.createElement('canvas');
      const testDim = 256;
      testCanvas.width = testDim;
      testCanvas.height = testDim;
      const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
      tCtx.drawImage(this.activePatternCanvas, 0, 0, testDim, testDim);

      const topRow = tCtx.getImageData(0, 0, testDim, 1).data;
      const bottomRow = tCtx.getImageData(0, testDim - 1, testDim, 1).data;
      const leftCol = tCtx.getImageData(0, 0, 1, testDim).data;
      const rightCol = tCtx.getImageData(testDim - 1, 0, 1, testDim).data;

      let horizontalDiffSum = 0;
      let verticalDiffSum = 0;

      // Compare top row vs bottom row
      for (let i = 0; i < testDim * 4; i += 4) {
        const dr = topRow[i] - bottomRow[i];
        const dg = topRow[i + 1] - bottomRow[i + 1];
        const db = topRow[i + 2] - bottomRow[i + 2];
        const da = topRow[i + 3] - bottomRow[i + 3];
        horizontalDiffSum += Math.sqrt(dr * dr + dg * dg + db * db + da * da);
      }

      // Compare left column vs right column
      for (let i = 0; i < testDim * 4; i += 4) {
        const dr = leftCol[i] - rightCol[i];
        const dg = leftCol[i + 1] - rightCol[i + 1];
        const db = leftCol[i + 2] - rightCol[i + 2];
        const da = leftCol[i + 3] - rightCol[i + 3];
        verticalDiffSum += Math.sqrt(dr * dr + dg * dg + db * db + da * da);
      }

      const maxPossibleDiff = Math.sqrt(255 * 255 * 4) * testDim;
      const avgHorizontalDiff = (horizontalDiffSum / maxPossibleDiff) * 100;
      const avgVerticalDiff = (verticalDiffSum / maxPossibleDiff) * 100;
      const overallDiff = (avgHorizontalDiff + avgVerticalDiff) / 2;

      // Match confidence percentage
      const matchScore = Math.max(0, Math.min(100, 100 - overallDiff));
      const isPass = matchScore >= 88.0;

      this.verificationResult = {
        isPass,
        matchScore: matchScore.toFixed(1),
        horizontalDiff: avgHorizontalDiff.toFixed(2),
        verticalDiff: avgVerticalDiff.toFixed(2)
      };

      if (isPass) {
        badge.className = 'seamless-badge pass';
        badge.innerHTML = `✓ Seamless: PASS (${matchScore.toFixed(1)}% Match)`;
        if (detailEl) {
          detailEl.innerHTML = `
            <span class="text-success">Horizontal Seam: ${(100 - avgHorizontalDiff).toFixed(1)}% match</span> • 
            <span class="text-success">Vertical Seam: ${(100 - avgVerticalDiff).toFixed(1)}% match</span>
            <p class="text-xs text-muted mt-1">Pixel colors cleanly align across opposite boundaries with smooth continuity.</p>
          `;
        }
      } else {
        badge.className = 'seamless-badge warning';
        badge.innerHTML = `⚠ Possible edge mismatch detected (${(100 - matchScore).toFixed(1)}% Variance)`;
        if (detailEl) {
          detailEl.innerHTML = `
            <span class="text-warning">Horizontal Variance: ${avgHorizontalDiff.toFixed(1)}%</span> • 
            <span class="text-warning">Vertical Variance: ${avgVerticalDiff.toFixed(1)}%</span>
            <p class="text-xs text-muted mt-1">Tip: Check 'Seamless' checkbox or adjust spacing/rotation so motif edges meet uniformly.</p>
          `;
        }
      }
    }, 150);
  },

  _createModalDOM() {
    const modal = document.createElement('div');
    modal.id = 'modal-seamless-test';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'seamless-modal-title');

    modal.innerHTML = `
      <div class="modal-backdrop" id="modal-seamless-backdrop"></div>
      <div class="modal-box modal-box-lg">
        <div class="modal-header">
          <div class="modal-header-text">
            <h2 id="seamless-modal-title">🔁 Seamless Pattern Tester & Edge Verification</h2>
            <p class="modal-subtitle">Verify repeating tile symmetry and mathematical edge continuity before publishing.</p>
          </div>
          <button class="modal-close" id="modal-seamless-close" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body">
          <div class="seamless-toolbar-row">
            <div class="seamless-grid-selector">
              <span class="selector-label">Tile Grid:</span>
              <button class="grid-size-btn" data-size="2">2×2</button>
              <button class="grid-size-btn active" data-size="3">3×3</button>
              <button class="grid-size-btn" data-size="4">4×4</button>
              <button class="grid-size-btn" data-size="5">5×5</button>
            </div>
            <div class="seamless-options-group">
              <label class="toggle-wrap">
                <input type="checkbox" id="toggle-seam-lines" checked>
                <span class="text-sm">Show Seam Lines</span>
              </label>
              <button class="btn-secondary btn-sm" id="btn-retest-seamless">🔄 Re-test Edges</button>
            </div>
          </div>

          <div class="seamless-matrix-wrapper">
            <div id="seamless-matrix-container" class="seamless-matrix-container"></div>
          </div>

          <div class="seamless-verification-card">
            <div class="verification-header">
              <span class="verification-title">Mathematical Boundary Analysis</span>
              <div id="seamless-result-badge" class="seamless-badge">Analyzing…</div>
            </div>
            <div id="seamless-result-details" class="verification-details"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="modal-seamless-close2">Close</button>
          <button class="btn-primary" id="btn-export-seamless-tile">⬇ Export Single Tile</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelectorAll('#modal-seamless-close, #modal-seamless-close2, #modal-seamless-backdrop').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    modal.querySelectorAll('.grid-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const size = parseInt(e.target.dataset.size, 10);
        this.setGridSize(size);
      });
    });

    const seamToggle = modal.querySelector('#toggle-seam-lines');
    seamToggle.addEventListener('change', () => this.renderTestMatrix());

    const retestBtn = modal.querySelector('#btn-retest-seamless');
    retestBtn.addEventListener('click', () => {
      this.renderTestMatrix();
      this.runEdgeVerification();
    });

    const exportBtn = modal.querySelector('#btn-export-seamless-tile');
    exportBtn.addEventListener('click', () => {
      if (typeof ExportEngine !== 'undefined' && this.activePatternCanvas) {
        ExportEngine.exportImage(this.activePatternCanvas, 'png', 100, 'seamless_tile.png');
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.SeamlessTester = SeamlessTester;
}
if (typeof module !== 'undefined') {
  module.exports = SeamlessTester;
}
