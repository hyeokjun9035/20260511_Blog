import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // admin 아니면 그냥 통과
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next()
    }

    // 로그인 페이지는 허용
    if (pathname === "/admin/login") {
        return NextResponse.next()
    }

    const token = req.cookies.get("token")?.value

    if (!token) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = "/admin/login"
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
