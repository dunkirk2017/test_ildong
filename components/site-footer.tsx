import { MapPin } from 'lucide-react'
import { Logo, navItems } from '@/components/site-nav'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
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
