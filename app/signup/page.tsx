'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { AuthShell, Field, FormMessage, SubmitButton, toKoreanError } from '@/components/auth-shell'
import { VerifyCodeForm } from '@/components/verify-code-form'

export default function SignupPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))

    if (password !== form.get('passwordConfirm')) {
      setError('비밀번호가 서로 일치하지 않습니다.')
      return
    }

    setError('')
    setPending(true)
    const { error } = await authClient.signUp.email({ name, email, password, callbackURL: '/' })
    setPending(false)

    if (error) setError(toKoreanError(error))
    else setSentTo(email)
  }

  if (sentTo) {
    return (
      <AuthShell
        title="이메일 인증"
        description="가입이 거의 끝났습니다. 인증하면 바로 로그인됩니다."
        footer={<Link href="/login" className="font-medium text-primary hover:underline">로그인으로 이동</Link>}
      >
        <VerifyCodeForm email={sentTo} />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="회원가입"
      description="일동제약 회원이 되어 다양한 소식을 받아보세요."
      footer={
        <>
          이미 회원이신가요?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">로그인</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="이름" name="name" autoComplete="name" required />
        <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="name@example.com" required />
        <Field label="비밀번호" name="password" type="password" autoComplete="new-password" placeholder="8자 이상" minLength={8} required />
        <Field label="비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" minLength={8} required />
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <SubmitButton pending={pending}>가입하기</SubmitButton>
      </form>
    </AuthShell>
  )
}
