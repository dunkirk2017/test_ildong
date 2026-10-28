import type { Metadata } from 'next'
import { About } from '@/components/about'

export const metadata: Metadata = { title: '회사소개 | 일동제약' }

export default function Page() {
  return <About />
}
