/**
 * Threshold Analysis — Higher-Order Trigger Proximity Map
 *
 * For every sector/tier combination (16 x 5 = 80), computes:
 *   - Whether each of the three higher-order triggers fires
 *   - The margin (distance to threshold) for each trigger
 *   - The binding sub-condition (which constraint is tightest)
 *   - Whether a single +/-1 impact change can flip the trigger
 *   - The minimal such change if one exists
 *
 * This is the most analytically granular module in the sensitivity suite.
 */

'use strict';

const { engine, data, resetCache, window: win } = require('../shim');
const { deepClone } = require('../utils/clone');

const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];
const ANALYTICAL_TASK_IDS = [13, 14, 15, 16, 17, 18, 19, 20];
const COORDINATION_TASK_IDS = [3, 20, 21, 22, 23, 24];
const IMPACT_KEYS = ['A', 'C', 'P', 'T', 'D'];
const CLIFF_EDGE_THRESHOLD = 0.3;

// ---------------------------------------------------------------------------
// Helpers — read impact values straight from the live data
// ---------------------------------------------------------------------------

function getTask(taskId) {
  return data.TASKS.find(function (t) { return t.id === taskId; });
}

function getSector(sectorId) {
  return data.SECTORS.find(function (s) { return s.id === sectorId; });
}

function impactValue(task, tier, key) {
  var impacts = task.impacts[tier];
  if (!impacts) return 0;
  return impacts[key] || 0;
}

function tierIndex(tier) {
  return TIERS.indexOf(tier);
}

// ---------------------------------------------------------------------------
// Margin computation for each trigger
// ---------------------------------------------------------------------------

/**
 * Scarce Knowledge trigger analysis.
 *
 * Conditions (on analytical tasks 13-20 present in sector):
 *   hwmAvgT >= 2.0   (high-water mark of avg T across T1..selectedTier)
 *   avgA    >= 1.5   (avg A at selectedTier)
 *
 * Margin = min(|hwmAvgT - 2.0|, |avgA - 1.5|)
 * Binding = whichever sub-condition is closer to its threshold
 */
function analyzeScarceKnowledge(sectorId, tier) {
  var sector = getSector(sectorId);
  var taskIds = Object.keys(sector.weights).map(Number);
  var analyticalInSector = taskIds.filter(function (id) {
    return ANALYTICAL_TASK_IDS.indexOf(id) !== -1;
  });

  if (analyticalInSector.length === 0) {
    return {
      id: 'scarce_knowledge',
      triggered: false,
      margin: Infinity,
      bindingCondition: null,
      flippable: false,
      minFlipChange: null,
      _tasks: [],
      _hwmAvgT: 0,
      _avgA: 0,
    };
  }

  var selIdx = tierIndex(tier);

  // High-water mark of avg T across tiers T1..selected
  var hwmAvgT = 0;
  for (var t = 0; t <= selIdx; t++) {
    var sumT = 0;
    for (var i = 0; i < analyticalInSector.length; i++) {
      sumT += impactValue(getTask(analyticalInSector[i]), TIERS[t], 'T');
    }
    var avgT = sumT / analyticalInSector.length;
    if (avgT > hwmAvgT) hwmAvgT = avgT;
  }

  // Avg A at selected tier
  var sumA = 0;
  for (var j = 0; j < analyticalInSector.length; j++) {
    sumA += impactValue(getTask(analyticalInSector[j]), tier, 'A');
  }
  var avgA = sumA / analyticalInSector.length;

  var triggered = hwmAvgT >= 2.0 && avgA >= 1.5;

  var distHwm = Math.abs(hwmAvgT - 2.0);
  var distAvgA = Math.abs(avgA - 1.5);
  var margin = Math.min(distHwm, distAvgA);
  var bindingCondition = distHwm <= distAvgA ? 'hwmAvgT' : 'avgA';

  return {
    id: 'scarce_knowledge',
    triggered: triggered,
    margin: Math.round(margin * 1e6) / 1e6,
    bindingCondition: bindingCondition,
    flippable: false,
    minFlipChange: null,
    _tasks: analyticalInSector,
    _hwmAvgT: hwmAvgT,
    _avgA: avgA,
  };
}

/**
 * Coordination Zero trigger analysis.
 *
 * Condition (on coordination tasks 3,20,21,22,23,24 in sector):
 *   avgMaxAP >= 2.0
 *
 * Margin = |avgMaxAP - 2.0|
 */
function analyzeCoordinationZero(sectorId, tier) {
  var sector = getSector(sectorId);
  var taskIds = Object.keys(sector.weights).map(Number);
  var coordInSector = taskIds.filter(function (id) {
    return COORDINATION_TASK_IDS.indexOf(id) !== -1;
  });

  if (coordInSector.length === 0) {
    return {
      id: 'coordination_zero',
      triggered: false,
      margin: Infinity,
      bindingCondition: null,
      flippable: false,
      minFlipChange: null,
      _tasks: [],
      _avgMaxAP: 0,
    };
  }

  var sumMaxAP = 0;
  for (var i = 0; i < coordInSector.length; i++) {
    var task = getTask(coordInSector[i]);
    var a = impactValue(task, tier, 'A');
    var p = impactValue(task, tier, 'P');
    sumMaxAP += Math.max(a, p);
  }
  var avgMaxAP = sumMaxAP / coordInSector.length;

  var triggered = avgMaxAP >= 2.0;
  var margin = Math.abs(avgMaxAP - 2.0);

  return {
    id: 'coordination_zero',
    triggered: triggered,
    margin: Math.round(margin * 1e6) / 1e6,
    bindingCondition: null,
    flippable: false,
    minFlipChange: null,
    _tasks: coordInSector,
    _avgMaxAP: avgMaxAP,
  };
}

/**
 * Unbundling trigger analysis.
 *
 * Conditions (all sector tasks):
 *   avgA       >= 1.5   (avg A across all sector tasks at selected tier)
 *   task 34 A  <= 1
 *   task 27 A  <= 1
 *
 * Margin = min of sub-condition distances:
 *   |avgA - 1.5|
 *   For task 34/27: if A <= 1 (condition met), distance = |A - 1.01|
 *                   if A > 1  (condition not met), distance = |A - 1|
 */
function analyzeUnbundling(sectorId, tier) {
  var sector = getSector(sectorId);
  var taskIds = Object.keys(sector.weights).map(Number);

  if (taskIds.length === 0) {
    return {
      id: 'unbundling',
      triggered: false,
      margin: Infinity,
      bindingCondition: null,
      flippable: false,
      minFlipChange: null,
      _tasks: [],
      _avgA: 0,
      _task34A: 0,
      _task27A: 0,
    };
  }

  var sumA = 0;
  for (var i = 0; i < taskIds.length; i++) {
    sumA += impactValue(getTask(taskIds[i]), tier, 'A');
  }
  var avgA = sumA / taskIds.length;

  var task34A = impactValue(getTask(34), tier, 'A');
  var task27A = impactValue(getTask(27), tier, 'A');

  var triggered = avgA >= 1.5 && task34A <= 1 && task27A <= 1;

  var distAvgA = Math.abs(avgA - 1.5);

  // Distance for the <= 1 conditions
  var dist34 = task34A <= 1 ? Math.abs(task34A - 1.01) : Math.abs(task34A - 1);
  var dist27 = task27A <= 1 ? Math.abs(task27A - 1.01) : Math.abs(task27A - 1);

  var margin = Math.min(distAvgA, dist34, dist27);

  // Determine binding condition
  var bindingCondition = 'avgA';
  if (margin === dist34) bindingCondition = 'task34A';
  else if (margin === dist27) bindingCondition = 'task27A';
  else bindingCondition = 'avgA';

  return {
    id: 'unbundling',
    triggered: triggered,
    margin: Math.round(margin * 1e6) / 1e6,
    bindingCondition: bindingCondition,
    flippable: false,
    minFlipChange: null,
    _tasks: taskIds,
    _avgA: avgA,
    _task34A: task34A,
    _task27A: task27A,
  };
}

// ---------------------------------------------------------------------------
// Flip detection — can a single +/-1 impact change toggle the trigger?
// ---------------------------------------------------------------------------

/**
 * Temporarily mutate a single impact value at a specific tier, reset engine
 * cache, re-evaluate the trigger, then restore original data.
 *
 * Returns the new triggered state.
 */
function testFlip(taskId, tier, impactKey, delta, sectorId, evaluateFn) {
  var task = win.DiagnosticData.TASKS.find(function (t) { return t.id === taskId; });
  if (!task || !task.impacts[tier]) return null;

  var oldVal = task.impacts[tier][impactKey] || 0;
  var newVal = Math.max(0, Math.min(3, oldVal + delta));

  // No-op if clamped to same value
  if (newVal === oldVal) return null;

  // Mutate
  task.impacts[tier][impactKey] = newVal;
  resetCache();

  var result = evaluateFn(sectorId, tier);

  // Restore
  task.impacts[tier][impactKey] = oldVal;
  resetCache();

  return result;
}

/**
 * For a given trigger analysis result, find the minimum single +/-1 impact
 * change that flips the trigger.
 *
 * Strategy: test every relevant task/impact-key/tier combination.
 */
function findMinFlip(analysis, sectorId, tier) {
  var currentState = analysis.triggered;
  var candidates = [];
  var triggerId = analysis.id;

  // Determine which evaluator to use and which tasks/keys to probe
  var evaluateFn;
  var probeTaskIds;
  var probeKeys;
  var probeTiers;

  if (triggerId === 'scarce_knowledge') {
    evaluateFn = function (sid, t) {
      var res = engine.evaluateHigherOrderImpacts(sid, t);
      return res[0].triggered;
    };
    probeTaskIds = analysis._tasks;
    // T affects hwmAvgT across tiers T1..selected, A affects avgA at selected tier
    probeKeys = ['T', 'A'];
    // For T, need to probe all tiers up to selected; for A, only selected tier
    var selIdx = tierIndex(tier);
    probeTiers = TIERS.slice(0, selIdx + 1);
  } else if (triggerId === 'coordination_zero') {
    evaluateFn = function (sid, t) {
      var res = engine.evaluateHigherOrderImpacts(sid, t);
      return res[1].triggered;
    };
    probeTaskIds = analysis._tasks;
    probeKeys = ['A', 'P'];
    probeTiers = [tier];
  } else if (triggerId === 'unbundling') {
    evaluateFn = function (sid, t) {
      var res = engine.evaluateHigherOrderImpacts(sid, t);
      return res[2].triggered;
    };
    // Probe sector tasks for avgA, plus tasks 34 and 27 specifically
    probeTaskIds = analysis._tasks.slice();
    if (probeTaskIds.indexOf(34) === -1) probeTaskIds.push(34);
    if (probeTaskIds.indexOf(27) === -1) probeTaskIds.push(27);
    probeKeys = ['A'];
    probeTiers = [tier];
  }

  var deltas = [+1, -1];

  for (var ti = 0; ti < probeTiers.length; ti++) {
    var probeTier = probeTiers[ti];
    for (var pi = 0; pi < probeTaskIds.length; pi++) {
      var taskId = probeTaskIds[pi];
      for (var ki = 0; ki < probeKeys.length; ki++) {
        var key = probeKeys[ki];
        for (var di = 0; di < deltas.length; di++) {
          var delta = deltas[di];
          var flipped = testFlip(taskId, probeTier, key, delta, sectorId, evaluateFn);

          if (flipped !== null && flipped !== currentState) {
            var task = getTask(taskId);
            candidates.push({
              taskId: taskId,
              taskName: task.name || ('Task ' + taskId),
              impactKey: key,
              tier: probeTier,
              delta: delta,
            });
          }
        }
      }
    }
  }

  if (candidates.length === 0) return null;

  // Return the first candidate found — they're all single-step flips.
  // Prefer changes at the selected tier, then by smallest task ID for stability.
  candidates.sort(function (a, b) {
    if (a.tier === tier && b.tier !== tier) return -1;
    if (b.tier === tier && a.tier !== tier) return 1;
    return a.taskId - b.taskId;
  });

  var best = candidates[0];
  return {
    taskId: best.taskId,
    taskName: best.taskName,
    impactKey: best.impactKey,
    delta: best.delta,
  };
}

// ---------------------------------------------------------------------------
// Main analysis
// ---------------------------------------------------------------------------

function run() {
  resetCache();

  var sectors = data.SECTORS;
  var thresholds = [];
  var cliffEdges = [];
  var totalRuns = 0;

  for (var si = 0; si < sectors.length; si++) {
    var sector = sectors[si];

    for (var ti = 0; ti < TIERS.length; ti++) {
      var tier = TIERS[ti];
      totalRuns++;

      // Compute margin analysis for each trigger
      var sk = analyzeScarceKnowledge(sector.id, tier);
      var cz = analyzeCoordinationZero(sector.id, tier);
      var ub = analyzeUnbundling(sector.id, tier);

      var analyses = [sk, cz, ub];

      // Find minimum flip for each trigger
      for (var ai = 0; ai < analyses.length; ai++) {
        var a = analyses[ai];
        if (a._tasks.length === 0) continue;

        var flipResult = findMinFlip(a, sector.id, tier);
        a.flippable = flipResult !== null;
        a.minFlipChange = flipResult;
      }

      // Build clean output triggers (strip internal fields)
      var triggers = analyses.map(function (a) {
        return {
          id: a.id,
          triggered: a.triggered,
          margin: a.margin,
          bindingCondition: a.bindingCondition,
          flippable: a.flippable,
          minFlipChange: a.minFlipChange,
        };
      });

      thresholds.push({
        sectorId: sector.id,
        sectorName: sector.name,
        tier: tier,
        triggers: triggers,
      });

      // Collect cliff edges — triggers within CLIFF_EDGE_THRESHOLD of boundary
      for (var ci = 0; ci < triggers.length; ci++) {
        var trig = triggers[ci];
        if (trig.margin !== Infinity && trig.margin <= CLIFF_EDGE_THRESHOLD) {
          cliffEdges.push({
            sectorName: sector.name,
            tier: tier,
            triggerId: trig.id,
            margin: trig.margin,
            triggered: trig.triggered,
          });
        }
      }
    }
  }

  // Sort cliff edges by margin ascending (most precarious first)
  cliffEdges.sort(function (a, b) {
    return a.margin - b.margin;
  });

  return {
    name: 'Threshold Analysis',
    totalRuns: totalRuns,
    thresholds: thresholds,
    cliffEdges: cliffEdges,
  };
}

module.exports = { run: run };
