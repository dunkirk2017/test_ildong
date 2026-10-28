import { mkdirSync } from 'node:fs'
import { Pool } from 'pg'
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { getMigrations } from 'better-auth/db/migration'
import { nextCookies } from 'better-auth/next-js'
import { emailOTP } from 'better-auth/plugins'
import { sendVerificationCode } from '@/lib/email'

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
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  plugins: [
    // 인증 메일을 링크 대신 6자리 코드로 보낸다
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      sendVerificationOTP: async ({ email, otp }) => {
        await sendVerificationCode({ to: email, code: otp })
      },
    }),
    nextCookies(),
  ],
} satisfies BetterAuthOptions

export const auth = betterAuth(options)

let migrated: Promise<void> | undefined

// 첫 요청 때 필요한 테이블(user, session, account, verification)을 만든다
export function ensureAuthDb() {
  migrated ??= getMigrations(options).then(({ runMigrations }) => runMigrations())
  return migrated
}
