// engines/generic/parser.js
// Tries to parse any unknown file as JSON or INI

import { readAsText } from '../../utils/fileUtils'

/**
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function parse(file) {
  const text = await readAsText(file)

  // Try JSON
  try {
    return JSON.parse(text)
} catch {
  // not this format, try next
}

  // Try base64 decoded JSON
  try {
    const decoded = atob(text.trim())
    return JSON.parse(decoded)
} catch {
  // not this format, try next
}

  // Try INI
  try {
    return parseINI(text)
} catch {
  // not this format, try next
}

  // Last resort — return raw text wrapped in an object
  return { _raw: text }
}

function parseINI(text) {
  const result = {}
  let section = '_root'

  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith(';') || t.startsWith('#')) continue

    if (t.startsWith('[') && t.endsWith(']')) {
      section = t.slice(1, -1)
      result[section] = result[section] || {}
    } else if (t.includes('=')) {
      const [k, ...v] = t.split('=')
      if (!result[section]) result[section] = {}
      result[section][k.trim()] = v.join('=').trim()
    }
  }

  return result
}