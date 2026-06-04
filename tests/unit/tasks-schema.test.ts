import { describe, test, expect } from 'vitest'
import { createTaskSchema, updateTaskSchema } from '@/lib/tasks/schema'

describe('createTaskSchema', () => {
  test('accepts a valid task', () => {
    const result = createTaskSchema.safeParse({ title: 'Buy milk' })
    expect(result.success).toBe(true)
  })

  test('accepts title with optional description', () => {
    const result = createTaskSchema.safeParse({
      title: 'Buy milk',
      description: 'Whole milk, 2 litres',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toBe('Whole milk, 2 litres')
    }
  })

  test('rejects empty title', () => {
    const result = createTaskSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/required/i)
    }
  })

  test('rejects title exceeding 255 characters', () => {
    const result = createTaskSchema.safeParse({ title: 'a'.repeat(256) })
    expect(result.success).toBe(false)
  })

  test('rejects description exceeding 2000 characters', () => {
    const result = createTaskSchema.safeParse({
      title: 'Valid title',
      description: 'x'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })
})

describe('updateTaskSchema', () => {
  test('accepts partial update with is_complete only', () => {
    const result = updateTaskSchema.safeParse({ is_complete: true })
    expect(result.success).toBe(true)
  })

  test('accepts empty object (no-op update)', () => {
    const result = updateTaskSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  test('rejects is_complete as a non-boolean', () => {
    const result = updateTaskSchema.safeParse({ is_complete: 'yes' })
    expect(result.success).toBe(false)
  })
})
