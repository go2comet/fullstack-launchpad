import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import styles from '../auth.module.css'

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account.</p>
        <LoginForm />
        <OAuthButtons />
        <p className={styles.switchLink}>
          No account yet?{' '}
          <Link href="/signup">Create one</Link>
        </p>
      </section>
    </main>
  )
}
