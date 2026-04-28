// engines/generic/exporter.js
// Exports a JS object back to a generic format

import { downloadFile, isINIStyle, serializeINI } from '../../utils/fileUtils'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  // If it was a raw text fallback, export as text
  if (data._raw !== undefined) {
    downloadFile(data._raw, filename, 'text/plain')
    return
  }

  // If it looks like INI sections
  if (isINIStyle(data)) {
    const ini = serializeINI(data)
    downloadFile(ini, filename, 'text/plain')
    return
  }

  // Default to JSON
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}

/**
 * Check if object looks like INI sections
 * @param {object} data
 * @returns {boolean}
 */

/**
 * Serialize a JS object back to INI format
 * @param {object} data
 * @returns {string}
 */
