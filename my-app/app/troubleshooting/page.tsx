"use client";

import { useState, useEffect } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import BlogLayout from "../../components/layout/BlogLayout";
import Link from "next/link";
import { troubleshootingTopics } from "../../data/profile";

interface Post {
  id: number;
  slug?: string;
  thumbnail?: string;
  title: string;
  category_name?: string;
  category_id?: number | null;
  created_at: string;
}

export default function TroubleShootingPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        // 최신순으로 정렬
        const sorted = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setAllPosts(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // show only troubleshooting posts (category_id === 1), then filter by troubleshootingTopics
  const troubleshootingPosts = allPosts.filter((post) => post.category_id === 1);

  const filteredPosts = selectedTopic === null
    ? troubleshootingPosts
    : troubleshootingPosts.filter((post) => post.category_name === selectedTopic);

  const postCounts = troubleshootingTopics.reduce<Record<string, number>>((acc, topic) => {
    acc[topic] = troubleshootingPosts.filter((post) => post.category_name === topic).length;
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <BlogLayout title={["TroubleShooting", "실무에서 마주한 문제 해결 기록"]}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant={selectedTopic === null ? "contained" : "outlined"}
            onClick={() => setSelectedTopic(null)}
            sx={{
              fontWeight: 700,
              transition: "all 0.2s ease-in-out",
              textTransform: "none",
            }}
          >
            All ({troubleshootingPosts.length})
          </Button>
          {troubleshootingTopics.map((topic) => (
            <Button
              key={topic}
              variant={selectedTopic === topic ? "contained" : "outlined"}
              onClick={() => setSelectedTopic(topic)}
              sx={{
                fontWeight: 700,
                transition: "all 0.2s ease-in-out",
                textTransform: "none",
              }}
            >
              {topic} ({postCounts[topic] ?? 0})
            </Button>
          ))}
        </Stack>
      </Box>

      <Box>
        {loading ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            로딩 중...
          </Typography>
        ) : error ? (
          <Typography variant="body1" color="error" sx={{ textAlign: "center", py: 4 }}>
            오류: {error}
          </Typography>
        ) : filteredPosts.length > 0 ? (
          <>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  position: "relative",
                  zIndex: 1,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 4,
                    left: 0,
                    width: "100%",
                    height: "12px",
                    bgcolor: "primary.main",
                    zIndex: -1,
                    opacity: 0.5,
                  },
                }}
              >
                {selectedTopic ? `${selectedTopic}` : "모든 트러블슈팅 포스트"}
              </Typography>
              <Chip
                label={`${filteredPosts.length} Posts`}
                size="small"
                sx={{ fontWeight: 700, bgcolor: "grey.200" }}
              />
            </Stack>
            <Stack spacing={2}>
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      justifyContent: "flex-start",
                      padding: "16px 20px",
                      borderRadius: 2,
                      borderColor: "grey.300",
                      backgroundColor: "transparent",
                      transition: "all 0.2s ease-in-out",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        borderColor: "primary.main",
                        color: "white",
                        transform: "translateX(4px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                        <Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center", textAlign: "left" }}>
                          {post.thumbnail && (
                            <Box component="img" src={post.thumbnail} alt={post.title} sx={{ width: 120, height: 80, objectFit: "cover", borderRadius: 1 }} />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ display: "block", mb: 0.5, opacity: 0.7 }}>
                              {formatDate(post.created_at)}
                            </Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                              {post.title}
                            </Typography>
                          </Box>
                        </Stack>
                  </Button>
                </Link>
              ))}
            </Stack>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic", ml: 1 }}>
            아직 이 카테고리에 트러블슈팅 포스트가 없습니다.
          </Typography>
        )}
      </Box>
    </BlogLayout>
  );
}
