/**
 * Dominant Impact Stability Analysis
 *
 * For each sector/tier combo (16x5=80), measures the gap between #1 and #2
 * impact type and finds the minimum perturbation (single +/-1 change to any
 * task impact value) that would flip which impact type is dominant.
 */

'use strict';

const { engine, data, resetCache, window: win } = require('../shim');
const { deepClone } = require('../utils/clone');

const IMPACT_KEYS = ['A', 'C', 'P', 'T', 'D'];
const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];

function run() {
  const sectors = data.SECTORS;
  const results = [];
  let totalRuns = 0;

  for (let s = 0; s < sectors.length; s++) {
    const sector = sectors[s];
    const taskIds = Object.keys(sector.weights).map(Number);

    for (let t = 0; t < TIERS.length; t++) {
      const tier = TIERS[t];

      // 1. Baseline
      const baseline = engine.computeDominantImpact(sector.id, tier);
      const scores = baseline.scores;
      totalRuns++;

      // 2. Sort scores descending
      const sorted = IMPACT_KEYS.slice().sort((a, b) => scores[b] - scores[a]);
      const top = sorted[0];
      const second = sorted[1];
      const margin = +(scores[top] - scores[second]).toFixed(6);
      const isCoDominant = margin < 0.3;
      const dominantLabel = isCoDominant ? top + '/' + second : top;

      // 3. Find minimum perturbation to flip dominance
      let minFlip = null;

      // Only keys worth testing: increase second's key, decrease top's key
      const keysToTest = new Set();
      keysToTest.add(second); // bump #2 up
      keysToTest.add(top);    // push #1 down

      // Save original TASKS for restoration
      const originalTasks = deepClone(win.DiagnosticData.TASKS);

      for (let ti = 0; ti < taskIds.length; ti++) {
        const taskId = taskIds[ti];
        const taskIndex = win.DiagnosticData.TASKS.findIndex(tk => tk.id === taskId);
        if (taskIndex === -1) continue;

        for (const key of keysToTest) {
          for (const delta of [+1, -1]) {
            // Only test changes that could close the gap
            // Increasing second or decreasing top
            if (key === second && delta === -1) continue; // lowers #2, widens gap
            if (key === top && delta === +1) continue;    // raises #1, widens gap

            const original = win.DiagnosticData.TASKS[taskIndex].impacts[tier][key];
            const newVal = original + delta;
            if (newVal < 0 || newVal > 3) continue; // stay in valid range

            // Mutate
            win.DiagnosticData.TASKS[taskIndex].impacts[tier][key] = newVal;
            resetCache();

            const perturbed = engine.computeDominantImpact(sector.id, tier);
            totalRuns++;

            // Check if dominant changed
            const newDom = Array.isArray(perturbed.dominant)
              ? perturbed.dominant.join('/')
              : perturbed.dominant;
            const baseDom = dominantLabel;

            if (newDom !== baseDom) {
              const taskObj = data.TASKS.find(tk => tk.id === taskId);
              const candidate = {
                taskId,
                taskName: taskObj ? taskObj.name : 'Task ' + taskId,
                impactKey: key,
                delta,
                newDominant: newDom,
              };

              if (!minFlip) {
                minFlip = candidate;
              }
              // Prefer single-key dominant over co-dominant flip
              // and prefer smaller absolute margin change
            }

            // Restore
            win.DiagnosticData.TASKS[taskIndex].impacts[tier][key] = original;
            resetCache();
          }
        }
      }

      // Full restore as safety net
      win.DiagnosticData.TASKS = originalTasks;
      resetCache();

      results.push({
        sectorId: sector.id,
        sectorName: sector.name,
        tier,
        dominant: dominantLabel,
        scores,
        margin,
        isCoDominant,
        flippable: minFlip !== null,
        minFlip,
      });
    }
  }

  // Unstable: margin < 0.3
  const unstable = results
    .filter(r => r.margin < 0.3)
    .map(r => ({
      sectorName: r.sectorName,
      tier: r.tier,
      dominant: r.dominant,
      margin: r.margin,
    }));

  // Narrative risks: flippable cases where the story could change with minimal data change
  const narrativeRisks = results
    .filter(r => r.flippable && r.minFlip)
    .map(r => {
      const from = r.dominant.includes('/') ? r.dominant.split('/')[0] : r.dominant;
      return {
        sectorName: r.sectorName,
        tier: r.tier,
        from,
        to: r.minFlip.newDominant,
        margin: r.margin,
      };
    });

  return {
    name: 'Dominant Impact Stability',
    totalRuns,
    results,
    unstable,
    narrativeRisks,
  };
}

module.exports = { run };
