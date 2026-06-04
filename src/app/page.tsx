import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.title}>IdeaPaddy</h1>
        <p className={styles.subtitle}>
          Your full-stack workspace. Sign in to get started.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryCta}>Sign in</Link>
          <Link href="/signup" className={styles.secondaryCta}>Create account</Link>
        </div>
      </section>
    </main>
  )
}
