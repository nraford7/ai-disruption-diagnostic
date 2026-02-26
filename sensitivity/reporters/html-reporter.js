/**
 * HTML Reporter — self-contained sensitivity analysis dashboard.
 *
 * Generates a dark-themed, executive-ready HTML report with Chart.js
 * visualizations covering all 9 analysis sections.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Color utilities
// ---------------------------------------------------------------------------

const COLORS = {
  bg: '#0a0a0f',
  card: '#12121a',
  cardBorder: '#1e1e2e',
  text: '#e0e0e0',
  textMuted: '#8888a0',
  accent: '#6366f1',
  accentLight: '#818cf8',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  gray: '#4b5563',
};

function scoreColor(score) {
  if (score <= 20) return COLORS.green;
  if (score <= 40) return '#86efac';
  if (score <= 50) return COLORS.yellow;
  if (score <= 60) return COLORS.orange;
  if (score <= 80) return '#f87171';
  return COLORS.red;
}

function scoreHeatColor(score) {
  const t = Math.min(100, Math.max(0, score)) / 100;
  if (t <= 0.25) {
    const f = t / 0.25;
    return lerpColor('#166534', '#86efac', f);
  }
  if (t <= 0.5) {
    const f = (t - 0.25) / 0.25;
    return lerpColor('#86efac', '#eab308', f);
  }
  if (t <= 0.75) {
    const f = (t - 0.5) / 0.25;
    return lerpColor('#eab308', '#f97316', f);
  }
  const f = (t - 0.75) / 0.25;
  return lerpColor('#f97316', '#dc2626', f);
}

function marginColor(margin, maxMargin) {
  const t = Math.min(1, Math.max(0, margin / maxMargin));
  return lerpColor('#dc2626', '#166534', t);
}

function lerpColor(a, b, t) {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return '#' + [r, g, bv].map(c => c.toString(16).padStart(2, '0')).join('');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

const TIERS = ['T1', 'T2', 'T3', 'T4', 'T5'];

function buildExecutiveSummary(results) {
  const rows = (results.fullEnumeration.results || [])
    .filter(r => r.tier === 'T3' && r.horizon === 'H2' && r.adoption === 'medium');

  if (rows.length === 0) return '<p>No T3/H2/medium data available.</p>';

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Sector</th>
          <th>Score</th>
          <th>Zone</th>
          <th>Dominant Impact</th>
          <th>Higher-Order Triggers</th>
        </tr>
      </thead>
      <tbody>`;

  for (const row of rows) {
    const color = scoreColor(row.score);
    const triggers = (row.triggers || []).join(', ') || 'None';
    html += `
        <tr>
          <td>${esc(row.sectorName)}</td>
          <td style="color:${color};font-weight:600">${row.score.toFixed(1)}</td>
          <td><span class="badge" style="background:${color}20;color:${color}">${esc(row.zone)}</span></td>
          <td>${esc(row.dominant)}</td>
          <td class="muted">${esc(triggers)}</td>
        </tr>`;
  }

  html += '</tbody></table>';
  return html;
}

function buildParameterLeverageChart(results) {
  const ranking = results.oatSensitivity && results.oatSensitivity.parameterRanking;
  if (!ranking || ranking.length === 0) return '<p>No OAT data available.</p>';

  const labels = JSON.stringify(ranking.map(r => r.parameter));
  const values = JSON.stringify(ranking.map(r => +r.avgLeverage.toFixed(2)));

  return `
    <div class="chart-container">
      <canvas id="paramLeverageChart"></canvas>
    </div>
    <script>
      new Chart(document.getElementById('paramLeverageChart'), {
        type: 'bar',
        data: {
          labels: ${labels},
          datasets: [{
            label: 'Average Leverage (score range)',
            data: ${values},
            backgroundColor: '${COLORS.accent}',
            borderColor: '${COLORS.accentLight}',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'x',
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Parameter Leverage (avg max-min across baselines)', color: '${COLORS.text}', font: { size: 14 } }
          },
          scales: {
            x: { ticks: { color: '${COLORS.textMuted}' }, grid: { color: '${COLORS.cardBorder}' } },
            y: { ticks: { color: '${COLORS.textMuted}' }, grid: { color: '${COLORS.cardBorder}' }, title: { display: true, text: 'Score Range', color: '${COLORS.textMuted}' } }
          }
        }
      });
    </script>`;
}

function buildSectorTierHeatmap(results) {
  const rows = (results.fullEnumeration.results || [])
    .filter(r => r.horizon === 'H2' && r.adoption === 'medium');

  if (rows.length === 0) return '<p>No enumeration data available.</p>';

  // Group by sector
  const sectorMap = {};
  const sectorOrder = [];
  for (const row of rows) {
    if (!sectorMap[row.sectorId]) {
      sectorMap[row.sectorId] = { name: row.sectorName, tiers: {} };
      sectorOrder.push(row.sectorId);
    }
    sectorMap[row.sectorId].tiers[row.tier] = row.score;
  }

  let html = `
    <div class="heatmap-scroll">
    <table class="heatmap-table">
      <thead>
        <tr>
          <th>Sector</th>`;
  for (const t of TIERS) html += `<th>${t}</th>`;
  html += '</tr></thead><tbody>';

  for (const sid of sectorOrder) {
    const sec = sectorMap[sid];
    html += `<tr><td class="sector-label">${esc(sec.name)}</td>`;
    for (const t of TIERS) {
      const score = sec.tiers[t];
      if (score != null) {
        const bg = scoreHeatColor(score);
        html += `<td class="heat-cell" style="background:${bg};color:#000">${score.toFixed(1)}</td>`;
      } else {
        html += '<td class="heat-cell" style="background:#1a1a2a">-</td>';
      }
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}

function buildWeightTornadoCharts(results) {
  const sectors = results.weightSensitivity && results.weightSensitivity.sectors;
  if (!sectors || sectors.length === 0) return '<p>No weight sensitivity data available.</p>';

  let html = '<div class="tornado-grid">';
  let chartIdx = 0;

  for (const sector of sectors) {
    const top8 = sector.tasks.slice(0, 8);
    if (top8.length === 0) continue;

    const canvasId = 'tornado_' + chartIdx++;
    const labels = JSON.stringify(top8.map(t => t.taskName.length > 30 ? t.taskName.slice(0, 28) + '...' : t.taskName));

    // For tornado: use maxScoreChange as magnitude, show positive and negative bars
    // Derive from details: find max positive delta and max negative delta
    const posDeltas = [];
    const negDeltas = [];
    for (const task of top8) {
      let maxPos = 0;
      let maxNeg = 0;
      for (const d of task.details || []) {
        if (d.scoreChange > maxPos) maxPos = d.scoreChange;
        if (d.scoreChange < maxNeg) maxNeg = d.scoreChange;
      }
      posDeltas.push(+(maxPos).toFixed(2));
      negDeltas.push(+(maxNeg).toFixed(2));
    }

    html += `
      <div class="tornado-card">
        <h4>${esc(sector.sectorName)}</h4>
        <canvas id="${canvasId}" height="200"></canvas>
        <script>
          new Chart(document.getElementById('${canvasId}'), {
            type: 'bar',
            data: {
              labels: ${labels},
              datasets: [
                {
                  label: 'Positive delta',
                  data: ${JSON.stringify(posDeltas)},
                  backgroundColor: '${COLORS.accent}',
                  borderRadius: 2
                },
                {
                  label: 'Negative delta',
                  data: ${JSON.stringify(negDeltas)},
                  backgroundColor: '${COLORS.red}',
                  borderRadius: 2
                }
              ]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, labels: { color: '${COLORS.textMuted}', boxWidth: 10, font: { size: 10 } } },
                title: { display: false }
              },
              scales: {
                x: {
                  ticks: { color: '${COLORS.textMuted}', font: { size: 9 } },
                  grid: { color: '${COLORS.cardBorder}' },
                  title: { display: true, text: 'Score Change', color: '${COLORS.textMuted}', font: { size: 10 } }
                },
                y: {
                  ticks: { color: '${COLORS.textMuted}', font: { size: 9 } },
                  grid: { display: false }
                }
              }
            }
          });
        </script>
      </div>`;
  }

  html += '</div>';
  return html;
}

function buildImpactInfluenceTable(results) {
  const top20 = results.impactSensitivity && results.impactSensitivity.top20;
  if (!top20 || top20.length === 0) return '<p>No impact sensitivity data available.</p>';

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Task</th>
          <th>Tier</th>
          <th>Key</th>
          <th>Original</th>
          <th>Max Cross-Sector Change</th>
          <th>Most Affected Sectors</th>
        </tr>
      </thead>
      <tbody>`;

  for (let i = 0; i < top20.length; i++) {
    const item = top20[i];
    // Determine most affected sectors from the perturbation results
    const affectedSectors = [];
    const pertResult = item.plusOne || item.minusOne;
    if (pertResult && pertResult.sectorChanges) {
      for (const sc of pertResult.sectorChanges.slice(0, 3)) {
        if (Math.abs(sc.delta) > 0.01) {
          affectedSectors.push(sc.sectorName + ' (' + (sc.delta > 0 ? '+' : '') + sc.delta.toFixed(2) + ')');
        }
      }
    }

    html += `
        <tr>
          <td class="muted">${i + 1}</td>
          <td>${esc(item.taskName)}</td>
          <td>${esc(item.tier)}</td>
          <td><span class="key-badge">${esc(item.impactKey)}</span></td>
          <td>${item.originalValue}</td>
          <td style="color:${item.maxCrossSectorChange > 2 ? COLORS.red : COLORS.text}">${item.maxCrossSectorChange.toFixed(3)}</td>
          <td class="muted" style="font-size:0.8rem">${esc(affectedSectors.join('; ') || 'Minimal')}</td>
        </tr>`;
  }

  html += '</tbody></table>';
  return html;
}

function buildMonteCarloBoxPlots(results) {
  const sectors = results.monteCarlo && results.monteCarlo.sectors;
  if (!sectors || sectors.length === 0) return '<p>No Monte Carlo data available.</p>';

  // Approximate box plots using floating bars + scatter for median/baseline
  const labels = JSON.stringify(sectors.map(s => s.sectorName.length > 20 ? s.sectorName.slice(0, 18) + '...' : s.sectorName));

  // IQR bars (p25 to p75)
  const iqrData = JSON.stringify(sectors.map(s => [s.distribution.p25, s.distribution.p75]));
  // Whisker bars (p5 to p95)
  const whiskerData = JSON.stringify(sectors.map(s => [s.distribution.p5, s.distribution.p95]));
  // Medians
  const medians = JSON.stringify(sectors.map(s => s.distribution.median));
  // Baselines
  const baselines = JSON.stringify(sectors.map(s => s.baselineScore));

  return `
    <div class="chart-container" style="height:500px">
      <canvas id="monteCarloChart"></canvas>
    </div>
    <script>
      (function() {
        const labels = ${labels};
        const whiskerData = ${whiskerData};
        const iqrData = ${iqrData};
        const medians = ${medians};
        const baselines = ${baselines};

        new Chart(document.getElementById('monteCarloChart'), {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'p5-p95 range',
                data: whiskerData,
                backgroundColor: '${COLORS.accent}22',
                borderColor: '${COLORS.accent}66',
                borderWidth: 1,
                borderSkipped: false,
                barPercentage: 0.3
              },
              {
                label: 'IQR (p25-p75)',
                data: iqrData,
                backgroundColor: '${COLORS.accent}66',
                borderColor: '${COLORS.accentLight}',
                borderWidth: 1,
                borderSkipped: false,
                barPercentage: 0.6
              },
              {
                label: 'Median',
                type: 'line',
                data: medians,
                borderColor: '${COLORS.text}',
                backgroundColor: '${COLORS.text}',
                pointStyle: 'dash',
                pointRadius: 6,
                pointBorderWidth: 2,
                showLine: false,
                order: 0
              },
              {
                label: 'Baseline',
                type: 'line',
                data: baselines,
                borderColor: '${COLORS.green}',
                backgroundColor: '${COLORS.green}',
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderWidth: 2,
                showLine: false,
                order: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '${COLORS.textMuted}', font: { size: 11 } } },
              title: { display: true, text: 'Monte Carlo Score Distributions (${(results.monteCarlo.iterations || 5000).toLocaleString()} iterations)', color: '${COLORS.text}', font: { size: 14 } }
            },
            scales: {
              x: { ticks: { color: '${COLORS.textMuted}', maxRotation: 45, font: { size: 10 } }, grid: { color: '${COLORS.cardBorder}' } },
              y: { ticks: { color: '${COLORS.textMuted}' }, grid: { color: '${COLORS.cardBorder}' }, title: { display: true, text: 'Disruption Score', color: '${COLORS.textMuted}' } }
            }
          }
        });
      })();
    </script>`;
}

function buildThresholdProximityMap(results) {
  const thresholdData = results.thresholdMap && results.thresholdMap.thresholds;
  if (!thresholdData) return '<p>No threshold map data available.</p>';

  const triggerNames = Object.keys(thresholdData);
  if (triggerNames.length === 0) return '<p>No threshold triggers found.</p>';

  let html = '';

  for (const trigger of triggerNames) {
    const triggerData = thresholdData[trigger];
    if (!triggerData) continue;

    html += `<h4 class="trigger-title">${esc(trigger)}</h4>`;
    html += `<div class="heatmap-scroll"><table class="heatmap-table"><thead><tr><th>Sector</th>`;
    for (const t of TIERS) html += `<th>${t}</th>`;
    html += '</tr></thead><tbody>';

    // triggerData should be keyed by sectorId or be an array
    const entries = Array.isArray(triggerData) ? triggerData : Object.values(triggerData);
    const sectorMap = {};
    for (const entry of entries) {
      const key = entry.sectorId || entry.sector;
      if (!sectorMap[key]) {
        sectorMap[key] = { name: entry.sectorName || key, tiers: {} };
      }
      sectorMap[key].tiers[entry.tier] = entry;
    }

    for (const sid of Object.keys(sectorMap)) {
      const sec = sectorMap[sid];
      html += `<tr><td class="sector-label">${esc(sec.name)}</td>`;
      for (const t of TIERS) {
        const entry = sec.tiers[t];
        if (entry) {
          if (entry.triggered || entry.active) {
            html += `<td class="heat-cell" style="background:${COLORS.gray};color:#fff">ACT</td>`;
          } else {
            const margin = entry.margin != null ? entry.margin : entry.distance || 0;
            const bg = marginColor(Math.abs(margin), 10);
            html += `<td class="heat-cell" style="background:${bg};color:#fff">${margin.toFixed(1)}</td>`;
          }
        } else {
          html += '<td class="heat-cell" style="background:#1a1a2a">-</td>';
        }
      }
      html += '</tr>';
    }

    html += '</tbody></table></div>';
  }

  return html;
}

function buildDominantStabilityMap(results) {
  const stabData = results.dominantStability && results.dominantStability.results;
  if (!stabData || stabData.length === 0) return '<p>No dominant stability data available.</p>';

  // Group by sector
  const sectorMap = {};
  const sectorOrder = [];
  for (const entry of stabData) {
    const key = entry.sectorId || entry.sector;
    if (!sectorMap[key]) {
      sectorMap[key] = { name: entry.sectorName || key, tiers: {} };
      sectorOrder.push(key);
    }
    sectorMap[key].tiers[entry.tier] = entry;
  }

  let html = `
    <div class="heatmap-scroll">
    <table class="heatmap-table">
      <thead>
        <tr>
          <th>Sector</th>`;
  for (const t of TIERS) html += `<th>${t}</th>`;
  html += '</tr></thead><tbody>';

  for (const sid of sectorOrder) {
    const sec = sectorMap[sid];
    html += `<tr><td class="sector-label">${esc(sec.name)}</td>`;
    for (const t of TIERS) {
      const entry = sec.tiers[t];
      if (entry) {
        const dominant = entry.dominant || entry.dominantImpact || '?';
        const margin = entry.margin != null ? entry.margin : 0;
        // Opacity: low margin = less opaque (less stable), high margin = fully opaque (stable)
        const maxMargin = 5;
        const opacity = 0.3 + 0.7 * Math.min(1, Math.abs(margin) / maxMargin);
        html += `<td class="heat-cell dom-cell" style="opacity:${opacity.toFixed(2)}">${esc(dominant)}<span class="margin-label">${margin.toFixed(1)}</span></td>`;
      } else {
        html += '<td class="heat-cell" style="background:#1a1a2a">-</td>';
      }
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}

function buildCalibrationFlags(results) {
  const flags = [];

  // 1. Normalization fragility
  const normFrag = results.impactSensitivity && results.impactSensitivity.normalizationFragility;
  if (normFrag) {
    const minSec = normFrag.globalMinSector;
    const maxSec = normFrag.globalMaxSector;
    const nearMin = normFrag.nearMinSectors || [];
    const nearMax = normFrag.nearMaxSectors || [];

    if (nearMin.length > 0 || nearMax.length > 0) {
      flags.push({
        severity: 'warning',
        title: 'Normalization Fragility',
        detail: `Score normalization anchored by ${esc(minSec.sectorName)} (min) and ${esc(maxSec.sectorName)} (max). ` +
          (nearMin.length > 0 ? `${nearMin.length} sector(s) within 0.01 of min boundary. ` : '') +
          (nearMax.length > 0 ? `${nearMax.length} sector(s) within 0.01 of max boundary. ` : '') +
          'A single impact change to boundary sectors could rescale all scores.',
      });
    } else {
      flags.push({
        severity: 'info',
        title: 'Normalization Anchors',
        detail: `Min anchor: ${esc(minSec.sectorName)} (${minSec.rawScore.toFixed(2)}), Max anchor: ${esc(maxSec.sectorName)} (${maxSec.rawScore.toFixed(2)}). No near-boundary competitors detected.`,
      });
    }
  }

  // 2. Disproportionate influence (top 5 from impact sensitivity)
  const top20 = results.impactSensitivity && results.impactSensitivity.top20;
  if (top20 && top20.length >= 5) {
    const top5 = top20.slice(0, 5);
    const names = top5.map(t => `${t.taskName}/${t.tier}/${t.impactKey} (${t.maxCrossSectorChange.toFixed(2)})`);
    flags.push({
      severity: 'warning',
      title: 'Disproportionate Influence',
      detail: 'These 5 impact values produce the largest cross-sector score swings from a single +/-1 change: ' + names.join('; ') + '.',
    });
  }

  // 3. Fragile zone boundaries
  const enumResults = results.fullEnumeration && results.fullEnumeration.results;
  if (enumResults) {
    const boundaries = [20, 40, 60, 80];
    const fragile = [];
    for (const row of enumResults) {
      for (const b of boundaries) {
        if (Math.abs(row.score - b) <= 2) {
          fragile.push(`${row.sectorName} @ ${row.tier}/${row.horizon}/${row.adoption} (${row.score.toFixed(1)}, boundary ${b})`);
        }
      }
    }
    if (fragile.length > 0) {
      const unique = [...new Set(fragile)];
      flags.push({
        severity: 'critical',
        title: 'Fragile Zone Boundaries',
        detail: `${unique.length} configuration(s) sit within 2 points of a zone boundary. Small input changes could shift their classification. Examples: ${unique.slice(0, 8).join('; ')}${unique.length > 8 ? ` ... and ${unique.length - 8} more` : ''}.`,
      });
    }
  }

  // 4. Trigger cliffs
  const cliffEdges = results.thresholdMap && results.thresholdMap.cliffEdges;
  if (cliffEdges && cliffEdges.length > 0) {
    const examples = cliffEdges.slice(0, 6).map(c =>
      `${c.sectorName || c.sector} @ ${c.tier}: ${c.trigger || c.triggerName} (margin ${(c.margin != null ? c.margin : c.distance || 0).toFixed(2)})`
    );
    flags.push({
      severity: 'critical',
      title: 'Trigger Cliffs',
      detail: `${cliffEdges.length} sector-tier combination(s) are near a higher-order trigger boundary. ` + examples.join('; ') + '.',
    });
  }

  // 5. Narrative instability
  const unstable = results.dominantStability && results.dominantStability.unstable;
  if (unstable && unstable.length > 0) {
    const examples = unstable.slice(0, 6).map(u =>
      `${u.sectorName || u.sector} @ ${u.tier}: margin ${(u.margin != null ? u.margin : 0).toFixed(2)}`
    );
    flags.push({
      severity: 'warning',
      title: 'Narrative Instability',
      detail: `${unstable.length} sector-tier combination(s) have a dominant impact that could flip with minor weight or score changes. ` + examples.join('; ') + '.',
    });
  }

  if (flags.length === 0) {
    return '<p class="muted">No calibration concerns detected.</p>';
  }

  const severityIcon = { critical: '!!', warning: '!', info: 'i' };
  const severityColor = { critical: COLORS.red, warning: COLORS.orange, info: COLORS.accent };

  let html = '<div class="flags-list">';
  for (const flag of flags) {
    const color = severityColor[flag.severity] || COLORS.text;
    const icon = severityIcon[flag.severity] || '?';
    html += `
      <div class="flag-card" style="border-left:3px solid ${color}">
        <div class="flag-header">
          <span class="flag-icon" style="background:${color}20;color:${color}">${icon}</span>
          <strong>${esc(flag.title)}</strong>
        </div>
        <p class="flag-detail">${flag.detail}</p>
      </div>`;
  }
  html += '</div>';
  return html;
}

// ---------------------------------------------------------------------------
// Full HTML assembly
// ---------------------------------------------------------------------------

function buildHTML(results) {
  const timestamp = (results.metadata && results.metadata.timestamp) || new Date().toISOString();
  const totalRuns = (results.metadata && results.metadata.totalRuns) || '?';

  const sections = [
    { id: 'exec-summary', title: '1. Executive Summary', content: buildExecutiveSummary(results) },
    { id: 'param-leverage', title: '2. Parameter Leverage', content: buildParameterLeverageChart(results) },
    { id: 'sector-heatmap', title: '3. Sector x Tier Heatmap', content: buildSectorTierHeatmap(results) },
    { id: 'weight-tornado', title: '4. Weight Sensitivity Tornados', content: buildWeightTornadoCharts(results) },
    { id: 'impact-influence', title: '5. Impact Score Influence', content: buildImpactInfluenceTable(results) },
    { id: 'monte-carlo', title: '6. Monte Carlo Distributions', content: buildMonteCarloBoxPlots(results) },
    { id: 'threshold-map', title: '7. Threshold Proximity Map', content: buildThresholdProximityMap(results) },
    { id: 'dominant-stability', title: '8. Dominant Impact Stability', content: buildDominantStabilityMap(results) },
    { id: 'calibration', title: '9. Calibration Flags', content: buildCalibrationFlags(results) },
  ];

  let navItems = '';
  let sectionBlocks = '';

  for (const sec of sections) {
    navItems += `<a href="#${sec.id}" class="nav-link">${esc(sec.title)}</a>\n`;
    sectionBlocks += `
      <section id="${sec.id}" class="report-section">
        <h2>${esc(sec.title)}</h2>
        ${sec.content}
      </section>\n`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Disruption Diagnostic — Sensitivity Analysis</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.text};
      line-height: 1.6;
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar navigation */
    .sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 260px;
      height: 100vh;
      background: ${COLORS.card};
      border-right: 1px solid ${COLORS.cardBorder};
      padding: 24px 16px;
      overflow-y: auto;
      z-index: 100;
    }

    .sidebar h1 {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${COLORS.accent};
      margin-bottom: 8px;
    }

    .sidebar .subtitle {
      font-size: 11px;
      color: ${COLORS.textMuted};
      margin-bottom: 24px;
    }

    .nav-link {
      display: block;
      padding: 8px 12px;
      margin-bottom: 2px;
      color: ${COLORS.textMuted};
      text-decoration: none;
      font-size: 13px;
      border-radius: 6px;
      transition: all 0.15s ease;
    }

    .nav-link:hover {
      color: ${COLORS.text};
      background: ${COLORS.bg};
    }

    /* Main content */
    .main {
      margin-left: 260px;
      flex: 1;
      padding: 40px 48px;
      max-width: 1400px;
    }

    .report-header {
      margin-bottom: 48px;
    }

    .report-header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .report-header .meta {
      font-size: 13px;
      color: ${COLORS.textMuted};
    }

    .report-section {
      margin-bottom: 56px;
    }

    .report-section h2 {
      font-size: 18px;
      font-weight: 600;
      color: ${COLORS.text};
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${COLORS.cardBorder};
    }

    /* Data tables */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .data-table th {
      text-align: left;
      padding: 10px 12px;
      background: ${COLORS.card};
      color: ${COLORS.textMuted};
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid ${COLORS.cardBorder};
    }

    .data-table td {
      padding: 8px 12px;
      border-bottom: 1px solid ${COLORS.cardBorder}33;
    }

    .data-table tr:hover td {
      background: ${COLORS.card}88;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .key-badge {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 4px;
      background: ${COLORS.accent}22;
      color: ${COLORS.accentLight};
      font-weight: 700;
      font-size: 12px;
    }

    .muted { color: ${COLORS.textMuted}; }

    /* Heatmap tables */
    .heatmap-scroll { overflow-x: auto; }

    .heatmap-table {
      border-collapse: collapse;
      font-size: 12px;
      width: 100%;
    }

    .heatmap-table th {
      padding: 8px 10px;
      background: ${COLORS.card};
      color: ${COLORS.textMuted};
      font-weight: 600;
      font-size: 11px;
      text-align: center;
      border-bottom: 1px solid ${COLORS.cardBorder};
    }

    .heatmap-table .sector-label {
      text-align: left;
      padding: 6px 10px;
      font-weight: 500;
      color: ${COLORS.text};
      white-space: nowrap;
    }

    .heat-cell {
      text-align: center;
      padding: 6px 8px;
      font-weight: 600;
      font-size: 11px;
      min-width: 56px;
    }

    .dom-cell {
      background: ${COLORS.card};
      color: ${COLORS.accentLight};
      font-size: 14px;
      font-weight: 700;
    }

    .margin-label {
      display: block;
      font-size: 9px;
      font-weight: 400;
      color: ${COLORS.textMuted};
      margin-top: 2px;
    }

    /* Tornado grid */
    .tornado-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .tornado-card {
      background: ${COLORS.card};
      border: 1px solid ${COLORS.cardBorder};
      border-radius: 8px;
      padding: 16px;
    }

    .tornado-card h4 {
      font-size: 13px;
      font-weight: 600;
      color: ${COLORS.text};
      margin-bottom: 12px;
    }

    /* Trigger title */
    .trigger-title {
      font-size: 14px;
      font-weight: 600;
      color: ${COLORS.accentLight};
      margin: 20px 0 10px 0;
    }

    /* Chart containers */
    .chart-container {
      background: ${COLORS.card};
      border: 1px solid ${COLORS.cardBorder};
      border-radius: 8px;
      padding: 24px;
      position: relative;
    }

    /* Calibration flags */
    .flags-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .flag-card {
      background: ${COLORS.card};
      border: 1px solid ${COLORS.cardBorder};
      border-radius: 8px;
      padding: 16px 20px;
    }

    .flag-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .flag-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
    }

    .flag-detail {
      font-size: 13px;
      color: ${COLORS.textMuted};
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .sidebar { display: none; }
      .main { margin-left: 0; padding: 24px 16px; }
      .tornado-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav class="sidebar">
    <h1>Sensitivity Analysis</h1>
    <div class="subtitle">AI Disruption Diagnostic</div>
    ${navItems}
  </nav>
  <main class="main">
    <header class="report-header">
      <h1>Sensitivity Analysis Report</h1>
      <div class="meta">Generated ${esc(timestamp)} &mdash; ${esc(String(totalRuns))} total engine runs</div>
    </header>
    ${sectionBlocks}
  </main>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function write(results, outputDir) {
  const fs = require('fs');
  const path = require('path');

  fs.mkdirSync(outputDir, { recursive: true });

  const html = buildHTML(results);
  const filePath = path.join(outputDir, 'sensitivity-report.html');
  fs.writeFileSync(filePath, html, 'utf-8');

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`  HTML report written to ${filePath} (${sizeKB} KB)`);
}

module.exports = { write };
