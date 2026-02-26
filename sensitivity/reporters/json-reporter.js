/**
 * JSON Reporter — writes full sensitivity results as formatted JSON.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Write results to a JSON file.
 *
 * @param {Object} results - Combined results from all analyses
 * @param {string} outputDir - Directory to write into
 */
function write(results, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });

  const output = {
    metadata: results.metadata,
    fullEnumeration: results.fullEnumeration,
    oatSensitivity: results.oatSensitivity,
    weightSensitivity: results.weightSensitivity,
    impactSensitivity: results.impactSensitivity,
    monteCarlo: results.monteCarlo,
    thresholdMap: results.thresholdMap,
    dominantStability: results.dominantStability,
  };

  const filePath = path.join(outputDir, 'sensitivity-results.json');
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`  JSON report written to ${filePath}`);
}

module.exports = { write };
