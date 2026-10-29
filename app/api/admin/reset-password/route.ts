import { randomInt } from 'node:crypto'
import { auth, getSession } from '@/lib/auth'
import { sendTemporaryPassword } from '@/lib/email'

// 관리자 전용: 회원 비밀번호를 임시 비밀번호로 초기화하고, 모든 기기에서 로그아웃시킨 뒤 회원 이메일로 안내한다
export async function POST(request: Request) {
  const session = await getSession(request.headers)
  if (session?.user.role !== 'admin') {
    return Response.json({ error: '관리자만 사용할 수 있습니다.' }, { status: 403 })
  }

  const { userId } = (await request.json().catch(() => ({}))) as { userId?: string }
  if (!userId || userId === session.user.id) {
    return Response.json({ error: '초기화할 수 없는 회원입니다.' }, { status: 400 })
  }

  const ctx = await auth.$context
  const user = await ctx.internalAdapter.findUserById(userId)
  if (!user) return Response.json({ error: '해당 회원을 찾을 수 없습니다.' }, { status: 404 })

  const tempPassword = generateTempPassword()
  await auth.api.setUserPassword({ body: { userId, newPassword: tempPassword }, headers: request.headers })
  await auth.api.revokeUserSessions({ body: { userId }, headers: request.headers })

  let emailed = true
  try {
    await sendTemporaryPassword({ to: user.email, password: tempPassword })
  } catch (error) {
    console.error('임시 비밀번호 메일 발송 실패', error)
    emailed = false
  }

  // 메일이 실패해도 관리자가 직접 전달할 수 있도록 이번 응답에서 한 번만 보여준다
  return Response.json({ tempPassword, emailed })
}

// 헷갈리는 문자(0/O, 1/l/I)를 뺀 10자리 임시 비밀번호
function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  return Array.from({ length: 10 }, () => chars[randomInt(chars.length)]).join('')
}
