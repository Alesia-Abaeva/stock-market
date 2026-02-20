import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Specify the routes the middleware applies to
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)'],
}
