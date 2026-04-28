
/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  if (ext === 'save') return true
  if (ext === 'rpysav') return true

  return false
}