import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
// ReactMarkdown removed in favor of raw HTML rendering
import BlogLayout from "../../../components/layout/BlogLayout";
import AboutSectionMenu from "../../../components/about/AboutSectionMenu";

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:4000"

type PostData = {
  id: number
  title: string
  contents: string
  category_name?: string | null
  thumbnail?: string | null
  category_id?: number | null
  created_at?: string | null
}

async function fetchPostById(id: string) {
  const response = await fetch(`${API_BASE}/posts/${encodeURIComponent(id)}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("포스트를 찾을 수 없습니다.")
  }

  return response.json() as Promise<PostData>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await fetchPostById(id)
    return {
      title: post.title,
      description:
        post.contents?.slice(0, 120) || `${post.title} 포스트 상세 페이지`,
    }
  } catch {
    return {
      title: "포스트를 찾을 수 없음",
      description: "요청한 포스트를 찾을 수 없습니다.",
    }
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  let post: PostData
  const { id } = await params

  try {
    post = await fetchPostById(id)
  } catch (error) {
    return notFound()
  }

  return (
    <BlogLayout title={[]} rightSlot={<AboutSectionMenu />}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 900 }} dangerouslySetInnerHTML={{ __html: post.title }} />
          {post.category_name && (
            <Chip
              label={post.category_name}
              size="small"
              sx={{ bgcolor: "grey.200", fontWeight: 700 }}
            />
          )}
        </Stack>

        {post.created_at && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {new Date(post.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </Typography>
        )}

        {post.thumbnail && (
          <Box sx={{ mb: 4 }}>
            <Box
              component="img"
              src={post.thumbnail}
              alt={post.title}
              sx={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 1 }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 4,
            justifyContent: "flex-end",
          }}
        >
          {(() => {
            const href = post.category_id === 1 ? "/troubleshooting" : "/skill";
            const label = post.category_id === 1 ? "Back to Troubleshooting" : "Back to Skill";
            return (
              <Link href={href} style={{ textDecoration: "none" }}>
                <Button variant="outlined" size="small">
                  {label}
                </Button>
              </Link>
            )
          })()}

          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small">
              Home
            </Button>
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          typography: "body1",
          lineHeight: 1.8,
          color: "text.primary",
          "& h2": { mt: 4, mb: 2, fontWeight: 800 },
          "& h3": { mt: 3, mb: 1.5, fontWeight: 700 },
          "& ul": { pl: 4, mb: 3 },
          "& li": { mb: 1 },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: post.contents }} />
      </Box>
    </BlogLayout>
  )
}
