import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // حماية مسارات لوحة التحكم
    const rawRole = token?.role as string | undefined;
    const role = rawRole?.trim()?.toUpperCase();
    console.log('Middleware check:', { pathname, rawRole, role });
    if (pathname.startsWith('/dashboard/company') && role !== 'COMPANY' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/dashboard/user') && token?.role !== 'USER') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
)

export const config = { 
  matcher: ["/dashboard/:path*"] 
}