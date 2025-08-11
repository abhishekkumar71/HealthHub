import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const features = [
  {
    icon: <FavoriteIcon />,
    title: "Wellness First",
    desc: "Create guided wellness sessions for mental clarity.",
  },
  {
    icon: <GroupIcon />,
    title: "Community Driven",
    desc: "Share, discuss, and grow with like-minded individuals.",
  },
  {
    icon: <AutoGraphIcon />,
    title: "Track Progress",
    desc: "Monitor your mental wellness journey over time.",
  },
  {
    icon: <AutoStoriesIcon />,
    title: "Holistic Wellbeing",
    desc: "Balance mind and body with lifestyle tools.",
  },
];

export default function FeaturesSection() {
  return (
    <Box
      sx={{
        backgroundImage: "url('/bgImg.jpg')",
        backgroundSize: "cover",

        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        py: 8,
      }}
    >
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, i) => (
            <Grid
              item
              key={i}
              sx={{
                width: 300,
                height: 200,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  boxSizing: "border-box",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <Typography variant="h4" color="primary">
                  {feature.icon}
                </Typography>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
