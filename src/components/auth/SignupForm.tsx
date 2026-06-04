'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import styles from './AuthForm.module.css'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <p className={styles.successMessage}>
        Check your inbox — we sent a confirmation link to <strong>{email}</strong>.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Field label="Email" error={undefined}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Password" error={undefined}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      <Button type="submit" loading={loading} style={{ width: '100%' }}>
        Create account
      </Button>
    </form>
  )
}
