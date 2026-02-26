/**
 * AI Disruption Diagnostic — Scoring Engine
 *
 * Reads from window.DiagnosticData which provides:
 *   TASKS           – array of 35 task objects, each with .impacts[tier] = {A, C, P, T, D}
 *   SECTORS         – array of sector objects, each with .weights = { task_id: decimal }
 *   TIMELINE_PERCENTAGES – adoption speed x time point lookup
 *   RECOMMENDATION_RULES – array of { condition: fn, text: string }
 *
 * Exposes window.DiagnosticEngine with all scoring methods.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];
  const IMPACT_KEYS = ['A', 'C', 'P', 'T', 'D'];
  const TIME_POINTS = [2, 5, 10, 20];
  const HORIZONS = ['H1', 'H2', 'H3', 'H4'];

  // Physical / manual task IDs (routine manual 8-12, non-routine manual 29-32)
  const PHYSICAL_TASK_IDS = [8, 9, 10, 11, 12, 29, 30, 31, 32];

  // Analytical task IDs (non-routine analytical 13-20)
  const ANALYTICAL_TASK_IDS = [13, 14, 15, 16, 17, 18, 19, 20];

  // Coordination task IDs (scheduling, supply chain, sales, negotiation, teaching, customer service)
  const COORDINATION_TASK_IDS = [3, 20, 21, 22, 23, 24];

  function getData() {
    if (!window.DiagnosticData) {
      throw new Error('DiagnosticEngine: window.DiagnosticData is not loaded.');
    }
    return window.DiagnosticData;
  }

  function getTask(taskId) {
    const data = getData();
    const task = data.TASKS.find(function (t) { return t.id === taskId; });
    if (!task) throw new Error('Unknown task id: ' + taskId);
    return task;
  }

  function getSector(sectorId) {
    const data = getData();
    const sector = data.SECTORS.find(function (s) { return s.id === sectorId; });
    if (!sector) throw new Error('Unknown sector id: ' + sectorId);
    return sector;
  }

  function tierIndex(tier) {
    var idx = TIERS.indexOf(tier);
    if (idx === -1) throw new Error('Invalid tier: ' + tier);
    return idx;
  }

  /** Sum impact values at a given tier for a task. Missing keys default to 0. */
  function impactSum(task, tier) {
    var impacts = task.impacts[tier];
    if (!impacts) return 0;
    var sum = 0;
    for (var i = 0; i < IMPACT_KEYS.length; i++) {
      sum += (impacts[IMPACT_KEYS[i]] || 0);
    }
    return sum;
  }

  /** Get a single impact value for a task at a tier. */
  function impactValue(task, tier, key) {
    var impacts = task.impacts[tier];
    if (!impacts) return 0;
    return impacts[key] || 0;
  }

  // ---------------------------------------------------------------------------
  // Global min/max cache (computed once)
  // ---------------------------------------------------------------------------

  var _globalRange = null;

  function computeGlobalRange() {
    // Fix 3: Fixed-range normalization — eliminates cross-sector normalization ripple.
    // Score = raw * 100 before adoption modifier. No sector iteration needed.
    return { min: 0, max: 1.0 };
  }

  /** Reset cached global range (call if data changes). */
  function resetCache() {
    _globalRange = null;
  }

  // ---------------------------------------------------------------------------
  // computeTaskScore
  // ---------------------------------------------------------------------------

  /**
   * Compute normalized task disruption score at a given tier.
   *
   * 1. Sum impact intensities at selectedTier (A+C+P+T+D)
   * 2. Find peak sum across ALL tiers for this task
   * 3. Normalize: sum / peakSum
   * 4. Apply monotonic floor: score at tier N >= score at tier N-1
   *
   * @param {number} taskId
   * @param {string} selectedTier – e.g. 'T3'
   * @returns {number} 0–1
   */
  function computeTaskScore(taskId, selectedTier) {
    var task = getTask(taskId);

    // Fix 1: Fixed theoretical max of 15 (5 dimensions × 3 max intensity)
    // Tasks no longer guaranteed to reach 1.0 at their peak tier.
    var THEORETICAL_MAX = 15;

    var sum = impactSum(task, selectedTier);

    // Fix 2: No monotonic floor — tasks can score lower at higher tiers
    // if their impact profile genuinely dips. Direct computation.
    return sum / THEORETICAL_MAX;
  }

  // ---------------------------------------------------------------------------
  // rawSectorScore (internal)
  // ---------------------------------------------------------------------------

  /**
   * Compute raw weighted sector score (0–1) at a given tier.
   * No normalization or adoption modifier.
   */
  function rawSectorScore(sector, tier) {
    var weights = sector.weights;
    var raw = 0;
    var taskIds = Object.keys(weights);
    for (var i = 0; i < taskIds.length; i++) {
      var tid = Number(taskIds[i]);
      var weight = weights[tid];
      raw += computeTaskScore(tid, tier) * weight;
    }
    return raw;
  }

  // ---------------------------------------------------------------------------
  // computeSectorScore
  // ---------------------------------------------------------------------------

  /**
   * Compute the sector disruption score (0–100).
   *
   * 1. Weighted sum of task scores -> raw (0–1)
   * 2. Normalize to 0–100 using global min/max
   * 3. Apply adoption modifier
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @param {string} adoptionLevel – 'low' | 'medium' | 'high'
   * @returns {number} 0–100
   */
  function computeSectorScore(sectorId, selectedTier, adoptionLevel) {
    var sector = getSector(sectorId);
    var raw = rawSectorScore(sector, selectedTier);
    var range = computeGlobalRange();

    // Normalize to 0–100
    var span = range.max - range.min;
    var score;
    if (span === 0) {
      score = 50; // degenerate: all sectors identical
    } else {
      score = ((raw - range.min) / span) * 100;
    }

    // Clamp before adoption modifier
    score = Math.max(0, Math.min(100, score));

    // Adoption modifier
    var level = (adoptionLevel || 'medium').toLowerCase();
    if (level === 'low') {
      score = score * 0.7 + 15;
    } else if (level === 'medium') {
      score = score * 0.85 + 8;
    }
    // high: score * 1.0

    return Math.max(0, Math.min(100, score));
  }

  // ---------------------------------------------------------------------------
  // computeTimeline
  // ---------------------------------------------------------------------------

  /**
   * Compute disruption timeline across 2yr, 5yr, 10yr, 20yr.
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @param {string} horizon – 'H1' | 'H2' | 'H3' | 'H4'
   * @param {string} adoptionLevel
   * @returns {Array<{year: number, score: number}>}
   */
  function computeTimeline(sectorId, selectedTier, horizon, adoptionLevel) {
    var baseline = computeSectorScore(sectorId, 'T1', adoptionLevel);
    var finalScore = computeSectorScore(sectorId, selectedTier, adoptionLevel);

    var data = getData();
    var pctTable = data.TIMELINE_PERCENTAGES;
    var level = (adoptionLevel || 'medium').toLowerCase();

    // Horizon shift amount (H1=0, H2=1, H3=2, H4=3)
    var shift = HORIZONS.indexOf(horizon);
    if (shift === -1) shift = 0;

    var results = [];
    for (var i = 0; i < TIME_POINTS.length; i++) {
      var sourceIndex = i - shift;
      var pct;
      if (sourceIndex < 0) {
        pct = 0; // shifted off table — capability hasn't arrived
      } else {
        // Read from the table. pctTable keyed by adoption level and time point index or year.
        pct = getTimelinePercentage(pctTable, level, sourceIndex);
      }

      var scoreAtPoint = baseline + (finalScore - baseline) * (pct / 100);
      results.push({ year: TIME_POINTS[i], score: scoreAtPoint });
    }

    return results;
  }

  /**
   * Read a timeline percentage from the data table.
   * Supports two table formats:
   *   1. pctTable[adoptionLevel][timePointIndex] = number
   *   2. pctTable[adoptionLevel] = array of 4 numbers
   */
  function getTimelinePercentage(pctTable, level, index) {
    if (index < 0 || index >= TIME_POINTS.length) return 0;

    var row = pctTable[level];
    if (!row) {
      // Try capitalized keys
      var capLevel = level.charAt(0).toUpperCase() + level.slice(1);
      row = pctTable[capLevel];
    }
    if (!row) return 0;

    // Array format
    if (Array.isArray(row)) {
      return row[index] || 0;
    }

    // Object keyed by year or index
    var year = TIME_POINTS[index];
    if (row[year] !== undefined) return row[year];
    if (row[index] !== undefined) return row[index];

    // Object keyed by string year
    if (row[String(year)] !== undefined) return row[String(year)];

    return 0;
  }

  // ---------------------------------------------------------------------------
  // evaluateHigherOrderImpacts
  // ---------------------------------------------------------------------------

  /**
   * Evaluate the three higher-order structural shift triggers.
   * Uses HIGH-WATER MARK logic: best score across T1 through selected tier.
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @returns {Array<{id: string, label: string, triggered: boolean}>}
   */
  function evaluateHigherOrderImpacts(sectorId, selectedTier) {
    var sector = getSector(sectorId);
    var selIdx = tierIndex(selectedTier);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);

    // --- "Scarce knowledge -> zero value" ---
    // Across analytical tasks (13-20):
    //   high-water mark of avg T >= 2.0 at any tier up to selected
    //   AND avg A at selected tier >= 1.5
    var scarceKnowledge = (function () {
      var analyticalInSector = taskIds.filter(function (id) {
        return ANALYTICAL_TASK_IDS.indexOf(id) !== -1;
      });

      if (analyticalInSector.length === 0) return false;

      // High-water mark of avg T across tiers T1..selected
      var hwmAvgT = 0;
      for (var t = 0; t <= selIdx; t++) {
        var sumT = 0;
        for (var i = 0; i < analyticalInSector.length; i++) {
          var task = getTask(analyticalInSector[i]);
          sumT += impactValue(task, TIERS[t], 'T');
        }
        var avgT = sumT / analyticalInSector.length;
        if (avgT > hwmAvgT) hwmAvgT = avgT;
      }

      // Avg A at selected tier
      var sumA = 0;
      for (var j = 0; j < analyticalInSector.length; j++) {
        var taskA = getTask(analyticalInSector[j]);
        sumA += impactValue(taskA, selectedTier, 'A');
      }
      var avgA = sumA / analyticalInSector.length;

      // Fix 4: Raised thresholds — triggers discriminate instead of firing universally
      return hwmAvgT >= 2.5 && avgA >= 2.0;
    })();

    // --- "Coordination costs -> zero" ---
    // Tasks 3, 20, 21-24: combined avg of max(A, P) >= 2.0 at selected tier
    var coordinationZero = (function () {
      var coordInSector = taskIds.filter(function (id) {
        return COORDINATION_TASK_IDS.indexOf(id) !== -1;
      });

      if (coordInSector.length === 0) return false;

      var sumMaxAP = 0;
      for (var i = 0; i < coordInSector.length; i++) {
        var task = getTask(coordInSector[i]);
        var a = impactValue(task, selectedTier, 'A');
        var p = impactValue(task, selectedTier, 'P');
        sumMaxAP += Math.max(a, p);
      }
      var avgMaxAP = sumMaxAP / coordInSector.length;

      // Fix 4: Raised threshold
      return avgMaxAP >= 2.5;
    })();

    // --- "Unbundling & new bottlenecks" ---
    // Avg A across all sector tasks >= 1.5
    // AND task 34 (verification) A score <= 1
    // AND task 27 (strategic planning) A score <= 1
    var unbundling = (function () {
      if (taskIds.length === 0) return false;

      var sumA = 0;
      for (var i = 0; i < taskIds.length; i++) {
        var task = getTask(taskIds[i]);
        sumA += impactValue(task, selectedTier, 'A');
      }
      var avgA = sumA / taskIds.length;

      var task34 = getTask(34);
      var task27 = getTask(27);
      var verifyA = impactValue(task34, selectedTier, 'A');
      var stratA = impactValue(task27, selectedTier, 'A');

      // Fix 4: Raised threshold (verifyA/stratA conditions unchanged — different logic)
      return avgA >= 2.0 && verifyA <= 1 && stratA <= 1;
    })();

    return [
      {
        id: 'scarce_knowledge',
        label: 'Scarce knowledge \u2192 zero value',
        triggered: scarceKnowledge,
      },
      {
        id: 'coordination_zero',
        label: 'Coordination costs \u2192 zero',
        triggered: coordinationZero,
      },
      {
        id: 'unbundling',
        label: 'Unbundling & new bottlenecks',
        triggered: unbundling,
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // computeDominantImpact
  // ---------------------------------------------------------------------------

  /**
   * Compute the dominant impact type for a sector at a given tier.
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @returns {{ dominant: string|string[], scores: {A:number,C:number,P:number,T:number,D:number} }}
   */
  function computeDominantImpact(sectorId, selectedTier) {
    var sector = getSector(sectorId);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);

    // Weighted average for each impact type
    var scores = {};
    for (var k = 0; k < IMPACT_KEYS.length; k++) {
      var key = IMPACT_KEYS[k];
      var weightedSum = 0;
      var totalWeight = 0;
      for (var i = 0; i < taskIds.length; i++) {
        var tid = taskIds[i];
        var task = getTask(tid);
        var w = weights[tid];
        weightedSum += impactValue(task, selectedTier, key) * w;
        totalWeight += w;
      }
      scores[key] = totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    // Sort impact types by score descending
    var sorted = IMPACT_KEYS.slice().sort(function (a, b) {
      return scores[b] - scores[a];
    });

    var top = sorted[0];
    var second = sorted[1];

    var dominant;
    // Fix 5: Widened co-dominance threshold — fewer false single-dominant calls
    if (scores[top] - scores[second] >= 0.5) {
      dominant = top;
    } else {
      // Co-dominant: top two
      dominant = [top, second];
    }

    return { dominant: dominant, scores: scores };
  }

  // ---------------------------------------------------------------------------
  // generateRecommendations
  // ---------------------------------------------------------------------------

  /**
   * Generate strategic recommendations for a sector/tier/adoption combination.
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @param {string} adoptionLevel
   * @returns {string[]}
   */
  function generateRecommendations(sectorId, selectedTier, adoptionLevel) {
    var sector = getSector(sectorId);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);

    var dominantResult = computeDominantImpact(sectorId, selectedTier);
    var higherOrder = evaluateHigherOrderImpacts(sectorId, selectedTier);
    var level = (adoptionLevel || 'medium').toLowerCase();

    var recs = [];

    // --- Dominant impact recommendation ---
    var dom = dominantResult.dominant;
    var domArr = Array.isArray(dom) ? dom : [dom];

    var dominantRecs = {
      A: 'Restructure workforce around non-automatable tasks; plan headcount transition.',
      C: 'Prepare for compressed cost structures \u2014 margins will shift industry-wide, not just for early adopters.',
      P: 'Model workforce at 2\u20133x current productivity; plan for smaller, higher-output teams.',
      T: 'Compress talent pyramid; redefine role boundaries; fewer mid-level specialists.',
      D: 'Invest in AI-augmented strategy; don\u2019t replace strategists, arm them.',
    };

    for (var d = 0; d < domArr.length; d++) {
      if (dominantRecs[domArr[d]]) {
        recs.push(dominantRecs[domArr[d]]);
      }
    }

    // --- Verification bottleneck ---
    var task34 = getTask(34);
    var verifyA = impactValue(task34, selectedTier, 'A');
    if (verifyA <= 1) {
      recs.push('Invest in verification infrastructure \u2014 this becomes your most defensible capability.');
    }

    // --- Higher-order impact recommendations ---
    var hoRecs = {
      scarce_knowledge: 'Protect proprietary data; build differentiation beyond expertise.',
      coordination_zero: 'Rethink firm boundaries \u2014 what you outsource vs. build changes when coordination is free.',
      unbundling: 'Shift competitive moat from knowledge to judgment, trust, and risk management.',
    };

    for (var h = 0; h < higherOrder.length; h++) {
      if (higherOrder[h].triggered && hoRecs[higherOrder[h].id]) {
        recs.push(hoRecs[higherOrder[h].id]);
      }
    }

    // --- Physical-task intensive sector ---
    var physicalWeight = 0;
    for (var p = 0; p < PHYSICAL_TASK_IDS.length; p++) {
      var pid = PHYSICAL_TASK_IDS[p];
      if (weights[pid]) {
        physicalWeight += weights[pid];
      }
    }
    if (physicalWeight >= 0.30) {
      recs.push('Develop robotics/automation roadmap; timeline is longer, invest in transition.');
    }

    // --- Adoption speed recommendation (always included) ---
    if (level === 'high') {
      recs.push('Act now \u2014 competitive pressure leaves no runway for delayed response.');
    } else if (level === 'low') {
      recs.push('Build capability over 3\u20135 years \u2014 you have time but not unlimited time.');
    } else {
      recs.push('Begin strategic repositioning now; moderate adoption gives you a window, not a wall.');
    }

    // --- Apply any custom recommendation rules from data ---
    var data = getData();
    if (data.RECOMMENDATION_RULES && Array.isArray(data.RECOMMENDATION_RULES)) {
      var context = {
        sectorId: sectorId,
        selectedTier: selectedTier,
        adoptionLevel: level,
        dominantImpact: dominantResult,
        higherOrderImpacts: higherOrder,
        sector: sector,
        scores: dominantResult.scores,
        physicalWeight: physicalWeight,
      };
      for (var r = 0; r < data.RECOMMENDATION_RULES.length; r++) {
        var rule = data.RECOMMENDATION_RULES[r];
        try {
          if (typeof rule.condition === 'function' && rule.condition(context)) {
            // Avoid duplicates
            if (recs.indexOf(rule.text) === -1) {
              recs.push(rule.text);
            }
          }
        } catch (e) {
          // Swallow bad rules silently
        }
      }
    }

    return recs;
  }

  // ---------------------------------------------------------------------------
  // computeAll
  // ---------------------------------------------------------------------------

  /**
   * Compute the full diagnostic result set for a given scenario.
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @param {string} horizon
   * @param {string} adoptionLevel
   * @returns {Object} Complete results object
   */
  function computeAll(sectorId, selectedTier, horizon, adoptionLevel) {
    var sector = getSector(sectorId);
    var score = computeSectorScore(sectorId, selectedTier, adoptionLevel);
    var timeline = computeTimeline(sectorId, selectedTier, horizon, adoptionLevel);
    var higherOrder = evaluateHigherOrderImpacts(sectorId, selectedTier);
    var dominant = computeDominantImpact(sectorId, selectedTier);
    var recommendations = generateRecommendations(sectorId, selectedTier, adoptionLevel);

    // Risk zone label
    var zone;
    if (score <= 20) zone = 'Resilient';
    else if (score <= 40) zone = 'Adapting';
    else if (score <= 60) zone = 'Transforming';
    else if (score <= 80) zone = 'Disrupting';
    else zone = 'Restructuring';

    // Per-task detail for the sector
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);
    var taskDetails = taskIds.map(function (tid) {
      var task = getTask(tid);
      var taskScore = computeTaskScore(tid, selectedTier);
      var impacts = task.impacts[selectedTier] || {};
      return {
        id: tid,
        name: task.name || ('Task ' + tid),
        weight: weights[tid],
        score: taskScore,
        impacts: {
          A: impacts.A || 0,
          C: impacts.C || 0,
          P: impacts.P || 0,
          T: impacts.T || 0,
          D: impacts.D || 0,
        },
      };
    }).sort(function (a, b) {
      // Sort by weighted score descending
      return (b.score * b.weight) - (a.score * a.weight);
    });

    return {
      sectorId: sectorId,
      sectorName: sector.name || ('Sector ' + sectorId),
      selectedTier: selectedTier,
      horizon: horizon,
      adoptionLevel: adoptionLevel,
      score: score,
      zone: zone,
      timeline: timeline,
      dominantImpact: dominant,
      higherOrderImpacts: higherOrder,
      recommendations: recommendations,
      taskDetails: taskDetails,
    };
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  window.DiagnosticEngine = {
    computeTaskScore: computeTaskScore,
    computeSectorScore: computeSectorScore,
    computeTimeline: computeTimeline,
    evaluateHigherOrderImpacts: evaluateHigherOrderImpacts,
    computeDominantImpact: computeDominantImpact,
    generateRecommendations: generateRecommendations,
    computeAll: computeAll,
    resetCache: resetCache,
  };
})();
