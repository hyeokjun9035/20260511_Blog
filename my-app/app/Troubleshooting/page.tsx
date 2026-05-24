"use client";

import { useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import BlogLayout from "../components/BlogLayout";
import Link from "next/link";
import { troubleshootingTopics, troubleshootingPosts } from "../data/profile";

export default function TroubleShootingPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredPosts =
    selectedTopic === null
      ? troubleshootingPosts
      : troubleshootingPosts.filter((post) => post.category === selectedTopic);

  const postCounts = troubleshootingTopics.reduce<Record<string, number>>((acc, topic) => {
    acc[topic] = troubleshootingPosts.filter((post) => post.category === topic).length;
    return acc;
  }, {});

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
            아직 이 카테고리에 트러블슈팅 포스트가 없습니다.
          </Typography>
        )}
      </Box>
    </BlogLayout>
  );
}
