import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

const VALID_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
}

describe('env validation', () => {
  beforeEach(() => {
    Object.entries(VALID_VARS).forEach(([k, v]) => { process.env[k] = v })
  })

  afterEach(() => {
    Object.keys(VALID_VARS).forEach((k) => { delete process.env[k] })
    vi.resetModules()
  })

  test('parseServerEnv succeeds when all vars are present', async () => {
    const { parseServerEnv } = await import('@/lib/env')
    const env = parseServerEnv()
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(VALID_VARS.NEXT_PUBLIC_SUPABASE_URL)
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe(VALID_VARS.SUPABASE_SERVICE_ROLE_KEY)
  })

  test('parseServerEnv throws when SUPABASE_SERVICE_ROLE_KEY is missing', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const { parseServerEnv } = await import('@/lib/env')
    expect(() => parseServerEnv()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/)
  })

  test('module load throws when NEXT_PUBLIC_SUPABASE_URL is not a valid URL', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'not-a-url'
    await expect(import('@/lib/env')).rejects.toThrow(/NEXT_PUBLIC_SUPABASE_URL/)
  })
})
