import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// 쿠키만 보는 빠른 확인. 실제 세션 검증은 app/(members)/layout.tsx에서 한다
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next()

  const url = new URL('/login', request.url)
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/about/:path*', '/brands/:path*', '/research/:path*', '/history/:path*'],
}
