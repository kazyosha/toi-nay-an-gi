import DishForm from '@/components/admin/dish-form'

export default function NewDishPage() {
  return <main className="admin-page"><p className="eyebrow">NEW DROP</p><h1>Thêm món</h1><p className="admin-intro">Món mới sẽ được lưu vào database để admin bật hoặc tắt trong pool.</p><DishForm /></main>
}
