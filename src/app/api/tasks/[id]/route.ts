import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTask, updateTask, deleteTask } from '@/lib/tasks/repository'
import { updateTaskSchema } from '@/lib/tasks/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const task = await getTask(supabase, id)
    if (!task) {
      return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ data: task, error: null })
  } catch (err) {
    console.error('[GET /api/tasks/:id]', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = updateTaskSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  try {
    const task = await updateTask(supabase, id, parsed.data)
    return NextResponse.json({ data: task, error: null })
  } catch (err) {
    console.error('[PATCH /api/tasks/:id]', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await deleteTask(supabase, id)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/tasks/:id]', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}
