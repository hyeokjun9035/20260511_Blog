import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import BlogLayout from "../../components/BlogLayout";
import AboutSectionMenu from "../../components/AboutSectionMenu";
import { getPostBySlug, getPostSlugs } from "../../lib/posts";

// 정적 경로 생성
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

// 메타데이터 (async 처리 필요)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    return {
      title: post.frontMatter.title,
      description:
        post.frontMatter.description ||
        `${post.frontMatter.title} 포스트 상세 페이지`,
    };
  } catch {
    return {
      title: "포스트를 찾을 수 없음",
      description: "요청한 포스트를 찾을 수 없습니다.",
    };
  }
}

// 페이지
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post;

  const { slug } = await params;

  try {
    post = getPostBySlug(slug);
  } catch (error) {
    return notFound();
  }

  const { frontMatter, content } = post;

  return (
    <BlogLayout
      title={[]}
      rightSlot={<AboutSectionMenu />}
    >
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", mb: 2 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            {frontMatter.title}
          </Typography>
          {frontMatter.category && (
            <Chip
              label={frontMatter.category}
              size="small"
              sx={{ bgcolor: "grey.200", fontWeight: 700 }}
            />
          )}
        </Stack>

        {frontMatter.date && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {frontMatter.date}
          </Typography>
        )}

        <Box
          sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4,  justifyContent: "flex-end", }}
        >
          {/* ✅ 안전한 방식 */}
          <Link href="/Skill" style={{ textDecoration: "none" }}>
            <Button variant="outlined" size="small">  
              Back to Skill
            </Button>
          </Link>

          {/* ✅ 이것도 동일하게 수정 */}
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
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
    </BlogLayout>
  );
}