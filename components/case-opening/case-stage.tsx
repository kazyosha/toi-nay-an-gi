'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Sparkle } from '@phosphor-icons/react'
import type { DishRecord, DrawFilters } from '@/lib/dishes/types'
import CategoryFilter from './category-filter'
import AdvancedFilters from './advanced-filters'
import DishReel from './dish-reel'
import RevealPanel from './reveal-panel'
import { REEL_SPIN_DURATION_MS } from './reel-motion'
import CelebrationModal from './celebration-modal'
import { startSpinSound } from '@/lib/audio/celebration-sound'
import { useDrawHistory } from '@/lib/history/use-draw-history'
import { useFavorites } from '@/lib/favorites/use-favorites'
import DrawHistory from './draw-history'

type DrawResponse = {
  reelItems: Array<Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category'>>
  selectedDish: Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category' | 'description' | 'spiceLevel'>
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
  const [filters, setFilters] = useState<DrawFilters>({ categories: [], priceLevels: [], mealTimes: [], includeDishIds: [], excludeDishIds: [] })
  const [draw, setDraw] = useState<DrawResponse | null>(() => makePreviewDraw(initialDishes))
  const [status, setStatus] = useState<'idle' | 'drawing' | 'revealed' | 'error'>('idle')
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const [error, setError] = useState('')
  const [spinSequence, setSpinSequence] = useState(0)
  const [noRepeatToday, setNoRepeatToday] = useState(false)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { history, todayIds, add: addHistory, clear: clearHistory } = useDrawHistory()
  const validDishIds = useMemo(() => initialDishes.length ? initialDishes.map((dish) => dish.id) : undefined, [initialDishes])
  const { favoriteIds, toggle: toggleFavorite, isFavorite } = useFavorites(validDishIds)
  const previewController = useRef<AbortController | null>(null)
  const initialFilters = useRef(filters)
  const previousFilters = useRef<string | null>(null)
  const statusRef = useRef(status)
  const reelKey = status === 'drawing'
    ? `${spinSequence}-${draw?.reelItems.map((item, index) => `${item.id}-${index}`).join('|') ?? ''}`
    : ''
  const effectiveFilters = useMemo(() => ({
    ...filters,
    includeDishIds: favoritesOnly ? (favoriteIds.length ? favoriteIds : ['__no_favorite_match__']) : [],
    excludeDishIds: noRepeatToday ? todayIds : [],
  }), [favoriteIds, favoritesOnly, filters, noRepeatToday, todayIds])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    if (initialDishes.length > 0) return

    const controller = new AbortController()
    previewController.current = controller

    fetch('/api/draw', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(initialFilters.current),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) return
      const body = await response.json()
      if (!controller.signal.aborted) setDraw(body as DrawResponse)
    }).catch(() => undefined)

    return () => controller.abort()
  }, [initialDishes.length])

  useEffect(() => {
    const filterKey = JSON.stringify(effectiveFilters)
    if (previousFilters.current === null) {
      previousFilters.current = filterKey
      return
    }
    if (previousFilters.current === filterKey) return
    previousFilters.current = filterKey
    if (statusRef.current === 'drawing') return

    previewController.current?.abort()
    const controller = new AbortController()
    previewController.current = controller
    setCelebrationOpen(false)
    setStatus('idle')
    setError('')

    fetch('/api/draw', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(effectiveFilters),
      signal: controller.signal,
    }).then(async (response) => {
      const body = await response.json()
      if (controller.signal.aborted) return
      if (!response.ok) {
        setDraw(null)
        setStatus('error')
        setError(body.message || 'Không có món phù hợp trong nhóm này.')
        return
      }
      setDraw(body as DrawResponse)
    }).catch(() => undefined)

    return () => controller.abort()
  }, [effectiveFilters])

  useEffect(() => {
    if (status !== 'drawing') return
    return startSpinSound()
  }, [status])

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
        body: JSON.stringify(effectiveFilters),
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
      try {
        addHistory({ drawnAt: new Date().toISOString(), dish: body.selectedDish, filters: effectiveFilters })
      } catch {
        // A storage permission issue must not hide a successful draw.
      }
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
        <span className="header-status"><ShieldCheck size={17} weight="fill" aria-hidden="true" /> CƠ SỞ DỮ LIỆU TRỰC TUYẾN</span>
      </header>

      <section id="mo-hom" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">HÒM MÓN ĂN <span>01</span></p>
          <h1 id="hero-title">Để chiếc hòm quyết định <em>bữa tối.</em></h1>
          <p className="hero-description">Một vòng quay, một món ăn. Chọn nhóm món và mở hòm để thoát khỏi câu hỏi quen thuộc.</p>
        </div>

        <div className="case-stage-panel">
          <div className="case-stage-topline"><span>MỞ HÒM // NGẪU NHIÊN</span><span>QUAY CÔNG BẰNG</span></div>
          <DishReel items={draw?.reelItems ?? []} selectedId={draw?.selectedDish.id ?? ''} isDrawing={status === 'drawing'} rollKey={reelKey} favoriteIds={favoriteIds} onFavoriteToggle={toggleFavorite} />
          <div className="stage-meta"><span>NHÓM MÓN: {filters.categories.length ? `${filters.categories.length} nhóm` : 'TẤT CẢ MÓN'}</span><span>NGẪU NHIÊN THEO TRỌNG SỐ</span></div>
        </div>

        <div className="action-zone">
          <CategoryFilter selected={filters.categories} onChange={(categories) => setFilters((current) => ({ ...current, categories }))} />
          <AdvancedFilters value={filters} disabled={status === 'drawing'} onChange={(advanced) => setFilters((current) => ({ ...current, ...advanced }))} />
          <label className="no-repeat-toggle"><input type="checkbox" checked={noRepeatToday} disabled={status === 'drawing'} onChange={(event) => setNoRepeatToday(event.target.checked)} /> Không lặp món đã quay hôm nay <small>({todayIds.length})</small></label>
          <label className="no-repeat-toggle"><input type="checkbox" checked={favoritesOnly} disabled={status === 'drawing'} onChange={(event) => setFavoritesOnly(event.target.checked)} /> Chỉ quay món yêu thích <small>({favoriteIds.length})</small></label>
          <button type="button" className="primary-button" onClick={openCase} disabled={status === 'drawing'}>
            {status === 'drawing' ? 'ĐANG QUAY...' : 'MỞ HÒM'}
          </button>
          {status === 'error' && <div className="error-stack"><p className="error-message" role="alert">{error}</p>{noRepeatToday && <button type="button" className="table-action" onClick={() => setNoRepeatToday(false)}>Quay lại toàn bộ món</button>}{favoritesOnly && <button type="button" className="table-action" onClick={() => setFavoritesOnly(false)}>Tắt lọc yêu thích</button>}</div>}
          <p className="action-hint">Bộ lọc cập nhật ngay lập tức. Kết quả được chọn từ danh sách món đang bật.</p>
        </div>

        <RevealPanel dish={status === 'revealed' ? draw?.selectedDish ?? null : null} onDrawAgain={openCase} isFavorite={draw?.selectedDish ? isFavorite(draw.selectedDish.id) : false} onFavoriteToggle={draw?.selectedDish ? () => toggleFavorite(draw.selectedDish.id) : undefined} />
        <DrawHistory history={history} onClear={clearHistory} favoriteIds={favoriteIds} onFavoriteToggle={toggleFavorite} />
        {celebrationOpen && status === 'revealed' && draw?.selectedDish && (
          <CelebrationModal dish={draw.selectedDish} onClose={() => setCelebrationOpen(false)} />
        )}
      </section>

      <section id="huong-dan" className="guide-section" aria-label="Cách hoạt động">
        <div className="guide-heading"><p className="eyebrow">CÁCH HOẠT ĐỘNG</p><h2>Ba nhịp để hết phân vân.</h2></div>
        <div className="guide-grid">
          <article><span>01</span><h3>Lọc nhóm món</h3><p>Chọn đúng mood hoặc để tất cả món cùng vào pool.</p></article>
          <article><span>02</span><h3>Mở hòm</h3><p>Reel chạy qua các lựa chọn đang được bật trong database.</p></article>
          <article><span>03</span><h3>Ăn thôi</h3><p>Nhận một món rõ ràng và dành thời gian cho việc ngon hơn.</p></article>
        </div>
      </section>
    </main>
  )
}
