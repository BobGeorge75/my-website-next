import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  // Redirect authenticated users away from auth pages
  if (user && (path === '/auth/login' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/members', request.url))
  }

  // Protect /members routes
  if (path.startsWith('/members')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Fetch role from profiles table
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role as string | undefined

    if (!role || role === 'pending') {
      return NextResponse.redirect(new URL('/auth/pending', request.url))
    }

    // Members cannot access the admin panel
    if (role === 'member' && path.startsWith('/members/admin')) {
      return NextResponse.redirect(new URL('/members', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
