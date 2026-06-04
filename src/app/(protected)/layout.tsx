import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './protected.module.css'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>IdeaPaddy</span>
        <form action="/auth/signout" method="post">
          <button type="submit" className={styles.signout}>Sign out</button>
        </form>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
