'use strict';
/**
 * Pattern Generator PRO V2 — project-manager.js
 * Save / Load / Auto-save projects (localStorage + export JSON)
 */

const ProjectManager = {
  _KEY: 'pgpro_projects',
  _LAST_KEY: 'pgpro_last_state',
  _autoSaveTimer: null,
  _isDirty: false,
  _onDirtyChange: null,

  init(onDirtyChange) {
    this._onDirtyChange = onDirtyChange;
  },

  // ─── Dirty Tracking ─────────────────────────────────────
  markDirty() {
    if (!this._isDirty) {
      this._isDirty = true;
      this._fireChange();
    }
    this._scheduleAutoSave();
  },

  markSaved() {
    this._isDirty = false;
    this._fireChange();
  },

  isDirty() { return this._isDirty; },

  _fireChange() {
    if (typeof this._onDirtyChange === 'function') {
      this._onDirtyChange(this._isDirty);
    }
  },

  // ─── Auto-Save ──────────────────────────────────────────
  _scheduleAutoSave(state) {
    clearTimeout(this._autoSaveTimer);
    if (state) {
      this._autoSaveTimer = setTimeout(() => {
        this.saveLastState(state);
      }, 2000);
    }
  },

  saveLastState(state) {
    try { localStorage.setItem(this._LAST_KEY, JSON.stringify(state)); } catch(e) {}
  },

  loadLastState() {
    try { return JSON.parse(localStorage.getItem(this._LAST_KEY) || 'null'); } catch { return null; }
  },

  // ─── Project CRUD ────────────────────────────────────────
  getAll() {
    try { return JSON.parse(localStorage.getItem(this._KEY) || '[]'); } catch { return []; }
  },

  save(id, name, state, thumbnail) {
    const projects = this.getAll();
    const now = new Date().toISOString();
    const idx = projects.findIndex(p => p.id === id);

    const entry = {
      id: id || ('proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)),
      name: name || 'Untitled Project',
      createdAt: idx >= 0 ? projects[idx].createdAt : now,
      updatedAt: now,
      thumbnail: thumbnail || '',
      state: JSON.parse(JSON.stringify(state)),
    };

    if (idx >= 0) {
      projects[idx] = entry;
    } else {
      projects.unshift(entry);
    }

    // Keep max 50 projects
    const trimmed = projects.slice(0, 50);
    try { localStorage.setItem(this._KEY, JSON.stringify(trimmed)); return entry; } catch(e) { return null; }
  },

  load(id) {
    const projects = this.getAll();
    return projects.find(p => p.id === id) || null;
  },

  rename(id, newName) {
    const projects = this.getAll();
    const p = projects.find(p => p.id === id);
    if (p) {
      p.name = newName;
      p.updatedAt = new Date().toISOString();
      try { localStorage.setItem(this._KEY, JSON.stringify(projects)); return true; } catch { return false; }
    }
    return false;
  },

  duplicate(id) {
    const p = this.load(id);
    if (!p) return null;
    const newProject = JSON.parse(JSON.stringify(p));
    newProject.id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    newProject.name = p.name + ' Copy';
    newProject.createdAt = newProject.updatedAt = new Date().toISOString();
    const projects = this.getAll();
    projects.unshift(newProject);
    try { localStorage.setItem(this._KEY, JSON.stringify(projects.slice(0, 50))); return newProject; } catch { return null; }
  },

  delete(id) {
    const projects = this.getAll().filter(p => p.id !== id);
    try { localStorage.setItem(this._KEY, JSON.stringify(projects)); return true; } catch { return false; }
  },

  toggleFavorite(id) {
    const projects = this.getAll();
    const p = projects.find(p => p.id === id);
    if (p) {
      p.favorite = !p.favorite;
      try { localStorage.setItem(this._KEY, JSON.stringify(projects)); return p.favorite; } catch {}
    }
    return false;
  },

  // ─── JSON Import / Export ────────────────────────────────
  exportJSON(state, name) {
    const data = {
      version: '2.0',
      name: name || 'PatternGeneratorPRO',
      exportedAt: new Date().toISOString(),
      state: JSON.parse(JSON.stringify(state)),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (name || 'pattern-project').toLowerCase().replace(/\s+/g, '-') + '.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  },

  async importJSON(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.name.endsWith('.json')) {
        reject(new Error('Please select a .json project file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.state) resolve(data);
          else reject(new Error('Invalid project file format'));
        } catch(err) {
          reject(new Error('Could not parse project file: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsText(file);
    });
  },

  generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  },
};

if (typeof window !== 'undefined') window.ProjectManager = ProjectManager;
if (typeof module !== 'undefined') module.exports = ProjectManager;
