import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminMembers } from '@/components/admin-members'

export const metadata: Metadata = { title: '회원 관리 | 일동제약' }

// 관리자(role = 'admin')만 볼 수 있다. 일반 회원에게는 페이지가 없는 것처럼 보인다
export default async function AdminPage() {
  const session = await getSession(await headers())
  if (session?.user.role !== 'admin') notFound()

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">회원 관리</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        회원을 비활성화하면 즉시 로그아웃되고 다시 로그인할 수 없습니다. 비밀번호를 초기화하면 임시 비밀번호가 회원 이메일로 발송됩니다.
      </p>
      <AdminMembers currentUserId={session.user.id} />
    </section>
  )
}
