import { readAsText } from '../../utils/fileUtils'
import { decompressSync } from 'fflate'

export async function parse(file) {
  try {
    const text = await readAsText(file)
    const rawBytes = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
      rawBytes[i] = text.charCodeAt(i) & 0xff
    }
    const decompressed = decompressSync(rawBytes)
    const json = new TextDecoder().decode(decompressed)
    console.log('MZ success:', json.slice(0, 100))
    return JSON.parse(json)
  } catch (e) {
    console.error('MZ format failed:', e.message)
  }
  try {
    const text = await readAsText(file)
    const decoded = atob(text.trim())
    return JSON.parse(decoded)
  } catch {
    // not base64
  }
  try {
    const text = await readAsText(file)
    return JSON.parse(text)
  } catch {
    throw new Error('Could not parse RPG Maker save file', { cause: new Error('parse_failed') })
  }
}