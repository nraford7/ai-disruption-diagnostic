/**
 * Full Enumeration — parametric sensitivity analysis across all combinations.
 * 5 tiers x 4 horizons x 3 adoption levels x 16 sectors = 960 runs.
 */

'use strict';

const { engine, data } = require('../shim');
const { mean, median, min, max } = require('../utils/stats');

const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];
const HORIZONS = ['H1', 'H2', 'H3', 'H4'];
const ADOPTIONS = ['low', 'medium', 'high'];

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

function formatDominant(dominant) {
  if (Array.isArray(dominant)) return dominant.join('/');
  return String(dominant);
}

function groupStats(scores) {
  return { mean: mean(scores), min: min(scores), max: max(scores) };
}

function run() {
  const results = [];
  const sectors = data.SECTORS;

  for (const sector of sectors) {
    for (const tier of TIERS) {
      for (const horizon of HORIZONS) {
        for (const adoption of ADOPTIONS) {
          const full = engine.computeAll(sector.id, tier, horizon, adoption);

          results.push({
            sectorId: sector.id,
            sectorName: sector.name,
            tier,
            horizon,
            adoption,
            score: full.score,
            zone: full.zone,
            dominant: formatDominant(full.dominantImpact.dominant),
            triggers: full.higherOrderImpacts
              .filter(h => h.triggered)
              .map(h => h.label),
            timeline: full.timeline,
          });
        }
      }
    }
  }

  const allScores = results.map(r => r.score);

  const zoneDistribution = {};
  for (const [,, label] of ZONE_THRESHOLDS) zoneDistribution[label] = 0;
  for (const r of results) {
    zoneDistribution[r.zone] = (zoneDistribution[r.zone] || 0) + 1;
  }

  const scoresByTier = {};
  for (const tier of TIERS) {
    scoresByTier[tier] = groupStats(
      results.filter(r => r.tier === tier).map(r => r.score)
    );
  }

  const scoresByAdoption = {};
  for (const adoption of ADOPTIONS) {
    scoresByAdoption[adoption] = groupStats(
      results.filter(r => r.adoption === adoption).map(r => r.score)
    );
  }

  const scoresBySector = {};
  for (const sector of sectors) {
    scoresBySector[sector.name] = groupStats(
      results.filter(r => r.sectorId === sector.id).map(r => r.score)
    );
  }

  return {
    name: 'Full Enumeration',
    totalRuns: results.length,
    results,
    summary: {
      scoreRange: { min: min(allScores), max: max(allScores) },
      zoneDistribution,
      meanScore: mean(allScores),
      medianScore: median(allScores),
      scoresByTier,
      scoresByAdoption,
      scoresBySector,
    },
  };
}

module.exports = { run };
