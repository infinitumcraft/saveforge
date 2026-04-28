// components/FieldRow/index.jsx
// Renders a single editable field row

import { useState } from 'react'

/**
 * @param {{
 *   fieldKey: string,
 *   value: any,
 *   path: string,
 *   onChange: (path: string, value: any) => void
 * }} props
 */
export default function FieldRow({ fieldKey, value, path, onChange }) {
  const [current, setCurrent] = useState(value)
  const type = typeof value

  function handleChange(e) {
    let parsed

    if (type === 'boolean') {
      parsed = e.target.value.trim().toLowerCase() === 'true'
    } else if (type === 'number') {
      parsed = Number(e.target.value)
      if (isNaN(parsed)) return
    } else {
      parsed = e.target.value
    }

    setCurrent(parsed)
    onChange(path, parsed)
  }

  const modified = current !== value

  return (
    <div className={`field-row ${modified ? 'field-row--modified' : ''}`}>
      <span className="field-row__key" title={path}>
        {fieldKey}
      </span>

      <input
        className={`field-row__input ${modified ? 'field-row__input--modified' : ''}`}
        type={type === 'number' ? 'number' : 'text'}
        value={current === null ? 'null' : String(current)}
        onChange={handleChange}
      />

      <span className="field-row__type">
        {type.slice(0, 3)}
      </span>
    </div>
  )
}