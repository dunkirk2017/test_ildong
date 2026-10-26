export const navItems = [
  { href: '#about', label: '회사소개' },
  { href: '#brands', label: '대표 브랜드' },
  { href: '#research', label: '연구개발' },
  { href: '#history', label: '연혁' },
]

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="일동제약 홈">
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-md bg-primary font-serif text-sm font-bold text-primary-foreground"
      >
        日
      </span>
      <span className="font-serif text-lg font-bold tracking-tight text-foreground">
        일동제약
      </span>
    </a>
  )
}
