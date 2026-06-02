"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "로그인에 실패했습니다.")
      }

      const data = await response.json()
      document.cookie = `token=${data.token}; path=/; max-age=3600`
      console.log("token = " + data.token)
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "로그인 실패")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        bgcolor: "#f8fafc",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 520, borderRadius: 5, boxShadow: 8 }}>
        <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            관리자 전용 로그인
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
            블로그 관리자 로그인
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 3 }}>
            <TextField
              label="이메일"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoComplete="username"
            />
            <TextField
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              fullWidth
              autoComplete="current-password"
            />

            {error && (
              <Typography color="error" sx={{ fontSize: 14 }}>
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" sx={{ py: 1.8 }} disabled={loading}>
              {loading ? "로그인 중..." : "관리자 로그인"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 4, color: "text.secondary" }}>
            <Link href="/admin/join" style={{ textDecoration: 'none' }}>
              <Button variant="text" size="small" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                관리자 계정 생성하기
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
