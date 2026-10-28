import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth, ensureAuthDb } from '@/lib/auth'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

// 로그인한 회원만 볼 수 있는 페이지 묶음 (회사소개, 대표 브랜드, 연구개발, 연혁)
export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  await ensureAuthDb()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
