import { createClient } from '@/lib/supabase/server'
import { listTasks } from '@/lib/tasks/repository'
import { TaskList } from '@/components/tasks/TaskList'
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm'
import styles from './tasks.module.css'

export default async function TasksPage() {
  const supabase = await createClient()
  const initialTasks = await listTasks(supabase)

  return (
    <section>
      <h1 className={styles.heading}>Tasks</h1>
      <CreateTaskForm />
      <TaskList initialTasks={initialTasks} />
    </section>
  )
}
