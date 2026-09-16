'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/project-manager.js
 * Comprehensive Project Management System
 * Supports 6 Folders: My Designs, Favorites, Client Projects, Stock Ready, Templates, Archived
 * Search, Sort, Filter, Duplicate, Rename, Delete, and Full Structured JSON Import/Export.
 */

const ProjectManager = {
  _KEY: 'pgpro_projects',
  _LAST_KEY: 'pgpro_last_state',
  _autoSaveTimer: null,
  _isDirty: false,
  _onDirtyChange: null,

  FOLDERS: [
    { id: 'all', name: 'All Projects', icon: '📁' },
    { id: 'my_designs', name: 'My Designs', icon: '🎨' },
    { id: 'favorites', name: 'Favorites', icon: '❤️' },
    { id: 'client_projects', name: 'Client Projects', icon: '💼' },
    { id: 'stock_ready', name: 'Stock Ready', icon: '🏷️' },
    { id: 'templates', name: 'Templates', icon: '📋' },
    { id: 'archived', name: 'Archived', icon: '📦' }
  ],

  activeFolder: 'all',
  searchQuery: '',
  sortBy: 'updated_desc', // 'updated_desc', 'created_desc', 'name_asc'

  init(onDirtyChange) {
    this._onDirtyChange = onDirtyChange;
  },

  markDirty() {
    if (!this._isDirty) {
      this._isDirty = true;
      this._fireChange();
    }
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

  saveLastState(state) {
    try { localStorage.setItem(this._LAST_KEY, JSON.stringify(state)); } catch(e) {}
  },

  loadLastState() {
    try { return JSON.parse(localStorage.getItem(this._LAST_KEY) || 'null'); } catch { return null; }
  },

  // ─── Project Storage & Query ──────────────────────────────
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this._KEY) || '[]');
    } catch {
      return [];
    }
  },

  getFilteredProjects() {
    let projects = this.getAll();

    // Folder filter
    if (this.activeFolder === 'favorites') {
      projects = projects.filter(p => p.favorite);
    } else if (this.activeFolder !== 'all') {
      projects = projects.filter(p => p.folder === this.activeFolder);
    }

    // Search query filter
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      projects = projects.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    projects.sort((a, b) => {
      if (this.sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (this.sortBy === 'created_desc') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return projects;
  },

  save(id, name, state, thumbnail, folder = 'my_designs', category = 'Abstract', tags = []) {
    const projects = this.getAll();
    const now = new Date().toISOString();
    const idx = id ? projects.findIndex(p => p.id === id) : -1;

    const structuredData = {
      id: id || ('proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)),
      name: (name && name.trim()) ? name.trim() : 'Untitled Design',
      version: '2.0',
      folder: folder || 'my_designs',
      category: category || (state.patternType || 'Abstract'),
      tags: Array.isArray(tags) ? tags : [],
      favorite: idx >= 0 ? projects[idx].favorite : false,
      status: 'Ready',
      exportStatus: 'Draft',
      createdAt: idx >= 0 ? projects[idx].createdAt : now,
      updatedAt: now,
      thumbnail: thumbnail || '',
      canvas: {
        width: state.canvasWidth || 4000,
        height: state.canvasHeight || 2663,
        ppi: state.ppi || 300,
      },
      prompt: state.prompt || '',
      style: state.style || 'Modern',
      colors: state.colors || [],
      layers: state.layers || [],
      effects: state.effects || {},
      seed: state.seed || 483920,
      variations: state.variations || [],
      metadata: state.metadata || {},
      state: JSON.parse(JSON.stringify(state)),
    };

    if (idx >= 0) {
      projects[idx] = structuredData;
    } else {
      projects.unshift(structuredData);
    }

    try {
      localStorage.setItem(this._KEY, JSON.stringify(projects.slice(0, 100)));
      this.markSaved();
      return structuredData;
    } catch(e) {
      console.error('Failed to save project:', e);
      return null;
    }
  },

  load(id) {
    const projects = this.getAll();
    return projects.find(p => p.id === id) || null;
  },

  rename(id, newName) {
    const projects = this.getAll();
    const p = projects.find(p => p.id === id);
    if (p && newName && newName.trim()) {
      p.name = newName.trim();
      p.updatedAt = new Date().toISOString();
      try { localStorage.setItem(this._KEY, JSON.stringify(projects)); return true; } catch { return false; }
    }
    return false;
  },

  setFolder(id, targetFolder) {
    const projects = this.getAll();
    const p = projects.find(p => p.id === id);
    if (p) {
      p.folder = targetFolder;
      p.updatedAt = new Date().toISOString();
      try { localStorage.setItem(this._KEY, JSON.stringify(projects)); return true; } catch { return false; }
    }
    return false;
  },

  duplicate(id) {
    const p = this.load(id);
    if (!p) return null;
    const copy = JSON.parse(JSON.stringify(p));
    copy.id = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    copy.name = p.name + ' (Copy)';
    copy.createdAt = copy.updatedAt = new Date().toISOString();
    const projects = this.getAll();
    projects.unshift(copy);
    try { localStorage.setItem(this._KEY, JSON.stringify(projects.slice(0, 100))); return copy; } catch { return null; }
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
      p.updatedAt = new Date().toISOString();
      try { localStorage.setItem(this._KEY, JSON.stringify(projects)); return p.favorite; } catch {}
    }
    return false;
  },

  // ─── Standard JSON Project Format (Import & Export) ────────
  exportJSON(state, name = 'AI_Design_Studio_Project') {
    const cleanName = (name || 'pattern-project').toLowerCase().replace(/\s+/g, '-');
    const projectDoc = {
      projectName: name,
      version: '2.0',
      generator: 'AI Pattern & Image Design Studio PRO',
      canvas: {
        width: state.canvasWidth || 4000,
        height: state.canvasHeight || 2663,
        ppi: state.ppi || 300,
        tileMode: state.tileMode || 1
      },
      prompt: state.prompt || '',
      category: state.patternType || 'Geometric',
      style: state.style || 'Modern',
      colors: state.colors || [],
      layers: state.layers || [],
      effects: state.effects || {},
      seed: state.seed || 483920,
      variations: state.variations || [],
      metadata: state.metadata || {},
      state: JSON.parse(JSON.stringify(state)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanName}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  },

  async importJSON(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.name.endsWith('.json')) {
        reject(new Error('Please select a valid .json project file.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const doc = JSON.parse(e.target.result);
          if (doc.state || doc.canvas) {
            resolve(doc);
          } else {
            reject(new Error('Unrecognized project file schema.'));
          }
        } catch(err) {
          reject(new Error('Could not parse JSON project: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Failed reading file.'));
      reader.readAsText(file);
    });
  }
};

if (typeof window !== 'undefined') window.ProjectManager = ProjectManager;
if (typeof module !== 'undefined') module.exports = ProjectManager;
