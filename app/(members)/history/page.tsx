import type { Metadata } from 'next'
import { History } from '@/components/history'

export const metadata: Metadata = { title: '연혁 | 일동제약' }

export default function Page() {
  return <History />
}
