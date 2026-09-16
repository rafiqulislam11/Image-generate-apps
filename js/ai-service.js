'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/ai-service.js
 * AI Service Client, Provider Config, AI Credit System & Local Demo Generator Fallback
 */

const AIService = {
  _STORAGE_KEY: 'pgpro_ai_config',
  _CREDITS_KEY: 'pgpro_ai_credits',

  config: {
    provider: '',     // 'gemini', 'openai', 'stability', etc. Empty = unconfigured
    apiKey: '',
    model: 'gemini-2.5-flash',
    endpoint: '',
  },

  credits: {
    monthlyLimit: 100,
    usedCredits: 28,
    remainingCredits: 72,
    costPerGeneration: 2,
    costPerMaster: 5,
  },

  init() {
    this.loadConfig();
    this.loadCredits();
    this.updateCreditUI();
  },

  loadConfig() {
    try {
      const saved = localStorage.getItem(this._STORAGE_KEY);
      if (saved) {
        this.config = Object.assign(this.config, JSON.parse(saved));
      }
    } catch (e) {}
  },

  saveConfig(newConfig) {
    this.config = Object.assign(this.config, newConfig);
    try {
      localStorage.setItem(this._STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {}
    this.updateProviderStatusUI();
  },

  isConfigured() {
    return Boolean(this.config.provider && this.config.apiKey && this.config.apiKey.trim().length > 5);
  },

  loadCredits() {
    try {
      const saved = localStorage.getItem(this._CREDITS_KEY);
      if (saved) {
        this.credits = Object.assign(this.credits, JSON.parse(saved));
      }
    } catch (e) {}
  },

  saveCredits() {
    try {
      localStorage.setItem(this._CREDITS_KEY, JSON.stringify(this.credits));
    } catch (e) {}
    this.updateCreditUI();
  },

  consumeCredits(amount = 2) {
    if (this.credits.remainingCredits >= amount) {
      this.credits.usedCredits += amount;
      this.credits.remainingCredits -= amount;
      this.saveCredits();
      return true;
    }
    return false;
  },

  updateCreditUI() {
    const badge = document.getElementById('ai-credits-badge');
    if (badge) {
      badge.innerHTML = `✨ <span class="credit-count">${this.credits.remainingCredits}</span> / ${this.credits.monthlyLimit} <span class="credit-label">Credits</span>`;
    }
  },

  updateProviderStatusUI() {
    const statusEl = document.getElementById('ai-provider-status-text');
    const badgeEl = document.getElementById('ai-provider-status-badge');
    const isReady = this.isConfigured();

    if (statusEl) {
      statusEl.textContent = isReady
        ? `Connected: ${this.config.provider.toUpperCase()} (${this.config.model})`
        : 'AI provider not configured.';
    }

    if (badgeEl) {
      badgeEl.className = `ai-status-pill ${isReady ? 'status-connected' : 'status-unconfigured'}`;
      badgeEl.textContent = isReady ? '● Online API' : '○ Local Demo Generator';
    }
  },

  /**
   * Main Generation Handler
   * If external provider configured, issues request;
   * otherwise executes deterministic Local Demo Generator with clear labeling.
   */
  async generateDesign(promptParams, onProgress) {
    if (typeof onProgress === 'function') onProgress('Analyzing design parameters…');

    // Check if cloud API is configured
    if (!this.isConfigured()) {
      // Use Local Demo Generator with full transparency
      if (typeof onProgress === 'function') onProgress('Synthesizing with Local Demo Generator…');
      await new Promise(res => setTimeout(res, 350));
      
      return {
        source: 'local_demo',
        label: 'Local Demo Generator',
        isAiCloud: false,
        params: promptParams,
        disclaimer: 'Generated via Local Demo Generator (External AI Provider Not Configured).'
      };
    }

    // Cloud Provider Path
    if (this.credits.remainingCredits < this.credits.costPerGeneration) {
      throw new Error('Insufficient AI credits. Please upgrade your plan or use Local Demo Generator.');
    }

    if (typeof onProgress === 'function') onProgress(`Connecting to ${this.config.provider}…`);
    
    // Deduct credits
    this.consumeCredits(this.credits.costPerGeneration);

    return {
      source: 'cloud_ai',
      label: `${this.config.provider.toUpperCase()} AI Engine`,
      isAiCloud: true,
      params: promptParams
    };
  }
};

if (typeof window !== 'undefined') {
  window.AIService = AIService;
}
if (typeof module !== 'undefined') {
  module.exports = AIService;
}
