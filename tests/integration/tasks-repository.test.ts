import { describe, test, expect, vi, beforeEach } from 'vitest'
import { listTasks, createTask, updateTask, deleteTask, getTask } from '@/lib/tasks/repository'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

function makeMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    user_id: 'user-1',
    title: 'Test task',
    description: null,
    is_complete: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

function makeDbClient(overrides: Record<string, unknown> = {}) {
  const chainable = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
    ...overrides,
  }

  return {
    from: vi.fn(() => chainable),
    _chain: chainable,
  } as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient>
}

describe('listTasks', () => {
  test('returns tasks ordered by created_at desc', async () => {
    const tasks = [makeMockTask({ id: 'task-2' }), makeMockTask()]
    const db = makeDbClient()
    const chain = (db as unknown as { _chain: Record<string, ReturnType<typeof vi.fn>> })._chain
    chain.order = vi.fn().mockResolvedValue({ data: tasks, error: null })

    const result = await listTasks(db as never)
    expect(result).toEqual(tasks)
  })

  test('throws when supabase returns an error', async () => {
    const db = makeDbClient()
    const chain = (db as unknown as { _chain: Record<string, ReturnType<typeof vi.fn>> })._chain
    chain.order = vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') })

    await expect(listTasks(db as never)).rejects.toThrow('DB error')
  })
})

describe('createTask', () => {
  test('inserts a task and returns the created row', async () => {
    const task = makeMockTask()
    const db = makeDbClient()
    const chain = (db as unknown as { _chain: Record<string, ReturnType<typeof vi.fn>> })._chain
    chain.single = vi.fn().mockResolvedValue({ data: task, error: null })

    const result = await createTask(db as never, 'user-1', { title: 'Test task' })
    expect(result).toEqual(task)
  })
})

describe('updateTask', () => {
  test('updates a task and returns the updated row', async () => {
    const updated = makeMockTask({ is_complete: true })
    const db = makeDbClient()
    const chain = (db as unknown as { _chain: Record<string, ReturnType<typeof vi.fn>> })._chain
    chain.single = vi.fn().mockResolvedValue({ data: updated, error: null })

    const result = await updateTask(db as never, 'task-1', { is_complete: true })
    expect(result.is_complete).toBe(true)
  })
})

describe('deleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('resolves without error on success', async () => {
    const db = makeDbClient()
    const chain = (db as unknown as { _chain: Record<string, ReturnType<typeof vi.fn>> })._chain
    chain.eq = vi.fn().mockResolvedValue({ error: null })

    await expect(deleteTask(db as never, 'task-1')).resolves.toBeUndefined()
  })
})

describe('getTask', () => {
  test('returns null when task does not exist', async () => {
    const db = makeDbClient()
    const chain = (db as unknown as { _chain: Record<string, ReturnType<typeof vi.fn>> })._chain
    chain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })

    const result = await getTask(db as never, 'nonexistent')
    expect(result).toBeNull()
  })
})
