const categories = ['Tất cả', 'Cơm', 'Bún phở', 'Mì', 'Ăn vặt', 'Đồ uống']

export default function Home() {
  return (
    <main>
      <header>
        <p>Tối nay ăn gì</p>
        <nav aria-label="Điều hướng chính">
          <a href="#mo-hom">Mở hòm</a>
          <a href="#huong-dan">Hướng dẫn</a>
        </nav>
      </header>

      <section id="mo-hom" aria-labelledby="hero-title">
        <p>FOOD CASE OPENER</p>
        <h1 id="hero-title">Để chiếc hòm quyết định bữa tối.</h1>
        <p>Chọn nhóm món, mở hòm và nhận một gợi ý ngon lành.</p>
        <div role="group" aria-label="Nhóm món">
          {categories.map((category) => (
            <button type="button" key={category} aria-pressed={category === 'Tất cả'}>
              {category}
            </button>
          ))}
        </div>
        <button type="button" aria-label="Mở hòm">
          MỞ HÒM
        </button>
      </section>

      <section id="huong-dan" aria-label="Cách hoạt động">
        <p>Ba bước để hết phân vân</p>
      </section>
    </main>
  )
}
