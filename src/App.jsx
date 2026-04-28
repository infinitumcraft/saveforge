
import { useState } from 'react'
import DropZone from './components/DropZone'
import Editor from './components/Editor'
import { parse as parseRPGMaker } from './engines/rpgmaker/parser'
import { parse as parseRenpy } from './engines/renpy/parser'
import { parse as parseGameMaker } from './engines/gamemaker/parser'
import { parse as parseUnity } from './engines/unity/parser'
import { parse as parseGeneric } from './engines/generic/parser'

const parsers = {
  rpgmaker: parseRPGMaker,
  renpy: parseRenpy,
  gamemaker: parseGameMaker,
  unity: parseUnity,
  generic: parseGeneric,
}

export default function App() {
  const [data, setData] = useState(null)
  const [engine, setEngine] = useState(null)
  const [filename, setFilename] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleFileLoaded(file, detectedEngine) {
    setError(null)
    setLoading(true)

    try {
      const parser = parsers[detectedEngine] || parseGeneric
      const parsed = await parser(file)
      setData(parsed)
      setEngine(detectedEngine)
      setFilename(file.name)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDataChange(updated) {
    setData(updated)
  }

  function handleReset() {
    setData(null)
    setEngine(null)
    setFilename(null)
    setError(null)
  }

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header__logo">SaveForge</div>
        <span className="header__tag">multi-engine</span>
        {data && (
          <button
            className="btn btn--ghost"
            style={{ marginLeft: 'auto' }}
            onClick={handleReset}
          >
            ← Load Another
          </button>
        )}
      </header>

      {/* Main */}
      <main className="main">
        {loading && (
          <div className="loading">Parsing save file...</div>
        )}

        {error && (
          <div className="error">
            ⚠️ {error}
            <button className="btn btn--ghost" onClick={handleReset}>Try Again</button>
          </div>
        )}

        {!data && !loading && !error && (
          <DropZone onFileLoaded={handleFileLoaded} />
        )}

        {data && !loading && (
          <Editor
            data={data}
            engine={engine}
            filename={filename}
            onDataChange={handleDataChange}
          />
        )}
      </main>

    </div>
  )
}