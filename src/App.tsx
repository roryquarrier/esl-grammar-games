import { useState } from 'react'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import './App.css'
import { AppChrome } from './ui/AppChrome/AppChrome'
import { GameScreen } from './ui/GameScreen/GameScreen'
import { DashboardLite } from './ui/DashboardLite/DashboardLite'
import { TeacherSignIn } from './ui/Auth/TeacherSignIn'
import { TeacherSync } from './ui/Auth/TeacherSync'

type Route = 'game' | 'dashboard' | 'sign-in'

function App() {
  const [route, setRoute] = useState<Route>('game')

  return (
    <>
      <SignedIn>
        <TeacherSync />
        <AppChrome>
          {route === 'game' && <GameScreen />}
          {route === 'dashboard' && <DashboardLite />}
          <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button onClick={() => setRoute('game')}>Game</button>
            <button onClick={() => setRoute('dashboard')}>Dashboard</button>
          </nav>
        </AppChrome>
      </SignedIn>

      <SignedOut>
        {route === 'sign-in' ? (
          <TeacherSignIn />
        ) : (
          <AppChrome>
            <GameScreen />
            <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button onClick={() => setRoute('sign-in')}>Sign In</button>
            </nav>
          </AppChrome>
        )}
      </SignedOut>
    </>
  )
}

export default App
