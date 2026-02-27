/**
 * AI Disruption Diagnostic — Scoring Engine (v2: Executive-Native)
 *
 * Dimensions: H(eadcount) / M(argin) / V(elocity) / B(arrier) / R(estructuring)
 *
 * Reads from window.DiagnosticData which provides:
 *   TASKS           – array of 35 task objects, each with .impacts[tier] = {H, M, V, B, R}
 *   SECTORS         – array of sector objects, each with .weights = { task_id: decimal }
 *   TIMELINE_PERCENTAGES – adoption speed x time point lookup
 *   SCENARIO_DEFINITIONS – 5 named scenarios with severity computation
 *
 * Exposes window.DiagnosticEngine with all scoring methods.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  var TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];
  var IMPACT_KEYS = ['H', 'M', 'V', 'B', 'R'];
  var TIME_POINTS = [2, 5, 10, 20];
  var HORIZONS = ['H1', 'H2', 'H3', 'H4'];

  // Regulation dimension multipliers: applied to raw H/M/V/B/R before summing
  var REGULATION_MODIFIERS = {
    restrictive: { H: 0.80, M: 0.90, V: 0.65, B: 0.55, R: 0.85 },
    fragmented:  { H: 1.00, M: 1.10, V: 0.90, B: 1.35, R: 1.25 },
    permissive:  { H: 1.10, M: 1.10, V: 1.15, B: 1.20, R: 1.00 },
    supportive:  { H: 1.25, M: 1.00, V: 1.30, B: 1.10, R: 0.75 }
  };

  // Physical / manual task IDs (routine manual 8-12, non-routine manual 29-32)
  var PHYSICAL_TASK_IDS = [8, 9, 10, 11, 12, 29, 30, 31, 32];

  // Junior/routine task IDs (routine cognitive 1-7, routine manual 8-12)
  var JUNIOR_TASK_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Senior/strategic task IDs (strategic planning, negotiation, leadership, creative)
  var SENIOR_TASK_IDS = [22, 25, 27, 28];

  // Coordination task IDs
  var COORDINATION_TASK_IDS = [3, 20, 21, 22, 23, 24];

  // Analytical task IDs
  var ANALYTICAL_TASK_IDS = [13, 14, 15, 16, 17, 18, 19, 20];

  // Execution-heavy task IDs (tasks that automate fast)
  var EXECUTION_TASK_IDS = [1, 2, 3, 4, 5, 6, 7, 13, 14, 19, 24, 28];

  // Verification task
  var VERIFICATION_TASK_ID = 34;

  // Strategic planning task
  var STRATEGIC_TASK_ID = 27;

  // Theoretical max: 5 dimensions × 3 max intensity = 15
  var THEORETICAL_MAX = 15;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getData() {
    if (!window.DiagnosticData) {
      throw new Error('DiagnosticEngine: window.DiagnosticData is not loaded.');
    }
    return window.DiagnosticData;
  }

  function getTask(taskId) {
    var data = getData();
    var task = data.TASKS.find(function (t) { return t.id === taskId; });
    if (!task) throw new Error('Unknown task id: ' + taskId);
    return task;
  }

  function getSector(sectorId) {
    var data = getData();
    var sector = data.SECTORS.find(function (s) { return s.id === sectorId; });
    if (!sector) throw new Error('Unknown sector id: ' + sectorId);
    return sector;
  }

  function tierIndex(tier) {
    var idx = TIERS.indexOf(tier);
    if (idx === -1) throw new Error('Invalid tier: ' + tier);
    return idx;
  }

  /** Sum impact values at a given tier for a task, with optional regulation modifiers. */
  function impactSum(task, tier, regulationLevel) {
    var impacts = task.impacts[tier];
    if (!impacts) return 0;
    var mods = regulationLevel ? REGULATION_MODIFIERS[regulationLevel] : null;
    var sum = 0;
    for (var i = 0; i < IMPACT_KEYS.length; i++) {
      var key = IMPACT_KEYS[i];
      var val = impacts[key] || 0;
      if (mods) val *= mods[key];
      sum += val;
    }
    return sum;
  }

  /** Get a single impact value for a task at a tier, with optional regulation modifier. */
  function impactValue(task, tier, key, regulationLevel) {
    var impacts = task.impacts[tier];
    if (!impacts) return 0;
    var val = impacts[key] || 0;
    if (regulationLevel) {
      var mods = REGULATION_MODIFIERS[regulationLevel];
      if (mods) val *= mods[key];
    }
    return val;
  }

  // ---------------------------------------------------------------------------
  // Global range (fixed)
  // ---------------------------------------------------------------------------

  function computeGlobalRange() {
    return { min: 0, max: 1.0 };
  }

  function resetCache() {
    // No cache to reset with fixed range, but keep API stable
  }

  // ---------------------------------------------------------------------------
  // computeTaskScore
  // ---------------------------------------------------------------------------

  function computeTaskScore(taskId, selectedTier, regulationLevel) {
    var task = getTask(taskId);
    var sum = impactSum(task, selectedTier, regulationLevel);
    return sum / THEORETICAL_MAX;
  }

  // ---------------------------------------------------------------------------
  // rawSectorScore
  // ---------------------------------------------------------------------------

  function rawSectorScore(sector, tier, regulationLevel) {
    var weights = sector.weights;
    var raw = 0;
    var taskIds = Object.keys(weights);
    for (var i = 0; i < taskIds.length; i++) {
      var tid = Number(taskIds[i]);
      var weight = weights[tid];
      raw += computeTaskScore(tid, tier, regulationLevel) * weight;
    }
    return raw;
  }

  // ---------------------------------------------------------------------------
  // computeSectorScore
  // ---------------------------------------------------------------------------

  function computeSectorScore(sectorId, selectedTier, adoptionLevel, regulationLevel) {
    var sector = getSector(sectorId);
    var raw = rawSectorScore(sector, selectedTier, regulationLevel);
    var range = computeGlobalRange();

    var span = range.max - range.min;
    var score;
    if (span === 0) {
      score = 50;
    } else {
      score = ((raw - range.min) / span) * 100;
    }

    score = Math.max(0, Math.min(100, score));

    var level = (adoptionLevel || 'medium').toLowerCase();
    if (level === 'low') {
      score = score * 0.7 + 15;
    } else if (level === 'medium') {
      score = score * 0.85 + 8;
    }

    return Math.max(0, Math.min(100, score));
  }

  // ---------------------------------------------------------------------------
  // computeTimeline
  // ---------------------------------------------------------------------------

  function computeTimeline(sectorId, selectedTier, horizon, adoptionLevel, regulationLevel) {
    var baseline = computeSectorScore(sectorId, 'T1', adoptionLevel, regulationLevel);
    var finalScore = computeSectorScore(sectorId, selectedTier, adoptionLevel, regulationLevel);

    var data = getData();
    var pctTable = data.TIMELINE_PERCENTAGES;
    var level = (adoptionLevel || 'medium').toLowerCase();

    var shift = HORIZONS.indexOf(horizon);
    if (shift === -1) shift = 0;

    var results = [];
    for (var i = 0; i < TIME_POINTS.length; i++) {
      var sourceIndex = i - shift;
      var pct;
      if (sourceIndex < 0) {
        pct = 0;
      } else {
        pct = getTimelinePercentage(pctTable, level, sourceIndex);
      }

      var scoreAtPoint = baseline + (finalScore - baseline) * (pct / 100);
      results.push({ year: TIME_POINTS[i], score: scoreAtPoint });
    }

    return results;
  }

  function getTimelinePercentage(pctTable, level, index) {
    if (index < 0 || index >= TIME_POINTS.length) return 0;

    var row = pctTable[level];
    if (!row) {
      var capLevel = level.charAt(0).toUpperCase() + level.slice(1);
      row = pctTable[capLevel];
    }
    if (!row) return 0;

    if (Array.isArray(row)) {
      return row[index] || 0;
    }

    var year = TIME_POINTS[index];
    if (row[year] !== undefined) return row[year];
    if (row[index] !== undefined) return row[index];
    if (row[String(year)] !== undefined) return row[String(year)];

    return 0;
  }

  // ---------------------------------------------------------------------------
  // evaluateScenarios — replaces evaluateHigherOrderImpacts
  // ---------------------------------------------------------------------------

  /**
   * Evaluate 5 named scenarios with graded severity (none / moderate / severe).
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @returns {Array<{id: string, label: string, severity: string, score: number, description: string}>}
   */
  function evaluateScenarios(sectorId, selectedTier, regulationLevel) {
    var sector = getSector(sectorId);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);

    // Helper: weighted average of a dimension across a subset of tasks
    function weightedAvgDim(ids, dim) {
      var filteredIds = ids.filter(function (id) { return weights[id] !== undefined; });
      if (filteredIds.length === 0) return 0;
      var sumW = 0;
      var sumVal = 0;
      for (var i = 0; i < filteredIds.length; i++) {
        var tid = filteredIds[i];
        var w = weights[tid] || 0;
        var task = getTask(tid);
        sumVal += impactValue(task, selectedTier, dim, regulationLevel) * w;
        sumW += w;
      }
      return sumW > 0 ? sumVal / sumW : 0;
    }

    // Helper: simple average of a dimension across task subset
    function avgDim(ids, dim) {
      var filteredIds = ids.filter(function (id) { return weights[id] !== undefined; });
      if (filteredIds.length === 0) return 0;
      var sum = 0;
      for (var i = 0; i < filteredIds.length; i++) {
        var task = getTask(filteredIds[i]);
        sum += impactValue(task, selectedTier, dim, regulationLevel);
      }
      return sum / filteredIds.length;
    }

    // Helper: severity from score (0-3)
    function severity(score) {
      if (score < 1.2) return 'none';
      if (score < 2.0) return 'moderate';
      return 'severe';
    }

    var scenarios = [];

    // ── 1. "The Pyramid Inverts" ──
    // Junior/routine tasks have high H but senior tasks don't → staffing pyramid breaks
    var juniorH = avgDim(JUNIOR_TASK_IDS, 'H');
    var seniorH = avgDim(SENIOR_TASK_IDS, 'H');
    var pyramidScore = Math.max(0, juniorH - seniorH);
    // Scale: if gap >= 2, severe; if gap >= 1, moderate
    var pyramidSeverity = pyramidScore < 1.0 ? 'none' : pyramidScore < 2.0 ? 'moderate' : 'severe';
    scenarios.push({
      id: 'pyramid_inverts',
      label: 'The Pyramid Inverts',
      severity: pyramidSeverity,
      score: pyramidScore,
      description: 'Junior and routine roles face high headcount exposure while senior roles don\'t. The staffing pyramid that feeds your talent pipeline breaks.'
    });

    // ── 2. "The Price Floor Drops" ──
    // AI enables comparable services at a fraction of the cost → M across analytical tasks
    var analyticalM = avgDim(ANALYTICAL_TASK_IDS, 'M');
    var analyticalB = avgDim(ANALYTICAL_TASK_IDS, 'B');
    var priceFloorScore = (analyticalM * 0.6 + analyticalB * 0.4);
    scenarios.push({
      id: 'price_floor_drops',
      label: 'The Price Floor Drops',
      severity: severity(priceFloorScore),
      score: priceFloorScore,
      description: 'AI enables comparable services at a fraction of the cost. New entrants undercut your pricing model because the expertise barrier is gone.'
    });

    // ── 3. "The Solo Operator" ──
    // Coordination tasks face high V + low B → one person does what a team did
    var coordV = avgDim(COORDINATION_TASK_IDS, 'V');
    var coordB = avgDim(COORDINATION_TASK_IDS, 'B');
    var soloScore = coordV * 0.7 + (3 - coordB) * 0.3; // high V + low B (inverted)
    scenarios.push({
      id: 'solo_operator',
      label: 'The Solo Operator',
      severity: severity(soloScore),
      score: soloScore,
      description: 'Coordination tasks face massive velocity gains with weak defensible barriers. One person with AI does what a team of ten did.'
    });

    // ── 4. "The Verification Bottleneck" ──
    // Execution automates but verification doesn't → value shifts to "who can check"
    var execH = avgDim(EXECUTION_TASK_IDS, 'H');
    var verifyTask = getTask(VERIFICATION_TASK_ID);
    var verifyH = impactValue(verifyTask, selectedTier, 'H', regulationLevel);
    var verifyB = impactValue(verifyTask, selectedTier, 'B', regulationLevel);
    var verificationGap = Math.max(0, execH - verifyH);
    var verificationScore = verificationGap * 0.5 + verifyB * 0.5;
    scenarios.push({
      id: 'verification_bottleneck',
      label: 'The Verification Bottleneck',
      severity: severity(verificationScore),
      score: verificationScore,
      description: 'Execution automates but verification doesn\'t. Value shifts from "who can do the work" to "who can check the work was done right."'
    });

    // ── 5. "The Speed Trap" ──
    // Velocity gains so extreme that unrestructured orgs become irrelevant
    var avgV = weightedAvgDim(taskIds, 'V');
    var avgR = weightedAvgDim(taskIds, 'R');
    var speedTrapScore = avgV * 0.5 + avgR * 0.5;
    scenarios.push({
      id: 'speed_trap',
      label: 'The Speed Trap',
      severity: severity(speedTrapScore),
      score: speedTrapScore,
      description: 'Velocity gains are so extreme that organizations that don\'t restructure become competitively irrelevant. Speed becomes table stakes.'
    });

    return scenarios;
  }

  // ---------------------------------------------------------------------------
  // computeDominantImpact
  // ---------------------------------------------------------------------------

  function computeDominantImpact(sectorId, selectedTier, regulationLevel) {
    var sector = getSector(sectorId);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);

    var scores = {};
    for (var k = 0; k < IMPACT_KEYS.length; k++) {
      var key = IMPACT_KEYS[k];
      var weightedSum = 0;
      var totalWeight = 0;
      for (var i = 0; i < taskIds.length; i++) {
        var tid = taskIds[i];
        var task = getTask(tid);
        var w = weights[tid];
        weightedSum += impactValue(task, selectedTier, key, regulationLevel) * w;
        totalWeight += w;
      }
      scores[key] = totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    var sorted = IMPACT_KEYS.slice().sort(function (a, b) {
      return scores[b] - scores[a];
    });

    var top = sorted[0];
    var second = sorted[1];

    var dominant;
    if (scores[top] - scores[second] >= 0.5) {
      dominant = top;
    } else {
      dominant = [top, second];
    }

    return { dominant: dominant, scores: scores };
  }

  // ---------------------------------------------------------------------------
  // computeWhatChanges — replaces task table with 3 executive cards
  // ---------------------------------------------------------------------------

  /**
   * Compute the "What Changes" cards: Changes First (V), Changes Most (H), Stays Human.
   *
   * @param {number} sectorId
   * @param {string} selectedTier
   * @returns {{ changesFirst: Array, changesMost: Array, staysHuman: Array }}
   */
  function computeWhatChanges(sectorId, selectedTier, regulationLevel) {
    var sector = getSector(sectorId);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);
    var mods = regulationLevel ? REGULATION_MODIFIERS[regulationLevel] : null;

    // Build scored task list
    var taskScores = taskIds.map(function (tid) {
      var task = getTask(tid);
      var impacts = task.impacts[selectedTier] || {};
      var h = impacts.H || 0;
      var m = impacts.M || 0;
      var v = impacts.V || 0;
      var b = impacts.B || 0;
      var r = impacts.R || 0;
      if (mods) {
        h *= mods.H; m *= mods.M; v *= mods.V; b *= mods.B; r *= mods.R;
      }
      var total = h + m + v + b + r;
      return {
        id: tid,
        name: task.name || ('Task ' + tid),
        weight: weights[tid],
        impacts: { H: h, M: m, V: v, B: b, R: r },
        total: total,
        score: computeTaskScore(tid, selectedTier, regulationLevel)
      };
    });

    // Changes First: top 3 by V impact (weighted)
    var byVelocity = taskScores.slice().sort(function (a, b) {
      return (b.impacts.V * b.weight) - (a.impacts.V * a.weight);
    });
    var changesFirst = byVelocity.slice(0, 3);

    // Changes Most: top 3 by H impact (weighted)
    var byHeadcount = taskScores.slice().sort(function (a, b) {
      return (b.impacts.H * b.weight) - (a.impacts.H * a.weight);
    });
    var changesMost = byHeadcount.slice(0, 3);

    // Stays Human: bottom 3 by total impact (weighted)
    var byTotal = taskScores.slice().sort(function (a, b) {
      return (a.total * a.weight) - (b.total * b.weight);
    });
    var staysHuman = byTotal.slice(0, 3);

    return {
      changesFirst: changesFirst,
      changesMost: changesMost,
      staysHuman: staysHuman
    };
  }

  // ---------------------------------------------------------------------------
  // generateRecommendations
  // ---------------------------------------------------------------------------

  function generateRecommendations(sectorId, selectedTier, adoptionLevel, regulationLevel) {
    var sector = getSector(sectorId);
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);

    var dominantResult = computeDominantImpact(sectorId, selectedTier, regulationLevel);
    var scenarios = evaluateScenarios(sectorId, selectedTier, regulationLevel);
    var level = (adoptionLevel || 'medium').toLowerCase();

    var recs = [];

    // --- Dominant impact recommendation ---
    var dom = dominantResult.dominant;
    var domArr = Array.isArray(dom) ? dom : [dom];

    var dominantRecs = {
      H: 'Map your headcount exposure by role and timeline. Build transition plans for the roles that automate first — retraining, redeployment, or managed attrition.',
      M: 'Your cost structure is compressing industry-wide. Re-baseline operating models now — competitors with AI-native cost structures will undercut your pricing within 18 months.',
      V: 'Your competitors will move 3-5x faster with AI. Match their speed or lose on responsiveness. Mandate AI tool adoption across high-velocity tasks within 90 days.',
      B: 'Your defensible advantages are eroding. Shift competitive moat from knowledge scarcity to proprietary data, trusted relationships, and judgment that AI can\'t replicate.',
      R: 'Your org chart was designed for a pre-AI world. Restructure around AI-augmented pods: fewer layers, smaller teams, higher output per person.'
    };

    for (var d = 0; d < domArr.length; d++) {
      if (dominantRecs[domArr[d]]) {
        recs.push(dominantRecs[domArr[d]]);
      }
    }

    // --- Regulation-specific recommendations ---
    var reg = (regulationLevel || '').toLowerCase();
    if (reg === 'restrictive') {
      recs.push('Compliance is your moat — invest in AI governance infrastructure now. Competitors who treat regulation as overhead will fall behind those who weaponize it as a barrier to entry.');
    } else if (reg === 'fragmented') {
      recs.push('Regulatory arbitrage is your moat — build jurisdiction-flexible operations. The patchwork gives you room to move fast where rules allow and lock in advantages before harmonization.');
    } else if (reg === 'permissive') {
      recs.push('Move now while the field is open — first movers in unregulated spaces set the de facto standards. Build market position before regulation inevitably arrives.');
    } else if (reg === 'supportive') {
      recs.push('Align with government AI initiatives — subsidies, sandboxes, and liability frameworks are your accelerant. Organizations that partner with the state\'s AI agenda get structural advantages.');
    }

    // --- Verification bottleneck ---
    var verifyTask = getTask(VERIFICATION_TASK_ID);
    var verifyH = impactValue(verifyTask, selectedTier, 'H', regulationLevel);
    if (verifyH <= 1) {
      recs.push('Invest in verification infrastructure — as AI does more execution, the ability to check the work becomes your most defensible capability.');
    }

    // --- Scenario-driven recommendations ---
    var scenarioRecs = {
      pyramid_inverts: 'Redesign your talent pipeline — the junior roles that fed your senior pipeline are disappearing. Build new on-ramps or face a senior talent cliff in 3-5 years.',
      price_floor_drops: 'Develop tiered service offerings — AI-automated basic tier, human-premium advisory tier. If you only sell the expensive version, AI-native entrants take the floor.',
      solo_operator: 'Rethink team composition — AI makes individual contributors as productive as small teams. Restructure around capability, not headcount.',
      verification_bottleneck: 'Build or acquire verification capability — as execution commoditizes, the premium shifts to trust, audit, and quality assurance.',
      speed_trap: 'Restructure or die — the velocity gap between AI-native and traditional organizations will become competitively lethal. This isn\'t optional.'
    };

    for (var s = 0; s < scenarios.length; s++) {
      if (scenarios[s].severity !== 'none' && scenarioRecs[scenarios[s].id]) {
        recs.push(scenarioRecs[scenarios[s].id]);
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
      recs.push('Develop a robotics/automation roadmap — physical automation moves slower than cognitive, giving you a longer runway but not an infinite one.');
    }

    // --- Adoption speed recommendation ---
    if (level === 'high') {
      recs.push('Act now — competitive pressure leaves no runway for delayed response.');
    } else if (level === 'low') {
      recs.push('Build capability over 3–5 years — you have time but not unlimited time.');
    } else {
      recs.push('Begin strategic repositioning now; moderate adoption gives you a window, not a wall.');
    }

    return recs;
  }

  // ---------------------------------------------------------------------------
  // computeAll
  // ---------------------------------------------------------------------------

  function computeAll(sectorId, selectedTier, horizon, adoptionLevel, regulationLevel) {
    var sector = getSector(sectorId);
    var score = computeSectorScore(sectorId, selectedTier, adoptionLevel, regulationLevel);
    var timeline = computeTimeline(sectorId, selectedTier, horizon, adoptionLevel, regulationLevel);
    var scenarios = evaluateScenarios(sectorId, selectedTier, regulationLevel);
    var dominant = computeDominantImpact(sectorId, selectedTier, regulationLevel);
    var whatChanges = computeWhatChanges(sectorId, selectedTier, regulationLevel);
    var recommendations = generateRecommendations(sectorId, selectedTier, adoptionLevel, regulationLevel);

    // Risk zone label
    var zone;
    if (score <= 20) zone = 'Resilient';
    else if (score <= 40) zone = 'Adapting';
    else if (score <= 60) zone = 'Transforming';
    else if (score <= 80) zone = 'Disrupting';
    else zone = 'Restructuring';

    // Per-task detail for the sector (kept for backward compat / debug)
    var weights = sector.weights;
    var taskIds = Object.keys(weights).map(Number);
    var regMods = regulationLevel ? REGULATION_MODIFIERS[regulationLevel] : null;
    var taskDetails = taskIds.map(function (tid) {
      var task = getTask(tid);
      var taskScore = computeTaskScore(tid, selectedTier, regulationLevel);
      var impacts = task.impacts[selectedTier] || {};
      var h = impacts.H || 0, m = impacts.M || 0, v = impacts.V || 0, b = impacts.B || 0, r = impacts.R || 0;
      if (regMods) {
        h *= regMods.H; m *= regMods.M; v *= regMods.V; b *= regMods.B; r *= regMods.R;
      }
      return {
        id: tid,
        name: task.name || ('Task ' + tid),
        weight: weights[tid],
        score: taskScore,
        impacts: { H: h, M: m, V: v, B: b, R: r },
      };
    }).sort(function (a, b) {
      return (b.score * b.weight) - (a.score * a.weight);
    });

    return {
      sectorId: sectorId,
      sectorName: sector.name || ('Sector ' + sectorId),
      selectedTier: selectedTier,
      horizon: horizon,
      adoptionLevel: adoptionLevel,
      regulationLevel: regulationLevel,
      score: score,
      zone: zone,
      timeline: timeline,
      dominantImpact: dominant,
      scenarios: scenarios,
      whatChanges: whatChanges,
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
    evaluateScenarios: evaluateScenarios,
    computeDominantImpact: computeDominantImpact,
    computeWhatChanges: computeWhatChanges,
    generateRecommendations: generateRecommendations,
    computeAll: computeAll,
    resetCache: resetCache,
  };
})();
