import { SignIn } from '@clerk/clerk-react'
import styles from './TeacherSignIn.module.css'

export function TeacherSignIn() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Teacher Sign In</h1>
        <p className={styles.subtitle}>Grammar Connect 4</p>
        <SignIn
          routing="hash"
          signUpUrl="/"
          afterSignInUrl="/"
          appearance={{
            elements: {
              card: { boxShadow: 'none', background: 'transparent' },
              headerTitle: { display: 'none' },
              headerSubtitle: { display: 'none' },
              socialButtonsBlockButton: {
                backgroundColor: '#1e2a24',
                border: '1px solid #28ba72',
                color: '#def3e4',
              },
              formFieldInput: {
                backgroundColor: '#1a1f1c',
                border: '1px solid #2a3a30',
                color: '#def3e4',
              },
              formButtonPrimary: {
                backgroundColor: '#28ba72',
                color: '#121212',
              },
              footerActionLink: { color: '#28ba72' },
            },
          }}
        />
      </div>
    </main>
  )
}
