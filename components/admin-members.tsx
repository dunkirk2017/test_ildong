'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { FormMessage, toKoreanError } from '@/components/auth-shell'

type Member = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role?: string | null
  banned?: boolean | null
  createdAt: Date | string
}

export function AdminMembers({ currentUserId }: { currentUserId: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)

  const load = useCallback(async (search: string) => {
    setLoading(true)
    const { data, error } = await authClient.admin.listUsers({
      query: {
        limit: 100,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        ...(search && { searchValue: search, searchField: search.includes('@') ? 'email' : 'name' }),
      },
    })
    setLoading(false)
    if (error) {
      setMessage({ tone: 'error', text: toKoreanError(error) })
      return
    }
    setMembers(data.users as Member[])
    setTotal(data.total)
  }, [])

  useEffect(() => {
    load('')
  }, [load])

  async function toggleBan(member: Member) {
    const action = member.banned ? '활성화' : '비활성화'
    if (!confirm(`${member.name}(${member.email}) 회원을 ${action}할까요?`)) return

    setBusyId(member.id)
    setMessage(null)
    const { error } = member.banned
      ? await authClient.admin.unbanUser({ userId: member.id })
      : await authClient.admin.banUser({ userId: member.id, banReason: '관리자에 의한 비활성화' })
    setBusyId(null)
    if (error) {
      setMessage({ tone: 'error', text: toKoreanError(error) })
      return
    }
    setMembers((list) => list.map((m) => (m.id === member.id ? { ...m, banned: !member.banned } : m)))
    setMessage({ tone: 'info', text: `${member.name} 회원을 ${action}했습니다.` })
  }

  async function resetPassword(member: Member) {
    if (!confirm(`${member.name}(${member.email}) 회원의 비밀번호를 초기화할까요?\n임시 비밀번호가 회원 이메일로 발송되고 모든 기기에서 로그아웃됩니다.`)) return

    setBusyId(member.id)
    setMessage(null)
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: member.id }),
    })
    const body = (await res.json()) as { tempPassword?: string; emailed?: boolean; error?: string }
    setBusyId(null)
    if (!res.ok || !body.tempPassword) {
      setMessage({ tone: 'error', text: body.error ?? '초기화에 실패했습니다.' })
      return
    }
    setMessage({
      tone: 'info',
      text: body.emailed
        ? `${member.email}로 임시 비밀번호를 보냈습니다. (임시 비밀번호: ${body.tempPassword})`
        : `메일 발송에 실패했습니다. 임시 비밀번호를 직접 전달해 주세요: ${body.tempPassword}`,
    })
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          load(query.trim())
        }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 또는 이메일 검색"
            aria-label="회원 검색"
            className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
          />
        </div>
        <p className="text-sm text-muted-foreground">전체 {total}명</p>
      </form>

      {message && (
        <div className="mt-4">
          <FormMessage tone={message.tone}>{message.text}</FormMessage>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">가입일</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">불러오는 중…</td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">회원이 없습니다.</td>
              </tr>
            ) : (
              members.map((m) => {
                const isSelf = m.id === currentUserId
                return (
                  <tr key={m.id} className={m.banned ? 'bg-muted/40' : undefined}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {m.name}
                      {m.role === 'admin' && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">관리자</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(m.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-4 py-3">
                      {m.banned ? (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">비활성</span>
                      ) : m.emailVerified ? (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700">활성</span>
                      ) : (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700">인증 대기</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={isSelf || busyId === m.id}
                          onClick={() => resetPassword(m)}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                        >
                          비밀번호 초기화
                        </button>
                        <button
                          type="button"
                          disabled={isSelf || busyId === m.id}
                          onClick={() => toggleBan(m)}
                          className={
                            m.banned
                              ? 'rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40'
                              : 'rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40'
                          }
                        >
                          {m.banned ? '활성화' : '비활성화'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
