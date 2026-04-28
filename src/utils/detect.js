
import { detect as detectRPGMaker } from '../engines/rpgmaker/detector'
import { detect as detectRenpy } from '../engines/renpy/detector'
import { detect as detectGameMaker } from '../engines/gamemaker/detector'
import { detect as detectUnity } from '../engines/unity/detector'
import { detect as detectGeneric } from '../engines/generic/detector'

const detectors = [
  { name: 'rpgmaker',   fn: detectRPGMaker },
  { name: 'renpy',      fn: detectRenpy },
  { name: 'gamemaker',  fn: detectGameMaker },
  { name: 'unity',      fn: detectUnity },
  { name: 'generic',    fn: detectGeneric },
]

/**
 * @param {File} file - the File object from the input/drop
 * @returns {string} engine name or 'unknown'
 */
export function detectEngine(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  for (const { name, fn } of detectors) {
    if (fn(file, ext)) return name
  }

  return 'unknown'
}