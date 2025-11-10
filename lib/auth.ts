export const AUTH_TOKEN_KEY = "auth-token"
export const AUTH_USER_KEY = "auth-user"

type AuthUser = {
  id: number
  email: string
  username: string
  first_name?: string
  last_name?: string
  role?: string
}

export function saveAuthSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`
}
