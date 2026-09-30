# Thiết kế ứng dụng "Tối nay ăn gì"

## 1. Mục tiêu

Xây dựng một web app tiếng Việt giúp người dùng chọn món ăn ngẫu nhiên bằng trải nghiệm mở hòm lấy cảm hứng từ giao diện CS:GO. Người dùng chọn nhóm món, bấm mở hòm, xem reel chạy qua các món và nhận một món kết quả. Quản trị viên có khu vực riêng để quản lý dữ liệu món ăn.

Ứng dụng không có tiền cược, vật phẩm trả phí hoặc phần thưởng quy đổi. Trọng số chỉ là xác suất tương đối do quản trị viên cấu hình để cân bằng danh sách món.

## 2. Phạm vi phiên bản đầu

### Có trong phạm vi

- Trang công khai `/` với giao diện dark-tech arcade.
- Chọn một hoặc nhiều nhóm món trước khi quay.
- Reel món ăn có animation quay, pointer ở giữa và trạng thái loading.
- Kết quả reveal gồm ảnh, tên, nhóm và mô tả món.
- Dữ liệu món ăn lưu trong PostgreSQL.
- Seed dữ liệu món Việt mẫu.
- Admin login bằng mật khẩu cấu hình qua environment variable.
- Admin CRUD món ăn: tạo, xem, sửa, xóa, bật/tắt, tìm kiếm, lọc nhóm.
- Điều chỉnh trọng số món ăn.
- Responsive cho desktop và mobile.
- Deploy theo mô hình Next.js trên Vercel.

### Chưa có trong phạm vi

- Tài khoản người dùng và lịch sử quay cá nhân.
- Upload ảnh trực tiếp ở phiên bản đầu. Admin nhập URL ảnh; Vercel Blob có thể bổ sung sau.
- Đồng bộ dữ liệu realtime.
- Đa ngôn ngữ.
- Thanh toán, điểm, tiền ảo hoặc cơ chế gacha có giá trị.

## 3. Design read và design system

Reading this as: consumer utility app cho người dùng muốn quyết định bữa ăn nhanh, với ngôn ngữ dark-tech arcade lấy cảm hứng từ case-opening game UI, triển khai bằng custom CSS và Tailwind thay vì sao chép thương hiệu hay tài sản của CS:GO.

### Design dials

- `DESIGN_VARIANCE: 8`: khung vát góc, reel bất đối xứng nhẹ, hierarchy mạnh.
- `MOTION_INTENSITY: 8`: animation reel, glow khi dừng, reveal có nhịp và reduced-motion fallback.
- `VISUAL_DENSITY: 5`: trang chính tập trung vào một hành động chính; admin có mật độ thông tin cao hơn.

### Token hình ảnh

- Theme duy nhất: dark.
- Nền: xanh tím gần đen.
- Accent chính: violet-magenta neon, dùng nhất quán cho CTA, pointer và focus state.
- Neutral: ink navy, slate violet, white lavender.
- Semantic status dùng độ sáng và border, không tạo thêm palette accent cạnh tranh.
- Shape system: các panel chính dùng góc vát bằng clip-path/CSS polygon; control nhỏ dùng radius 8px; không dùng nhiều kiểu bo góc tùy ý.
- Typography: sans display đậm cho heading và sans dễ đọc cho nội dung; không dùng Inter làm lựa chọn mặc định nếu font khác phù hợp hơn.
- Icon: một thư viện icon được chọn thống nhất, ưu tiên Phosphor.

## 4. Kiến trúc kỹ thuật

### Stack

- Next.js App Router, TypeScript.
- React Server Components cho phần đọc dữ liệu và layout tĩnh.
- Client components chỉ cho reel, filter, modal reveal và form admin có tương tác.
- Tailwind CSS v4 và CSS layer riêng cho case-opening effects.
- Motion cho animation; hỗ trợ `prefers-reduced-motion`.
- Prisma ORM.
- PostgreSQL provisioned through a Vercel Marketplace integration, ưu tiên Prisma Postgres; Neon là lựa chọn tương thích.
- Vercel cho hosting và serverless functions.

### Ranh giới module

- `app/(public)/`: route và layout trang công khai.
- `app/admin/`: route admin và layout bảo vệ.
- `app/api/` hoặc Server Actions: mutation admin và random selection.
- `components/case-opening/`: reel, dish tile, pointer, reveal.
- `components/admin/`: table, filter, editor form, confirm dialog.
- `lib/db/`: Prisma client và query helpers.
- `lib/auth/`: kiểm tra mật khẩu admin, signed cookie session.
- `lib/random/`: lọc món hợp lệ và weighted random.
- `prisma/schema.prisma`: schema database.
- `prisma/seed.ts`: dữ liệu món mẫu.

## 5. Luồng người dùng

### Public flow

1. Người dùng mở `/` và thấy case-opening stage.
2. Người dùng chọn nhóm món hoặc giữ lựa chọn mặc định tất cả nhóm.
3. Người dùng bấm `MỞ HÒM`.
4. Client lấy danh sách món hợp lệ từ server hoặc gọi endpoint random.
5. Reel chạy qua một chuỗi item đã tạo trước, món kết quả được đặt ở vị trí pointer.
6. Khi animation kết thúc, reveal panel hiển thị món trúng.
7. Người dùng có thể quay lại hoặc mở lượt mới.

### Admin flow

1. Admin truy cập `/admin`.
2. Nếu chưa có session, chuyển tới `/admin/login`.
3. Admin nhập mật khẩu. Server kiểm tra với `ADMIN_PASSWORD` và tạo signed httpOnly cookie.
4. Admin xem danh sách món, lọc theo nhóm/trạng thái và tìm kiếm.
5. Admin tạo hoặc sửa món qua form có validation.
6. Admin có thể tắt món khỏi pool random mà không xóa dữ liệu.
7. Xóa món yêu cầu confirm và chỉ xóa bản ghi món đó.

## 6. Data model

### Dish

- `id`: String, cuid, primary key.
- `name`: String, bắt buộc.
- `slug`: String, unique.
- `imageUrl`: String, bắt buộc, URL hợp lệ.
- `category`: enum hoặc String có tập giá trị được kiểm soát: `RICE`, `NOODLE`, `SOUP`, `SNACK`, `DRINK`, `OTHER`.
- `description`: String, tùy chọn, giới hạn độ dài.
- `spiceLevel`: Int, 0-3, mặc định 0.
- `weight`: Int, lớn hơn hoặc bằng 1, mặc định 1.
- `isActive`: Boolean, mặc định true.
- `createdAt`: DateTime.
- `updatedAt`: DateTime.

Index trên `category`, `isActive`, `name`.

### Auth

Không lưu tài khoản admin trong database ở phiên bản đầu. Mật khẩu nằm trong `ADMIN_PASSWORD`; session ký bằng `ADMIN_SESSION_SECRET`. Có thể thay thế bằng Auth.js hoặc Better Auth khi cần nhiều quản trị viên.

## 7. Weighted random

Server chỉ lấy những món có `isActive = true` và thuộc nhóm đã chọn. Món có `weight` càng cao thì xác suất tương đối càng lớn. Nếu không có món hợp lệ, server trả lỗi có mã `EMPTY_DISH_POOL`; giao diện hiển thị empty state và liên kết sang admin.

Việc chọn kết quả thực hiện phía server để không phụ thuộc vào dữ liệu client và tránh trạng thái khác nhau giữa các lượt. Client chỉ nhận chuỗi item để render animation cùng kết quả đã chọn.

## 8. Routes và API surface

- `GET /`: public case opener.
- `GET /admin/login`: form đăng nhập.
- `POST /admin/login`: tạo session.
- `POST /admin/logout`: xóa session.
- `GET /admin`: dashboard món ăn.
- `GET /admin/dishes/new`: form tạo món.
- `GET /admin/dishes/[id]/edit`: form sửa món.
- `POST /api/draw`: nhận danh sách category tùy chọn, trả reel items và selected dish.
- `POST /api/admin/dishes`: tạo món.
- `PATCH /api/admin/dishes/[id]`: cập nhật món.
- `DELETE /api/admin/dishes/[id]`: xóa món.

Tất cả route `/api/admin/*` kiểm tra session server-side. Input được validate bằng schema trước khi gọi Prisma.

## 9. Vercel deployment contract

### Environment variables

- `DATABASE_URL`: do Vercel Marketplace integration cấp.
- `DIRECT_URL`: tùy chọn, dùng cho migration nếu provider cung cấp direct connection.
- `ADMIN_PASSWORD`: mật khẩu admin production.
- `ADMIN_SESSION_SECRET`: secret đủ dài để ký session.

### Build và database

- `postinstall`: generate Prisma client nếu dùng Prisma client generation trong build.
- `build`: generate client, chạy kiểm tra TypeScript/lint và build Next.js.
- Migration chạy chủ động bằng script có `DIRECT_URL` hoặc quy trình CI, không chạy migration phá dữ liệu mỗi lần request.
- Seed chạy riêng cho local và môi trường được chỉ định, không seed tự động vào production nếu chưa có cờ rõ ràng.
- Không ghi file runtime vào local filesystem của Vercel.

### Preview/Production

Preview và Production dùng environment variables của Vercel. Database phải có migration versioned trong repo. Ảnh dùng URL ngoài database; nếu thêm upload, dùng Vercel Blob và chỉ lưu URL Blob trong `imageUrl`.

## 10. Error handling và accessibility

- Loading state: skeleton reel và disabled CTA, không dùng spinner đơn độc.
- Empty state: thông báo chưa có món đang bật và hướng dẫn admin.
- Error state: lỗi inline ở form; lỗi draw hiển thị trong stage với nút thử lại.
- Keyboard: CTA, filter, table action và modal có focus state rõ.
- Modal reveal đóng được bằng Escape và giữ focus hợp lý.
- Animation tắt hoặc rút gọn khi `prefers-reduced-motion: reduce`.
- Contrast CTA đạt WCAG AA; không dùng chữ trắng trên accent thiếu tương phản.
- Ảnh món có alt text theo tên món.

## 11. Kiểm thử và xác minh

- Unit test weighted random: pool rỗng, một món, nhiều món, category filter, weight validation.
- Unit test validation schema và auth cookie.
- Integration test query CRUD món.
- E2E smoke test public draw và admin create/edit/toggle/delete.
- `npm run build` phải chạy được với environment variables mẫu hoặc test database.
- Manual visual QA desktop/mobile cho reel, reveal, admin table và reduced-motion.

## 12. Tiêu chí hoàn thành

- Người dùng có thể quay và nhận món từ dữ liệu PostgreSQL thật.
- Admin có thể quản lý món mà không sửa code.
- Không có món inactive xuất hiện trong pool.
- Ứng dụng chạy local và có hướng dẫn deploy Vercel rõ ràng.
- Preview deployment không phụ thuộc filesystem local.
- UI giữ tinh thần case-opening của ảnh tham chiếu nhưng không sao chép logo, text hoặc tài sản thương hiệu bên thứ ba.
