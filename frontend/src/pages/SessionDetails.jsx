import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const SessionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      await axios.delete(`https://healthhub-backend-sldu.onrender.com/delete/${session._id}`, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`https://healthhub-backend-sldu.onrender.com/session/${id}`);
        console.log(res);
        if (res.data.success) {
          setSession(res.data.session);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchMe = async () => {
      try {
        const res = await axios.get("https://healthhub-backend-sldu.onrender.com/me", {
          withCredentials: true,
        });
        if (res.data.success) {
          setCurrentUsername(res.data.user.username);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchMe();
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
  const isAuthor = currentUsername === session.author;
  const formattedDate = new Date(session.updatedAt).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {session.cover && (
        <Box
          component="img"
          src={session.cover}
          alt={session.title}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
            mb: 3,
            boxShadow: 2,
          }}
        />
      )}

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {session.title}
      </Typography>

      <Box mb={2} display="flex" gap={1} flexWrap="wrap">
        {session.tags?.map((tag, index) => (
          <Chip label={`#${tag}`} key={index} size="small" />
        ))}
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last updated: {formattedDate}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {session.steps?.length > 0 ? (
        session.steps.map((step, idx) => {
          const isVideo =
            step.media &&
            (step.media.endsWith(".mp4") || step.media.endsWith(".webm"));

          return (
            <Box key={idx} mb={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Step {idx + 1}
              </Typography>

              <Grid
                container
                spacing={3}
                direction={idx % 2 === 0 ? "row" : "row-reverse"}
                alignItems="center"
                sx={{ flexWrap: "nowrap" }}
              >
                {step.media && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ width: "100%"}}
                  >
                    {isVideo ? (
                      <Box
                        component="video"
                        src={step.media}
                        controls
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          boxShadow: 1,
                        }}
                      />
                    ) : (
                      <Box
                        component="img"
                        src={step.media}
                        alt={`Step ${idx + 1} media`}
                        sx={{
                          width: "100%",
                          borderRadius: 2,
                          boxShadow: 1,
                        }}
                      />
                    )}
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ whiteSpace: "pre-wrap" }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2"> {step.description}</Typography>
                </Grid>
              </Grid>
            </Box>
          );
        })
      ) : (
        <Typography color="text.secondary">
          No steps available for this session.
        </Typography>
      )}
      {isAuthor && (
        <div
          className="gap-2 mt-2"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/editSession/${id}`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </Container>
  );
};

export default SessionDetails;
