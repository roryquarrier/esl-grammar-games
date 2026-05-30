import { useState, useCallback } from 'react'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import './App.css'
import { AppChrome } from './ui/AppChrome/AppChrome'
import { GameScreen } from './ui/GameScreen/GameScreen'
import { DashboardLite } from './ui/DashboardLite/DashboardLite'
import { TeacherSignIn } from './ui/Auth/TeacherSignIn'
import { TeacherSync } from './ui/Auth/TeacherSync'
import { StudentSelect } from './ui/Auth/StudentSelect'
import type { Student } from './lib/database.types'

type Route = 'game' | 'dashboard' | 'sign-in' | 'student-select'

interface StudentSession {
  studentId: string
  displayName: string
  teacherId: string
  avatarKey: string
  bookLevel: string
}

const STORAGE_KEY = 'studentSession'

function loadSession(): StudentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSession(student: Student): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    studentId: student.id,
    displayName: student.display_name,
    teacherId: student.teacher_id,
    avatarKey: student.avatar_key,
    bookLevel: student.book_level,
  }))
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

function App() {
  const [route, setRoute] = useState<Route>('game')
  const [studentSession, setStudentSession] = useState<StudentSession | null>(loadSession)

  const handleStudentSelect = useCallback((student: Student) => {
    persistSession(student)
    setStudentSession(loadSession())
    setRoute('game')
  }, [])

  const handleSwitchStudent = useCallback(() => {
    clearSession()
    setStudentSession(null)
    setRoute('student-select')
  }, [])

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
        ) : studentSession ? (
          <AppChrome>
            <GameScreen />
            <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button onClick={handleSwitchStudent}>Switch Student</button>
              <button onClick={() => setRoute('sign-in')}>Sign In</button>
            </nav>
          </AppChrome>
        ) : (
          <StudentSelect onSelect={handleStudentSelect} />
        )}
      </SignedOut>
    </>
  )
}

export default App
