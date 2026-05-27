"use client"

import { Box } from "@mui/material";
import BlogHeader from "./BlogHeader";
import BlogSidebar from "./BlogSidebar";

type BlogLayoutProps = {
  title: string[];
  children: React.ReactNode;
  eyebrow?: string;
  rightSlot?: React.ReactNode;
};

export default function BlogLayout({
  title,
  children,
  eyebrow,
  rightSlot,
}: BlogLayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <BlogSidebar />

      <Box component="main" sx={{ position: "relative", flex: 1, px: 6, py: 5 }}>
        {rightSlot}
        <BlogHeader title={title} eyebrow={eyebrow} />
        {children}
      </Box>
    </Box>
  );
}
