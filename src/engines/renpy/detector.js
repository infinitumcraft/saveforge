// engines/renpy/detector.js
// Detects Ren'Py save files

/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  // Ren'Py saves use .save extension
  if (ext === 'save') return true

  // Ren'Py also sometimes uses .rpysav
  if (ext === 'rpysav') return true

  return false
}