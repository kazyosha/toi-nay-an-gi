import { hasAdminSession } from '@/lib/auth/admin-session'
import { deleteDish, updateDish } from '@/lib/dishes/repository'
import { DishInputSchema } from '@/lib/dishes/validation'

type Params = { params: Promise<{ id: string }> }

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await hasAdminSession())) return unauthorized()

  try {
    const { id } = await params
    const input = DishInputSchema.parse(await request.json())
    const dish = await updateDish(id, input)
    return Response.json({ dish })
  } catch {
    return Response.json({ error: 'Dữ liệu món ăn không hợp lệ hoặc món không tồn tại.' }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await hasAdminSession())) return unauthorized()

  try {
    await deleteDish((await params).id)
    return new Response(null, { status: 204 })
  } catch {
    return Response.json({ error: 'Không thể xóa món ăn.' }, { status: 404 })
  }
}
