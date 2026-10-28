import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const from = process.env.EMAIL_FROM ?? '일동제약 <onboarding@resend.dev>'

export async function sendVerificationCode({ to, code }: { to: string; code: string }) {
  // RESEND_API_KEY가 없으면 개발용으로 인증코드를 서버 콘솔에 출력한다
  if (!resend) {
    console.log(`\n[이메일 인증] ${to} 인증코드: ${code}\n`)
    return
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `[일동제약] 인증코드 ${code}`,
    text: `일동제약 회원가입 인증코드는 ${code} 입니다. 10분 안에 입력해 주세요.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">이메일 인증코드</h2>
        <p style="color:#555;line-height:1.6">아래 6자리 코드를 가입 화면에 입력해 주세요. 코드는 10분 동안 유효합니다.</p>
        <p style="margin:24px 0;padding:16px;border-radius:12px;background:#f1f5f9;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>
        <p style="color:#888;font-size:13px">본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
      </div>
    `,
  })
  if (error) throw new Error(`인증 메일 발송 실패: ${error.message}`)
}
