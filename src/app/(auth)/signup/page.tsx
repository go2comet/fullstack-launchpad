import Link from 'next/link'
import { SignupForm } from '@/components/auth/SignupForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import styles from '../auth.module.css'

export default function SignupPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.sub}>Start building something.</p>
        <SignupForm />
        <OAuthButtons />
        <p className={styles.switchLink}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}
