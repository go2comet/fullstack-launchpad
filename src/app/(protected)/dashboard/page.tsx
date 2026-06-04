import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './dashboard.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <section>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.welcome}>
        Welcome{user?.email ? `, ${user.email}` : ''}.
      </p>
      <nav className={styles.nav}>
        <Link href="/dashboard/tasks" className={styles.navCard}>
          <strong>Tasks</strong>
          <span>Manage your to-dos</span>
        </Link>
      </nav>
    </section>
  )
}
