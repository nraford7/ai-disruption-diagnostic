/**
 * Impact Score Sensitivity — per-value perturbation analysis.
 *
 * For each of the 875 impact values (35 tasks × 5 tiers × 5 keys),
 * perturb by ±1 at T3/medium and measure cross-sector score change.
 *
 * ~875 × 2 × 16 ≈ 28,000 engine calls.
 */

'use strict';

const { engine, data, resetCache, window: win } = require('../shim');
const { deepClone } = require('../utils/clone');
const { mean, max: statMax } = require('../utils/stats');

const IMPACT_KEYS = ['A', 'C', 'P', 'T', 'D'];
const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];
const TIER = 'T3';
const ADOPTION = 'medium';
const CLAMP_MIN = 0;
const CLAMP_MAX = 3;
const SIGNIFICANCE_THRESHOLD = 0.5;

/**
 * Get scores for all 16 sectors at T3/medium.
 * Returns Map<sectorId, { sectorId, sectorName, score }>.
 */
function getAllSectorScores(sectors) {
  const scores = new Map();
  for (const sector of sectors) {
    const score = engine.computeSectorScore(sector.id, TIER, ADOPTION);
    scores.set(sector.id, { sectorId: sector.id, sectorName: sector.name, score });
  }
  return scores;
}

/**
 * Compute deltas between perturbed and baseline scores.
 * Returns sorted by absolute delta descending.
 */
function computeDeltas(baseline, perturbed) {
  const deltas = [];
  for (const [sectorId, base] of baseline) {
    const pert = perturbed.get(sectorId);
    deltas.push({
      sectorId: base.sectorId,
      sectorName: base.sectorName,
      delta: +(pert.score - base.score).toFixed(6),
    });
  }
  deltas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return deltas;
}

function run() {
  const sectors = data.SECTORS;
  const origTasks = deepClone(win.DiagnosticData.TASKS);

  // Baseline scores at T3/medium
  resetCache();
  const baseline = getAllSectorScores(sectors);

  // Identify global min/max for normalization fragility
  let globalMinSector = null;
  let globalMaxSector = null;
  const rawScores = [];

  for (const sector of sectors) {
    // Raw score at T1 (potential global min) and T5 (potential global max)
    const rawT1 = engine.computeSectorScore(sector.id, 'T1', 'high');
    const rawT5 = engine.computeSectorScore(sector.id, 'T5', 'high');
    rawScores.push({ sectorId: sector.id, sectorName: sector.name, rawT1, rawT5 });
  }

  // Use raw sector scores at high adoption to approximate boundaries
  // (high adoption = 1.0 multiplier, closest to raw)
  const minEntry = rawScores.reduce((a, b) => a.rawT1 < b.rawT1 ? a : b);
  const maxEntry = rawScores.reduce((a, b) => a.rawT5 > b.rawT5 ? a : b);

  globalMinSector = { sectorId: minEntry.sectorId, sectorName: minEntry.sectorName, rawScore: minEntry.rawT1 };
  globalMaxSector = { sectorId: maxEntry.sectorId, sectorName: maxEntry.sectorName, rawScore: maxEntry.rawT5 };

  const nearMinSectors = rawScores
    .filter(r => Math.abs(r.rawT1 - minEntry.rawT1) <= 0.01 && r.sectorId !== minEntry.sectorId)
    .map(r => ({ sectorId: r.sectorId, sectorName: r.sectorName, rawScore: r.rawT1 }));

  const nearMaxSectors = rawScores
    .filter(r => Math.abs(r.rawT5 - maxEntry.rawT5) <= 0.01 && r.sectorId !== maxEntry.sectorId)
    .map(r => ({ sectorId: r.sectorId, sectorName: r.sectorName, rawScore: r.rawT5 }));

  // Build a set of (taskId, tier) pairs that sit at the global min/max boundary
  // These are the tasks/tiers that define the normalization range
  const boundaryTaskIds = new Set();
  // Tasks weighted heavily in the global min sector at T1 or global max sector at T5
  const minSector = sectors.find(s => s.id === minEntry.sectorId);
  const maxSector = sectors.find(s => s.id === maxEntry.sectorId);
  if (minSector) {
    for (const tid of Object.keys(minSector.weights)) boundaryTaskIds.add(Number(tid));
  }
  if (maxSector) {
    for (const tid of Object.keys(maxSector.weights)) boundaryTaskIds.add(Number(tid));
  }

  // Main perturbation loop
  const impactValues = [];
  let totalRuns = 0;

  for (const task of origTasks) {
    for (const tier of TIERS) {
      for (const key of IMPACT_KEYS) {
        const original = (task.impacts[tier] && task.impacts[tier][key]) || 0;

        let plusOneResult = null;
        let minusOneResult = null;

        // +1 perturbation
        const upVal = Math.min(original + 1, CLAMP_MAX);
        if (upVal !== original) {
          // Mutate
          const taskRef = win.DiagnosticData.TASKS.find(t => t.id === task.id);
          taskRef.impacts[tier][key] = upVal;
          resetCache();

          const perturbed = getAllSectorScores(sectors);
          totalRuns += sectors.length;

          const deltas = computeDeltas(baseline, perturbed);
          const absDels = deltas.map(d => Math.abs(d.delta));
          plusOneResult = {
            maxChange: +statMax(absDels).toFixed(6),
            avgChange: +mean(absDels).toFixed(6),
            sectorChanges: deltas.slice(0, 5),
          };

          // Restore
          taskRef.impacts[tier][key] = original;
          resetCache();
        }

        // -1 perturbation
        const downVal = Math.max(original - 1, CLAMP_MIN);
        if (downVal !== original) {
          const taskRef = win.DiagnosticData.TASKS.find(t => t.id === task.id);
          taskRef.impacts[tier][key] = downVal;
          resetCache();

          const perturbed = getAllSectorScores(sectors);
          totalRuns += sectors.length;

          const deltas = computeDeltas(baseline, perturbed);
          const absDels = deltas.map(d => Math.abs(d.delta));
          minusOneResult = {
            maxChange: +statMax(absDels).toFixed(6),
            avgChange: +mean(absDels).toFixed(6),
            sectorChanges: deltas.slice(0, 5),
          };

          // Restore
          taskRef.impacts[tier][key] = original;
          resetCache();
        }

        // Compute max cross-sector change
        const maxUp = plusOneResult ? plusOneResult.maxChange : 0;
        const maxDown = minusOneResult ? minusOneResult.maxChange : 0;
        const maxCrossSectorChange = Math.max(maxUp, maxDown);

        // Normalization sensitivity: does this task contribute to a boundary sector?
        const normalizationSensitive = boundaryTaskIds.has(task.id);

        const entry = {
          taskId: task.id,
          taskName: task.name,
          tier,
          impactKey: key,
          originalValue: original,
          plusOne: plusOneResult,
          minusOne: minusOneResult,
          maxCrossSectorChange: +maxCrossSectorChange.toFixed(6),
          normalizationSensitive,
        };

        impactValues.push(entry);
      }
    }
  }

  // Sort by maxCrossSectorChange descending
  impactValues.sort((a, b) => b.maxCrossSectorChange - a.maxCrossSectorChange);

  // Top 20
  const top20 = impactValues.slice(0, 20);

  // Filter full array to significant entries only
  const significant = impactValues.filter(v => v.maxCrossSectorChange > SIGNIFICANCE_THRESHOLD);

  // Ensure data is fully restored
  win.DiagnosticData.TASKS = deepClone(origTasks);
  resetCache();

  return {
    name: 'Impact Score Sensitivity',
    totalRuns,
    impactValues: significant,
    top20,
    normalizationFragility: {
      globalMinSector,
      globalMaxSector,
      nearMinSectors,
      nearMaxSectors,
    },
  };
}

module.exports = { run };
