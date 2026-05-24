"use client";

import {
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { GithubIcon, MailIcon } from "./BlogIcons";
import { profile, skills } from "../data/profile";

export default function BlogSidebar() {
  return (
    <Box
      component="aside"
      sx={{
        position: "sticky",
        top: 0,
        width: 280,
        minHeight: "100vh",
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "grey.200",
        bgcolor: "background.paper",
        px: 3,
        py: 4,
      }}
    >
      <Stack spacing={2.25} sx={{ pb: 4, alignItems: "center" }}>
        <Box
          component={Link}
          href="/"
          aria-label="Go to home"
          sx={{
            position: "relative",
            width: 112,
            height: 112,
            overflow: "hidden",
            border: "4px solid",
            borderColor: "primary.main",
            borderRadius: "50%",
            boxShadow: 4,
            display: "block",
          }}
        >
          <Image
            src={profile.avatar}
            alt={`${profile.name} profile`}
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box
          component={Link}
          href="/"
          aria-label="Go to home"
          sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            {profile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            FullStack Developer
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.25}>
          <IconButton
            component={Link}
            href={`mailto:${profile.contacts.email}`}
            aria-label="Send email"
            title="Email"
            sx={{
              width: 44,
              height: 44,
              bgcolor: "primary.main",
              color: "common.black",
              boxShadow: 2,
              "&:hover": { bgcolor: "#ffd84a", transform: "translateY(-2px)" },
            }}
          >
            <MailIcon />
          </IconButton>
          <IconButton
            component={Link}
            href={profile.contacts.github}
            aria-label="Open GitHub"
            title="GitHub"
            target="_blank"
            rel="noreferrer"
            sx={{
              width: 44,
              height: 44,
              bgcolor: "common.black",
              color: "common.white",
              boxShadow: 2,
              "&:hover": { bgcolor: "grey.800", transform: "translateY(-2px)" },
            }}
          >
            <GithubIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Divider />

      <Stack component="nav" spacing={3.25} sx={{ mt: 3.5 }}>
        <Box>
          <Typography
            component={Link}
            href="/About"
            variant="h6"
            sx={{ display: "inline-block", mb: 1, fontWeight: 800 }}
          >
            About
          </Typography>
        </Box>

        <Box>
          <Typography
            component={Link}
            href="/Troubleshooting"
            variant="h6"
            sx={{ display: "inline-block", mb: 1, fontWeight: 800 }}
          >
            TroubleShooting
          </Typography>
          <List dense disablePadding>
            {["Front-End", "Back-End", "DB"].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  component={Link}
                  href={`/Troubleshooting#${item.toLowerCase()}`}
                  sx={{ borderRadius: 2, px: 1.25, py: 0.4 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography
            component={Link}
            href="/Skill"
            variant="h6"
            sx={{ display: "inline-block", mb: 1.5, fontWeight: 800 }}
          >
            Skill
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{ bgcolor: "#fff3bf", fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
