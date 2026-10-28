import { toNextJsHandler } from 'better-auth/next-js'
import { auth, ensureAuthDb } from '@/lib/auth'

const handler = toNextJsHandler(auth)

export async function GET(request: Request) {
  await ensureAuthDb()
  return handler.GET(request)
}

export async function POST(request: Request) {
  await ensureAuthDb()
  return handler.POST(request)
}
