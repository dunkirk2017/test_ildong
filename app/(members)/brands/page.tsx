import type { Metadata } from 'next'
import { Brands } from '@/components/brands'

export const metadata: Metadata = { title: '대표 브랜드 | 일동제약' }

export default function Page() {
  return <Brands />
}
