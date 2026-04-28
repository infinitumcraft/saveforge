
/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  if (ext === 'ini') return true
  if (ext === 'sav') return true
  if (ext === 'gmsav') return true

  return false
}