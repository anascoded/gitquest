import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import MissionMap from './components/MissionMap'
import TrainingPage from './components/TrainingPage'
import Arsenal from './components/Arsenal'
import TrophyRoom from './components/TrophyRoom'
import { ProgressProvider } from './context/ProgressContext'

const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
}

export default function App() {
  const [screen, setScreen] = useState('welcome')        // 'welcome' | 'map' | 'training'
  const [activeLevel, setActiveLevel] = useState(null)   // { levelId, questId }

  return (
    <ProgressProvider>
      <style>{`
        @keyframes sb-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        body { margin: 0; background: #0a0e1a; }
      `}</style>

      <div style={{ background: '#0a0e1a', minHeight: '100vh', width: '100%', position: 'relative', fontFamily: 'monospace' }}>
        <div style={{ position: 'fixed', inset: 0, ...GRID_STYLE, pointerEvents: 'none' }} />

        <button
          style={{ position: 'fixed', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a6fa5', background: '#0d1526', border: '1px solid #1a2a45', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', zIndex: 100, fontFamily: 'monospace' }}
        >
          🔊 sound on
        </button>

        {screen === 'welcome' && <WelcomeScreen onSelect={() => setScreen('map')} />}
        {screen === 'map' &&
          <MissionMap
            onBack={() => setScreen('welcome')}
            onOpenArsenal={() => setScreen('arsenal')}
            onOpenTrophy={() => setScreen('trophy')}
            onStartLevel={(levelId, questId) => {
              setActiveLevel({ levelId, questId })
              setScreen('training')
            }} />}
        {screen === 'training' && activeLevel && (
          <TrainingPage
            levelId={activeLevel.levelId}
            questId={activeLevel.questId}
            onBack={() => setScreen('map')}
            onComplete={() => setScreen('map')}
          />)}
        {screen === 'arsenal' && <Arsenal onBack={() => setScreen('map')} coins={120} />}
        {screen === 'trophy' && <TrophyRoom onBack={() => setScreen('map')} />}
      </div>
    </ProgressProvider>
  )
}