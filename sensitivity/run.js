#!/usr/bin/env node

/**
 * Sensitivity Analysis Orchestrator
 *
 * Runs all 7 analyses sequentially, collects results, and writes reports
 * via JSON, CSV, and HTML reporters.
 *
 * Usage:
 *   node sensitivity/run.js [--iterations N] [--output DIR]
 */

'use strict';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { iterations: 5000, output: './sensitivity/results' };

  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--iterations' && argv[i + 1]) {
      args.iterations = parseInt(argv[++i], 10);
      if (isNaN(args.iterations) || args.iterations < 1) {
        console.error('Error: --iterations must be a positive integer.');
        process.exit(1);
      }
    } else if (argv[i] === '--output' && argv[i + 1]) {
      args.output = argv[++i];
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      console.log('Usage: node sensitivity/run.js [--iterations N] [--output DIR]');
      console.log('  --iterations N   Monte Carlo iterations (default: 5000)');
      console.log('  --output DIR     Output directory (default: ./sensitivity/results)');
      process.exit(0);
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv);

  console.log('=== AI Disruption Diagnostic — Sensitivity Analysis ===');
  console.log(`Monte Carlo iterations: ${args.iterations.toLocaleString()}`);
  console.log(`Output directory: ${args.output}`);
  console.log('');

  // Define analyses
  const analyses = [
    { name: 'Full Enumeration',   mod: require('./analyses/full-enumeration') },
    { name: 'OAT Sensitivity',    mod: require('./analyses/oat-sensitivity') },
    { name: 'Weight Sensitivity',  mod: require('./analyses/weight-sensitivity') },
    { name: 'Impact Sensitivity',  mod: require('./analyses/impact-sensitivity') },
    { name: 'Monte Carlo',         mod: require('./analyses/monte-carlo') },
    { name: 'Threshold Map',       mod: require('./analyses/threshold-map') },
    { name: 'Dominant Stability',  mod: require('./analyses/dominant-stability') },
  ];

  // Result keys matching the analysis order
  const resultKeys = [
    'fullEnumeration',
    'oatSensitivity',
    'weightSensitivity',
    'impactSensitivity',
    'monteCarlo',
    'thresholdMap',
    'dominantStability',
  ];

  const results = {};
  let totalRuns = 0;
  const totalStart = Date.now();

  // Run each analysis sequentially
  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    const key = resultKeys[i];

    process.stdout.write(`[${i + 1}/${analyses.length}] ${analysis.name}...`);
    const start = Date.now();

    try {
      // Pass options to analyses that accept them
      const opts = key === 'monteCarlo' ? { iterations: args.iterations } : {};
      const result = analysis.mod.run(opts);

      results[key] = result;
      totalRuns += result.totalRuns || 0;

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const runs = result.totalRuns ? ` (${result.totalRuns.toLocaleString()} runs)` : '';
      console.log(` done in ${elapsed}s${runs}`);
    } catch (err) {
      console.log(` FAILED`);
      console.error(`  Error in ${analysis.name}: ${err.message}`);
      if (err.stack) {
        const stackLines = err.stack.split('\n').slice(1, 4).join('\n');
        console.error(`  ${stackLines}`);
      }
      results[key] = { error: err.message, name: analysis.name, totalRuns: 0 };
    }
  }

  // Attach metadata
  results.metadata = {
    timestamp: new Date().toISOString(),
    totalRuns,
    iterations: args.iterations,
    analysesRun: analyses.length,
    analysesFailed: Object.values(results).filter(r => r && r.error).length,
  };

  console.log('');
  console.log('--- Reports ---');

  // Run reporters
  const reporters = [
    { name: 'JSON',  mod: require('./reporters/json-reporter') },
    { name: 'CSV',   mod: require('./reporters/csv-reporter') },
    { name: 'HTML',  mod: require('./reporters/html-reporter') },
  ];

  for (const reporter of reporters) {
    try {
      reporter.mod.write(results, args.output);
    } catch (err) {
      console.error(`  ${reporter.name} reporter failed: ${err.message}`);
    }
  }

  const totalElapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
  console.log('');
  console.log(`Total: ${totalRuns.toLocaleString()} engine runs in ${totalElapsed}s`);
  console.log(`Results in ${args.output}/`);
}

main();
