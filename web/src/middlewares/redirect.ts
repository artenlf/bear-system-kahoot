import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/']
}

export function redirect(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

