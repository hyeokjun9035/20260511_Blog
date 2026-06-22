"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from "@mui/icons-material/Refresh"
import ArticleIcon from "@mui/icons-material/Article"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import AdminLayout from "../../../components/layout/AdminLayout"

type PostItem = {
  id: number
  title: string
  contents?: string | null
  category_id?: number | string | null
  category_name?: string | null
  thumbnail?: string | null
  is_public?: boolean | number | string | null
  view_count?: number | string | null
  like_count?: number | string | null
  created_at?: string | null
  updated_at?: string | null
}

type VisibilityFilter = "all" | "public" | "private"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

function isPublicPost(value: PostItem["is_public"]) {
  return value === true || value === 1 || value === "1" || value === "Y" || value === "y" || value === "true"
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getSnippet(contents?: string | null) {
  if (!contents) {
    return "내용 미리보기가 없습니다."
  }

  const plainText = contents.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  if (!plainText) {
    return "내용 미리보기가 없습니다."
  }

  return plainText.length > 120 ? `${plainText.slice(0, 120)}...` : plainText
}

export default function AdminCreateManagementPage() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<VisibilityFilter>("all")

  const loadPosts = async (background = false) => {
    if (background) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError("")

    try {
      const [postsResponse, countResponse] = await Promise.all([
        fetch(`${API_BASE}/posts`),
        fetch(`${API_BASE}/posts/count`),
      ])

      if (!postsResponse.ok) {
        throw new Error("게시글 목록을 불러오지 못했습니다.")
      }

      if (!countResponse.ok) {
        throw new Error("게시글 수를 불러오지 못했습니다.")
      }

      const postsData = await postsResponse.json()
      const countData = await countResponse.json()

      setPosts(Array.isArray(postsData) ? postsData : [])
      setTotalCount(Number(countData) || 0)
    } catch (fetchError: unknown) {
      setError(fetchError instanceof Error ? fetchError.message : "게시글을 불러오지 못했습니다.")
      setPosts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return posts.filter((post) => {
      const visible =
        filter === "all"
          ? true
          : filter === "public"
            ? isPublicPost(post.is_public)
            : !isPublicPost(post.is_public)

      if (!visible) {
        return false
      }

      if (!keyword) {
        return true
      }

      const searchable = [
        String(post.id),
        post.title,
        post.category_name || "",
        String(post.category_id ?? ""),
        getSnippet(post.contents),
      ]
        .join(" ")
        .toLowerCase()

      return searchable.includes(keyword)
    })
  }, [filter, posts, query])

  const stats = useMemo(() => {
    const publicPosts = posts.filter((post) => isPublicPost(post.is_public)).length
    const privatePosts = posts.length - publicPosts
    const latestPost = posts[0]

    return [
      {
        label: "전체 게시글",
        value: totalCount,
        helper: "백엔드 기준 현재 게시물 수",
        icon: <ArticleIcon />,
      },
      {
        label: "공개 게시글",
        value: publicPosts,
        helper: "외부에 노출되는 글",
        icon: <VisibilityIcon />,
      },
      {
        label: "비공개 게시글",
        value: privatePosts,
        helper: "관리자만 확인하는 글",
        icon: <VisibilityOffIcon />,
      },
      {
        label: "최근 수정",
        value: latestPost ? formatDate(latestPost.updated_at || latestPost.created_at) : "-",
        helper: latestPost ? latestPost.title : "아직 게시글이 없습니다",
        icon: <RefreshIcon />,
      },
    ]
  }, [posts, totalCount])

  const handleRefresh = () => {
    loadPosts(true)
  }

  const handleDelete = async (post: PostItem) => {
    const confirmed = window.confirm(`"${post.title}" 게시글을 삭제하시겠습니까?`)

    if (!confirmed) {
      return
    }

    setDeletingId(post.id)
    setError("")

    try {
      const token = getCookie("token")
      const response = await fetch(`${API_BASE}/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        throw new Error("게시글 삭제에 실패했습니다.")
      }

      await loadPosts(true)
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "게시글 삭제에 실패했습니다.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout title={["게시글 관리", "목록 조회와 삭제를 빠르게 처리하세요"]}>
      <Box sx={{ display: "grid", gap: 4 }}>
        <Card
          sx={{
            borderRadius: 5,
            border: "1px solid",
            borderColor: "grey.200",
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(51, 65, 85, 0.92) 60%, rgba(248, 250, 252, 1) 100%)",
            color: "common.white",
            overflow: "hidden",
            boxShadow: 6,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={3}
              sx={{ alignItems: { xs: "flex-start", lg: "center" }, justifyContent: "space-between" }}
            >
              <Box sx={{ maxWidth: 760 }}>
                <Chip
                  label="관리자 전용"
                  sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700 }}
                />
                <Typography variant="h3" component="h2" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                  게시글을 한눈에 보고
                  <br />
                  바로 정리하세요.
                </Typography>
                <Typography sx={{ mt: 2.5, maxWidth: 680, color: "rgba(255,255,255,0.82)", lineHeight: 1.8 }}>
                  이 화면에서 게시글의 상태를 빠르게 확인하고, 검색·필터·삭제까지 처리할 수 있습니다. 관리에 필요한
                  기본 동작만 남기고 시야를 깔끔하게 정리했습니다.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/admin/posts/new"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: "white", color: "slate.900", px: 2.5, py: 1.3, fontWeight: 800 }}
                >
                  새 게시글 작성
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  startIcon={refreshing ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
                  sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white", px: 2.5, py: 1.3, fontWeight: 700 }}
                >
                  새로고침
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" },
          }}
        >
          {stats.map((item) => (
            <Card
              key={item.label}
              sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "grey.200",
                boxShadow: 2,
                transition: "transform 180ms ease, box-shadow 180ms ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 8 },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.6 }}>
                  {item.helper}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card sx={{ borderRadius: 5, border: "1px solid", borderColor: "grey.200", boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  게시글 목록
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
                  검색어와 공개 상태를 기준으로 게시글을 빠르게 찾을 수 있습니다.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                {[
                  { key: "all", label: "전체" },
                  { key: "public", label: "공개" },
                  { key: "private", label: "비공개" },
                ].map((item) => (
                  <Button
                    key={item.key}
                    variant={filter === item.key ? "contained" : "outlined"}
                    onClick={() => setFilter(item.key as VisibilityFilter)}
                    sx={{ minWidth: 92 }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Stack>

            <TextField
              fullWidth
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="제목, 카테고리, 본문, ID로 검색"
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : filteredPosts.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  textAlign: "center",
                  borderRadius: 4,
                  border: "1px dashed",
                  borderColor: "grey.300",
                  bgcolor: "grey.50",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  표시할 게시글이 없습니다.
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  검색어를 바꾸거나 필터를 해제해 보세요.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setQuery("")
                    setFilter("all")
                  }}
                >
                  필터 초기화
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {filteredPosts.map((post) => {
                  const published = isPublicPost(post.is_public)

                  return (
                    <Card
                      key={post.id}
                      variant="outlined"
                      sx={{
                        borderRadius: 4,
                        borderColor: "grey.200",
                        background: published ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" : "#fff7ed",
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", md: "center" },
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.2, flexWrap: "wrap" }}>
                              <Chip
                                label={published ? "공개" : "비공개"}
                                color={published ? "success" : "warning"}
                                size="small"
                              />
                              <Chip label={`#${post.id}`} size="small" variant="outlined" />
                              <Chip
                                label={post.category_name || `카테고리 ${post.category_id ?? "미지정"}`}
                                size="small"
                                variant="outlined"
                              />
                            </Stack>

                            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.35 }}>
                              {post.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.8 }}>
                              {getSnippet(post.contents)}
                            </Typography>

                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                작성 {formatDate(post.created_at)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                수정 {formatDate(post.updated_at)}
                              </Typography>
                            </Stack>
                          </Box>

                          <Box sx={{ minWidth: { xs: "100%", md: 260 } }}>
                            <Stack direction="row" spacing={1.2} sx={{ justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDelete(post)}
                                disabled={deletingId === post.id}
                              >
                                삭제
                              </Button>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: 2, flexWrap: "wrap", justifyContent: { xs: "flex-start", md: "flex-end" } }}
                            >
                              <Chip label={`조회 ${Number(post.view_count ?? 0)}`} size="small" />
                              <Chip label={`좋아요 ${Number(post.like_count ?? 0)}`} size="small" />
                            </Stack>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )
                })}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  )
}
