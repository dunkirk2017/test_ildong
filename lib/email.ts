import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// 발송 수단 우선순위: Gmail(앱 비밀번호) → Resend → 서버 콘솔 출력(개발용)
const gmail =
  process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') },
      })
    : null
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendVerificationCode({ to, code }: { to: string; code: string }) {
  const subject = `[일동제약] 인증코드 ${code}`
  const text = `일동제약 회원가입 인증코드는 ${code} 입니다. 10분 안에 입력해 주세요.`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 12px">이메일 인증코드</h2>
      <p style="color:#555;line-height:1.6">아래 6자리 코드를 가입 화면에 입력해 주세요. 코드는 10분 동안 유효합니다.</p>
      <p style="margin:24px 0;padding:16px;border-radius:12px;background:#f1f5f9;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>
      <p style="color:#888;font-size:13px">본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
    </div>
  `

  if (gmail) {
    await gmail.sendMail({ from: `일동제약 <${process.env.GMAIL_USER}>`, to, subject, text, html })
    return
  }

  if (resend) {
    const from = process.env.EMAIL_FROM ?? '일동제약 <onboarding@resend.dev>'
    const { error } = await resend.emails.send({ from, to, subject, text, html })
    if (error) throw new Error(`인증 메일 발송 실패: ${error.message}`)
    return
  }

  console.log(`\n[이메일 인증] ${to} 인증코드: ${code}\n`)
}
