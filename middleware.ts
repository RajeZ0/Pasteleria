import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth-token")
  const isLoginPage = request.nextUrl.pathname === "/login"

  // Si no está logueado y no está en la página de login, redirigir a login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si está logueado y trata de acceder a login, redirigir a home
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)"],
}
