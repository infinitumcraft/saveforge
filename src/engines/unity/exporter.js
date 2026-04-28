// engines/unity/exporter.js
// Exports a JS object back to Unity save format

import { downloadFile } from '../../utils/fileUtils'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  // Export as JSON — most Unity games use plain JSON
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}