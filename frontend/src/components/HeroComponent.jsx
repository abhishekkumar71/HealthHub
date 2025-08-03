import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 10, backgroundColor: "#eafbea", textAlign: "center" }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to HealthHub
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Track your wellness, share sessions, and grow your inner peace.
        </Typography>
        <Button variant="contained" size="large" sx={{ backgroundColor: "#075b07" }} onClick={()=>navigate("/dashboard")}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
}
