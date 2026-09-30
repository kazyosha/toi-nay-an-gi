import DishForm from '@/components/admin/dish-form'

export default function NewDishPage() {
  return <main className="admin-page"><p className="eyebrow">THÊM MÓN MỚI</p><h1>Thêm món</h1><p className="admin-intro">Món mới sẽ được lưu vào cơ sở dữ liệu để quản trị viên bật hoặc tắt trong danh sách.</p><DishForm /></main>
}
