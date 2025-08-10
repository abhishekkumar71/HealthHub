import React from "react";
import SessionForm from "../components/SessionForm";
import { Typography, Box } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const NewSession = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSessionSubmit = async (sessionData) => {
    try {
      const res = await axios.post(
        "https://healthhub-backend-sldu.onrender.com/newsession",
        sessionData,
        { withCredentials: true }
      );
      enqueueSnackbar("Session saved successfully", { variant: "success" });
      navigate("/dashboard");
    } catch (error) {
      enqueueSnackbar("Failed to save session", { variant: "error" });
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignContent: "center", flexWrap: "wrap" }}>
      <Typography variant="h5" gutterBottom>
        Create New Session
      </Typography>
      <SessionForm onSubmit={handleSessionSubmit}/>
    </Box>
  );
};

export default NewSession;
