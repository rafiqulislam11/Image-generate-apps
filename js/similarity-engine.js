'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/similarity-engine.js
 * Approximate Similarity & Uniqueness Analyzer for Generated Designs
 * Computes color histogram & parameter variance against existing designs.
 * NOTE: Mathematical indicator only; does not claim legal uniqueness or copyright clearance.
 */

const SimilarityEngine = {
  /**
   * Compare a design state against an array of reference design states
   * Returns: { similarityPercent, uniquenessRating, duplicateDetected, disclaimer }
   */
  evaluateSimilarity(targetState, referenceList = []) {
    if (!referenceList || referenceList.length === 0) {
      return {
        similarityPercent: 0,
        uniquenessRating: 'High',
        duplicateDetected: false,
        closestMatchIndex: -1,
        disclaimer: 'Approximate mathematical similarity indicator. Does not constitute legal uniqueness or copyright clearance.'
      };
    }

    let highestSimilarity = 0;
    let closestIndex = -1;

    for (let i = 0; i < referenceList.length; i++) {
      const sim = this.compareStates(targetState, referenceList[i]);
      if (sim > highestSimilarity) {
        highestSimilarity = sim;
        closestIndex = i;
      }
    }

    const similarityPercent = Math.round(highestSimilarity * 100);
    let uniquenessRating = 'High';
    if (similarityPercent > 65) uniquenessRating = 'Low (Similar)';
    else if (similarityPercent > 35) uniquenessRating = 'Medium';

    return {
      similarityPercent,
      uniquenessRating,
      duplicateDetected: similarityPercent >= 85,
      closestMatchIndex: closestIndex,
      disclaimer: 'Approximate mathematical similarity indicator. Does not constitute legal uniqueness or copyright clearance.'
    };
  },

  /**
   * Compare two design states (0 = completely different, 1 = identical)
   */
  compareStates(s1, s2) {
    if (!s1 || !s2) return 0;

    let score = 0;
    let weights = 0;

    // 1. Pattern type match (weight 30)
    weights += 30;
    if (s1.patternType === s2.patternType) {
      score += 30;
    }

    // 2. Color Palette match (weight 35)
    weights += 35;
    const c1 = s1.colors || [];
    const c2 = s2.colors || [];
    const colorMatch = this._comparePalettes(c1, c2);
    score += colorMatch * 35;

    // 3. Density & Scale match (weight 20)
    weights += 20;
    const scaleDiff = Math.abs((s1.scale || 50) - (s2.scale || 50)) / 100;
    const densityDiff = Math.abs((s1.density || 5) - (s2.density || 5)) / 10;
    const structuralSim = 1 - (scaleDiff * 0.5 + densityDiff * 0.5);
    score += Math.max(0, structuralSim) * 20;

    // 4. Rotation & Spacing match (weight 15)
    weights += 15;
    const rotDiff = Math.abs((s1.rotation || 0) - (s2.rotation || 0)) / 360;
    score += (1 - rotDiff) * 15;

    return Math.max(0, Math.min(1, score / weights));
  },

  _comparePalettes(p1, p2) {
    if (!p1.length || !p2.length) return 0;
    let totalDist = 0;
    const n = Math.min(p1.length, p2.length);

    for (let i = 0; i < n; i++) {
      const rgb1 = this._hexToRgb(p1[i]);
      const rgb2 = this._hexToRgb(p2[i]);
      const dr = (rgb1.r - rgb2.r) / 255;
      const dg = (rgb1.g - rgb2.g) / 255;
      const db = (rgb1.b - rgb2.b) / 255;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db) / Math.sqrt(3);
      totalDist += (1 - dist);
    }

    return totalDist / n;
  },

  _hexToRgb(hex) {
    if (!hex) return { r: 128, g: 128, b: 128 };
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(x => x + x).join('') : clean, 16) || 0;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }
};

if (typeof window !== 'undefined') {
  window.SimilarityEngine = SimilarityEngine;
}
if (typeof module !== 'undefined') {
  module.exports = SimilarityEngine;
}
