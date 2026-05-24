"use client";

import { useState } from "react";
import {
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";
import BlogLayout from "../components/BlogLayout";
import { skills, latestPosts } from "../data/profile";

export default function SkillPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // 선택된 스킬에 따른 포스트 필터링
  const filteredPosts =
    selectedSkill === null
      ? latestPosts
      : latestPosts.filter((post) => post.category === selectedSkill);

  const postCounts = skills.reduce<Record<string, number>>((acc, skill) => {
    acc[skill] = latestPosts.filter((post) => post.category === skill).length;
    return acc;
  }, {});

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
            All ({latestPosts.length})
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
        {filteredPosts.length > 0 ? (
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
                  key={post.slug}
                  href={`/post/${post.slug}`}
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
                    <Box sx={{ textAlign: "left", width: "100%" }}>
                      <Typography variant="caption" sx={{ display: "block", mb: 0.5, opacity: 0.7 }}>
                        {post.date}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                        {post.title}
                      </Typography>
                    </Box>
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