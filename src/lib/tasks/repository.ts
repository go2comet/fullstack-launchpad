import type { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import type { CreateTaskInput, UpdateTaskInput } from './schema'

type Task = Database['public']['Tables']['tasks']['Row']
type DbClient = Awaited<ReturnType<typeof createClient>>

export async function listTasks(db: DbClient): Promise<Task[]> {
  const { data, error } = await db
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getTask(db: DbClient, id: string): Promise<Task | null> {
  const { data, error } = await db
    .from('tasks')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createTask(db: DbClient, userId: string, input: CreateTaskInput): Promise<Task> {
  const { data, error } = await db
    .from('tasks')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(db: DbClient, id: string, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await db
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(db: DbClient, id: string): Promise<void> {
  const { error } = await db.from('tasks').delete().eq('id', id)
  if (error) throw error
}
