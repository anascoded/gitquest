const TROPHIES = [
  {
    id: 1, name: 'First Blood',
    desc: 'Complete your very first battle scenario.',
    icon: '🩸', earned: true, earnedDate: '2026-06-01', rarity: 'common',
  },
  {
    id: 2, name: 'Clean Commit',
    desc: 'Submit a correct command on the first attempt, three battles in a row.',
    icon: '✦', earned: true, earnedDate: '2026-06-04', rarity: 'uncommon',
  },
  {
    id: 3, name: 'No Hints Required',
    desc: 'Complete an entire mission without using a single hint.',
    icon: '🧠', earned: true, earnedDate: '2026-06-08', rarity: 'uncommon',
  },
  {
    id: 4, name: 'Shadow Hunter',
    desc: 'Complete Mission 3 — Saving Your Work.',
    icon: '🎯', earned: false, rarity: 'common',
  },
  {
    id: 5, name: 'Streak Operative',
    desc: 'Maintain a 7-day login streak.',
    icon: '🔥', earned: false, rarity: 'uncommon',
  },
  {
    id: 6, name: 'Branch Commander',
    desc: 'Complete Mission 4 — Branching Out with no mistakes.',
    icon: '⎇', earned: false, rarity: 'rare',
  },
  {
    id: 7, name: 'Zero Day',
    desc: 'Complete any battle in under 10 seconds.',
    icon: '⚡', earned: false, rarity: 'rare',
  },
  {
    id: 8, name: 'Ghost Protocol',
    desc: 'Complete a full mission without the training module — go straight to battle.',
    icon: '👻', earned: false, rarity: 'rare',
  },
  {
    id: 9, name: 'Shadow Breach Neutralized',
    desc: 'Complete all six missions. The operation is over.',
    icon: '🛡', earned: false, rarity: 'legendary',
  },
]

const RARITY = {
  common: { label: 'COMMON', color: '#4a6fa5', border: '#1a2a45', bg: '#0a1220' },
  uncommon: { label: 'UNCOMMON', color: '#00cc66', border: '#00ff8833', bg: '#0d1f15' },
  rare: { label: 'RARE', color: '#9a6fcf', border: '#4a2a8a44', bg: '#110d1f' },
  legendary: { label: 'LEGENDARY', color: '#e4a020', border: '#a0600033', bg: '#1a1005' },
}

const STATS = [
  { label: 'Missions complete', value: '2 / 6' },
  { label: 'Battles won', value: '11' },
  { label: 'Perfect attempts', value: '7' },
  { label: 'Current streak', value: '4 days' },
  { label: 'Coins earned', value: '320' },
  { label: 'Hints used', value: '3' },
]

export default function TrophyRoom({ onBack }) {
  const earned = TROPHIES.filter(t => t.earned)
  const locked = TROPHIES.filter(t => !t.earned)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1a2a45', background: '#080c17', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ fontSize: 11, color: '#4a6fa5', background: 'none', border: '1px solid #1a2a45', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}>
          ← back
        </button>
        <span style={{ fontSize: 11, color: '#4a6fa5', fontFamily: 'monospace', letterSpacing: '0.1em' }}>TROPHY ROOM</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#00ff88', fontFamily: 'monospace' }}>{earned.length} / {TROPHIES.length} UNLOCKED</span>
      </div>

      <div style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, color: '#4a6fa5', letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: 6 }}>COMMENDATIONS</div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: '#c8daf0', fontFamily: 'monospace', marginBottom: 6 }}>Trophy Room</h1>
          <p style={{ fontSize: 13, color: '#4a6fa5', fontFamily: 'monospace', lineHeight: 1.6 }}>
            A record of your field operations. Earn commendations by completing missions, winning battles, and mastering Git under pressure.
          </p>
        </div>

        {/* Agent stats */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, color: '#4a6fa5', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.75rem' }}>AGENT DOSSIER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: '#080c17', border: '1px solid #1a2a45', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#2a3a55', fontFamily: 'monospace', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#c8daf0', fontFamily: 'monospace' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: '#4a6fa5', fontFamily: 'monospace', letterSpacing: '0.1em' }}>COMMENDATION PROGRESS</span>
            <span style={{ fontSize: 10, color: '#00ff88', fontFamily: 'monospace' }}>{Math.round((earned.length / TROPHIES.length) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: '#1a2a45', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(earned.length / TROPHIES.length) * 100}%`, background: '#00ff88', borderRadius: 99 }} />
          </div>
        </div>

        {/* Earned trophies */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, color: '#00ff8888', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.75rem' }}>EARNED — {earned.length}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {earned.map(t => {
              const r = RARITY[t.rarity]
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: r.bg, border: `1px solid ${r.border}`, borderRadius: 10, padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: 26, flexShrink: 0, width: 36, textAlign: 'center' }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#c8daf0', fontFamily: 'monospace' }}>{t.name}</span>
                      <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em', color: r.color, border: `1px solid ${r.border}`, borderRadius: 4, padding: '2px 6px' }}>{r.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#4a6fa5', fontFamily: 'monospace', lineHeight: 1.6 }}>{t.desc}</div>
                  </div>
                  <div style={{ fontSize: 10, color: '#2a3a55', fontFamily: 'monospace', flexShrink: 0, textAlign: 'right' }}>
                    {t.earnedDate}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Locked trophies */}
        <div>
          <div style={{ fontSize: 10, color: '#2a3a55', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.75rem' }}>CLASSIFIED — {locked.length}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {locked.map(t => {
              const r = RARITY[t.rarity]
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#080c17', border: '1px solid #1a2a45', borderRadius: 10, padding: '1rem 1.25rem', opacity: 0.6 }}>
                  <span style={{ fontSize: 26, flexShrink: 0, width: 36, textAlign: 'center', filter: 'grayscale(1)', opacity: 0.3 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#2a3a55', fontFamily: 'monospace' }}>{t.name}</span>
                      <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em', color: '#2a3a55', border: '1px solid #1a2a45', borderRadius: 4, padding: '2px 6px' }}>{r.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#2a3a55', fontFamily: 'monospace', lineHeight: 1.6 }}>{t.desc}</div>
                  </div>
                  <span style={{ fontSize: 16, color: '#1a2a45', flexShrink: 0 }}>⬡</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: '3rem' }} />
      </div>
    </div>
  )
}