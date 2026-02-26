/**
 * Monte Carlo Stress Test — simultaneous random perturbation of all weights
 * and all impact scores across every sector.
 *
 * Each iteration: perturb every impact value (±1, clamped [0,3]) and every
 * sector weight (×random factor in [0.8,1.2], re-normalized), then compute
 * all 16 sectors at T3/medium.
 */

'use strict';

const { engine, data, resetCache, window: win } = require('../shim');
const { deepClone } = require('../utils/clone');
const { randomPerturbWeights, randomPerturbImpacts } = require('../utils/perturbation');
const { mean, stdev, percentile, min, max, median } = require('../utils/stats');

const ZONE_THRESHOLDS = [
  [0, 20, 'Resilient'],
  [21, 40, 'Adapting'],
  [41, 60, 'Transforming'],
  [61, 80, 'Disrupting'],
  [81, 100, 'Restructuring'],
];

const ZONE_NAMES = ZONE_THRESHOLDS.map(z => z[2]);

function scoreToZone(score) {
  for (const [lo, hi, label] of ZONE_THRESHOLDS) {
    if (score >= lo && score <= hi) return label;
  }
  return 'Unknown';
}

function run({ iterations = 5000 } = {}) {
  const sectors = data.SECTORS;
  const numSectors = sectors.length;

  // Save originals
  const origTasks = deepClone(win.DiagnosticData.TASKS);
  const origSectors = deepClone(win.DiagnosticData.SECTORS);

  // Compute baseline scores (unperturbed, T3/medium)
  const baselineScores = {};
  for (const sector of sectors) {
    const result = engine.computeAll(sector.id, 'T3', 'H2', 'medium');
    baselineScores[sector.id] = result.score;
  }

  // Accumulate scores per sector: sectorId -> number[]
  const scoreAccum = {};
  for (const sector of sectors) {
    scoreAccum[sector.id] = [];
  }

  for (let i = 0; i < iterations; i++) {
    // Progress logging
    if (i > 0 && i % 1000 === 0) {
      process.stderr.write(`Monte Carlo: ${i} / ${iterations} iterations\n`);
    }

    // 1. Perturb all impact scores
    const perturbedTasks = randomPerturbImpacts(origTasks, 1);

    // 2. Build perturbed sectors with randomized weights
    const perturbedSectors = deepClone(origSectors);
    for (const sector of perturbedSectors) {
      sector.weights = randomPerturbWeights(sector.weights, 0.8, 1.2);
    }

    // 3. Apply mutations to the shared sandbox
    win.DiagnosticData.TASKS = perturbedTasks;
    win.DiagnosticData.SECTORS = perturbedSectors;
    resetCache();

    // 4. Score all 16 sectors at T3/medium
    for (const sector of perturbedSectors) {
      const result = engine.computeAll(sector.id, 'T3', 'H2', 'medium');
      scoreAccum[sector.id].push(result.score);
    }

    // 5. Restore originals
    win.DiagnosticData.TASKS = deepClone(origTasks);
    win.DiagnosticData.SECTORS = deepClone(origSectors);
    resetCache();
  }

  // Build per-sector results
  const sectorResults = sectors.map(sector => {
    const scores = scoreAccum[sector.id];

    // Zone probability distribution
    const zoneCounts = {};
    for (const name of ZONE_NAMES) zoneCounts[name] = 0;
    for (const s of scores) {
      zoneCounts[scoreToZone(s)]++;
    }
    const zoneProbs = {};
    for (const name of ZONE_NAMES) {
      zoneProbs[name] = +(zoneCounts[name] / iterations).toFixed(4);
    }

    const p5 = percentile(scores, 5);
    const p95 = percentile(scores, 95);

    return {
      sectorId: sector.id,
      sectorName: sector.name,
      baselineScore: baselineScores[sector.id],
      distribution: {
        mean: +mean(scores).toFixed(2),
        stdev: +stdev(scores).toFixed(2),
        median: +median(scores).toFixed(2),
        p5: +p5.toFixed(2),
        p25: +percentile(scores, 25).toFixed(2),
        p75: +percentile(scores, 75).toFixed(2),
        p95: +p95.toFixed(2),
        min: min(scores),
        max: max(scores),
      },
      zoneProbs,
      ci95: [+p5.toFixed(2), +p95.toFixed(2)],
    };
  });

  const overallVolatility = +(
    mean(sectorResults.map(s => s.distribution.stdev))
  ).toFixed(2);

  process.stderr.write(`Monte Carlo: ${iterations} / ${iterations} iterations — done\n`);

  return {
    name: 'Monte Carlo Stress Test',
    iterations,
    totalRuns: iterations * numSectors,
    sectors: sectorResults,
    overallVolatility,
  };
}

module.exports = { run };
