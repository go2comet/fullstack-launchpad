import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_NEXT_PREFIXES = ['/dashboard']

function isSafeRedirect(next: string | null): boolean {
  if (!next) return false
  // Only allow relative paths starting with known protected prefixes
  return next.startsWith('/') && ALLOWED_NEXT_PREFIXES.some((p) => next.startsWith(p))
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const redirectTo = isSafeRedirect(next) ? next! : '/dashboard'
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
