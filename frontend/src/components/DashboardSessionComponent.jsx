import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardSessionCard = ({ session }) => {
  const navigate = useNavigate();
  const { _id, title, tags, cover, status, updatedAt } = session;
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
  return (
    <Card
      sx={{
         height: 380, 
        width: 305,
        borderRadius: 2,
        boxShadow: 3,
        ":hover": { boxShadow: 10, cursor: "pointer" },
      }}
      onClick={() => navigate(`/session/${_id}`)} 
    >
      {cover && (
        <CardMedia component="img" height="180" image={cover} alt={title} />
      )}

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
          {tags?.map((tag, idx) => (
            <Chip key={idx} label={tag} size="small" />
          ))}
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 2 }}
        >
          Status: {status} • Last updated:{" "}
          {new Date(updatedAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/editSession/${_id}`);
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default DashboardSessionCard;
