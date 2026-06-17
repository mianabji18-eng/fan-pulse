import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ============================================================
// Fan Pulse — Auth Proxy (Next.js 16+)
// Gracefully handles missing Supabase env vars in development
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If Supabase is not configured yet, skip auth checks
const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function proxy(request: NextRequest) {
  // Dev mode without Supabase: allow all routes through
  if (!SUPABASE_CONFIGURED) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session (do NOT remove this)
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes
  const isAppRoute = ['/home', '/matches', '/predictions', '/checkin', '/leaderboard', '/profile']
    .some(route => request.nextUrl.pathname.startsWith(route));

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirectResponse = NextResponse.redirect(url);
    // Persist cookies to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Redirect logged-in users away from auth pages
  const isAuthRoute = ['/', '/login', '/register']
    .includes(request.nextUrl.pathname);

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    const redirectResponse = NextResponse.redirect(url);
    // Persist cookies to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
