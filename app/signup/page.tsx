'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { AuthShell, Field, FormMessage, SubmitButton, toKoreanError } from '@/components/auth-shell'
import { VerifyCodeForm } from '@/components/verify-code-form'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [draft, setDraft] = useState({ name: '', email: '' })
  // 가입 요청이 끝났는지 나타내는 Promise. 코드 입력 화면은 이걸 기다린 뒤 인증을 요청한다
  const signupRequest = useRef<Promise<void>>(Promise.resolve())

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))

    if (password !== form.get('passwordConfirm')) {
      setError('비밀번호가 서로 일치하지 않습니다.')
      return
    }

    // 낙관적 처리: 서버 응답을 기다리지 않고 바로 코드 입력 화면으로 넘어간다.
    // 가입이 실패하면(이미 가입된 이메일 등) 입력값을 유지한 채 가입 화면으로 되돌린다
    setError('')
    setDraft({ name, email })
    setSentTo(email)
    signupRequest.current = authClient.signUp.email({ name, email, password, callbackURL: '/' }).then(({ error }) => {
      if (!error) return
      setSentTo('')
      setError(toKoreanError(error))
      throw error
    })
    // 실패는 위에서 화면으로 처리했으므로 브라우저의 "처리되지 않은 오류" 경고만 막는다
    signupRequest.current.catch(() => {})
  }

  if (sentTo) {
    return (
      <AuthShell
        title="이메일 인증"
        description="가입이 거의 끝났습니다. 인증하면 바로 로그인됩니다."
        footer={<Link href="/login" className="font-medium text-primary hover:underline">로그인으로 이동</Link>}
      >
        <VerifyCodeForm email={sentTo} ready={signupRequest.current} />
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
        <Field label="이름" name="name" autoComplete="name" defaultValue={draft.name} required />
        <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="name@example.com" defaultValue={draft.email} required />
        <Field label="비밀번호" name="password" type="password" autoComplete="new-password" placeholder="8자 이상" minLength={8} required />
        <Field label="비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" minLength={8} required />
        {error && <FormMessage tone="error">{error}</FormMessage>}
        <SubmitButton pending={false}>가입하기</SubmitButton>
      </form>
    </AuthShell>
  )
}
