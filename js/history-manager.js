'use strict';
/**
 * Pattern Generator PRO V2 — history-manager.js
 * 50-100 state undo/redo (parameters only, no bitmaps)
 */

const HistoryManager = {
  _stack: [],
  _index: -1,
  _maxSize: 80,
  _onUpdate: null,

  init(onUpdate) {
    this._onUpdate = onUpdate;
  },

  push(state) {
    // Remove any forward states
    if (this._index < this._stack.length - 1) {
      this._stack = this._stack.slice(0, this._index + 1);
    }
    // Clone state (parameters only)
    const snapshot = JSON.parse(JSON.stringify(state));
    this._stack.push(snapshot);
    // Enforce max
    if (this._stack.length > this._maxSize) {
      this._stack.shift();
    }
    this._index = this._stack.length - 1;
    this._notify();
  },

  undo() {
    if (!this.canUndo()) return null;
    this._index--;
    this._notify();
    return JSON.parse(JSON.stringify(this._stack[this._index]));
  },

  redo() {
    if (!this.canRedo()) return null;
    this._index++;
    this._notify();
    return JSON.parse(JSON.stringify(this._stack[this._index]));
  },

  canUndo() { return this._index > 0; },
  canRedo() { return this._index < this._stack.length - 1; },

  clear() {
    this._stack = [];
    this._index = -1;
    this._notify();
  },

  _notify() {
    if (typeof this._onUpdate === 'function') {
      this._onUpdate({ canUndo: this.canUndo(), canRedo: this.canRedo(), index: this._index, total: this._stack.length });
    }
  },

  getSize() { return this._stack.length; },
};

if (typeof window !== 'undefined') window.HistoryManager = HistoryManager;
if (typeof module !== 'undefined') module.exports = HistoryManager;
