"use client"

import React from "react"
import { Box, Drawer, List, ListItemButton, ListItemText, Typography } from "@mui/material"
import Link from "next/link"

type AdminLayoutProps = {
  title?: string[]
  children: React.ReactNode
}

const handleLogout = () => {
  document.cookie = "token=; path=/; max-age=0"
  window.location.href = "/admin/login"
}

export default function AdminLayout({ title = ["Admin"], children }: AdminLayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box", p: 2 },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            component={Link}
            href="/admin"
            variant="h6"
            sx={{ fontWeight: 900 }}>
            관리자
          </Typography>
          <Typography variant="body2" color="text.secondary">
            관리 패널
          </Typography>
        </Box>
        <List>
          <ListItemButton component={Link} href="/admin">
            <ListItemText primary="대시보드" />
          </ListItemButton>
          <ListItemButton component={Link} href="/admin/management">
            <ListItemText primary="게시글 관리" />
          </ListItemButton>
          <ListItemButton component={Link} href="/admin/posts/new">
            <ListItemText primary="게시글 작성" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="로그아웃" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 6 }}>
        <Box sx={{ mb: 4 }}>
          {title.map((line, idx) => (
            <Typography key={idx} variant={idx === 0 ? "h6" : "h3"} sx={{ fontWeight: 900 }}>
              {line}
            </Typography>
          ))}
        </Box>

        {children}
      </Box>
    </Box>
  )
}
