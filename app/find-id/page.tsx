'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserSearch } from 'lucide-react'
import { AuthShell, Field, FormMessage, SubmitButton } from '@/components/auth-shell'

type Result = { found: false } | { found: true; id: string; createdAt: string }

export default function FindIdPage() {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    const res = await fetch('/api/account/find-id', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: form.get('name'), email: form.get('email') }),
    })
    setResult(await res.json())
    setPending(false)
  }

  return (
    <AuthShell
      title="아이디 찾기"
      description="가입할 때 입력한 이름과 이메일을 입력해 주세요."
      footer={
        <>
          <Link href="/login" className="font-medium text-primary hover:underline">로그인</Link>
          <span className="mx-2 text-border">|</span>
          <Link href="/reset-password" className="font-medium text-primary hover:underline">비밀번호 찾기</Link>
        </>
      }
    >
      {result?.found ? (
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserSearch className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm text-muted-foreground">회원님의 아이디는</p>
          <p className="mt-1 font-mono text-lg font-semibold text-foreground">{result.id}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            가입일 {new Date(result.createdAt).toLocaleDateString('ko-KR')}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            로그인하기
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="이름" name="name" autoComplete="name" required />
          <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="name@example.com" required />
          {result && <FormMessage tone="error">입력하신 정보와 일치하는 회원이 없습니다.</FormMessage>}
          <SubmitButton pending={pending}>아이디 찾기</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
