
/**
 * Holds the loaded data files
 */
const db = {
  items: null,
  weapons: null,
  armors: null,
  actors: null,
  variables: null,
  switches: null,
}

/**
 * Load a game data file and store it in db
 * @param {File} file
 */
export async function loadDataFile(file) {
  const text = await file.text()
  const data = JSON.parse(text)
  const name = file.name.toLowerCase()

  if (name.includes('item')) db.items = data
  else if (name.includes('weapon')) db.weapons = data
  else if (name.includes('armor')) db.armors = data
  else if (name.includes('actor')) db.actors = data
  else if (name === 'system.json') {
    db.variables = data.variables || []
    db.switches = data.switches || []
  }
}

/**
 * Check if any data files have been loaded
 * @returns {boolean}
 */
export function hasEnrichmentData() {
  return Object.values(db).some(v => v !== null)
}

/**
 * Get the name of an item by ID
 * @param {number} id
 * @returns {string}
 */
export function getItemName(id) {
  if (!db.items) return `Item #${id}`
  return db.items[id]?.name || `Item #${id}`
}

/**
 * Get the name of a weapon by ID
 * @param {number} id
 * @returns {string}
 */
export function getWeaponName(id) {
  if (!db.weapons) return `Weapon #${id}`
  return db.weapons[id]?.name || `Weapon #${id}`
}

/**
 * Get the name of an armor by ID
 * @param {number} id
 * @returns {string}
 */
export function getArmorName(id) {
  if (!db.armors) return `Armor #${id}`
  return db.armors[id]?.name || `Armor #${id}`
}

/**
 * Get the name of an actor by ID
 * @param {number} id
 * @returns {string}
 */
export function getActorName(id) {
  if (!db.actors) return `Actor #${id}`
  return db.actors[id]?.name || `Actor #${id}`
}

/**
 * Get the name of a variable by ID
 * @param {number} id
 * @returns {string}
 */
export function getVariableName(id) {
  if (!db.variables) return `Variable #${id}`
  const name = db.variables[id]
  return name && name.trim() !== '' ? name : `Variable #${id}`
}
/**
 * Get the name of a switch by ID
 * @param {number} id
 * @returns {string}
 */
export function getSwitchName(id) {
  if (!db.switches) return `Switch #${id}`
  const name = db.switches[id]
  return name && name.trim() !== '' ? name : `Switch #${id}`
}

/**
 * Clear all loaded data files
 */
export function clearEnrichmentData() {
  for (const key of Object.keys(db)) db[key] = null
}