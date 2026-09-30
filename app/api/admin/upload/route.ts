import { put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
import { hasAdminSession } from '@/lib/auth/admin-session'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) return Response.json({ error: 'Vui lòng chọn một file ảnh.' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return Response.json({ error: 'Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF.' }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return Response.json({ error: 'Ảnh không được vượt quá 5 MB.' }, { status: 400 })

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const blob = await put(`dishes/${randomUUID()}.${extension}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    })

    return Response.json({ url: blob.url })
  } catch {
    return Response.json({ error: 'Chưa cấu hình Vercel Blob hoặc upload thất bại.' }, { status: 500 })
  }
}
