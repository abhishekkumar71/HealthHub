import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";
import axios from "axios";

const SessionDetails = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`https://healthhub-backend-sldu.onrender.com/session/${id}`);
        if (res.data.success) {
          setSession(res.data.session);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="text.secondary">Session not found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6,mt:10 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {session.title}
          </Typography>

          <Box mb={2} display="flex" gap={1} flexWrap="wrap">
            {session.tags.map((tag, index) => (
              <Chip label={`#${tag}`} key={index} size="small" />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Status: <strong>{session.status}</strong>
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last updated: {new Date(session.updatedAt).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            This session is available at:{" "}
            <a href={session.jsonUrl} target="_blank" rel="noreferrer">
              {session.jsonUrl}
            </a>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SessionDetails;
