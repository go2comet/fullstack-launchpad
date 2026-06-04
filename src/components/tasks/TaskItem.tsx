'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import styles from './TaskItem.module.css'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [loading, setLoading] = useState(false)

  async function toggleComplete() {
    setLoading(true)
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_complete: !task.is_complete }),
    })
    const { data } = await res.json()
    if (data) onUpdate(data)
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    onDelete(task.id)
  }

  return (
    <li className={[styles.item, task.is_complete ? styles.complete : ''].join(' ')}>
      <button
        className={styles.checkbox}
        onClick={toggleComplete}
        disabled={loading}
        aria-label={task.is_complete ? 'Mark incomplete' : 'Mark complete'}
      >
        <span className={styles.checkmark} aria-hidden />
      </button>
      <div className={styles.content}>
        <span className={styles.title}>{task.title}</span>
        {task.description ? (
          <span className={styles.description}>{task.description}</span>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        aria-label={`Delete task: ${task.title}`}
      >
        Delete
      </Button>
    </li>
  )
}
