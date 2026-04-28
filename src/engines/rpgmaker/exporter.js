// engines/rpgmaker/exporter.js
// Exports a JS object back to RPG Maker MV/MZ save format

import { downloadFile } from '../../utils/fileUtils'
import { compressSync, strToU8 } from 'fflate'

/**
 * @param {object} data
 * @param {string} filename
 */
export function exportSave(data, filename) {
  try {
    // RPG Maker MZ: JSON → zlib compress → UTF-8 encode
    const json = JSON.stringify(data)
    const jsonBytes = strToU8(json)
    const compressed = compressSync(jsonBytes, { level: 1 })

    // UTF-8 encode the compressed bytes back to a string
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