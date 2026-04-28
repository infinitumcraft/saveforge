// engines/gamemaker/parser.js
// Parses GameMaker save files into a JS object

import { readAsText } from '../../utils/fileUtils'

/**
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function parse(file) {
  const text = await readAsText(file)

  // Try JSON first (GameMaker Studio 2)
  try {
    return JSON.parse(text)
} catch {
  // not this format, try next
}

// Try INI format (older GameMaker)
  try {
    return parseINI(text)
  } catch {
    throw new Error('Could not parse GameMaker save file', { cause: 'parse_failed' })
  }
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