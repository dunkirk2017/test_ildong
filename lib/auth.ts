import { mkdirSync } from 'node:fs'
import { Pool } from 'pg'
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { getMigrations } from 'better-auth/db/migration'
import { nextCookies } from 'better-auth/next-js'
import { admin, emailOTP } from 'better-auth/plugins'
import { sendExistingAccountNotice, sendVerificationCode } from '@/lib/email'

// DATABASE_URL(Neon PostgreSQL)이 있으면 그걸 쓰고, 없으면 개발용 로컬 파일 DB(data/auth.db)를 쓴다
function createDatabase() {
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL })
  }
  const { DatabaseSync } = process.getBuiltinModule('node:sqlite') as typeof import('node:sqlite')
  mkdirSync('data', { recursive: true })
  return new DatabaseSync('data/auth.db')
}

const options = {
  database: createDatabase(),
  // 비밀번호는 원문을 저장하지 않고 scrypt(무작위 salt 포함)로 해시해서 account.password에 저장한다 (better-auth 기본 동작)
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    // 이미 가입된 이메일로 가입을 시도하면 화면에는 알리지 않고(가입 여부 노출 방지) 본인에게 안내 메일을 보낸다
    onExistingUserSignUp: async ({ user }) => {
      await sendExistingAccountNotice({ to: user.email })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  user: {
    // 내 정보 페이지에서 비밀번호 확인 후 탈퇴할 수 있게 한다
    deleteUser: { enabled: true },
  },
  plugins: [
    // 인증 메일과 비밀번호 재설정 메일을 링크 대신 6자리 코드로 보낸다
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendVerificationCode({ to: email, code: otp, type })
      },
    }),
    // user.role = 'admin'인 회원은 /admin에서 회원 관리(비활성화, 비밀번호 초기화)를 할 수 있다
    admin({
      bannedUserMessage: '이용이 정지된 계정입니다. 관리자에게 문의해 주세요.',
    }),
    nextCookies(),
  ],
} satisfies BetterAuthOptions

export const auth = betterAuth(options)

let migrated: Promise<void> | undefined

// 첫 요청 때 필요한 테이블과 컬럼(user, session, account, verification, role/banned 등)을 만든다
export function ensureAuthDb() {
  migrated ??= getMigrations(options).then(({ runMigrations }) => runMigrations())
  return migrated
}

// 서버 컴포넌트/라우트에서 현재 로그인한 회원을 가져온다
export async function getSession(headers: Headers) {
  await ensureAuthDb()
  return auth.api.getSession({ headers })
}
