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

const purposes: Record<string, string> = {
  'email-verification': '회원가입',
  'forget-password': '비밀번호 재설정',
  'sign-in': '로그인',
  'change-email': '이메일 변경',
}

export async function sendVerificationCode({ to, code, type = 'email-verification' }: { to: string; code: string; type?: string }) {
  const purpose = purposes[type] ?? '본인 확인'
  await sendMail({
    to,
    subject: `[일동제약] ${purpose} 인증코드 ${code}`,
    text: `일동제약 ${purpose} 인증코드는 ${code} 입니다. 10분 안에 입력해 주세요.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">${purpose} 인증코드</h2>
        <p style="color:#555;line-height:1.6">아래 6자리 코드를 화면에 입력해 주세요. 코드는 10분 동안 유효합니다.</p>
        <p style="margin:24px 0;padding:16px;border-radius:12px;background:#f1f5f9;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>
        <p style="color:#888;font-size:13px">본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
      </div>
    `,
  })
}

export async function sendTemporaryPassword({ to, password }: { to: string; password: string }) {
  await sendMail({
    to,
    subject: '[일동제약] 임시 비밀번호 안내',
    text: `관리자가 비밀번호를 초기화했습니다. 임시 비밀번호: ${password} — 로그인 후 내 정보에서 비밀번호를 바꿔 주세요.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">임시 비밀번호 안내</h2>
        <p style="color:#555;line-height:1.6">관리자가 회원님의 비밀번호를 초기화했습니다. 아래 임시 비밀번호로 로그인한 뒤 <strong>내 정보</strong>에서 비밀번호를 바꿔 주세요.</p>
        <p style="margin:24px 0;padding:16px;border-radius:12px;background:#f1f5f9;text-align:center;font-family:monospace;font-size:24px;font-weight:700;letter-spacing:2px">${password}</p>
      </div>
    `,
  })
}

export async function sendExistingAccountNotice({ to }: { to: string }) {
  const site = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  await sendMail({
    to,
    subject: '[일동제약] 이미 가입된 이메일입니다',
    text: `이 이메일로 회원가입이 시도되었지만 이미 가입된 계정이 있습니다. 로그인: ${site}/login / 비밀번호 찾기: ${site}/reset-password`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">이미 가입된 이메일입니다</h2>
        <p style="color:#555;line-height:1.6">이 이메일로 회원가입이 시도되었지만, 이미 가입된 계정이 있습니다. 본인이라면 로그인하거나 비밀번호 찾기를 이용해 주세요.</p>
        <p style="margin-top:20px">
          <a href="${site}/login" style="display:inline-block;padding:10px 20px;border-radius:999px;background:#1e3a8a;color:#fff;text-decoration:none">로그인</a>
          <a href="${site}/reset-password" style="display:inline-block;margin-left:8px;padding:10px 20px;border-radius:999px;border:1px solid #cbd5e1;color:#1e293b;text-decoration:none">비밀번호 찾기</a>
        </p>
        <p style="color:#888;font-size:13px;margin-top:20px">본인이 시도하지 않았다면 이 메일을 무시해 주세요.</p>
      </div>
    `,
  })
}

async function sendMail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
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

  console.log(`\n[메일] ${to} / ${subject}\n${text}\n`)
}
