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
import BlogLayout from "./components/BlogLayout";
import Link from "next/link";
import { latestPosts } from "./data/profile";

export default function DevBlogMain() {
  return (
    <BlogLayout title={["문제 해결과 개발을", "기록하는 기술 블로그"]}>
      <Card
        sx={{
          mb: 7,
          p: 2,
          borderRadius: 5,
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

        <Grid container spacing={3.5}>
          {latestPosts.map((post) => (
            <Grid key={post.slug} size={{ xs: 12, md: 6 }}>
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
                  <Stack direction="row" sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}>
                    <Chip label={post.category} size="small" sx={{ bgcolor: "#fff3bf", fontWeight: 700 }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.date}
                    </Typography>
                  </Stack>

                  <Typography variant="h5" component="h3" sx={{ fontWeight: 900, lineHeight: 1.25 }}>
                    {post.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                    프로젝트를 진행하며 정리한 개발 기록과 트러블슈팅 내용을 공유합니다.
                  </Typography>

                  <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <Button color="inherit" sx={{ mt: 2.5, px: 0, fontWeight: 700 }}>
                      Read More &gt;
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </BlogLayout>
  );
}
