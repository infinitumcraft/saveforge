
/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  if (ext === 'dat') return true
  if (ext === 'es3') return true
  if (ext === 'unity') return true

  return false
}