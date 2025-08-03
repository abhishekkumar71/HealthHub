import { Box, Container, Typography } from "@mui/material";

export default function AboutSection() {
  return (
    <Box sx={{ backgroundColor: "#f3f3f3", py: 6 }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          About HealthHub
        </Typography>
        <Typography color="text.secondary">
          HealthHub empowers individuals to manage their emotional well-being by providing tools to create, share, and engage in wellness sessions. Whether you're a beginner or a practitioner, this is your space to grow.
        </Typography>
      </Container>
    </Box>
  );
}
