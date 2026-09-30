# Đặc tả mở rộng sản phẩm — Tối nay ăn gì

## Phạm vi

Triển khai lần lượt các tính năng 1, 2, 3, 4, 6 và 8 trong khi bỏ qua tính năng nhập/xuất dữ liệu và chia sẻ kết quả.

Thứ tự triển khai:

1. Lịch sử món đã quay.
2. Bộ lọc nâng cao.
3. Món yêu thích.
4. Chế độ nhóm.
5. Thống kê quản trị.
6. PWA và tối ưu trải nghiệm mobile.

Mục tiêu là giữ trải nghiệm mở hòm hiện tại: reel vẫn quay liên tục, món thắng dừng đúng dưới mũi tên, modal chúc mừng và âm thanh không bị thay đổi ngoài phạm vi cần thiết.

## Quyết định dữ liệu món

Mỗi món được bổ sung các trường:

- `isVegetarian`: món chay hay không.
- `priceLevel`: mức giá 1–3, thay cho việc lưu giá tiền cụ thể ở phiên bản đầu.
- `prepTimeMinutes`: thời gian chuẩn bị, số nguyên dương.
- `mealTimes`: danh sách buổi ăn, gồm `BREAKFAST`, `LUNCH`, `DINNER`, `LATE_NIGHT`.

Các trường mới có giá trị mặc định an toàn để dữ liệu món hiện tại không bị mất: món không chay, mức giá 1, thời gian 30 phút và `DINNER`.

## Tính năng 1 — Lịch sử món đã quay

Mỗi lần mở hòm thành công tạo một bản ghi lịch sử gồm món được chọn, thời điểm, danh mục đang lọc và các bộ lọc áp dụng. Lịch sử của khách dùng `localStorage`, không yêu cầu tài khoản; server vẫn trả về dữ liệu kết quả như hiện tại.

Giao diện hiển thị các món gần đây bên dưới kết quả, có thể xóa lịch sử trên thiết bị. Khi bật tùy chọn “Không lặp món hôm nay”, client gửi danh sách ID đã quay trong ngày để server loại các món đó khỏi pool nếu vẫn còn món hợp lệ.

Nếu pool sau khi loại trừ rỗng, giao diện báo rõ và cho phép quay lại toàn bộ pool.

## Tính năng 2 — Bộ lọc nâng cao

Bộ lọc hiện tại được mở rộng với:

- Danh mục.
- Món chay.
- Mức giá.
- Thời gian chuẩn bị.
- Buổi ăn.
- Độ cay.

Mọi thay đổi bộ lọc cập nhật preview reel ngay, không reload trang. API draw nhận một schema lọc duy nhất dùng chung cho preview và lần quay thật. Admin form có trường tương ứng và validation rõ ràng.

## Tính năng 3 — Món yêu thích

Danh sách yêu thích lưu trong `localStorage` theo ID món. Người dùng có thể thêm/bỏ yêu thích ngay trên tile, kết quả và lịch sử. Có bộ lọc “Chỉ món yêu thích” trong action zone.

Nếu món bị admin tắt hoặc xóa, ID đó được bỏ qua khi tải danh sách yêu thích; không làm hỏng giao diện.

## Tính năng 4 — Chế độ nhóm

Người dùng có thể tạo phòng bằng mã ngắn. Phòng lưu trên database với trạng thái mở, danh sách người tham gia tạm thời, bộ lọc chung và các lượt bình chọn. Không yêu cầu tài khoản; mỗi trình duyệt có một mã người tham gia trong phòng.

Luồng chính:

1. Người tạo phòng chọn bộ lọc và nhận mã phòng.
2. Người khác nhập mã để tham gia.
3. Mỗi người chọn các món muốn/không muốn hoặc bỏ phiếu cho món đề xuất.
4. Chủ phòng khóa bình chọn.
5. Server chọn món thắng từ các món hợp lệ và hiển thị modal kết quả cho phòng.

Phiên bản đầu dùng polling nhẹ theo chu kỳ, không thêm WebSocket để giữ đơn giản và phù hợp Vercel serverless. Phòng tự hết hạn sau 30 phút không hoạt động.

## Tính năng 6 — Thống kê quản trị

Ghi nhận số lượt mở hòm thành công và món được chọn. Trang admin có các thẻ:

- Tổng lượt quay.
- Món được chọn nhiều nhất.
- Món chưa từng được chọn.
- Danh mục phổ biến.
- Hoạt động 7 ngày gần nhất.

Thống kê chỉ dành cho admin, truy vấn aggregate ở server và giới hạn dữ liệu trả về. Không hiển thị thông tin nhận diện người dùng.

## Tính năng 8 — PWA và mobile

Thêm manifest, icon, theme màu và service worker tối thiểu cho app shell. Dữ liệu món vẫn cần mạng; offline chỉ hiển thị shell và trạng thái không kết nối, không giả vờ quay khi không có pool mới.

Mobile ưu tiên:

- Nút mở hòm dễ chạm.
- Bộ lọc cuộn ngang hoặc xếp hàng gọn.
- Modal không vượt chiều cao màn hình.
- Reel không tạo vùng trống khi đổi kích thước.

## Kiến trúc và tương thích

- Giữ Prisma/Postgres làm nguồn dữ liệu chính.
- Giữ API route hiện tại và mở rộng schema bằng Zod.
- Tách local persistence thành các hook client có test riêng.
- Không đưa secret hoặc dữ liệu admin vào client bundle.
- Mọi migration phải có default hoặc backfill an toàn.
- Mỗi tính năng hoàn thành một commit riêng, có test trước khi triển khai.

## Tiêu chí nghiệm thu

- Mỗi tính năng có test đơn vị hoặc component cho luồng chính và trạng thái lỗi.
- `npm test -- --run`, `npm run lint` và `npm run build` pass sau mỗi mốc.
- Dữ liệu món cũ vẫn hiển thị và quay được sau migration.
- Không có reload trang khi lọc, yêu thích, xem lịch sử hoặc dùng PWA shell.
- Chế độ nhóm hoạt động trên Vercel với polling, không phụ thuộc process chạy nền.
