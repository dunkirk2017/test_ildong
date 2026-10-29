import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AccountPanel } from '@/components/account-panel'

export const metadata: Metadata = { title: '내 정보 | 일동제약' }

export default async function AccountPage() {
  const session = await getSession(await headers())
  if (!session) redirect('/login?next=/account')
  const { user } = session

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">내 정보</h1>
      <p className="mt-2 text-sm text-muted-foreground">회원 정보를 확인하고 수정할 수 있습니다.</p>
      <AccountPanel
        user={{
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          role: user.role ?? 'user',
        }}
      />
    </section>
  )
}
