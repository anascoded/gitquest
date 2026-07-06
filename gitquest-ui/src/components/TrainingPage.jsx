import { useState } from 'react'
import { MISSIONS } from '../missions/Missions'
import { useProgress } from '../context/ProgressContext'

function TerminalBlock({ lines }) {
  return (
    <div style={{ background: '#040810', border: '1px solid #1a2a45', borderRadius: 8, padding: '1rem', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.output) {
          return (
            <div key={i} style={{ color: '#4a6fa5', whiteSpace: 'pre', paddingLeft: 16 }}>{line.output}</div>
          )
        }
        return (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#00ff8877' }}>{line.prompt}</span>
            <span style={{ color: '#c8daf0' }}>{line.cmd}</span>
            {line.comment && <span style={{ color: '#2a3a55' }}>{line.comment}</span>}
          </div>
        )
      })}
    </div>
  )
}

function BattleSection({ battle, onComplete }) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = () => {
    const trimmed = input.trim()
    const isCorrect = trimmed === battle.expected
    setCorrect(isCorrect)
    setSubmitted(true)
    setAttempts(a => a + 1)
    if (isCorrect) {
      setTimeout(() => onComplete(), 1200)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleRetry = () => {
    setInput('')
    setSubmitted(false)
    if (attempts >= 1) setShowHint(true)
  }

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #1a2a45', paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <span style={{ fontSize: 10, color: '#e24b4a', letterSpacing: '0.15em', fontFamily: 'monospace', border: '1px solid #e24b4a44', borderRadius: 4, padding: '3px 8px' }}>BATTLE</span>
        <span style={{ fontSize: 11, color: '#4a6fa5', fontFamily: 'monospace' }}>FIELD SCENARIO</span>
      </div>

      <div style={{ background: '#080c17', border: '1px solid #e24b4a33', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.25rem', fontSize: 13, color: '#c8daf0', lineHeight: 1.7, fontFamily: 'monospace' }}>
        <span style={{ color: '#e24b4a' }}>ALERT: </span>{battle.scenario.replace('ALERT: ', '')}
      </div>

      {showHint && (
        <div style={{ background: '#0d1f15', border: '1px solid #00ff8833', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 12, color: '#00cc66', fontFamily: 'monospace' }}>
          HINT: {battle.hint}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#00ff8877', fontFamily: 'monospace', fontSize: 14 }}>$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitted && correct}
          placeholder="enter command..."
          style={{
            flex: 1, background: '#040810',
            border: `1px solid ${submitted ? (correct ? '#00ff88' : '#e24b4a') : '#1a2a45'}`,
            borderRadius: 8, padding: '10px 14px',
            color: '#c8daf0', fontFamily: 'monospace', fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={submitted && !correct ? handleRetry : handleSubmit}
          disabled={!input.trim()}
          style={{
            background: '#003322', border: '1px solid #00ff88',
            color: '#00ff88', borderRadius: 8, padding: '10px 20px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'monospace', fontSize: 13,
            opacity: input.trim() ? 1 : 0.4,
          }}
        >
          {submitted && !correct ? 'Retry' : 'Execute'}
        </button>
      </div>

      {submitted && (
        <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'monospace', color: correct ? '#00ff88' : '#e24b4a' }}>
          {correct
            ? '✓ COMMAND ACCEPTED — mission objective secured'
            : `✗ REJECTED — ${attempts > 1 ? 'check your syntax carefully' : 'try again'}`}
        </div>
      )}
    </div>
  )
}

export default function TrainingPage({ levelId, questId, onBack, onComplete }) {
  const { completeLevel } = useProgress();
  const data = MISSIONS[questId].levels[levelId];
  const [battleDone, setBattleDone] = useState(false)
  const [skippedToBottom, setSkippedToBottom] = useState(false)

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#4a6fa5', fontFamily: 'monospace' }}>
        <div>No training data found for: {levelId}</div>
        <button onClick={onBack} style={{ marginTop: 16, color: '#00ff88', background: 'none', border: '1px solid #00ff8844', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}>← back</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1a2a45', background: '#080c17', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ fontSize: 11, color: '#4a6fa5', background: 'none', border: '1px solid #1a2a45', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}>
          ← back
        </button>
        <span style={{ fontSize: 11, color: '#4a6fa5', fontFamily: 'monospace' }}>{questId}</span>
        <span style={{ color: '#2a3a55', fontFamily: 'monospace' }}>/</span>
        <span style={{ fontSize: 11, color: '#00ff88', fontFamily: 'monospace' }}>{data.title}</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            setSkippedToBottom(true)
            setTimeout(() => document.getElementById('battle-section')?.scrollIntoView({ behavior: 'smooth' }), 50)
          }}
          style={{ fontSize: 11, color: '#4a6fa5', background: 'none', border: '1px solid #1a2a45', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'monospace' }}
        >
          skip to battle ↓
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 680, width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Mission briefing header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 10, color: '#4a6fa5', letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: 8 }}>TRAINING MODULE</div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: '#00ff88', fontFamily: 'monospace', marginBottom: 4 }}>{data.title}</h1>
          <div style={{ fontSize: 13, color: '#4a6fa5', fontFamily: 'monospace', marginBottom: '1.25rem' }}>{data.subtitle}</div>
          <div style={{ background: '#080c17', border: '1px solid #1a2a45', borderLeft: '3px solid #00ff8844', borderRadius: 8, padding: '1rem 1.25rem', fontSize: 13, color: '#8aaccf', lineHeight: 1.8, fontFamily: 'monospace' }}>
            <span style={{ color: '#4a6fa5', fontSize: 10, letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>HANDLER BRIEFING</span>
            {data.briefing}
          </div>
        </div>

        {/* Sections */}
        {data.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: 11, color: '#00ff8888', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              {section.heading}
            </div>

            {section.body && (
              <p style={{ fontSize: 14, color: '#8aaccf', lineHeight: 1.8, fontFamily: 'monospace' }}>{section.body}</p>
            )}

            {section.blocks && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.blocks.map((block, j) => (
                  <div key={j} style={{ background: '#040810', border: '1px solid #1a2a45', borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#00ff88', marginBottom: 4, whiteSpace: 'pre' }}>{block.code}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4a6fa5' }}>{block.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {section.terminal && <TerminalBlock lines={section.terminal} />}

            {section.comparison && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {section.comparison.map((item, j) => (
                  <div key={j} style={{ background: '#080c17', border: '1px solid #1a2a45', borderRadius: 8, padding: '1rem' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#00ff88', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4a6fa5', lineHeight: 1.7 }}>{item.point}</div>
                  </div>
                ))}
              </div>
            )}

            {section.warnings && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.warnings.map((w, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, background: '#0f0a0a', border: '1px solid #e24b4a22', borderRadius: 8, padding: '10px 14px' }}>
                    <span style={{ color: '#e24b4a', fontFamily: 'monospace', fontSize: 13, flexShrink: 0 }}>!</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8a6a6a', lineHeight: 1.7 }}>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Divider */}
        <div id="battle-section" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2rem 0' }}>
          <div style={{ flex: 1, height: 1, background: '#1a2a45' }} />
          <span style={{ fontSize: 10, color: '#2a3a55', fontFamily: 'monospace', letterSpacing: '0.15em' }}>FIELD ASSESSMENT</span>
          <div style={{ flex: 1, height: 1, background: '#1a2a45' }} />
        </div>

        {/* Battle */}
        {battleDone ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #00ff8844', borderRadius: 12, background: '#0d1f15' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#00ff88', marginBottom: 4 }}>OBJECTIVE SECURED</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4a6fa5', marginBottom: '1.5rem' }}>Training module complete. Returning to mission...</div>
            <button onClick={onComplete} style={{ background: '#003322', border: '1px solid #00ff88', color: '#00ff88', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
              Continue ▶
            </button>
          </div>
        ) : (
          <BattleSection levelId={levelId} battle={data.battle} onComplete={() => {
            completeLevel(levelId);
            setBattleDone(true)
          }}
          />
        )}

        <div style={{ height: '3rem' }} />
      </div>
    </div>
  )
}