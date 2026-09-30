# Lịch sử, bộ lọc nâng cao và món yêu thích — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai ba tính năng đầu tiên đã được duyệt: lịch sử món đã quay, bộ lọc nâng cao và món yêu thích; giữ nguyên trải nghiệm reel hiện tại, không reload trang khi thao tác.

**Architecture:** Mở rộng một kiểu `DrawFilters` dùng chung giữa client preview và API draw. Postgres/Prisma vẫn là nguồn dữ liệu món; lịch sử và yêu thích là dữ liệu theo thiết bị trong `localStorage`, được bọc trong các hook client có kiểm tra dữ liệu lỗi/thay đổi schema. Pool server áp dụng filter trước khi chọn trọng số và nhận danh sách ID cần loại trừ. UI giữ `CaseStage` làm state owner, tách bộ lọc nâng cao và các panel lịch sử/yêu thích thành component nhỏ.

**Tech Stack:** Next.js App Router, React client components, Prisma/Postgres, Zod, Vitest/Testing Library, TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-30-product-features-design.md`

---

## Global Constraints

- Không triển khai tính năng 4, 6 hoặc 8 trong plan này; không thêm nhập/xuất dữ liệu hay chia sẻ kết quả.
- Không thay đổi timing, cơ chế dừng dưới mũi tên, âm thanh hoặc modal thắng ngoài phần cần tích hợp state mới.
- Dữ liệu cũ phải tiếp tục đọc được sau migration; mọi field mới có default an toàn.
- Không đưa `localStorage`, secret hoặc dữ liệu admin vào server component/client bundle sai phạm vi.
- Mỗi mốc tính năng hoàn thành một commit riêng; trước khi kết thúc chạy test, lint và build mới.

## Review Focus

- **Data contract:** `MealTime`, `DrawFilters`, `DishRecord`, `DishInput` và Zod schema phải nhất quán giữa Prisma, repository, API và form.
- **No-repeat correctness:** loại trừ ID chỉ áp dụng cho pool quay thật, không làm preview rỗng giả; khi pool rỗng phải có đường quay lại toàn bộ pool.
- **Client persistence:** localStorage chỉ đọc sau mount, xử lý JSON hỏng/phiên bản cũ, không gây hydration mismatch.
- **UX:** mọi filter/favorite/history update là state transition tại chỗ, không gọi `router.refresh()` hoặc reload; thao tác khi đang quay phải được khóa hợp lý.
- **Accessibility:** control có label/aria phù hợp, favorite có trạng thái pressed, thông báo pool rỗng có `role="alert"`.

## Task 1: Chuẩn hóa dữ liệu món và hợp đồng bộ lọc

**Files:** `prisma/schema.prisma`, `prisma/migrations/<timestamp>_add_dish_preferences/migration.sql`, `lib/dishes/types.ts`, `lib/dishes/validation.ts`, `lib/dishes/repository.ts`, `lib/random/weighted-draw.ts`, `lib/dishes/*.test.ts`.

- [ ] Viết test đỏ cho các kiểu/validation mới: `isVegetarian`, `priceLevel` 1–3, `prepTimeMinutes` dương, `mealTimes` chỉ nhận `BREAKFAST|LUNCH|DINNER|LATE_NIGHT`; giữ default khi payload admin bỏ trống.
- [ ] Thêm enum `MealTime` và các field mới vào Prisma `Dish` với default không chay, giá 1, 30 phút, `DINNER`; tạo migration an toàn cho dữ liệu hiện có.
- [ ] Mở rộng `DishRecord`, `DishInput` và khai báo `DrawFilters` dùng chung; thống nhất filter gồm category, vegetarian, price levels, max prep time, meal times, max spice, favorite/include IDs và exclude IDs.
- [ ] Cập nhật repository để `listActiveDishes(filters)` xây dựng một `where` duy nhất, luôn giới hạn `isActive`, hỗ trợ include/exclude ID và chỉ trả public fields cần cho reel/result; cập nhật CRUD admin để lưu field mới.
- [ ] Viết test repository/contract cho filter kết hợp và trường hợp include/exclude rỗng; chạy test đỏ rồi xanh trước khi chuyển task tiếp theo.
- [ ] Commit riêng: `feat: add dish preference and draw filter contract`.

## Task 2: API draw và bộ lọc nâng cao trên màn hình chính

**Files:** `app/api/draw/route.ts`, `app/page.tsx`, `components/case-opening/case-stage.tsx`, `components/case-opening/category-filter.tsx`, `components/case-opening/advanced-filters.tsx`, `components/case-opening/*.test.tsx`, `app/globals.css`.

- [ ] Viết test đỏ cho API schema: payload filter hợp lệ, payload sai trả 400, pool rỗng sau filter/exclude trả 422 với mã rõ ràng, pool còn món thì chọn theo trọng số như hiện tại.
- [ ] Refactor route để parse `DrawFilters` một lần cho preview và draw thật, truyền filter xuống repository, giữ `Cache-Control: no-store`, và trả thêm metadata cần cho UI (ví dụ số lượng pool).
- [ ] Tạo `AdvancedFilters` cho món chay, mức giá, thời gian chuẩn bị, buổi ăn và độ cay; giữ `CategoryFilter` tương thích hoặc chuyển nó thành một phần của filter panel.
- [ ] Refactor `CaseStage` từ `categories` sang một `filters` state; mọi thay đổi filter hủy request preview trước, cập nhật reel ngay khi response mới về, reset lỗi/celebration và không reload trang.
- [ ] Truyền cùng `filters` trong preview và `openCase`; khi đang quay khóa filter, giữ `reelKey`/timing hiện có và không tạo vùng đen khi pool thay đổi.
- [ ] Thêm thông báo rõ cho pool rỗng và nút “Bỏ bộ lọc” tại chỗ; kiểm tra responsive/keyboard focus cho panel.
- [ ] Commit riêng: `feat: add advanced food filters`.

## Task 3: Lịch sử quay theo thiết bị và luật không lặp

**Files:** `lib/history/types.ts`, `lib/history/storage.ts`, `lib/history/use-draw-history.ts`, `lib/history/*.test.ts`, `components/case-opening/draw-history.tsx`, `components/case-opening/case-stage.tsx`, `app/globals.css`.

- [ ] Viết test đỏ cho storage: thêm bản ghi thành công, giới hạn danh sách gần đây, lọc theo ngày, xóa toàn bộ, JSON hỏng/shape cũ không làm crash.
- [ ] Tạo kiểu `DrawHistoryEntry` chứa dish snapshot tối thiểu, `drawnAt`, filter snapshot và category snapshot; tạo hook chỉ hydrate localStorage sau mount và phát sự kiện nội bộ để các component đồng bộ trong cùng tab.
- [ ] Thêm checkbox “Không lặp món hôm nay”, lấy các ID trong ngày theo timezone trình duyệt và đưa `excludeDishIds` vào lần quay thật; preview không được tự loại món nếu tùy chọn tắt.
- [ ] Sau khi API trả thành công và reel kết thúc, ghi đúng một entry; không ghi khi request lỗi, người dùng đóng modal, hoặc component unmount giữa lúc quay.
- [ ] Hiển thị panel món gần đây bên dưới kết quả, cho phép xóa lịch sử; khi pool bị loại hết hiển thị lựa chọn “Quay lại toàn bộ món” và reset exclude state.
- [ ] Test component cho ghi history sau reveal, không ghi khi 422, nút xóa và luồng fallback pool rỗng.
- [ ] Commit riêng: `feat: add local draw history and no-repeat mode`.

## Task 4: Món yêu thích và tích hợp với reel/result/history

**Files:** `lib/favorites/storage.ts`, `lib/favorites/use-favorites.ts`, `lib/favorites/*.test.ts`, `components/case-opening/favorite-toggle.tsx`, `components/case-opening/dish-tile.tsx`, `components/case-opening/dish-reel.tsx`, `components/case-opening/reveal-panel.tsx`, `components/case-opening/draw-history.tsx`, `components/case-opening/case-stage.tsx`, `app/globals.css`.

- [ ] Viết test đỏ cho favorite storage/hook: toggle id, hydrate an toàn, xóa id không còn active, không trùng ID và đồng bộ state giữa các vị trí.
- [ ] Tạo `FavoriteToggle` với `aria-pressed`, trạng thái yêu thích rõ ràng và event không làm click tile/animation bị kích hoạt ngoài ý muốn.
- [ ] Hiển thị toggle trên tile, món thắng và mỗi entry history; favorite state phải hoạt động ngay tại chỗ, không reload và không chờ API.
- [ ] Thêm filter “Chỉ món yêu thích”; khi bật, gửi danh sách favorite IDs vào `DrawFilters`, xử lý danh sách rỗng bằng empty state có hướng dẫn tắt filter.
- [ ] Khi danh sách món active tải lại, dọn các favorite ID không còn tồn tại/tắt khỏi view mà không làm mất các ID hợp lệ trong localStorage.
- [ ] Test component cho toggle, favorite-only empty state và favorite result/history.
- [ ] Commit riêng: `feat: add local favorite dishes`.

## Task 5: Kiểm thử tích hợp và hồi quy

**Files:** `components/case-opening/case-stage.test.tsx`, `app/api/draw/route.test.ts`, các test bị ảnh hưởng, `package.json` nếu cần script.

- [ ] Bổ sung test luồng end-to-end ở cấp component: filter nâng cao → preview cập nhật → mở hòm → reel reveal → history/favorite cập nhật.
- [ ] Kiểm tra các lỗi hồi quy: initial preview vẫn hiện món ngay khi vào trang, category filter cũ vẫn hoạt động, admin CRUD gửi đủ field mới, pool weighted draw không đổi hành vi ngoài filter.
- [ ] Chạy `npm test -- --run`, `npm run lint`, `npm run build`; xử lý mọi lỗi mới, chỉ để lại warning đã biết nếu không liên quan.
- [ ] Kiểm tra `git diff --check`, rà lại migration và không commit `.env*`, secret hoặc file build.
- [ ] Commit kiểm thử nếu có thay đổi: `test: cover history filters and favorites`.

