
import { downloadFile } from '../../utils/fileUtils'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}