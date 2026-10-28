import type { Metadata } from 'next'
import { Research } from '@/components/research'

export const metadata: Metadata = { title: '연구개발 | 일동제약' }

export default function Page() {
  return <Research />
}
