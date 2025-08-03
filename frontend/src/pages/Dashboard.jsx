import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SessionCard from "../components/SessionCardsd";
import Sidebar from "../components/sideeeBar";
import { useSnackbar } from "notistack";
import { SentimentDissatisfied } from "@mui/icons-material";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res1 = await axios.get("/me", { withCredentials: true });
        console.log("res1.data", res1.data);

        const userId = res1.data._id;

        const res2 = await axios.get("/my-sessions", {
          withCredentials: true,
        });
        if (res2.data.success) {
          
          setSessions(res2.data.sessions);
        }

        const res3 = await axios.get("/drafts", { withCredentials: true });
        if (res3.data.success) {
          setDrafts(res3.data.sessions);
        }
      } catch (err) {
        console.log(err)
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          maxWidth: "900px",
          mx: "auto",
          mt: { xs: 8, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Your Sessions
          </Typography>
          <Button variant="contained" onClick={handleCreateNew}>
            Create New Session
          </Button>
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
                    {sessions.map((session) => (
                      <SessionCard key={session._id} session={session} />
                    ))}
                  </>
                )}

                {drafts.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                      Drafts
                    </Typography>
                    {drafts.map((session) => (
                      <SessionCard key={session._id} session={session} />
                    ))}
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
