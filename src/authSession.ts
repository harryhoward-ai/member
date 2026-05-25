import type { DashFunAccount } from './Api'

const AUTH_SESSION_KEY = 'howardai.member.session'

export function loadAuthSession(): DashFunAccount | null {
  const raw = window.localStorage.getItem(AUTH_SESSION_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as DashFunAccount
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY)

    return null
  }
}

export function saveAuthSession(account: DashFunAccount) {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(account))
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY)
}