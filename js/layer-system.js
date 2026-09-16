'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/layer-system.js
 * Multi-Layer Management System
 * Supports: Show/Hide, Lock/Unlock, Rename, Duplicate, Delete, Opacity, Blend Mode, Reorder
 */

const LayerSystem = {
  _defaultLayers: [
    { id: 'layer_bg', name: 'Background', type: 'background', visible: true, locked: false, opacity: 1, blendMode: 'source-over' },
    { id: 'layer_base', name: 'Base Pattern', type: 'base_pattern', visible: true, locked: false, opacity: 0.9, blendMode: 'source-over' },
    { id: 'layer_primary', name: 'Primary Elements', type: 'primary_elements', visible: true, locked: false, opacity: 1, blendMode: 'source-over' },
    { id: 'layer_secondary', name: 'Secondary Elements', type: 'secondary_elements', visible: true, locked: false, opacity: 0.8, blendMode: 'source-over' },
    { id: 'layer_effects', name: 'Effects', type: 'effects', visible: true, locked: false, opacity: 1, blendMode: 'source-over' },
    { id: 'layer_text', name: 'Text / Signature', type: 'text', visible: false, locked: false, opacity: 1, blendMode: 'source-over', text: '' }
  ],

  layers: [],
  activeLayerId: 'layer_base',
  _onChangeCallback: null,

  init(savedLayers, onChange) {
    this._onChangeCallback = onChange;
    if (Array.isArray(savedLayers) && savedLayers.length > 0) {
      this.layers = JSON.parse(JSON.stringify(savedLayers));
    } else {
      this.layers = JSON.parse(JSON.stringify(this._defaultLayers));
    }
    this.renderLayerPanel();
  },

  getLayers() {
    return this.layers;
  },

  setLayers(layers) {
    if (Array.isArray(layers) && layers.length > 0) {
      this.layers = JSON.parse(JSON.stringify(layers));
      this.renderLayerPanel();
      this._notify();
    }
  },

  getActiveLayer() {
    return this.layers.find(l => l.id === this.activeLayerId) || this.layers[0];
  },

  setActiveLayer(id) {
    this.activeLayerId = id;
    this.renderLayerPanel();
  },

  toggleVisibility(id) {
    const layer = this.layers.find(l => l.id === id);
    if (layer) {
      layer.visible = !layer.visible;
      this.renderLayerPanel();
      this._notify();
    }
  },

  toggleLock(id) {
    const layer = this.layers.find(l => l.id === id);
    if (layer) {
      layer.locked = !layer.locked;
      this.renderLayerPanel();
      this._notify();
    }
  },

  setOpacity(id, opacity) {
    const layer = this.layers.find(l => l.id === id);
    if (layer && !layer.locked) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
      this._notify();
    }
  },

  setBlendMode(id, blendMode) {
    const layer = this.layers.find(l => l.id === id);
    if (layer && !layer.locked) {
      layer.blendMode = blendMode;
      this._notify();
    }
  },

  renameLayer(id, newName) {
    const layer = this.layers.find(l => l.id === id);
    if (layer && newName && newName.trim()) {
      layer.name = newName.trim();
      this.renderLayerPanel();
      this._notify();
    }
  },

  duplicateLayer(id) {
    const index = this.layers.findIndex(l => l.id === id);
    if (index >= 0) {
      const original = this.layers[index];
      const copy = JSON.parse(JSON.stringify(original));
      copy.id = 'layer_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      copy.name = original.name + ' Copy';
      this.layers.splice(index + 1, 0, copy);
      this.activeLayerId = copy.id;
      this.renderLayerPanel();
      this._notify();
    }
  },

  deleteLayer(id) {
    if (this.layers.length <= 1) return; // Keep at least 1 layer
    const index = this.layers.findIndex(l => l.id === id);
    if (index >= 0) {
      this.layers.splice(index, 1);
      if (this.activeLayerId === id) {
        this.activeLayerId = this.layers[Math.max(0, index - 1)].id;
      }
      this.renderLayerPanel();
      this._notify();
    }
  },

  moveLayer(id, direction) {
    const index = this.layers.findIndex(l => l.id === id);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < this.layers.length) {
      const [moved] = this.layers.splice(index, 1);
      this.layers.splice(targetIndex, 0, moved);
      this.renderLayerPanel();
      this._notify();
    }
  },

  _notify() {
    if (typeof this._onChangeCallback === 'function') {
      this._onChangeCallback(this.layers);
    }
  },

  renderLayerPanel() {
    const container = document.getElementById('layers-list-container');
    if (!container) return;

    container.innerHTML = '';
    
    this.layers.forEach((layer, idx) => {
      const item = document.createElement('div');
      item.className = `layer-item ${layer.id === this.activeLayerId ? 'active' : ''} ${layer.locked ? 'locked' : ''} ${!layer.visible ? 'hidden-layer' : ''}`;
      item.dataset.layerId = layer.id;

      item.innerHTML = `
        <div class="layer-item-main">
          <button class="layer-btn-icon btn-vis" title="${layer.visible ? 'Hide Layer' : 'Show Layer'}">
            ${layer.visible ? '👁️' : '🚫'}
          </button>
          <button class="layer-btn-icon btn-lock" title="${layer.locked ? 'Unlock Layer' : 'Lock Layer'}">
            ${layer.locked ? '🔒' : '🔓'}
          </button>
          <span class="layer-name" title="Double click to rename">${escapeHTML(layer.name)}</span>
          <div class="layer-reorder-group">
            <button class="layer-btn-mini btn-up" title="Move Up" ${idx === 0 ? 'disabled' : ''}>▲</button>
            <button class="layer-btn-mini btn-down" title="Move Down" ${idx === this.layers.length - 1 ? 'disabled' : ''}>▼</button>
          </div>
        </div>
        <div class="layer-controls-row">
          <div class="layer-opacity-wrap">
            <span class="layer-control-label">Opacity:</span>
            <input type="range" class="layer-opacity-slider" min="0" max="100" value="${Math.round(layer.opacity * 100)}" ${layer.locked ? 'disabled' : ''}>
            <span class="layer-opacity-val">${Math.round(layer.opacity * 100)}%</span>
          </div>
          <div class="layer-actions-mini">
            <button class="layer-btn-mini btn-dup" title="Duplicate Layer">📋</button>
            <button class="layer-btn-mini btn-del" title="Delete Layer" ${this.layers.length <= 1 ? 'disabled' : ''}>🗑️</button>
          </div>
        </div>
      `;

      // Event bindings for layer row
      item.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('input')) {
          this.setActiveLayer(layer.id);
        }
      });

      const btnVis = item.querySelector('.btn-vis');
      btnVis.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleVisibility(layer.id);
      });

      const btnLock = item.querySelector('.btn-lock');
      btnLock.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLock(layer.id);
      });

      const btnUp = item.querySelector('.btn-up');
      btnUp.addEventListener('click', (e) => {
        e.stopPropagation();
        this.moveLayer(layer.id, 'up');
      });

      const btnDown = item.querySelector('.btn-down');
      btnDown.addEventListener('click', (e) => {
        e.stopPropagation();
        this.moveLayer(layer.id, 'down');
      });

      const btnDup = item.querySelector('.btn-dup');
      btnDup.addEventListener('click', (e) => {
        e.stopPropagation();
        this.duplicateLayer(layer.id);
      });

      const btnDel = item.querySelector('.btn-del');
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteLayer(layer.id);
      });

      const opacitySlider = item.querySelector('.layer-opacity-slider');
      const opacityVal = item.querySelector('.layer-opacity-val');
      opacitySlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        opacityVal.textContent = val + '%';
        this.setOpacity(layer.id, val / 100);
      });

      const nameEl = item.querySelector('.layer-name');
      nameEl.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'layer-rename-input';
        input.value = layer.name;
        input.onblur = () => this.renameLayer(layer.id, input.value);
        input.onkeydown = (ev) => {
          if (ev.key === 'Enter') this.renameLayer(layer.id, input.value);
          if (ev.key === 'Escape') this.renderLayerPanel();
        };
        nameEl.replaceWith(input);
        input.focus();
        input.select();
      });

      container.appendChild(item);
    });
  }
};

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

if (typeof window !== 'undefined') {
  window.LayerSystem = LayerSystem;
}
if (typeof module !== 'undefined') {
  module.exports = LayerSystem;
}
