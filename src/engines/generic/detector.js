
/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  if (ext === 'json') return true
  if (ext === 'cfg') return true
  if (ext === 'txt') return true
  return true
}