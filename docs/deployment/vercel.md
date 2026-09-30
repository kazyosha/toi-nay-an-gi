# Deploy lên Vercel

## 1. Chuẩn bị database

Tạo một PostgreSQL database có connection pooling (Neon, Supabase hoặc nhà cung cấp tương đương). Dùng URL pooled cho `DATABASE_URL`; nếu nhà cung cấp có direct connection URL, lưu thêm `DIRECT_URL` để dùng cho migration từ máy local.

Chạy migration và dữ liệu mẫu từ máy local:

```bash
$env:DATABASE_URL="postgres://..."
npx prisma migrate deploy
npm run db:seed
```

## 2. Import repository

Trong Vercel chọn **Add New Project**, import repository `kazyosha/toi-nay-an-gi`, giữ framework preset là Next.js và để Build Command mặc định `next build`.

Thêm các Environment Variables cho Production, Preview và Development:

| Variable | Giá trị |
| --- | --- |
| `DATABASE_URL` | Pooled PostgreSQL connection string |
| `ADMIN_PASSWORD` | Mật khẩu truy cập `/admin` |
| `ADMIN_SESSION_SECRET` | Chuỗi ngẫu nhiên dài, tối thiểu 32 ký tự |

Không commit `.env` vào repository.

## 3. Sau khi deploy

- Mở `/` và thử nút **MỞ HÒM**.
- Mở `/admin`, đăng nhập và tạo một món test.
- Xác nhận món tắt `Cho phép xuất hiện trong pool` không xuất hiện khi quay.
- Nếu cần seed lại, chạy `npm run db:seed` với `DATABASE_URL` của môi trường tương ứng.

Vercel không nên chạy `prisma migrate dev` trong build; migration production được chạy chủ động bằng `prisma migrate deploy` trước khi đưa phiên bản mới lên phục vụ traffic.
