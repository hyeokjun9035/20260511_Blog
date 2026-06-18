"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BlogLayout from "../components/layout/BlogLayout";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  slug?: string;
  thumbnail?: string;
  title: string;
  category_name?: string;
  created_at: string;
}

export default function DevBlogMain() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        // 최신 2개만 표시하기 위해 정렬
        const recent = data
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2);
        setLatestPosts(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <BlogLayout title={["문제 해결과 개발을", "기록하는 기술 블로그"]}>
      <Card
        sx={{
          mb: 7,
          p: 2,
          borderRadius: 2,
          background: "linear-gradient(90deg, #f6c90e 0%, #fff3bf 100%)",
          boxShadow: 7,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
            Latest Project
          </Typography>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
            Next.js 기반
            <br />
            개발 블로그 시작중
          </Typography>

          <Typography sx={{ mt: 3, maxWidth: 720, color: "text.secondary", lineHeight: 1.8 }}>
            React, Next.js, TypeScript를 사용하여 개인 개발 기록과 트러블슈팅을
            정리하는 블로그입니다.
          </Typography>

          <Button variant="contained" color="inherit" sx={{ mt: 4, bgcolor: "black", color: "white" }}>
            자세히 보기
          </Button>
        </CardContent>
      </Card>

      <Box component="section">
        <Stack direction="row" sx={{ mb: 4, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900 }}>
            Latest Posts
          </Typography>
          <Button color="inherit">View All &gt;</Button>
        </Stack>

        {loading ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            로딩 중...
          </Typography>
        ) : error ? (
          <Typography variant="body1" color="error" sx={{ textAlign: "center", py: 4 }}>
            오류: {error}
          </Typography>
        ) : latestPosts.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            게시물이 없습니다.
          </Typography>
        ) : (
          <Grid container spacing={3.5}>
            {latestPosts.map((post) => (
              <Grid key={post.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    border: "1px solid",
                    borderColor: "grey.100",
                    boxShadow: 2,
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    {post.thumbnail && (
                      <Box
                        component="img"
                        src={post.thumbnail}
                        alt={post.title}
                        sx={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 1, mb: 2 }}
                      />
                    )}
                    <Stack direction="row" sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}>
                      <Chip
                        label={post.category_name || "기타"}
                        size="small"
                        sx={{ bgcolor: "#fff3bf", fontWeight: 700 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(post.created_at)}
                      </Typography>
                    </Stack>

                    <Typography variant="h5" component="h3" sx={{ fontWeight: 900, lineHeight: 1.25 }}>
                      {post.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                      프로젝트를 진행하며 정리한 개발 기록과 트러블슈팅 내용을 공유합니다.
                    </Typography>

                    <Link href={`/post/${post.id}`} style={{ textDecoration: "none" }}>
                      <Button color="inherit" sx={{ mt: 2.5, px: 0, fontWeight: 700 }}>
                        Read More &gt;
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </BlogLayout>
  );
}
