// proxy.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // 🔴 DEBUG LOG: Terminal mein check karo ye kya print kar raha hai
  console.log("Path:", request.nextUrl.pathname, " | Session Found:", !!session)

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  // Case 1: Admin page pe ho par login nahi ho -> Login pe bhejo
  if (isAdminPage && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Case 2: Login ho chuke ho aur wapas login page khol rahe ho -> Dashboard pe bhejo
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}