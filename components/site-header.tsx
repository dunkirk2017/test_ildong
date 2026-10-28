'use client'

import { useState } from 'react'
import { Lock, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo, navItems } from '@/components/site-nav'
import { authClient } from '@/lib/auth-client'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { data: session, refetch } = authClient.useSession()
  const user = session?.user
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await authClient.signOut()
    setOpen(false)
    refetch()
    // 회원 전용 페이지에 있었다면 첫 화면으로 보낸다
    if (navItems.some((item) => item.membersOnly && pathname.startsWith(item.href))) router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo />

        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
                >
                  {item.label}
                  {item.membersOnly && !user && (
                    <Lock className="size-3 opacity-60" aria-label="회원 전용" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="/contact"
            className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            문의하기
          </a>
          {user ? (
            <>
              <span className="pl-2 text-sm text-muted-foreground">
                <strong className="font-medium text-foreground">{user.name}</strong>님
              </span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="inline-flex rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                로그인
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? '메뉴 닫기' : '메뉴 열기'}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="모바일 메뉴" className="border-t border-border md:hidden">
          <ul className="flex flex-col px-5 py-3">
            {[...navItems, { href: '/contact', label: '문의하기' }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 py-3 text-base font-medium text-foreground"
                >
                  {item.label}
                  {'membersOnly' in item && item.membersOnly && !user && (
                    <Lock className="size-3.5 opacity-50" aria-label="회원 전용" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t border-border px-5 py-4">
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="flex-1 rounded-full border border-border bg-card py-2.5 text-sm font-medium text-foreground"
              >
                로그아웃 ({user.name}님)
              </button>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="flex-1 rounded-full border border-border bg-card py-2.5 text-center text-sm font-medium text-foreground"
                >
                  회원가입
                </Link>
                <Link
                  href="/login"
                  className="flex-1 rounded-full bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
