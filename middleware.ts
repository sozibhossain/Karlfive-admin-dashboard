import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url))
    }

    // Check if user is admin
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user-management/:path*",
    "/venue-management/:path*",
    "/registration-fees/:path*",
    "/reports/:path*",
  ],
}
