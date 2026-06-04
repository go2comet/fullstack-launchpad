import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listTasks, createTask } from '@/lib/tasks/repository'
import { createTaskSchema } from '@/lib/tasks/schema'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tasks = await listTasks(supabase)
    return NextResponse.json({ data: tasks, error: null })
  } catch (err) {
    console.error('[GET /api/tasks]', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = createTaskSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  try {
    const task = await createTask(supabase, user.id, parsed.data)
    return NextResponse.json({ data: task, error: null }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/tasks]', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}
