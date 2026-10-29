import { auth, ensureAuthDb } from '@/lib/auth'

// 아이디 찾기: 이름과 이메일이 모두 일치하는 회원이 있으면 가려진 아이디(이메일)와 가입일을 돌려준다
export async function POST(request: Request) {
  const { name, email } = (await request.json().catch(() => ({}))) as { name?: string; email?: string }
  if (!name?.trim() || !email?.trim()) {
    return Response.json({ found: false }, { status: 400 })
  }

  await ensureAuthDb()
  const ctx = await auth.$context
  const result = await ctx.internalAdapter.findUserByEmail(email.trim().toLowerCase())
  const user = result?.user
  if (!user || user.name.trim() !== name.trim()) {
    return Response.json({ found: false })
  }

  return Response.json({ found: true, id: maskEmail(user.email), createdAt: user.createdAt })
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  const visible = local.slice(0, Math.min(3, Math.max(1, local.length - 2)))
  return `${visible}${'*'.repeat(Math.max(2, local.length - visible.length))}@${domain}`
}
