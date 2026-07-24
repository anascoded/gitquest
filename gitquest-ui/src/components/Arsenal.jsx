import { useState } from 'react'

const CATEGORIES = ['all', 'tools', 'boosts', 'cosmetics']

const ITEMS = [
  {
    id: 1, category: 'tools',
    name: 'Auto-hint Module',
    desc: 'Reveals a hint after your first wrong attempt instead of your second.',
    cost: 80, icon: '⚡', owned: false,
  },
  {
    id: 2, category: 'tools',
    name: 'Syntax Scanner',
    desc: 'Highlights the exact part of your command that is wrong on a failed attempt.',
    cost: 120, icon: '🔬', owned: false,
  },
  {
    id: 3, category: 'tools',
    name: 'Ghost Command',
    desc: 'Shows a faded version of the correct command. You still have to type it yourself.',
    cost: 200, icon: '👻', owned: false,
  },
  {
    id: 4, category: 'boosts',
    name: 'Double XP Token',
    desc: 'Earn double coins on your next completed mission.',
    cost: 60, icon: '✦', owned: true,
  },
  {
    id: 5, category: 'boosts',
    name: 'Streak Shield',
    desc: 'Protects your current streak if you miss a day.',
    cost: 90, icon: '🛡', owned: false,
  },
  {
    id: 6, category: 'boosts',
    name: 'Time Freeze',
    desc: 'Pauses any timed battle challenges for 30 seconds.',
    cost: 150, icon: '⏸', owned: false,
  },
  {
    id: 7, category: 'cosmetics',
    name: 'Red Alert Theme',
    desc: 'Switches the UI accent color from green to red. Maximum threat energy.',
    cost: 300, icon: '🔴', owned: false,
  },
  {
    id: 8, category: 'cosmetics',
    name: 'Agent Callsign',
    desc: 'Set a custom callsign that appears in the topbar instead of AGENT.',
    cost: 100, icon: '🪪', owned: false,
  },
  {
    id: 9, category: 'cosmetics',
    name: 'Terminal Cursor',
    desc: 'Changes your battle input cursor to a blinking block instead of the default.',
    cost: 50, icon: '▋', owned: true,
  },
]

/**
 *
 * @param param0
 * @param param0.children
 * @param param0.color
 * @returns {JSX.Element}
 * @constructor
 */
function Tag({ children, color }) {
  const colors = {
    green: { bg: '#0d1f15', border: '#00ff8833', text: '#00cc66' },
    red: { bg: '#1a0808', border: '#e24b4a33', text: '#e24b4a' },
    blue: { bg: '#0a1220', border: '#1a3a6a', text: '#4a8fcf' },
  }
  const c = colors[color] || colors.blue
  return (
    <span style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {children}
    </span>
  )
}

export default function Arsenal({ onBack, coins = 120 }) {
  const [filter, setFilter] = useState('all')
  const [inventory, setInventory] = useState(
    ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: item.owned }), {})
  )
  const [balance, setBalance] = useState(coins)
  const [flash, setFlash] = useState(null)

  const visible = filter === 'all' ? ITEMS : ITEMS.filter(i => i.category === filter)

  const handleBuy = (item) => {
    if (inventory[item.id] || balance < item.cost) return
    setInventory(prev => ({ ...prev, [item.id]: true }))
    setBalance(b => b - item.cost)
    setFlash(item.id)
    setTimeout(() => setFlash(null), 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1a2a45', background: '#080c17', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ fontSize: 11, color: '#4a6fa5', background: 'none', border: '1px solid #1a2a45', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}>
          ← back
        </button>
        <span style={{ fontSize: 11, color: '#4a6fa5', fontFamily: 'monospace', letterSpacing: '0.1em' }}>ARSENAL</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 13, color: '#c8daf0' }}>
          <span style={{ color: '#4a6fa5', fontSize: 11 }}>BALANCE</span>
          <span style={{ color: '#00ff88', fontWeight: 500 }}>💰 {balance}</span>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: 10, color: '#4a6fa5', letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: 6 }}>FIELD EQUIPMENT</div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: '#c8daf0', fontFamily: 'monospace', marginBottom: 6 }}>Arsenal</h1>
          <p style={{ fontSize: 13, color: '#4a6fa5', fontFamily: 'monospace', lineHeight: 1.6 }}>
            Spend your field coins on tools, boosts, and gear. Owned items are active automatically.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em',
              padding: '5px 14px', borderRadius: 99, cursor: 'pointer',
              background: filter === cat ? '#003322' : 'none',
              border: `1px solid ${filter === cat ? '#00ff88' : '#1a2a45'}`,
              color: filter === cat ? '#00ff88' : '#4a6fa5',
              textTransform: 'uppercase',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {visible.map(item => {
            const owned = inventory[item.id]
            const canAfford = balance >= item.cost
            const justBought = flash === item.id
            return (
              <div key={item.id} style={{
                background: owned ? '#0d1f15' : '#0d1526',
                border: `1px solid ${justBought ? '#00ff88' : owned ? '#00ff8833' : '#1a2a45'}`,
                borderRadius: 10, padding: '1.25rem',
                transition: 'border-color 0.3s',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: owned ? '#00cc66' : '#c8daf0', fontFamily: 'monospace', marginBottom: 3 }}>{item.name}</div>
                      <Tag color={item.category === 'tools' ? 'blue' : item.category === 'boosts' ? 'green' : 'red'}>
                        {item.category}
                      </Tag>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: '#4a6fa5', fontFamily: 'monospace', lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: 13, fontFamily: 'monospace', color: owned ? '#4a6fa5' : canAfford ? '#c8daf0' : '#e24b4a' }}>
                    {owned ? '—' : `💰 ${item.cost}`}
                  </span>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={owned || !canAfford}
                    style={{
                      fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.08em',
                      padding: '6px 14px', borderRadius: 6, cursor: owned || !canAfford ? 'not-allowed' : 'pointer',
                      background: owned ? 'none' : canAfford ? '#003322' : 'none',
                      border: `1px solid ${owned ? '#00ff8833' : canAfford ? '#00ff88' : '#e24b4a44'}`,
                      color: owned ? '#00ff8877' : canAfford ? '#00ff88' : '#e24b4a77',
                      opacity: owned || !canAfford ? 0.7 : 1,
                    }}
                  >
                    {owned ? '✓ EQUIPPED' : canAfford ? 'ACQUIRE' : 'INSUFFICIENT'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ height: '3rem' }} />
      </div>
    </div>
  )
}