import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HeroSection({ user, setAuthOpen, setAuthMode }) {
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
        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#075b07",
             "&:hover":{
             boxShadow:"6",
             transform:"scale(1.05)"
             }}}
          onClick={() => {
            if (user) {
              console.log(user);
              navigate("/dashboard");
            } else {
              setAuthMode("login");
              setAuthOpen(true);
            }
            
          }}
          
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}
