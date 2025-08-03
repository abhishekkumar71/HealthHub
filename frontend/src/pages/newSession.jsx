import React from "react";
import SessionForm from "../components/sessionForm";
import { Typography, Box } from "@mui/material";

const NewSession = () => {
  return (
    <Box sx={{ p: 3 ,mt:5}}>
      <Typography variant="h5" gutterBottom>
        Create New Session
      </Typography>
      <SessionForm />
    </Box>
  );
};

export default NewSession;
