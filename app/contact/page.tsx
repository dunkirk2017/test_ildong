import type { Metadata } from 'next'
import { Globe } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = { title: '문의하기 | 일동제약' }

// 누구나 볼 수 있는 페이지 (로그인 불필요)
export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="rounded-3xl bg-secondary p-8 md:flex md:items-center md:justify-between md:p-12">
          <div>
            <h1 className="text-balance font-serif text-2xl font-bold text-foreground md:text-3xl">
              건강한 내일, 일동제약이 함께합니다
            </h1>
            <p className="mt-3 text-muted-foreground">
              제품 및 기업 관련 문의는 공식 홈페이지를 이용해 주세요.
            </p>
          </div>
          <a
            href="https://www.ildong.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:mt-0"
          >
            <Globe className="size-4" aria-hidden="true" />
            공식 홈페이지 방문
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
