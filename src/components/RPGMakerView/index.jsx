import { useState } from 'react'
import { getItemName, getWeaponName, getArmorName, getActorName, getVariableName, getSwitchName } from '../../engines/rpgmaker/enricher'

export default function RPGMakerView({ data, onDataChange }) {
  const [activeTab, setActiveTab] = useState('party')
  const [search, setSearch] = useState('')
  function handleTabChange(tab) {
    setActiveTab(tab)
    setSearch('')
  }

  function set(path, value) {
    const parts = path.split('.')
    const updated = structuredClone(data)
    let target = updated
    for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]]
    target[parts[parts.length - 1]] = value
    onDataChange(updated)
  }

  const party = data.party || {}
  const actors = data.actors?._data || 
  (Array.isArray(data.actors) ? data.actors : [])
  const variables = data.variables?._data || []
  const switches = data.switches?._data || []
  const items = party._items || {}
  const weapons = party._weapons || {}
  const armors = party._armors || {}

  const tabs = ['party', 'actors', 'inventory', 'variables', 'switches']
  function matches(name, value) {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      String(name).toLowerCase().includes(q) ||
      String(value).toLowerCase().includes(q)
    )
  }

  return (
    <div className="rpgmaker">
      {/* Tabs */}
      <div className="rpgmaker__tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`rpgmaker__tab ${activeTab === tab ? 'rpgmaker__tab--active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tabIcon(tab)} {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        {/* Search bar — hidden on party tab */}
        {activeTab !== 'party' && (
          <div className="rpgmaker__search">
            <span className="rpgmaker__search-icon">🔍</span>
            <input
              className="rpgmaker__search-input"
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="rpgmaker__search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        )}
      </div>

      <div className="rpgmaker__content">

        {/* Party Tab */}
        {activeTab === 'party' && (
          <div className="rpgmaker__section">
            <div className="rpgmaker__card">
              <div className="rpgmaker__card-title">💰 Gold</div>
              <input
                className="rpgmaker__input rpgmaker__input--large"
                type="number"
                value={party._gold ?? 0}
                onChange={e => set('party._gold', Number(e.target.value))}
              />
            </div>
            <div className="rpgmaker__card">
              <div className="rpgmaker__card-title">👣 Steps</div>
              <input
                className="rpgmaker__input rpgmaker__input--large"
                type="number"
                value={party._steps ?? 0}
                onChange={e => set('party._steps', Number(e.target.value))}
              />
            </div>
            <div className="rpgmaker__card">
              <div className="rpgmaker__card-title">⏱ Playtime (frames)</div>
              <input
                className="rpgmaker__input rpgmaker__input--large"
                type="number"
                value={data.system?._framesOnSave ?? 0}
                onChange={e => set('system._framesOnSave', Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Actors Tab */}
        {activeTab === 'actors' && (
        <div className="rpgmaker__actors">
            {actors.map((actor, index) => {
            if (!actor || !actor._name) return null
            if (!matches(getActorName(index + 1), actor._name)) return null
            const actorPath = `actors._data.${index}`
            return (
                <div key={index} className="rpgmaker__actor-card">
                <div className="rpgmaker__actor-name">
                    {getActorName(index + 1)} ({actor._name})
                </div>
                <div className="rpgmaker__stats">
                    <StatField label="Level" value={actor._level} path={`${actorPath}._level`} set={set} />
                    <StatField label="HP" value={actor._hp} path={`${actorPath}._hp`} set={set} />
                    <StatField label="MP" value={actor._mp} path={`${actorPath}._mp`} set={set} />
                    <StatField label="TP" value={actor._tp} path={`${actorPath}._tp`} set={set} />
                </div>
                <div className="rpgmaker__actor-label">Experience</div>
                {actor._exp && Object.entries(actor._exp).map(([classId, exp]) => (
                    <div key={classId} className="rpgmaker__field-row">
                    <span className="rpgmaker__field-key">Class {classId} EXP</span>
                    <input
                        className="rpgmaker__input"
                        type="number"
                        value={exp}
                        onChange={e => {
                        const updated = structuredClone(data)
                        updated.actors._data[index]._exp[classId] = Number(e.target.value)
                        onDataChange(updated)
                        }}
                    />
                    </div>
                ))}
                </div>
            )
            })}
            {actors.filter(a => a && a._name).length === 0 && (
            <div className="rpgmaker__empty">No actor data found in this save</div>
            )}
        </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="rpgmaker__section">
            <InventorySection
              title="🎒 Items" entries={items} getName={getItemName}
              path="party._items" data={data} onDataChange={onDataChange} search={search}
            />
            <InventorySection
              title="⚔️ Weapons" entries={weapons} getName={getWeaponName}
              path="party._weapons" data={data} onDataChange={onDataChange} search={search}
            />
            <InventorySection
              title="🛡️ Armors" entries={armors} getName={getArmorName}
              path="party._armors" data={data} onDataChange={onDataChange} search={search}
            />
          </div>
        )}

        {/* Variables Tab */}
        {activeTab === 'variables' && (
          <div className="rpgmaker__list">
            {variables.filter((val, index) =>
              val !== null && val !== undefined && matches(getVariableName(index), val)
            ).length === 0 && (
              <div className="rpgmaker__empty">No results</div>
            )}
            {variables.map((val, index) => (
              val !== null && val !== undefined && matches(getVariableName(index), val) ? (
                <div key={index} className="rpgmaker__field-row">
                  <span className="rpgmaker__field-key">{getVariableName(index)}</span>
                  <input
                    className="rpgmaker__input"
                    type={typeof val === 'number' ? 'number' : 'text'}
                    value={String(val)}
                    onChange={e => {
                      const updated = structuredClone(data)
                      updated.variables._data[index] = typeof val === 'number'
                        ? Number(e.target.value)
                        : e.target.value
                      onDataChange(updated)
                    }}
                  />
                  <span className="rpgmaker__field-id">#{index}</span>
                </div>
              ) : null
            ))}
          </div>
        )}

        {/* Switches Tab */}
        {activeTab === 'switches' && (
          <div className="rpgmaker__list">
            {switches.filter((val, index) =>
              val !== null && val !== undefined && matches(getSwitchName(index), val)
            ).length === 0 && (
              <div className="rpgmaker__empty">No results</div>
            )}
            {switches.map((val, index) => (
              val !== null && val !== undefined && matches(getSwitchName(index), val) ? (
                <div key={index} className="rpgmaker__field-row">
                  <span className="rpgmaker__field-key">{getSwitchName(index)}</span>
                  <select
                    className="rpgmaker__input"
                    value={String(val)}
                    onChange={e => {
                      const updated = structuredClone(data)
                      updated.switches._data[index] = e.target.value === 'true'
                      onDataChange(updated)
                    }}
                  >
                    <option value="true">ON</option>
                    <option value="false">OFF</option>
                  </select>
                  <span className="rpgmaker__field-id">#{index}</span>
                </div>
              ) : null
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

function StatField({ label, value, path, set }) {
  return (
    <div className="rpgmaker__stat">
      <div className="rpgmaker__stat-label">{label}</div>
      <input
        className="rpgmaker__input"
        type="number"
        value={value ?? 0}
        onChange={e => set(path, Number(e.target.value))}
      />
    </div>
  )
}

function InventorySection({ title, entries, getName, path, data, onDataChange, search }) {
  const entryList = Object.entries(entries || {}).filter(([id, qty]) =>
    !search.trim() ||
    getName(Number(id)).toLowerCase().includes(search.toLowerCase()) ||
    String(qty).includes(search)
  )

  return (
    <div className="rpgmaker__inventory-section">
      <div className="rpgmaker__inventory-title">{title}</div>
      {entryList.length === 0 && <div className="rpgmaker__empty">No results</div>}
      {entryList.map(([id, qty]) => (
        <div key={id} className="rpgmaker__field-row">
          <span className="rpgmaker__field-key">{getName(Number(id))}</span>
          <input
            className="rpgmaker__input"
            type="number"
            value={qty}
            onChange={e => {
              const updated = structuredClone(data)
              const parts = path.split('.')
              let target = updated
              for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]]
              target[parts[parts.length - 1]][id] = Number(e.target.value)
              onDataChange(updated)
            }}
          />
          <span className="rpgmaker__field-id">#{id}</span>
        </div>
      ))}
    </div>
  )
}

function tabIcon(tab) {
  const icons = { party: '👥', actors: '🧙', inventory: '🎒', variables: '📊', switches: '🔘' }
  return icons[tab] || '📁'
}