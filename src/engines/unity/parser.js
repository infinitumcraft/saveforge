
import { readAsText } from '../../utils/fileUtils'

/**
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function parse(file) {
  const text = await readAsText(file)
  try {
    return JSON.parse(text)
} catch {
  // not this format, try next
}
  try {
    const decoded = atob(text.trim())
    return JSON.parse(decoded)
} catch {
  // not this format, try next
}
  try {
    const cleaned = text.replace(/^es3:/i, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Could not parse Unity save file — may be binary format', { cause: 'parse_failed' })
  }
}