/**
 * Window shim — loads data.js + engine.js in Node without modifying the app.
 *
 * Usage:
 *   const { engine, data, resetCache } = require('./shim');
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Create a minimal window-like object
const window = {};

// Build a sandbox with window + Object.assign (used by data.js)
const sandbox = vm.createContext({
  window,
  Object,
  Array,
  Math,
  Number,
  String,
  Infinity,
  console,
  Error,
  TypeError,
  RangeError,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  undefined,
});

// Load data.js first (sets window.DiagnosticData)
const dataPath = path.join(__dirname, '..', 'js', 'data.js');
const dataCode = fs.readFileSync(dataPath, 'utf-8');
vm.runInContext(dataCode, sandbox, { filename: 'data.js' });

// Load engine.js (sets window.DiagnosticEngine, reads window.DiagnosticData)
const enginePath = path.join(__dirname, '..', 'js', 'engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf-8');
vm.runInContext(engineCode, sandbox, { filename: 'engine.js' });

if (!window.DiagnosticData) {
  throw new Error('Shim: window.DiagnosticData not loaded');
}
if (!window.DiagnosticEngine) {
  throw new Error('Shim: window.DiagnosticEngine not loaded');
}

module.exports = {
  engine: window.DiagnosticEngine,
  data: window.DiagnosticData,
  resetCache: window.DiagnosticEngine.resetCache,
  window,
  sandbox,
};
