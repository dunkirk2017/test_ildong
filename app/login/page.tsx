'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { AuthShell, Field, FormMessage, SubmitButton, toKoreanError } from '@/components/auth-shell'
import { VerifyCodeForm } from '@/components/verify-code-form'

// 회원 전용 페이지에서 넘어왔다면 그 페이지로 돌려보낸다 (외부 주소는 무시)
function getTarget() {
  const next = new URLSearchParams(window.location.search).get('next')
  return next?.startsWith('/') && !next.startsWith('//') ? next : '/'
}

export default function LoginPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [justReset, setJustReset] = useState(false)

  // 비밀번호 찾기에서 넘어온 경우(?reset=1) 안내 문구를 보여준다
  useEffect(() => {
    setJustReset(new URLSearchParams(window.location.search).has('reset'))
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email')).trim()
    const target = getTarget()

    setError('')
    setPending(true)
    const { error } = await authClient.signIn.email({
      email,
      password: String(form.get('password')),
      callbackURL: target,
    })
    setPending(false)

    // 인증 전 계정이면 서버가 새 인증코드를 보냈으므로 코드 입력 화면으로 바꾼다
    if (error?.code === 'EMAIL_NOT_VERIFIED') {
      setUnverifiedEmail(email)
      return
    }
    if (error) {
      setError(toKoreanError(error))
      return
    }
    router.push(target)
    router.refresh()
  }

  if (unverifiedEmail) {
    return (
      <AuthShell
        title="이메일 인증"
        description="아직 이메일 인증이 끝나지 않았습니다. 인증하면 바로 로그인됩니다."
        footer={
          <button type="button" onClick={() => setUnverifiedEmail('')} className="font-medium text-primary hover:underline">
            다른 계정으로 로그인
          </button>
        }
      >
        <VerifyCodeForm email={unverifiedEmail} target={getTarget()} />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="로그인"
      description="이메일과 비밀번호를 입력해 주세요."
      footer={
        <>
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">회원가입</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="name@example.com" required />
        <Field label="비밀번호" name="password" type="password" autoComplete="current-password" required />
        {error ? (
          <FormMessage tone="error">{error}</FormMessage>
        ) : (
          justReset && <FormMessage tone="info">비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.</FormMessage>
        )}
        <SubmitButton pending={pending}>로그인</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link href="/find-id" className="hover:text-foreground">아이디 찾기</Link>
        <span className="mx-2 text-border">|</span>
        <Link href="/reset-password" className="hover:text-foreground">비밀번호 찾기</Link>
      </p>
    </AuthShell>
  )
}
