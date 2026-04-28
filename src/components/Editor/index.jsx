// components/Editor/index.jsx
// Renders the full editor panel for a loaded save file

import { useState } from 'react'
import FieldRow from '../FieldRow'
import { exportSave as exportRPGMaker } from '../../engines/rpgmaker/exporter'
import { exportSave as exportRenpy } from '../../engines/renpy/exporter'
import { exportSave as exportGameMaker } from '../../engines/gamemaker/exporter'
import { exportSave as exportUnity } from '../../engines/unity/exporter'
import { exportSave as exportGeneric } from '../../engines/generic/exporter'
import { loadDataFile, hasEnrichmentData } from '../../engines/rpgmaker/enricher'
import RPGMakerView from '../RPGMakerView'

const exporters = {
  rpgmaker: exportRPGMaker,
  renpy: exportRenpy,
  gamemaker: exportGameMaker,
  unity: exportUnity,
  generic: exportGeneric,
}

const engineLabels = {
  rpgmaker: 'RPG Maker MV/MZ',
  renpy: "Ren'Py",
  gamemaker: 'GameMaker',
  unity: 'Unity',
  generic: 'Generic',
}

/**
 * @param {{
 *   data: object,
 *   engine: string,
 *   filename: string,
 *   onDataChange: (data: object) => void
 * }} props
 */
export default function Editor({ data, engine, filename, onDataChange }) {
  const [enriched, setEnriched] = useState(false)
  const [search, setSearch] = useState('')

  function handleChange(path, value) {
    const parts = path.split('.')
    const updated = structuredClone(data)
    let target = updated
    for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]]
    target[parts[parts.length - 1]] = value
    onDataChange(updated)
  }

  function handleExport() {
    const exporter = exporters[engine] || exportGeneric
    exporter(data, filename)
  }

  async function handleEnrichment(e) {
    const files = Array.from(e.target.files)
    for (const file of files) {
      await loadDataFile(file)
    }
    setEnriched(hasEnrichmentData())
  }

  return (
    <div className="editor">

      {/* Toolbar */}
      <div className="editor__toolbar">
        <span className="editor__filename">{filename}</span>
        <span className={`editor__engine editor__engine--${engine}`}>
          {engineLabels[engine] || engine}
        </span>
        <div className="editor__toolbar-right">
          <button className="btn btn--ghost" onClick={handleExport}>
            ⬇ Export Save
          </button>
        </div>
      </div>

      {/* Enrichment prompt for RPG Maker */}
      {engine === 'rpgmaker' && !enriched && (
        <div className="editor__enrichment">
          <span>💡 Drop your game's <code>data/</code> folder for named variables, items and actors</span>
          <label className="btn btn--ghost">
            Load Data Files
            <input
              type="file"
              multiple
              accept=".json"
              onChange={handleEnrichment}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {enriched && (
        <div className="editor__enrichment editor__enrichment--success">
          ✅ Data files loaded — fields are now named
        </div>
      )}

      {/* Global search for non-RPGMaker engines */}
      {engine !== 'rpgmaker' && (
        <div className="editor__search">
          <span>🔍</span>
          <input
            className="editor__search-input"
            type="text"
            placeholder="Search fields..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="editor__search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      )}

      {/* Fields */}
      <div className="editor__fields">
        {engine === 'rpgmaker'
          ? <RPGMakerView data={data} onDataChange={onDataChange} />
          : renderObject(data, '', handleChange, search)
        }
      </div>

    </div>
  )
}

/**
 * Recursively render fields and sections
 * @param {object} obj
 * @param {string} path
 * @param {function} onChange
 * @param {string} search
 * @returns {JSX.Element[]}
 */
function renderObject(obj, path, onChange, search = '') {
  return Object.entries(obj).map(([key, val]) => {
    const fullPath = path ? `${path}.${key}` : key

    if (val !== null && typeof val === 'object') {
      return (
        <div key={fullPath} className="editor__section">
          <div className="editor__section-head">{key}</div>
          <div className="editor__section-body">
            {renderObject(val, fullPath, onChange, search)}
          </div>
        </div>
      )
    }

    // Filter by name or value
    if (search.trim()) {
      const q = search.toLowerCase()
      if (
        !key.toLowerCase().includes(q) &&
        !String(val).toLowerCase().includes(q)
      ) return null
    }

    return (
      <FieldRow
        key={fullPath}
        fieldKey={key}
        value={val}
        path={fullPath}
        onChange={onChange}
      />
    )
  })
}