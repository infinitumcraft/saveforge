// engines/gamemaker/detector.js
// Detects GameMaker save files

/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  // GameMaker commonly uses .ini for saves
  if (ext === 'ini') return true

  // GameMaker Studio 2 sometimes uses .sav
  if (ext === 'sav') return true

  // GameMaker also uses .gmsav
  if (ext === 'gmsav') return true

  return false
}