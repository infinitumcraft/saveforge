
/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  if (ext === 'rpgsave') return true
  if (ext === 'rmmzsave') return true
  if (ext === 'rmmvsave') return true

  return false
}