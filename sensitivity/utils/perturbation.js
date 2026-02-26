/**
 * Weight and impact mutation helpers for sensitivity analysis.
 */

'use strict';

const { deepClone } = require('./clone');

const IMPACT_KEYS = ['A', 'C', 'P', 'T', 'D'];
const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];

/**
 * Perturb a single task weight in a sector, re-normalizing remaining weights.
 * Returns a new weights object (does not mutate input).
 *
 * @param {Object} weights - Original sector weights { taskId: decimal }
 * @param {number|string} taskId - Task to perturb
 * @param {number} delta - Fractional change (e.g., 0.05 for +5%)
 * @returns {Object} New weights object
 */
function perturbWeight(weights, taskId, delta) {
  const newWeights = deepClone(weights);
  const tid = String(taskId);

  if (!(tid in newWeights)) return newWeights;

  const oldVal = newWeights[tid];
  const newVal = Math.max(0, oldVal + delta);
  newWeights[tid] = newVal;

  // Re-normalize: all other weights scale proportionally
  const otherSum = Object.keys(newWeights)
    .filter(k => k !== tid)
    .reduce((s, k) => s + newWeights[k], 0);

  if (otherSum > 0) {
    const targetOther = 1 - newVal;
    const scale = targetOther / otherSum;
    for (const k of Object.keys(newWeights)) {
      if (k !== tid) newWeights[k] *= scale;
    }
  }

  return newWeights;
}

/**
 * Perturb a single impact value across all tiers for a task.
 * Returns a new TASKS array with the mutation applied.
 *
 * @param {Array} tasks - Original TASKS array
 * @param {number} taskId - Task to mutate
 * @param {string} impactKey - One of A, C, P, T, D
 * @param {number} delta - Change to apply (e.g., +1 or -1)
 * @returns {Array} New TASKS array
 */
function perturbImpact(tasks, taskId, impactKey, delta) {
  const newTasks = deepClone(tasks);
  const task = newTasks.find(t => t.id === taskId);
  if (!task) return newTasks;

  for (const tier of TIERS) {
    if (task.impacts[tier]) {
      const oldVal = task.impacts[tier][impactKey] || 0;
      task.impacts[tier][impactKey] = Math.max(0, Math.min(3, oldVal + delta));
    }
  }

  return newTasks;
}

/**
 * Perturb a single impact value at a specific tier for a task.
 * Returns a new TASKS array.
 */
function perturbImpactAtTier(tasks, taskId, tier, impactKey, delta) {
  const newTasks = deepClone(tasks);
  const task = newTasks.find(t => t.id === taskId);
  if (!task || !task.impacts[tier]) return newTasks;

  const oldVal = task.impacts[tier][impactKey] || 0;
  task.impacts[tier][impactKey] = Math.max(0, Math.min(3, oldVal + delta));
  return newTasks;
}

/**
 * Apply random perturbations to all weights in a sector.
 * Each weight multiplied by a random factor in [lo, hi], then re-normalized.
 */
function randomPerturbWeights(weights, lo, hi) {
  const newWeights = {};
  let total = 0;
  for (const k of Object.keys(weights)) {
    const factor = lo + Math.random() * (hi - lo);
    newWeights[k] = Math.max(0, weights[k] * factor);
    total += newWeights[k];
  }
  // Re-normalize
  if (total > 0) {
    for (const k of Object.keys(newWeights)) {
      newWeights[k] /= total;
    }
  }
  return newWeights;
}

/**
 * Apply random perturbations to all impact scores.
 * Each value shifted by delta in [-maxDelta, +maxDelta], clamped [0,3], rounded to int.
 */
function randomPerturbImpacts(tasks, maxDelta) {
  const newTasks = deepClone(tasks);
  for (const task of newTasks) {
    for (const tier of TIERS) {
      if (task.impacts[tier]) {
        for (const key of IMPACT_KEYS) {
          const oldVal = task.impacts[tier][key] || 0;
          const delta = Math.round((Math.random() * 2 - 1) * maxDelta);
          task.impacts[tier][key] = Math.max(0, Math.min(3, oldVal + delta));
        }
      }
    }
  }
  return newTasks;
}

module.exports = {
  perturbWeight,
  perturbImpact,
  perturbImpactAtTier,
  randomPerturbWeights,
  randomPerturbImpacts,
  IMPACT_KEYS,
  TIERS,
};
