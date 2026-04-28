// engines/renpy/exporter.js
// Exports a JS object back to Ren'Py save format

import { downloadFile } from '../../utils/fileUtils'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  // Ren'Py saves are plain JSON
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}