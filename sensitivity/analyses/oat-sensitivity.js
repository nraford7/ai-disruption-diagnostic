/**
 * One-at-a-Time (OAT) Parametric Sensitivity Analysis
 *
 * Sweeps each input parameter independently while holding others fixed,
 * from three baselines (low / mid / high disruption scenarios).
 * Measures leverage (max - min) and nonlinearity (max |2nd derivative|)
 * for each parameter sweep.
 */

'use strict';

const { engine, data, resetCache } = require('../shim');
const { mean, min, max } = require('../utils/stats');

const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];
const HORIZONS = ['H1', 'H2', 'H3', 'H4'];
const ADOPTIONS = ['low', 'medium', 'high'];

/**
 * Compute the max absolute second derivative across an ordered numeric sweep.
 * Returns 0 for sweeps with fewer than 3 points.
 */
function computeNonlinearity(scores) {
  if (scores.length < 3) return 0;
  let maxD2 = 0;
  for (let i = 1; i < scores.length - 1; i++) {
    const d2 = Math.abs(scores[i + 1] - 2 * scores[i] + scores[i - 1]);
    if (d2 > maxD2) maxD2 = d2;
  }
  return maxD2;
}

/**
 * Build the three baselines by scoring all 16 sectors at T3/medium,
 * then picking lowest, median, and highest.
 */
function buildBaselines(sectors) {
  const scored = sectors.map(function (s) {
    return { id: s.id, name: s.name, score: engine.computeSectorScore(s.id, 'T3', 'medium') };
  }).sort(function (a, b) { return a.score - b.score; });

  const lo = scored[0];
  const hi = scored[scored.length - 1];
  const midIdx = Math.floor(scored.length / 2);
  const md = scored[midIdx];

  return {
    low: {
      sectorId: lo.id, sectorName: lo.name,
      tier: 'T1', horizon: 'H4', adoption: 'low',
      baseScore: engine.computeSectorScore(lo.id, 'T1', 'low')
    },
    mid: {
      sectorId: md.id, sectorName: md.name,
      tier: 'T3', horizon: 'H2', adoption: 'medium',
      baseScore: engine.computeSectorScore(md.id, 'T3', 'medium')
    },
    high: {
      sectorId: hi.id, sectorName: hi.name,
      tier: 'T5', horizon: 'H1', adoption: 'high',
      baseScore: engine.computeSectorScore(hi.id, 'T5', 'high')
    }
  };
}

/**
 * Run a single sweep: vary one parameter across its domain, hold others fixed.
 * Returns { values, leverage, nonlinearity }.
 */
function sweep(paramName, domain, scoreFn, isNumeric) {
  const values = domain.map(function (v) {
    return { value: v, score: scoreFn(v) };
  });
  const scores = values.map(function (v) { return v.score; });
  const leverage = max(scores) - min(scores);
  const nonlinearity = isNumeric ? computeNonlinearity(scores) : 0;
  return { values: values, leverage: leverage, nonlinearity: nonlinearity };
}

function run() {
  resetCache();

  const sectors = data.SECTORS;
  const baselines = buildBaselines(sectors);
  const sweeps = [];
  let totalRuns = 0;

  var baselineKeys = ['low', 'mid', 'high'];

  for (let b = 0; b < baselineKeys.length; b++) {
    const bKey = baselineKeys[b];
    const bl = baselines[bKey];

    // --- Tier sweep ---
    var result = sweep('tier', TIERS, function (t) {
      return engine.computeSectorScore(bl.sectorId, t, bl.adoption);
    }, true);
    totalRuns += TIERS.length;
    sweeps.push({ baseline: bKey, parameter: 'tier', values: result.values, leverage: result.leverage, nonlinearity: result.nonlinearity });

    // --- Horizon sweep ---
    result = sweep('horizon', HORIZONS, function (h) {
      var full = engine.computeAll(bl.sectorId, bl.tier, h, bl.adoption);
      return full.score;
    }, true);
    totalRuns += HORIZONS.length;
    sweeps.push({ baseline: bKey, parameter: 'horizon', values: result.values, leverage: result.leverage, nonlinearity: result.nonlinearity });

    // --- Adoption sweep ---
    result = sweep('adoption', ADOPTIONS, function (a) {
      return engine.computeSectorScore(bl.sectorId, bl.tier, a);
    }, false);
    totalRuns += ADOPTIONS.length;
    sweeps.push({ baseline: bKey, parameter: 'adoption', values: result.values, leverage: result.leverage, nonlinearity: result.nonlinearity });

    // --- Sector sweep ---
    var sectorDomain = sectors.map(function (s) { return s.id; });
    result = sweep('sector', sectorDomain, function (sid) {
      return engine.computeSectorScore(sid, bl.tier, bl.adoption);
    }, false);
    totalRuns += sectors.length;
    sweeps.push({ baseline: bKey, parameter: 'sector', values: result.values, leverage: result.leverage, nonlinearity: result.nonlinearity });
  }

  // --- Parameter ranking: average leverage across all baselines ---
  var paramNames = ['tier', 'horizon', 'adoption', 'sector'];
  var parameterRanking = paramNames.map(function (p) {
    var leverages = sweeps
      .filter(function (s) { return s.parameter === p; })
      .map(function (s) { return s.leverage; });
    return { parameter: p, avgLeverage: mean(leverages) };
  }).sort(function (a, b) { return b.avgLeverage - a.avgLeverage; });

  return {
    name: 'One-at-a-Time Sensitivity',
    totalRuns: totalRuns,
    baselines: baselines,
    sweeps: sweeps,
    parameterRanking: parameterRanking
  };
}

module.exports = { run: run };
