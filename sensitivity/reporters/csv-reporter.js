/**
 * CSV Reporter — writes full enumeration grid as CSV.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TRIGGER_COLUMNS = [
  'trigger_scarce_knowledge',
  'trigger_coordination_zero',
  'trigger_unbundling',
];

const TRIGGER_LABELS = [
  'Scarce-Knowledge Trap',
  'Coordination Zero',
  'Unbundling',
];

/**
 * Escape a CSV field (wrap in quotes if it contains comma, quote, or newline).
 */
function csvField(val) {
  const s = String(val == null ? '' : val);
  if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/**
 * Write enumeration results to a CSV file.
 *
 * @param {Object} results - Combined results from all analyses
 * @param {string} outputDir - Directory to write into
 */
function write(results, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });

  const rows = results.fullEnumeration.results;
  if (!rows || rows.length === 0) {
    console.log('  CSV report: no enumeration data to write.');
    return;
  }

  const headers = [
    'sectorId',
    'sectorName',
    'tier',
    'horizon',
    'adoption',
    'score',
    'zone',
    'dominant',
    ...TRIGGER_COLUMNS,
  ];

  const lines = [headers.join(',')];

  for (const row of rows) {
    const triggers = row.triggers || [];

    const triggerBools = TRIGGER_LABELS.map(label =>
      triggers.indexOf(label) !== -1 ? 'TRUE' : 'FALSE'
    );

    const fields = [
      csvField(row.sectorId),
      csvField(row.sectorName),
      csvField(row.tier),
      csvField(row.horizon),
      csvField(row.adoption),
      csvField(typeof row.score === 'number' ? row.score.toFixed(4) : row.score),
      csvField(row.zone),
      csvField(row.dominant),
      ...triggerBools,
    ];

    lines.push(fields.join(','));
  }

  const filePath = path.join(outputDir, 'enumeration-grid.csv');
  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf-8');

  console.log(`  CSV report written to ${filePath} (${rows.length} rows)`);
}

module.exports = { write };
