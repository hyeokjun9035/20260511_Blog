"use client"
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AdminLayout from "../../components/layout/AdminLayout";
import Link from "next/link";

export default function AdminPage() {
  return (
    <AdminLayout title={["관리자 전용", "콘텐츠 관리 대시보드"]}>
      <Box sx={{ display: "grid", gap: 4 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 5,
            background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
            boxShadow: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: "text.secondary" }}>
              관리자 전용 화면
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
              블로그 운영과 관리
              <br />
              지금 바로 확인하세요.
            </Typography>
            <Typography sx={{ mt: 3, maxWidth: 720, color: "text.secondary", lineHeight: 1.8 }}>
              이 페이지는 게시글 관리, 작성, 수정, 삭제를 위한 관리자 패널입니다. 일반 사용자용 메인 페이지와
              구분되는 관리자 전용 UI를 제공합니다.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
              <Link href="/admin/posts/new" style={{ textDecoration: "none" }}>
                <Button variant="outlined">게시글 작성</Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          }}
        >
          {[
            {
              title: "게시글 수",
              value: "12",
              description: "전체 블로그 게시물 수입니다.",
            },
            {
              title: "임시 저장",
              value: "3",
              description: "현재 임시 저장된 게시물 수입니다.",
            },
            {
              title: "관리자 권한",
              value: "Active",
              description: "로그인 상태로 관리자 기능이 활성화되었습니다.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              sx={{
                minHeight: 180,
                border: "1px solid",
                borderColor: "grey.100",
                boxShadow: 2,
                transition: "transform 180ms ease, boxShadow 180ms ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  {item.value}
                </Typography>
                <Typography sx={{ mt: 2, color: "text.secondary" }}>{item.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

      </Box>
    </AdminLayout>
  );
}
