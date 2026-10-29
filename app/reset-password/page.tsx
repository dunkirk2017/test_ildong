'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { AuthShell, Field, FormMessage, SubmitButton, toKoreanError } from '@/components/auth-shell'

// 비밀번호 찾기: ① 이메일로 6자리 코드 받기 → ② 코드와 새 비밀번호 입력
export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)

  async function requestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = String(new FormData(e.currentTarget).get('email')).trim()
    setMessage(null)
    setPending(true)
    const { error } = await authClient.emailOtp.requestPasswordReset({ email: value })
    setPending(false)
    if (error) {
      setMessage({ tone: 'error', text: toKoreanError(error) })
      return
    }
    setEmail(value)
  }

  async function resetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = String(form.get('password'))
    if (password !== form.get('passwordConfirm')) {
      setMessage({ tone: 'error', text: '비밀번호가 서로 일치하지 않습니다.' })
      return
    }

    setMessage(null)
    setPending(true)
    const { error } = await authClient.emailOtp.resetPassword({ email, otp: String(form.get('otp')), password })
    setPending(false)
    if (error) {
      setMessage({ tone: 'error', text: toKoreanError(error) })
      return
    }
    router.push('/login?reset=1')
  }

  return (
    <AuthShell
      title="비밀번호 찾기"
      description={email ? '메일로 받은 인증코드와 새 비밀번호를 입력해 주세요.' : '가입한 이메일로 인증코드를 보내 드립니다.'}
      footer={
        <>
          <Link href="/login" className="font-medium text-primary hover:underline">로그인</Link>
          <span className="mx-2 text-border">|</span>
          <Link href="/find-id" className="font-medium text-primary hover:underline">아이디 찾기</Link>
        </>
      }
    >
      {email ? (
        <form onSubmit={resetPassword} className="space-y-4">
          <p className="rounded-lg bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground">
            <strong className="text-foreground">{email}</strong> 으로 인증코드를 보냈습니다. 가입된 이메일이 아니면 메일이 가지 않습니다.
          </p>
          <Field label="인증코드" name="otp" inputMode="numeric" autoComplete="one-time-code" placeholder="6자리 숫자" pattern="\d{6}" maxLength={6} required />
          <Field label="새 비밀번호" name="password" type="password" autoComplete="new-password" placeholder="8자 이상" minLength={8} required />
          <Field label="새 비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" minLength={8} required />
          {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
          <SubmitButton pending={pending}>비밀번호 변경</SubmitButton>
          <button
            type="button"
            onClick={() => { setEmail(''); setMessage(null) }}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            이메일 다시 입력
          </button>
        </form>
      ) : (
        <form onSubmit={requestCode} className="space-y-4">
          <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="name@example.com" required />
          {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
          <SubmitButton pending={pending}>인증코드 받기</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
