// engines/gamemaker/exporter.js
// Exports a JS object back to GameMaker save format

import { downloadFile, isINIStyle, serializeINI } from '../../utils/fileUtils'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  // If it has sections (INI style)
  if (isINIStyle(data)) {
    const ini = serializeINI(data)
    downloadFile(ini, filename, 'text/plain')
    return
  }

  // Otherwise export as JSON (GameMaker Studio 2)
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