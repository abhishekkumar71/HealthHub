import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,Tooltip,IconButton,
  CircularProgress,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardSessionCard from "../components/DashboardSessionComponent";
import { useSnackbar } from "notistack";
import { SentimentDissatisfied } from "@mui/icons-material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useTheme } from "@mui/material/styles";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const API_BASE_URL = import.meta.env.DEV ? "" : "https://healthhub-backend-sldu.onrender.com";

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res1 = await axios.get(`${API_BASE_URL}/me`, {
          withCredentials: true,
        });
        const userId = res1.data._id;
        setUsername(res1.data.user.username);
        const res2 = await axios.get(`${API_BASE_URL}/my-sessions`, {
          withCredentials: true,
        });
        if (res2.data.success) {
          setSessions(res2.data.sessions);
        }

        const res3 = await axios.get(`${API_BASE_URL}/drafts`, {
          withCredentials: true,
        });
        if (res3.data.success) {
          setDrafts(res3.data.drafts);
        }
      } catch (err) {
        console.log(err);
        enqueueSnackbar("Failed to load sessions", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleCreateNew = () => {
    navigate("/dashboard/new");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 5,
        width: "95%",
      }}
    >
      <h1>Welcome {username.toUpperCase()} !</h1>
      <Box sx={{ padding: "5%", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            width: "95%",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Your Sessions
          </Typography>
          {isSmallScreen ? (
            <Tooltip title="Create New Session" arrow>
              <IconButton color="primary" onClick={handleCreateNew}>
                <ControlPointIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              onClick={handleCreateNew}
              startIcon={<ControlPointIcon />}
            >
              Create New Session
            </Button>
          )}
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {sessions.length === 0 && drafts.length === 0 ? (
              <Box textAlign="center" mt={5}>
                <SentimentDissatisfied sx={{ fontSize: 60 }} />

                <Typography variant="h6" color="textSecondary">
                  No sessions posted yet.
                </Typography>
              </Box>
            ) : (
              <>
                {sessions.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Published Sessions
                    </Typography>
                    <Grid container spacing={2}>
                      {sessions.map((session) => (
                        <Grid item xs={12} sm={6} md={4} key={session._id}>
                          <DashboardSessionCard
                            key={session._id}
                            session={session}
                          />{" "}
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {drafts.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                      Drafts
                    </Typography>
                    <Grid container spacing={2}>
                      {drafts.map((session) => (
                        <Grid item xs={12} sm={6} md={4} key={session._id}>
                          <DashboardSessionCard session={session} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
