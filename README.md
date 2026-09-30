# Tối nay ăn gì

Ứng dụng random món ăn theo phong cách mở hòm CS:GO, có database PostgreSQL và khu vực admin để quản lý món ăn.

## Chạy local

1. Tạo PostgreSQL database và copy `.env.example` thành `.env`.
2. Điền `DATABASE_URL`, `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET`.
3. Cài dependency và tạo schema:

   ```bash
   npm install
   npx prisma migrate deploy
   npm run db:seed
   npm run dev
   ```

Mở `http://localhost:3000`; trang admin ở `/admin`.

## Deploy Vercel

Xem hướng dẫn chi tiết tại [docs/deployment/vercel.md](docs/deployment/vercel.md). Vercel cần các biến `DATABASE_URL`, `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET` trong Project Settings.

## Kiểm tra

```bash
npm test -- --run
npm run lint
npm run build
npm run test:e2e
```

E2E database-backed cần có `DATABASE_URL` và đã chạy seed; nếu chưa có database, test sẽ tự skip để không tạo false negative trong môi trường CI khởi tạo tối thiểu.
