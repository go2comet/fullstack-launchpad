'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import styles from './AuthForm.module.css'

export function OAuthButtons() {
  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className={styles.oauthGroup}>
      <div className={styles.divider}>
        <span>or</span>
      </div>
      <Button variant="secondary" style={{ width: '100%' }} onClick={signInWithGoogle}>
        Continue with Google
      </Button>
    </div>
  )
}
