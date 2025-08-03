import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const sessions = [
  {
    title: "Morning Meditation",
    desc: "Start your day with calm.",
    author: "Anjali R.",
  },
  {
    title: "Evening Reflections",
    desc: "Relax and rewind your thoughts.",
    author: "Ravi M.",
  },
  {
    title: "Focus Booster",
    desc: "Short session to sharpen your attention.",
    author: "Arjun D.",
  },
  {
    title: "Stress Release",
    desc: "Let go of tension and restore peace.",
    author: "Aditya S.",
  },
];

export default function PopularSessions() {
    const navigate=useNavigate();
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Popular Sessions
      </Typography>
      <Grid container spacing={3}>
        {sessions.map((s, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card
              sx={{
                "&:hover": {
                  boxShadow: 7,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6">{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.desc}
                </Typography>
                <Typography variant="caption" display="block" mt={1}>
                  By {s.author}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        size="large"
        sx={{ backgroundColor: "#075b07",padding:"10px",marginTop:"15px" }}
        onClick={()=>navigate("/explore")}
      >
        View more
      </Button>{" "}
    </Container>
  );
}
