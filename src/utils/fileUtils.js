
/**
 * Read a file as text
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Read a file as base64
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result.split(',')[1])
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Download a string as a file
 * @param {string} content
 * @param {string} filename
 * @param {string} mime
 */
export function downloadFile(content, filename, mime = 'application/octet-stream') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Get the extension of a filename
 * @param {string} filename
 * @returns {string}
 */
export function getExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

/**
 * Check if object looks like INI sections
 * @param {object} data
 * @returns {boolean}
 */
export function isINIStyle(data) {
  return Object.values(data).every(v => typeof v === 'object' && v !== null)
}

/**
 * Serialize a JS object back to INI format
 * @param {object} data
 * @returns {string}
 */
export function serializeINI(data) {
  let out = ''
  for (const [section, values] of Object.entries(data)) {
    out += `[${section}]\n`
    for (const [k, v] of Object.entries(values)) {
      out += `${k}=${v}\n`
    }
    out += '\n'
  }
  return out
}