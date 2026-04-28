// engines/rpgmaker/detector.js
// Detects RPG Maker MV/MZ save files

/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  // RPG Maker MV/MZ saves have a very specific extension
  if (ext === 'rpgsave') return true

  // RPG Maker MZ also uses .rmmzsave
  if (ext === 'rmmzsave') return true

  // RPG Maker MV also uses .rmmvsave
  if (ext === 'rmmvsave') return true

  return false
}