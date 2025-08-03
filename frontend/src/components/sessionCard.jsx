import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SessionCard = ({ session, showEdit = true }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sessions/${session._id}`);
  };

  return (
    <Card
      onClick={handleClick}
      variant="outlined"
      sx={{
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          boxShadow: 3,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {session.title}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
          {session.tags?.map((tag, i) => (
            <Chip
              key={i}
              label={`#${tag}`}
              size="small"
              sx={{ backgroundColor: "#f0f0f0" }}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Status: {session.status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
