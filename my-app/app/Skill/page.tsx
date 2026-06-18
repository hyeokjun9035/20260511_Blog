"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";
import BlogLayout from "../../components/layout/BlogLayout";
import { skills } from "../../data/profile";

interface Post {
  id: number;
  slug?: string;
  thumbnail?: string;
  title: string;
  category_name?: string;
  category_id?: number | null;
  created_at: string;
}

export default function SkillPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
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

  // show only posts with category_id === 2 (skill posts), then filter by tech skill name
  const skillPosts = allPosts.filter((post) => post.category_id === 2);

  const filteredPosts = selectedSkill === null
    ? skillPosts
    : skillPosts.filter((post) => post.category_name === selectedSkill);

  const postCounts = skills.reduce<Record<string, number>>((acc, skill) => {
    acc[skill] = skillPosts.filter((post) => post.category_name === skill).length;
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <BlogLayout title={["보유한 기술 스택과", "학습 기록을 확인하세요"]}>
      <Box sx={{ mb: 4 }}>
        {/* 필터 버튼 */}
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant={selectedSkill === null ? "contained" : "outlined"}
            onClick={() => setSelectedSkill(null)}
            sx={{
              fontWeight: 700,
              transition: "all 0.2s ease-in-out",
              textTransform: "none",
            }}
          >
            All ({skillPosts.length})
          </Button>
          {skills.map((skill) => (
            <Button
              key={skill}
              variant={selectedSkill === skill ? "contained" : "outlined"}
              onClick={() => setSelectedSkill(skill)}
              sx={{
                fontWeight: 700,
                transition: "all 0.2s ease-in-out",
                textTransform: "none",
              }}
            >
              {skill} ({postCounts[skill] ?? 0})
            </Button>
          ))}
        </Stack>
      </Box>

      {/* 포스트 목록 */}
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
                {selectedSkill ? `${selectedSkill}` : "모든 포스트"}
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
            아직 이 카테고리에 포스트가 없습니다.
          </Typography>
        )}
      </Box>
    </BlogLayout>
  );
}