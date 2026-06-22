"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material"

export default function AdminJoinPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const validatePassword = (value: string) => {
    const lower = /[a-z]/.test(value)
    const digit = /\d/.test(value)
    const special = /[^A-Za-z0-9]/.test(value)
    const matches = [lower, digit, special].filter(Boolean).length
    return value.length >= 8 && matches >= 2
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validatePassword(password)) {
      setError("비밀번호는 8자 이상이어야 하며 소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.")
      return
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, role: "admin" }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "가입에 실패했습니다.")
      }

      setSuccess(data.message || "관리자 계정이 생성되었습니다.")
      setTimeout(() => router.push("/admin/login"), 1200)
    } catch (err: any) {
      setError(err.message || "가입에 실패했습니다.")
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
            관리자 계정 가입
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5 }}>
            관리자 계정 생성
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
            이메일과 비밀번호를 입력해 관리자 계정을 생성하세요. 가입 후 로그인 페이지로 이동합니다.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 3 }}>
            <TextField
              label="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            
            <TextField
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              fullWidth
              autoComplete="new-password"
            />
            <Typography sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.5 }}>
              비밀번호는 8자 이상이며 소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.
            </Typography>
            <TextField
              label="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              fullWidth
              autoComplete="new-password"
            />

            {error && (
              <Typography color="error" sx={{ fontSize: 14 }}>
                {error}
              </Typography>
            )}

            {success && (
              <Typography color="success.main" sx={{ fontSize: 14 }}>
                {success}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" sx={{ py: 1.8 }} disabled={loading}>
              {loading ? "가입 중..." : "관리자 계정 생성"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mt: 4, color: "text.secondary" }}>
            <Typography variant="body2">가입 후 로그인 페이지로 이동합니다.</Typography>
            <Typography variant="body2">이메일은 로그인 아이디로 사용됩니다.</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
