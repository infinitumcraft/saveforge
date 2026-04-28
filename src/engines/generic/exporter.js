
import { downloadFile, isINIStyle, serializeINI } from '../../utils/fileUtils'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  if (data._raw !== undefined) {
    downloadFile(data._raw, filename, 'text/plain')
    return
  }
  if (isINIStyle(data)) {
    const ini = serializeINI(data)
    downloadFile(ini, filename, 'text/plain')
    return
  }
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
