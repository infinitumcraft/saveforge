
import { downloadFile } from '../../utils/fileUtils'
import { compressSync, strToU8 } from 'fflate'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  try {
    const json = JSON.stringify(data)
    const jsonBytes = strToU8(json)
    const compressed = compressSync(jsonBytes, { level: 1 })
    let encoded = ''
    for (let i = 0; i < compressed.length; i++) {
      encoded += String.fromCharCode(compressed[i])
    }

    downloadFile(encoded, filename, 'application/octet-stream')
  } catch {
    // Fallback to base64 for RPG Maker MV
    const json = JSON.stringify(data)
    const encoded = btoa(json)
    downloadFile(encoded, filename, 'application/octet-stream')
  }
}