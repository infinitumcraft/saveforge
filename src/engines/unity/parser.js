// engines/unity/parser.js
// Parses Unity save files into a JS object

import { readAsText } from '../../utils/fileUtils'

/**
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function parse(file) {
  const text = await readAsText(file)

  // Try raw JSON first
  try {
    return JSON.parse(text)
} catch {
  // not this format, try next
}

  // Try base64 encoded JSON (some Unity games)
  try {
    const decoded = atob(text.trim())
    return JSON.parse(decoded)
} catch {
  // not this format, try next
}

// Try ES3 format (Easy Save 3 plugin) which is JSON-based
  try {
    const cleaned = text.replace(/^es3:/i, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Could not parse Unity save file — may be binary format', { cause: 'parse_failed' })
  }
}