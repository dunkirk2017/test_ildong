import Link from 'next/link'

// membersOnly: 로그인한 회원만 접근 가능 (proxy.ts, app/(members)에서 보호)
export const navItems = [
  { href: '/about', label: '회사소개', membersOnly: true },
  { href: '/brands', label: '대표 브랜드', membersOnly: true },
  { href: '/research', label: '연구개발', membersOnly: true },
  { href: '/history', label: '연혁', membersOnly: true },
]

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="일동제약 홈">
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-md bg-primary font-serif text-sm font-bold text-primary-foreground"
      >
        日
      </span>
      <span className="font-serif text-lg font-bold tracking-tight text-foreground">
        일동제약
      </span>
    </Link>
  )
}
