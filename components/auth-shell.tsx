import Link from 'next/link'

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-secondary/40 px-5 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5" aria-label="일동제약 홈">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-md bg-primary font-serif text-sm font-bold text-primary-foreground"
        >
          日
        </span>
        <span className="font-serif text-lg font-bold tracking-tight text-foreground">일동제약</span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-sm">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-7">{children}</div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
    </main>
  )
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary/15"
      />
    </label>
  )
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? '처리 중…' : children}
    </button>
  )
}

export function FormMessage({ tone, children }: { tone: 'error' | 'info'; children: React.ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive'
          : 'rounded-lg bg-primary/8 px-3.5 py-2.5 text-sm text-primary'
      }
    >
      {children}
    </p>
  )
}

const errorMessages: Record<string, string> = {
  USER_ALREADY_EXISTS: '이미 가입된 이메일입니다.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: '이미 가입된 이메일입니다.',
  INVALID_EMAIL_OR_PASSWORD: '이메일 또는 비밀번호가 올바르지 않습니다.',
  INVALID_EMAIL: '올바른 이메일 주소를 입력해 주세요.',
  PASSWORD_TOO_SHORT: '비밀번호는 8자 이상이어야 합니다.',
  EMAIL_NOT_VERIFIED: '이메일 인증이 필요합니다.',
  INVALID_OTP: '인증코드가 올바르지 않습니다.',
  OTP_EXPIRED: '인증코드가 만료되었습니다. 코드를 다시 받아 주세요.',
  TOO_MANY_ATTEMPTS: '시도 횟수를 초과했습니다. 코드를 다시 받아 주세요.',
  BANNED_USER: '이용이 정지된 계정입니다. 관리자에게 문의해 주세요.',
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
  CREDENTIAL_ACCOUNT_NOT_FOUND: '비밀번호로 가입한 계정이 아닙니다.',
  SESSION_EXPIRED: '보안을 위해 다시 로그인한 뒤 시도해 주세요.',
  USER_NOT_FOUND: '해당 회원을 찾을 수 없습니다.',
  PASSWORD_TOO_LONG: '비밀번호가 너무 깁니다.',
}

export function toKoreanError(error: { code?: string; message?: string }) {
  return (error.code && errorMessages[error.code]) || '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
}
