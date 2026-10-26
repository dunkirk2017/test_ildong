import { MapPin, Globe } from 'lucide-react'
import { Logo, navItems } from '@/components/site-nav'

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="rounded-3xl bg-secondary p-8 md:flex md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-balance font-serif text-2xl font-bold text-foreground md:text-3xl">
              건강한 내일, 일동제약이 함께합니다
            </h2>
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

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="space-y-4">
            <Logo />
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              서울특별시 서초구 바우뫼로 27길 2
            </p>
          </div>
          <nav aria-label="푸터 메뉴">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          본 페이지는 일동제약을 소개하기 위한 목적으로 제작되었으며, 공개된 자료를 바탕으로
          구성되었습니다. 정확한 최신 정보는 공식 채널을 확인해 주세요.
        </p>
      </div>
    </footer>
  )
}
