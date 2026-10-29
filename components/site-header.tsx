'use client'

import { useState } from 'react'
import { Lock, Menu, UserRound, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo, navItems } from '@/components/site-nav'
import { authClient } from '@/lib/auth-client'

// 로그인해야 볼 수 있는 경로 (로그아웃하면 첫 화면으로 보낸다)
const protectedPaths = [...navItems.filter((item) => item.membersOnly).map((item) => item.href), '/account', '/admin']

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { data: session, refetch } = authClient.useSession()
  const user = session?.user
  const isAdmin = user?.role === 'admin'
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await authClient.signOut()
    setOpen(false)
    refetch()
    if (protectedPaths.some((path) => pathname.startsWith(path))) router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
        <Logo />

        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
                >
                  {item.label}
                  {item.membersOnly && !user && <Lock className="size-3 opacity-60" aria-label="회원 전용" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/contact"
            className="inline-flex whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            문의하기
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  회원 관리
                </Link>
              )}
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <UserRound className="size-4" aria-hidden="true" />
                <span>
                  <strong className="font-medium text-foreground">{user.name}</strong>님
                </span>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="inline-flex whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="inline-flex whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                로그인
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? '메뉴 닫기' : '메뉴 열기'}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="모바일 메뉴" className="border-t border-border lg:hidden">
          <ul className="flex flex-col px-5 py-3">
            {[...navItems, { href: '/contact', label: '문의하기', membersOnly: false }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 py-3 text-base font-medium text-foreground"
                >
                  {item.label}
                  {item.membersOnly && !user && <Lock className="size-3.5 opacity-50" aria-label="회원 전용" />}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
            {user ? (
              <>
                <div className="flex gap-2">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border border-border bg-card py-2.5 text-center text-sm font-medium text-foreground"
                  >
                    내 정보 ({user.name}님)
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-full border border-border bg-card py-2.5 text-center text-sm font-medium text-foreground"
                    >
                      회원 관리
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex gap-2">
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
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
