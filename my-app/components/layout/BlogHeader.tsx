"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState, useRef } from "react";
import { ChevronDownIcon, SearchIcon } from "../common/BlogIcons";
import { pageLinks } from "../../data/profile";

type BlogHeaderProps = {
  title: string[];
  eyebrow?: string;
};

export default function BlogHeader({
  title,
  eyebrow = "Developer Blog",
}: BlogHeaderProps) {
  const [pageMenuAnchor, setPageMenuAnchor] = useState<null | HTMLElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 드롭다운 틈새를 부드럽게 연결하기 위한 타이머
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPageMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setPageMenuAnchor(null);
    }, 100); // 유예 시간을 100ms로 줄여 밖으로 나갈 때 더 빠르게 닫히도록 함
  };

  return (
    <Box component="header" sx={{ mb: 7 }}>
      <Stack direction="row" sx={{ gap: 4, alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {eyebrow}
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontSize: 56,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            {title.map((line) => (
              <span style={{ display: "block" }} key={line}>
                {line}
              </span>
            ))}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            sx={{ display: 'inline-block' }}
          >
            <Button
              variant="contained"
              color="inherit"
              endIcon={<ChevronDownIcon />}
              sx={{
                bgcolor: "background.paper",
                px: 3,
                py: 1.35,
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "background.paper",
                  boxShadow: 4,
                },
              }}
            >
              Page
            </Button>

            <Menu
              anchorEl={pageMenuAnchor}
              open={Boolean(pageMenuAnchor)}
              onClose={() => setPageMenuAnchor(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              // 호버 브릿지 현상 해결을 위한 스타일 및 이벤트 추가
              sx={{ pointerEvents: 'none' }}
              slotProps={{
                paper: {
                  onMouseEnter: () => {
                    if (timerRef.current) {
                      clearTimeout(timerRef.current);
                    }
                    // 메뉴 영역에 있는 동안에는 계속 Anchor 유지
                    if (pageMenuAnchor) setPageMenuAnchor(pageMenuAnchor);
                  },
                  onMouseLeave: handleClose,
                  sx: { 
                    pointerEvents: 'auto', 
                    mt: 1, 
                    width: 240, 
                    borderRadius: 1, 
                    boxShadow: 8,
                    // 버튼과 메뉴 사이의 8px 간격(mt: 1)을 메워주는 투명한 브릿지 추가
                    '&::before': { content: '""', position: 'absolute', top: -8, left: 0, right: 0, height: 8 }
                  },
                },
              }}
            >
              {pageLinks.map((item) => (
                <MenuItem
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={() => setPageMenuAnchor(null)}
                  sx={{ py: 1.5 }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{item.label}</span>
                    <span>&gt;</span>
                  </Stack>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <IconButton
            aria-label="Open search"
            onClick={() => setIsSearchOpen(true)}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "background.paper", boxShadow: 4 },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Dialog
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              position: "absolute",
              top: 68,
              m: 0,
              borderRadius: 4,
              overflow: "visible",
              bgcolor: "#eef2f5",
              boxShadow: 10,

            },
          },
        }}
      >
        <DialogContent sx={{ position: "relative", zIndex: 1, p: 3.5 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="검색어 입력"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { bgcolor: "white", borderRadius: 2 },
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
