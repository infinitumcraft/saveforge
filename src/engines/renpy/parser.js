
import { readAsText } from '../../utils/fileUtils'
import { unzipSync } from 'fflate'

/**
 * Scan raw pickle bytes for simple key-value pairs
 * without needing a full pickle parser
 * @param {Uint8Array} bytes
 * @returns {object}
 */
function scanPickleValues(bytes) {
  const result = {}
  let i = 0

  function readInt32() {
    const val = bytes[i] | (bytes[i+1] << 8) | (bytes[i+2] << 16) | (bytes[i+3] << 24)
    i += 4
    return val
  }

  function readInt16() {
    const val = bytes[i] | (bytes[i+1] << 8)
    i += 2
    return val
  }

  function readString(len) {
    const slice = bytes.slice(i, i + len)
    i += len
    return new TextDecoder('utf-8', { fatal: false }).decode(slice)
  }

  function readLine() {
    let end = i
    while (end < bytes.length && bytes[end] !== 0x0a) end++
    const line = new TextDecoder('latin1').decode(bytes.slice(i, end))
    i = end + 1
    return line
  }

  let lastKeyCandidate = null

  while (i < bytes.length) {
    const op = bytes[i++]

    switch (op) {
      case 0x8c: {
        const len = bytes[i++]
        const str = readString(len)
        lastKeyCandidate = str
        break
      }
      case 0x58: {
        const len = readInt32()
        const str = readString(len)
        lastKeyCandidate = str
        break
      }
      case 0x55: {
        const len = bytes[i++]
        const str = readString(len)
        lastKeyCandidate = str
        break
      }
      case 0x54: {
        const len = readInt32()
        const str = readString(len)
        lastKeyCandidate = str
        break
      }
      case 0x4b: {
        const val = bytes[i++]
        if (lastKeyCandidate) {
          result[lastKeyCandidate] = val
        }
        lastKeyCandidate = null
        break
      }
      case 0x4d: {
        const val = readInt16()
        if (lastKeyCandidate) {
          result[lastKeyCandidate] = val
        }
        lastKeyCandidate = null
        break
      }
      case 0x4a: {
        const val = readInt32()
        if (lastKeyCandidate) {
          result[lastKeyCandidate] = val
        }
        lastKeyCandidate = null
        break
      }
      case 0x47: {
        const view = new DataView(bytes.buffer, i, 8)
        const val = view.getFloat64(0, false)
        i += 8
        if (lastKeyCandidate) {
          result[lastKeyCandidate] = val
        }
        lastKeyCandidate = null
        break
      }
      case 0x88: {
        if (lastKeyCandidate) {
          const existing = result[lastKeyCandidate]
          if (existing === undefined || typeof existing === 'boolean') {
            result[lastKeyCandidate] = true
          }
        }
        lastKeyCandidate = null
        break
      }
      case 0x89: {
        if (lastKeyCandidate) {
          const existing = result[lastKeyCandidate]
          if (existing === undefined || typeof existing === 'boolean') {
            result[lastKeyCandidate] = false
          }
        }
        lastKeyCandidate = null
        break
      }
      case 0x4e: {
        lastKeyCandidate = null
        break
      }
      case 0x49: {
        const line = readLine()
        const val = parseInt(line)
        if (!isNaN(val) && lastKeyCandidate) {
          result[lastKeyCandidate] = val
        }
        lastKeyCandidate = null
        break
      }
      case 0x50: {
        readLine()
        lastKeyCandidate = null
        break
      }
      case 0x51: {
        lastKeyCandidate = null
        break
      }

      default:
        break
    }
  }

  return result
}

/**
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function parse(file) {
  try {
    const text = await readAsText(file)
    return JSON.parse(text)
  } catch {
    // not JSON, try zip + pickle
  }
  try {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    const unzipped = unzipSync(bytes)
    let result = {}
    if (unzipped['json']) {
      const jsonText = new TextDecoder().decode(unzipped['json'])
      result = JSON.parse(jsonText)
    }
    if (unzipped['extra_info']) {
      const extraText = new TextDecoder().decode(unzipped['extra_info'])
      if (!extraText.includes('\x00')) {
        result['_extra_info'] = extraText
      }
    }
    const pickleBytes = unzipped['log']
    if (pickleBytes) {
      try {
        const scanned = scanPickleValues(pickleBytes)
        if (Object.keys(scanned).length > 0) {
          result['_gameState'] = scanned
        }
      } catch (e) {
        console.error('Pickle scan error:', e)
      }
    }

    if (Object.keys(result).length > 0) return result

    throw new Error('No readable data found in save', { cause: new Error('parse_failed') })

  } catch {
    throw new Error("Could not parse Ren'Py save file", { cause: new Error('parse_failed') })
  }
}