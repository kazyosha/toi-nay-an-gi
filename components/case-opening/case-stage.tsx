'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Sparkle } from '@phosphor-icons/react'
import type { DishCategory, DishRecord } from '@/lib/dishes/types'
import CategoryFilter from './category-filter'
import DishReel from './dish-reel'
import RevealPanel from './reveal-panel'
import { REEL_SPIN_DURATION_MS } from './reel-motion'
import CelebrationModal from './celebration-modal'

type DrawResponse = {
  reelItems: Array<Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category'>>
  selectedDish: Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'description' | 'spiceLevel'>
}

type InitialDish = Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category' | 'description' | 'spiceLevel'>

function makePreviewDraw(dishes: InitialDish[]): DrawResponse | null {
  const firstDish = dishes[0]
  if (!firstDish) return null

  return {
    reelItems: dishes.map(({ id, name, imageUrl, category }) => ({ id, name, imageUrl, category })),
    selectedDish: firstDish,
  }
}

export default function CaseStage({ initialDishes = [] }: { initialDishes?: InitialDish[] }) {
  const [categories, setCategories] = useState<DishCategory[]>([])
  const [draw, setDraw] = useState<DrawResponse | null>(() => makePreviewDraw(initialDishes))
  const [status, setStatus] = useState<'idle' | 'drawing' | 'revealed' | 'error'>('idle')
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const [error, setError] = useState('')
  const [spinSequence, setSpinSequence] = useState(0)
  const previewController = useRef<AbortController | null>(null)
  const reelKey = status === 'drawing'
    ? `${spinSequence}-${draw?.reelItems.map((item, index) => `${item.id}-${index}`).join('|') ?? ''}`
    : ''

  useEffect(() => {
    if (initialDishes.length > 0) return

    const controller = new AbortController()
    previewController.current = controller

    fetch('/api/draw', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ categories: [] }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) return
      const body = await response.json()
      if (!controller.signal.aborted) setDraw(body as DrawResponse)
    }).catch(() => undefined)

    return () => controller.abort()
  }, [initialDishes.length])

  async function openCase() {
    previewController.current?.abort()
    setSpinSequence((current) => current + 1)
    setStatus('drawing')
    setCelebrationOpen(false)
    setError('')

    try {
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ categories }),
      })
      const body = await response.json()

      if (!response.ok) {
        setStatus('error')
        setError(body.message || 'Không thể mở hòm lúc này.')
        return
      }

      setDraw(body as DrawResponse)
      await new Promise((resolve) => window.setTimeout(resolve, REEL_SPIN_DURATION_MS))
      setStatus('revealed')
      setCelebrationOpen(true)
    } catch {
      setStatus('error')
      setError('Kết nối gặp sự cố. Bạn thử lại nhé.')
    }
  }

  return (
    <main className="case-app">
      <header className="site-header">
        <Link className="brand-lockup" href="/" aria-label="Tối nay ăn gì, trang chủ">
          <span className="brand-mark"><Sparkle size={18} weight="fill" aria-hidden="true" /></span>
          <span>Tối nay ăn gì</span>
        </Link>
        <nav className="site-nav" aria-label="Điều hướng chính">
          <a href="#mo-hom">Mở hòm</a>
          <a href="#huong-dan">Cách chơi</a>
          <a href="/admin">Quản lý</a>
        </nav>
        <span className="header-status"><ShieldCheck size={17} weight="fill" aria-hidden="true" /> DATABASE ONLINE</span>
      </header>

      <section id="mo-hom" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">FOOD CASE OPENER <span>01</span></p>
          <h1 id="hero-title">Để chiếc hòm quyết định <em>bữa tối.</em></h1>
          <p className="hero-description">Một vòng quay, một món ăn. Chọn nhóm món và mở hòm để thoát khỏi câu hỏi quen thuộc.</p>
        </div>

        <div className="case-stage-panel">
          <div className="case-stage-topline"><span>CASE DROP // RANDOMIZED</span><span>FAIR DRAW</span></div>
          <DishReel items={draw?.reelItems ?? []} selectedId={draw?.selectedDish.id ?? ''} isDrawing={status === 'drawing'} rollKey={reelKey} />
          <div className="stage-meta"><span>POOL: {categories.length ? `${categories.length} nhóm` : 'TẤT CẢ MÓN'}</span><span>WEIGHTED RNG</span></div>
        </div>

        <div className="action-zone">
          <CategoryFilter selected={categories} onChange={setCategories} />
          <button type="button" className="primary-button" onClick={openCase} disabled={status === 'drawing'}>
            {status === 'drawing' ? 'ĐANG QUAY...' : 'MỞ HÒM'}
          </button>
          {status === 'error' && <p className="error-message" role="alert">{error}</p>}
          <p className="action-hint">Không có món trùng nhau trong lần quay này. Kết quả được chọn từ danh sách admin.</p>
        </div>

        <RevealPanel dish={status === 'revealed' ? draw?.selectedDish ?? null : null} onDrawAgain={openCase} />
        {celebrationOpen && status === 'revealed' && draw?.selectedDish && (
          <CelebrationModal dish={draw.selectedDish} onClose={() => setCelebrationOpen(false)} />
        )}
      </section>

      <section id="huong-dan" className="guide-section" aria-label="Cách hoạt động">
        <div className="guide-heading"><p className="eyebrow">HOW IT WORKS</p><h2>Ba nhịp để hết phân vân.</h2></div>
        <div className="guide-grid">
          <article><span>01</span><h3>Lọc nhóm món</h3><p>Chọn đúng mood hoặc để tất cả món cùng vào pool.</p></article>
          <article><span>02</span><h3>Mở hòm</h3><p>Reel chạy qua các lựa chọn đang được bật trong database.</p></article>
          <article><span>03</span><h3>Ăn thôi</h3><p>Nhận một món rõ ràng và dành thời gian cho việc ngon hơn.</p></article>
        </div>
      </section>
    </main>
  )
}
