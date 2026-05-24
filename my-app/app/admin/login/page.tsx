"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 백엔드 연동 예정
    // 개발용으로 쿠키에 mock 토큰을 저장하고 관리자 페이지로 이동
    document.cookie = "token=mock-token; path=/; max-age=3600"
    router.push("/admin")
  }

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: 20 }}>
      <h1>관리자 로그인</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column" }}>
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 8 }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 8 }}
          />
        </label>

        <button type="submit" style={{ padding: 10 }}>로그인</button>
      </form>

      <p style={{ marginTop: 16, color: "#666" }}>백엔드 연동은 추후 진행됩니다.</p>
    </div>
  )
}
