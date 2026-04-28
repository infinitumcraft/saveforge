// components/DropZone/index.jsx
import { useState } from 'react'
import { detectEngine } from '../../utils/detect'

export default function DropZone({ onFileLoaded }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const [selectedEngine, setSelectedEngine] = useState(null)

  function handleFile(file) {
    setError(null)
    const engine = selectedEngine || detectEngine(file)
    onFileLoaded(file, engine)
  }

  function handleInputChange(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

const engines = [
  {
    id: 'rpgmaker',
    name: 'RPG Maker',
    fmt: 'MV · MZ · .rpgsave',
    color: '#e8001c',
    letter: 'RPG',
    bg: '#1a0003'
  },
  {
    id: 'renpy',
    name: "Ren'Py",
    fmt: '.save · .rpysav',
    color: '#ff7fbf',
    letter: "ren'py",
    bg: '#1a0010'
  },
  {
    id: 'unity',
    name: 'Unity',
    fmt: '.dat · .es3',
    color: '#ffffff',
    letter: 'U',
    bg: '#111'
  },
  {
    id: 'gamemaker',
    name: 'GameMaker',
    fmt: '.ini · .sav',
    color: '#00c8ff',
    letter: 'GM',
    bg: '#001a1f'
  },
  {
    id: 'json',
    name: 'JSON',
    fmt: 'any .json',
    color: '#f5a623',
    letter: '{ }',
    bg: '#1a1000'
  },
  {
    id: 'ini',
    name: 'INI / CFG',
    fmt: '.ini · .cfg',
    color: '#aaa',
    letter: '#',
    bg: '#111'
  },
]

  return (
    <div className="dropzone">
      <div
        className={`dropzone-box ${dragging ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <span className="dropzone__icon">🗂️</span>
        <div className="dropzone__title">DROP SAVE FILE</div>
        <div className="dropzone__sub">
          .rpgsave · .rmmzsave · .save · .json · .ini · .sav · .dat
        </div>
        <label htmlFor="fileInput" className="btn btn--primary" style={{ marginTop: '20px' }}>
          [ BROWSE FILE ]
        </label>
        {error && <p className="dropzone__error" style={{ marginTop: '12px' }}>{error}</p>}
      </div>

      <div className="dropzone-divider">— or select engine first —</div>

      <div className="engine-grid">
        {engines.map(eng => (
        <div
            key={eng.id}
            className={`engine-card ${selectedEngine === eng.id ? 'selected' : ''}`}
            onClick={() => setSelectedEngine(selectedEngine === eng.id ? null : eng.id)}
            style={{ '--eng-color': eng.color, '--eng-bg': eng.bg }}
        >
            <div className="eng-logo" style={{ background: eng.bg, borderColor: eng.color }}>
            <span className="eng-logo-text" style={{ color: eng.color }}>{eng.letter}</span>
            </div>
            <div className="eng-name">{eng.name}</div>
            <div className="eng-fmt">{eng.fmt}</div>
        </div>
        ))}
      </div>
    </div>
  )
}