import CaseStage from '@/components/case-opening/case-stage'
import { listActiveDishes } from '@/lib/dishes/repository'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const dishes = await listActiveDishes().catch(() => [])
  return <CaseStage initialDishes={dishes} />
}
