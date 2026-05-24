"use client";

import { IconButton, Menu, MenuItem, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { MenuIcon } from "./BlogIcons";
import { aboutSections } from "../data/profile";

export default function AboutSectionMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoveSection = (href: string) => {
    // ex) "#education" -> "education"
    const targetId = href.replace("#", "");

    // URL hash 변경 (히스토리 추가 X)
    window.history.replaceState(null, "", href);

    // 해당 섹션으로 스크롤 이동
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // 메뉴 닫기
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="About section menu"
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          position: "fixed",
          right: 5,
          top: 300,
          zIndex: 1400,
          visibility: anchorEl ? "hidden" : "visible",
          pointerEvents: anchorEl ? "none" : "auto",
          width: 48,
          height: 48,
          bgcolor: "background.paper",
          boxShadow: 3,
          "&:hover": {
            bgcolor: "background.paper",
            boxShadow: 6,
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        disableScrollLock
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 176,
              borderRadius: 1,
              boxShadow: 8,
              zIndex: 1500,
            },
          },
        }}
      >

        <IconButton
          onClick={() => setAnchorEl(null)}
          size="small"
          aria-label="close menu"
          sx={{
            display: "flex",
            ml: "auto",
            mr: 1,
            mt: 0.5,
            width: "fit-content",
            height: "fit-content",
            p: 0.5,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {aboutSections.map((section) => (
          <MenuItem
            key={section.label}
            onClick={() => handleMoveSection(section.href)}
            sx={{ py: 1.5 }}
          >
            {section.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}