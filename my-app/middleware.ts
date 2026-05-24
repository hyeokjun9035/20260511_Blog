import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // admin 경로만 보호
  if (pathname.startsWith("/admin")) {
    // 로그인 페이지 자체는 허용
    if (pathname === "/admin/login") return NextResponse.next()

    // 간단한 토큰 검사: 쿠키에 `token` 존재 여부
    const token = req.cookies.get("token")?.value
    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = "/admin/login"
      // 접근 시 원래 가려던 경로를 쿼리로 전달
      loginUrl.search = `redirect=${encodeURIComponent(req.nextUrl.pathname)}`
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
