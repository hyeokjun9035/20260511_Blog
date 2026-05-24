import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import AboutSectionMenu from "../components/AboutSectionMenu";
import BlogLayout from "../components/BlogLayout";
import { education, profile, projects } from "../data/profile";

export default function AboutPage() {
  return (
    <BlogLayout
      title={["About", profile.name]}
      rightSlot={<AboutSectionMenu />}
    >
      <Card
        id="main"
        component="section"
        sx={{
          mb: 5,
          p: 2,
          borderRadius: 5,
          background: "linear-gradient(90deg, #f6c90e 0%, #fff3bf 100%)",
          boxShadow: 7,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
                Profile
              </Typography>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                안녕하세요.
                <br />
                개발자 {profile.name} 입니다.
              </Typography>

              <Stack spacing={1} sx={{ mt: 3, maxWidth: 820 }}>
                {profile.intro.map((line) => (
                  <Typography key={line} color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {line}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 3 }}>
              <Box
                sx={{
                  position: "relative",
                  width: 176,
                  height: 208,
                  overflow: "hidden",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: 4,
                }}
              >
                <Image
                  src={profile.portrait}
                  alt={`${profile.name} portrait`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box id="education" component="section" sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 900 }}>
          Education
        </Typography>
        <Grid container spacing={3.5}>
          {education.map((item) => (
            <Grid key={`${item.school}-${item.period}`} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "grey.100",
                  boxShadow: 2,
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Chip label="EDUCATION" size="small" sx={{ bgcolor: "#fff3bf", fontWeight: 700 }} />
                  <Typography variant="h5" component="h3" sx={{ mt: 2.5, fontWeight: 900 }}>
                    {item.school}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.period}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                    {item.major}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box id="project" component="section">
        <Stack direction="row" sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 900 }}>
            Project
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hard coded data
          </Typography>
        </Stack>

        <Grid container spacing={3.5}>
          {projects.map((project, index) => (
            <Grid key={project} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "grey.100",
                  boxShadow: 2,
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack direction="row" sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}>
                    <Chip label="PROJECT" size="small" sx={{ bgcolor: "#fff3bf", fontWeight: 700 }} />
                    <Typography variant="body2" color="text.secondary">
                      0{index + 1}
                    </Typography>
                  </Stack>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 900, lineHeight: 1.25 }}>
                    {project}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                    프로젝트 내용은 서버에 저장하지 않고 데이터 파일에서 관리합니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </BlogLayout>
  );
}
