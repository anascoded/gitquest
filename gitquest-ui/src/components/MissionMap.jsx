import { useState } from 'react'

const QUESTS = [
  {
    id: 'M1', x: 60, y: 138, done: true,
    title: 'Mission 1 — First Contact',
    levels: [
      { id: 'L1', cmd: 'git init', diff: 'easy', done: true },
      { id: 'L2', cmd: 'git clone', diff: 'easy', done: true },
      { id: 'L3', cmd: 'git remote', diff: 'med', done: true },
    ]
  },
  {
    id: 'M2', x: 150, y: 88, done: true,
    title: 'Mission 2 — Recon',
    levels: [
      { id: 'L1', cmd: 'git status', diff: 'easy', done: true },
      { id: 'L2', cmd: 'git log', diff: 'easy', done: true },
      { id: 'L3', cmd: 'git diff', diff: 'med', done: true },
      { id: 'L4', cmd: 'git show', diff: 'med', done: true },
    ]
  },
  {
    id: 'M3', x: 240, y: 138, active: true,
    title: 'Mission 3 — Saving Your Work',
    levels: [
      { id: 'L1', cmd: 'git add', diff: 'easy', done: false },
      { id: 'L2', cmd: 'git commit -m', diff: 'easy', done: false },
      { id: 'L3', cmd: 'git commit --amend', diff: 'med', done: false },
      { id: 'L4', cmd: 'staging vs. commit', diff: 'med', done: false },
    ]
  },
  { id: 'M4', x: 330, y: 88, locked: true, title: 'Mission 4 — Branching Out', levels: [] },
  { id: 'M5', x: 330, y: 178, locked: true, title: 'Mission 5 — Merge Conflict', levels: [] },
  { id: 'M6', x: 410, y: 58, locked: true, title: 'Mission 6 — Shadow Breach', levels: [] },
]

const LINES = [
  [80, 160, 170, 110], [170, 110, 260, 160], [260, 160, 350, 110],
  [260, 160, 350, 200], [350, 110, 430, 80], [350, 200, 430, 200],
]

const DIFF_STARS = { easy: 1, med: 2, hard: 3 }

function StarRating({ diff }) {
  const count = DIFF_STARS[diff] || 1
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={i <= count ? '#00ff88' : '#1a2a45'} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: 10, color: i => i <= count ? '#00ff88' : '#2a3a55', marginLeft: 4, fontFamily: 'monospace', color: '#4a6fa5' }}>{diff}</span>
    </span>
  )
}

function MissionPanel({ quest, onClose, onStartLevel, onOpenArsenal, onOpenTrophy }) {
  const completed = quest.levels.filter(l => l.done).length
  const total = quest.levels.length
  const isLocked = quest.locked

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'rgba(8,12,23,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: '#0d1526', border: '1px solid #1a2a45',
        borderRadius: 12, padding: '1.5rem', width: '100%', maxWidth: 480,
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#00ff88', fontSize: 18 }}>◎</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#c8daf0', fontFamily: 'monospace' }}>{quest.title}</div>
              <div style={{ fontSize: 11, color: '#4a6fa5', marginTop: 3, fontFamily: 'monospace' }}>
                LEVELS {completed}/{total}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6fa5', fontSize: 18, lineHeight: 1, padding: 0 }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#1a2a45', borderRadius: 99, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ height: '100%', width: total > 0 ? `${(completed / total) * 100}%` : '0%', background: '#00ff88', borderRadius: 99, transition: 'width 0.4s' }} />
        </div>

        {/* Levels */}
        {isLocked ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#2a3a55', fontFamily: 'monospace', fontSize: 13 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⬡</div>
            CLASSIFIED — complete prior missions to unlock
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>

            {quest.levels.map(level => (
              <div key={level.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: level.done ? '#0d1f15' : '#080c17',
                border: `1px solid ${level.done ? '#00ff8833' : '#1a2a45'}`,
                borderRadius: 8, padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: level.done ? '#00ff88' : '#2a3a55', fontFamily: 'monospace', minWidth: 16 }}>
                    {level.done ? '✓' : '○'}
                  </span>
                  <span style={{ fontSize: 13, color: level.done ? '#00cc66' : '#c8daf0', fontFamily: 'monospace' }}>
                    {level.id} — {level.cmd}
                  </span>
                </div>
                <StarRating diff={level.diff} />
              </div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: isLocked ? '#0d1526' : '#003322',
            border: `1px solid ${isLocked ? '#1a2a45' : '#00ff88'}`,
            color: isLocked ? '#2a3a55' : '#00ff88',
            borderRadius: 8, padding: '10px 20px', cursor: isLocked ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace', fontSize: 13, fontWeight: 500,
          }}
            onClick={() => onStartLevel(quest.levels[0]?.cmd)}
            disabled={isLocked}
          >
            ▶ {isLocked ? 'Locked' : 'Start'}
          </button>

          {quest.done && (
            <>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: '1px solid #1a2a45',
                color: '#4a6fa5', borderRadius: 8, padding: '10px 16px',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
              }}>
                ↺ Revisit training
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: '1px solid #1a2a45',
                color: '#4a6fa5', borderRadius: 8, padding: '10px 16px',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
              }}>
                ↺ Revisit battle
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MissionMap({ onBack, onStartLevel, onOpenArsenal, onOpenTrophy }) {
  const [selectedQuest, setSelectedQuest] = useState(null)

  const handleQuestClick = (quest) => {
    if (!quest.locked) setSelectedQuest(quest)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1a2a45', background: '#080c17' }}>
        <span style={{ fontSize: 11, color: '#00ff88', border: '1px solid #00ff8833', borderRadius: 4, padding: '3px 10px', letterSpacing: '0.08em', fontFamily: 'monospace' }}>AGENT</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#4a6fa5', marginBottom: 4, letterSpacing: '0.08em', fontFamily: 'monospace' }}>MISSION PROGRESS</div>
          <div style={{ height: 5, background: '#1a2a45', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '45%', background: '#00ff88', borderRadius: 99 }} />
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#c8daf0' }}>🔥 5</span>
        <span style={{ fontSize: 12, color: '#c8daf0' }}>💰 120</span>
        <span style={{ fontSize: 12, color: '#c8daf0' }}>🔊</span>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, padding: '1.5rem', position: 'relative' }}>
        <div style={{ fontSize: 10, color: '#4a6fa5', letterSpacing: '0.12em', marginBottom: '1rem', fontFamily: 'monospace' }}>MISSION MAP — SECTOR 1</div>

        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Intel room', 'Arsenal'].map(label => (
            <button
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#c8daf0', background: '#0d1526', border: '1px solid #1a2a45', borderRadius: 99, padding: '7px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
              onClick={() => label === 'Arsenal' ? onOpenArsenal() : onOpenTrophy()}
            >
              {label === 'Intel room' ? '🏆' : '🔧'} {label}
            </button>
          ))}
          <button onClick={onBack} style={{ fontSize: 11, color: '#2a3a55', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', marginTop: 4 }}>
            ← abort mission
          </button>
        </div>

        <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 480 }}>
          {LINES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i < 2 ? '#1a3a2a' : '#1a2a45'} strokeWidth="1.5" strokeDasharray="5,4" />
          ))}
          {QUESTS.map(q => (
            <g key={q.id} onClick={() => handleQuestClick(q)}
              style={{ cursor: q.locked ? 'not-allowed' : 'pointer' }}>
              <rect x={q.x} y={q.y} width="40" height="40" rx="6"
                fill={q.active ? '#003322' : q.done ? '#0d1f15' : '#0d1526'}
                stroke={q.active ? '#00ff88' : q.done ? '#00ff8844' : '#1a2a45'}
                strokeWidth={q.active ? 1.5 : 1}
              />
              <text x={q.x + 20} y={q.y + 25} textAnchor="middle" fontSize="13"
                fill={q.active ? '#00ff88' : q.done ? '#00ff88' : '#1a2a45'}
                fontFamily="monospace">
                {q.active ? '◎' : q.done ? '✓' : '⬡'}
              </text>
              <text x={q.x + 20} y={q.y + 54} textAnchor="middle" fontSize="10"
                fill={q.active ? '#00cc66' : q.done ? '#00ff8877' : '#2a3a55'}
                fontFamily="monospace">
                {q.id}
              </text>
            </g>
          ))}
        </svg>

        {/* Mission detail overlay */}
        {selectedQuest && (
          <MissionPanel
            quest={selectedQuest}
            onClose={() => setSelectedQuest(null)}
            onStartLevel={onStartLevel}
            onOpenArsenal={onOpenArsenal}
            onOpenTrophy={onOpenTrophy}
          />
        )}
      </div>
    </div>
  )
}