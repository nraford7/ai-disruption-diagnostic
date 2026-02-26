/**
 * Weight Sensitivity Analysis
 *
 * For each sector, perturb each task weight by +/-2%, +/-5%, +/-10%,
 * re-normalizing remaining weights. Run across all 5 tiers to measure
 * how score responds to weight changes.
 */

'use strict';

const { engine, data, resetCache, window: win } = require('../shim');
const { deepClone } = require('../utils/clone');
const { perturbWeight, TIERS } = require('../utils/perturbation');

const DELTAS = [-0.10, -0.05, -0.02, 0.02, 0.05, 0.10];
const ADOPTION = 'medium';
const HORIZON = 'H2';

const ZONE_THRESHOLDS = [
  [0, 20, 'Resilient'],
  [21, 40, 'Adapting'],
  [41, 60, 'Transforming'],
  [61, 80, 'Disrupting'],
  [81, 100, 'Restructuring'],
];

function scoreToZone(score) {
  for (const [lo, hi, label] of ZONE_THRESHOLDS) {
    if (score >= lo && score <= hi) return label;
  }
  return 'Unknown';
}

function getTaskName(taskId) {
  const task = data.TASKS.find(t => t.id === Number(taskId));
  return task ? task.name : 'Task ' + taskId;
}

function run() {
  const sectors = data.SECTORS;
  const sectorResults = [];
  let totalRuns = 0;

  // Snapshot original sector data for restoration
  const originalSectors = deepClone(win.DiagnosticData.SECTORS);

  for (const sector of sectors) {
    const taskEntries = [];
    const weightKeys = Object.keys(sector.weights);

    // Compute baselines for all tiers
    const baselines = {};
    for (const tier of TIERS) {
      const result = engine.computeAll(sector.id, tier, HORIZON, ADOPTION);
      baselines[tier] = { score: result.score, zone: result.zone };
    }

    for (const taskId of weightKeys) {
      const baseWeight = sector.weights[taskId];
      const details = [];
      const absSensitivities = [];
      let maxScoreChange = 0;
      let kingmaker = false;

      for (const delta of DELTAS) {
        const perturbedWeights = perturbWeight(sector.weights, taskId, delta);

        for (const tier of TIERS) {
          totalRuns++;

          // Swap perturbed weights into the live data
          const sectorRef = win.DiagnosticData.SECTORS.find(s => s.id === sector.id);
          const savedWeights = sectorRef.weights;
          sectorRef.weights = perturbedWeights;
          resetCache();

          const result = engine.computeAll(sector.id, tier, HORIZON, ADOPTION);
          const newScore = result.score;

          // Restore immediately
          sectorRef.weights = savedWeights;
          resetCache();

          const baseScore = baselines[tier].score;
          const scoreChange = newScore - baseScore;
          const baseZone = baselines[tier].zone;
          const newZone = scoreToZone(newScore);

          if (baseZone !== newZone) {
            kingmaker = true;
          }

          const absChange = Math.abs(scoreChange);
          if (absChange > maxScoreChange) {
            maxScoreChange = absChange;
          }

          // Sensitivity: |score change| per 1% weight change
          const absDelta = Math.abs(delta);
          if (absDelta > 0) {
            absSensitivities.push(absChange / (absDelta * 100));
          }

          // Only store details where change is meaningful
          if (absChange > 0.1) {
            details.push({
              delta,
              tier,
              baseScore: Math.round(baseScore * 1000) / 1000,
              newScore: Math.round(newScore * 1000) / 1000,
              scoreChange: Math.round(scoreChange * 1000) / 1000,
              baseZone,
              newZone,
            });
          }
        }
      }

      const sensitivity = absSensitivities.length > 0
        ? absSensitivities.reduce((a, b) => a + b, 0) / absSensitivities.length
        : 0;

      taskEntries.push({
        taskId: Number(taskId),
        taskName: getTaskName(taskId),
        baseWeight,
        sensitivity: Math.round(sensitivity * 10000) / 10000,
        maxScoreChange: Math.round(maxScoreChange * 1000) / 1000,
        kingmaker,
        details,
      });
    }

    // Sort tasks by sensitivity descending
    taskEntries.sort((a, b) => b.sensitivity - a.sensitivity);

    sectorResults.push({
      sectorId: sector.id,
      sectorName: sector.name,
      tasks: taskEntries,
    });
  }

  // Restore original sectors fully (belt and suspenders)
  win.DiagnosticData.SECTORS = originalSectors;
  resetCache();

  // Top 20 influencers across all sectors
  const allPairs = [];
  for (const sr of sectorResults) {
    for (const task of sr.tasks) {
      allPairs.push({
        sectorName: sr.sectorName,
        taskName: task.taskName,
        sensitivity: task.sensitivity,
        maxScoreChange: task.maxScoreChange,
      });
    }
  }
  allPairs.sort((a, b) => b.sensitivity - a.sensitivity);
  const topInfluencers = allPairs.slice(0, 20);

  return {
    name: 'Weight Sensitivity',
    totalRuns,
    sectors: sectorResults,
    topInfluencers,
  };
}

module.exports = { run };
