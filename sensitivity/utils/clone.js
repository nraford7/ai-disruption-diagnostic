/**
 * Deep clone for safe mutation of data objects.
 */

'use strict';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = { deepClone };
