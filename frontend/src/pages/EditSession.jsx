import React, { useEffect, useState } from "react";
import SessionForm from "../components/SessionForm";
import { Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";

const EditSession = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`https://healthhub-backend-sldu.onrender.com/edit/${id}`, {
          withCredentials: true,
        });
        console.log(res);
        setInitialData(res.data.session);
      } catch (error) {
        enqueueSnackbar("Failed to load session", { variant: "error" });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, enqueueSnackbar]);

  const handleSessionSubmit = async (sessionData) => {
    try {
      await axios.put(`https://healthhub-backend-sldu.onrender.com/edit/${id}`, sessionData, {
        withCredentials: true,
      });
      enqueueSnackbar("Session updated successfully", { variant: "success" });
      navigate("/dashboard");
    } catch (error) {
      enqueueSnackbar("Failed to update session", { variant: "error" });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Session
      </Typography>
      {initialData && (
        <SessionForm onSubmit={handleSessionSubmit} initialData={initialData} />
      )}
    </Box>
  );
};

export default EditSession;
