import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'food-case-admin'
const SESSION_TTL_SECONDS = 60 * 60 * 8

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not configured')
  return value
}

function sign(timestamp: string) {
  return createHmac('sha256', secret()).update(timestamp).digest('base64url')
}

function makeToken() {
  const timestamp = String(Date.now())
  return `${timestamp}.${sign(timestamp)}`
}

function isValidToken(token?: string) {
  if (!token) return false
  const [timestamp, signature] = token.split('.')
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false

  const age = Date.now() - Number(timestamp)
  if (age < 0 || age > SESSION_TTL_SECONDS * 1000) return false

  const expected = Buffer.from(sign(timestamp))
  const actual = Buffer.from(signature)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function createAdminSession() {
  const token = makeToken()
  const store = await cookies()
  store.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return token
}

export async function hasAdminSession() {
  try {
    const store = await cookies()
    return isValidToken(store.get(COOKIE_NAME)?.value)
  } catch {
    return false
  }
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
