import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const adminCookie = request.cookies.get("admin-auth")

  if (!adminCookie || adminCookie.value !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
