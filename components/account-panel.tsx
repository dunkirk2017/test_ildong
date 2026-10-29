'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Field, FormMessage, SubmitButton, toKoreanError } from '@/components/auth-shell'

type Message = { tone: 'error' | 'info'; text: string } | null

function Card({ title, description, children, danger }: { title: string; description?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`mt-8 rounded-2xl border bg-card p-6 md:p-7 ${danger ? 'border-destructive/30' : 'border-border'}`}>
      <h2 className={`text-lg font-semibold ${danger ? 'text-destructive' : 'text-foreground'}`}>{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}

export function AccountPanel({ user }: { user: { name: string; email: string; createdAt: string; role: string } }) {
  const router = useRouter()

  const [name, setName] = useState(user.name)
  const [profilePending, setProfilePending] = useState(false)
  const [profileMessage, setProfileMessage] = useState<Message>(null)

  const [passwordPending, setPasswordPending] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<Message>(null)

  const [deletePending, setDeletePending] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState<Message>(null)

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileMessage(null)
    setProfilePending(true)
    const { error } = await authClient.updateUser({ name: name.trim() })
    setProfilePending(false)
    setProfileMessage(error ? { tone: 'error', text: toKoreanError(error) } : { tone: 'info', text: '저장되었습니다.' })
    if (!error) router.refresh()
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const newPassword = String(form.get('newPassword'))
    if (newPassword !== form.get('newPasswordConfirm')) {
      setPasswordMessage({ tone: 'error', text: '새 비밀번호가 서로 일치하지 않습니다.' })
      return
    }

    setPasswordMessage(null)
    setPasswordPending(true)
    const { error } = await authClient.changePassword({
      currentPassword: String(form.get('currentPassword')),
      newPassword,
      revokeOtherSessions: true,
    })
    setPasswordPending(false)
    if (error) {
      setPasswordMessage({ tone: 'error', text: error.code === 'INVALID_PASSWORD' ? '현재 비밀번호가 올바르지 않습니다.' : toKoreanError(error) })
      return
    }
    formEl.reset()
    setPasswordMessage({ tone: 'info', text: '비밀번호가 변경되었습니다. 다른 기기에서는 로그아웃됩니다.' })
  }

  async function deleteAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (!confirm('정말 탈퇴하시겠습니까? 회원 정보가 모두 삭제되며 되돌릴 수 없습니다.')) return

    setDeleteMessage(null)
    setDeletePending(true)
    const { error } = await authClient.deleteUser({ password: String(form.get('password')) })
    setDeletePending(false)
    if (error) {
      setDeleteMessage({ tone: 'error', text: toKoreanError(error) })
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <Card title="기본 정보">
        <form onSubmit={saveProfile} className="space-y-4">
          <dl className="grid grid-cols-[6rem_1fr] gap-y-3 text-sm">
            <dt className="text-muted-foreground">아이디</dt>
            <dd className="font-medium text-foreground">{user.email}</dd>
            <dt className="text-muted-foreground">가입일</dt>
            <dd className="text-foreground">{new Date(user.createdAt).toLocaleDateString('ko-KR')}</dd>
            <dt className="text-muted-foreground">회원 구분</dt>
            <dd className="text-foreground">{user.role === 'admin' ? '관리자' : '일반 회원'}</dd>
          </dl>
          <Field label="이름" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          {profileMessage && <FormMessage tone={profileMessage.tone}>{profileMessage.text}</FormMessage>}
          <div className="sm:w-40">
            <SubmitButton pending={profilePending}>저장</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title="비밀번호 변경" description="변경하면 지금 쓰는 기기를 제외한 다른 기기에서 로그아웃됩니다.">
        <form onSubmit={changePassword} className="space-y-4">
          <Field label="현재 비밀번호" name="currentPassword" type="password" autoComplete="current-password" required />
          <Field label="새 비밀번호" name="newPassword" type="password" autoComplete="new-password" placeholder="8자 이상" minLength={8} required />
          <Field label="새 비밀번호 확인" name="newPasswordConfirm" type="password" autoComplete="new-password" minLength={8} required />
          {passwordMessage && <FormMessage tone={passwordMessage.tone}>{passwordMessage.text}</FormMessage>}
          <div className="sm:w-40">
            <SubmitButton pending={passwordPending}>변경</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title="회원 탈퇴" description="탈퇴하면 회원 정보와 로그인 기록이 모두 삭제되며 되돌릴 수 없습니다." danger>
        <form onSubmit={deleteAccount} className="space-y-4">
          <Field label="비밀번호 확인" name="password" type="password" autoComplete="current-password" required />
          {deleteMessage && <FormMessage tone={deleteMessage.tone}>{deleteMessage.text}</FormMessage>}
          <button
            type="submit"
            disabled={deletePending}
            className="inline-flex h-11 items-center justify-center rounded-full border border-destructive/40 px-6 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
          >
            {deletePending ? '처리 중…' : '탈퇴하기'}
          </button>
        </form>
      </Card>
    </>
  )
}
