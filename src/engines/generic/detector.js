// engines/generic/detector.js
// Fallback detector for generic JSON and INI files
// This should always be last in the detectors list

/**
 * @param {File} file
 * @param {string} ext
 * @returns {boolean}
 */
export function detect(file, ext) {
  // Generic JSON
  if (ext === 'json') return true

  // Generic INI/config files
  if (ext === 'cfg') return true

  // Generic text saves
  if (ext === 'txt') return true

  // If nothing else matched, we still try to handle it
  return true
}