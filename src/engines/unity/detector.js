// engines/unity/detector.js
// Detects Unity save files

/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  // Unity commonly uses .dat for save files
  if (ext === 'dat') return true

  // Some Unity games use .save
  if (ext === 'es3') return true

  // Unity also sometimes uses .sav
  if (ext === 'unity') return true

  return false
}