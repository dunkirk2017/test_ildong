'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MailCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { FormMessage, SubmitButton, toKoreanError } from '@/components/auth-shell'

// 메일로 받은 6자리 코드를 입력받아 인증하고, 인증되면 자동 로그인 상태로 target으로 보낸다
// ready: 가입 요청처럼 먼저 끝나야 하는 작업. 실패하면 부모가 화면을 되돌리므로 여기서는 조용히 멈춘다
export function VerifyCodeForm({
  email,
  target = '/',
  ready = Promise.resolve(),
}: {
  email: string
  target?: string
  ready?: Promise<void>
}) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setPending(true)
    try {
      await ready
    } catch {
      return
    }
    const { error } = await authClient.emailOtp.verifyEmail({ email, otp: code })
    setPending(false)

    if (error) {
      setMessage({ tone: 'error', text: toKoreanError(error) })
      return
    }
    router.push(target)
    router.refresh()
  }

  async function resend() {
    setMessage(null)
    try {
      await ready
    } catch {
      return
    }
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' })
    setMessage(error ? { tone: 'error', text: toKoreanError(error) } : { tone: 'info', text: '새 인증코드를 보냈습니다.' })
    setCode('')
  }

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">{email}</strong>
          <br />
          으로 보낸 6자리 인증코드를 입력해 주세요.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          이미 가입된 이메일이면 인증코드 대신 안내 메일이 발송됩니다.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="sr-only">인증코드</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            autoFocus
            required
            minLength={6}
            maxLength={6}
            className="h-14 w-full rounded-lg border border-border bg-background text-center font-mono text-2xl tracking-[0.5em] text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-3 focus:ring-primary/15"
          />
        </label>
        {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
        <SubmitButton pending={pending}>인증하기</SubmitButton>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        메일이 오지 않았나요?{' '}
        <button type="button" onClick={resend} className="font-medium text-primary hover:underline">
          코드 다시 받기
        </button>
      </p>
    </div>
  )
}
