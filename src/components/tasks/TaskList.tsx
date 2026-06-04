'use client'

import { useEffect, useReducer } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TaskItem } from './TaskItem'
import styles from './TaskList.module.css'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type Action =
  | { type: 'INIT'; tasks: Task[] }
  | { type: 'INSERT'; task: Task }
  | { type: 'UPDATE'; task: Task }
  | { type: 'DELETE'; id: string }

function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'INIT':
      return action.tasks
    case 'INSERT':
      if (state.some((t) => t.id === action.task.id)) return state
      return [action.task, ...state]
    case 'UPDATE':
      return state.map((t) => (t.id === action.task.id ? action.task : t))
    case 'DELETE':
      return state.filter((t) => t.id !== action.id)
  }
}

interface TaskListProps {
  initialTasks: Task[]
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, dispatch] = useReducer(reducer, initialTasks)

  useEffect(() => {
    dispatch({ type: 'INIT', tasks: initialTasks })
  }, [initialTasks])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => dispatch({ type: 'INSERT', task: payload.new as Task })
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => dispatch({ type: 'UPDATE', task: payload.new as Task })
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tasks' },
        (payload) => dispatch({ type: 'DELETE', id: (payload.old as Task).id })
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (tasks.length === 0) {
    return <p className={styles.empty}>No tasks yet. Add one above.</p>
  }

  return (
    <ul className={styles.list} aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={(updated) => dispatch({ type: 'UPDATE', task: updated })} onDelete={(id) => dispatch({ type: 'DELETE', id })} />
      ))}
    </ul>
  )
}
