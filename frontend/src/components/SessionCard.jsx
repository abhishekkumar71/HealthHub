import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import styles from "../styles/pages.module.css";
const SessionCard = ({ session }) => {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:8080/me", {
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
  }, []);

  const isAuthor = currentUsername === session.author;


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      await axios.delete(`http://localhost:8080/delete/${session._id}`, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };
  return (
    <Card
      className={styles.session}
      onClick={() => navigate(`/session/${session._id}`)}
    >
      {session.cover && (
        <img
          src={session.cover}
          alt={session.title}
          className="rounded-t-2xl w-full object-cover"
          style={{ maxHeight: "200px" }}
        />
      )}

      <CardContent className="flex flex-col flex-grow gap-3">
        <Typography variant="h6" className="font-bold">
          {session.title}
        </Typography>

        {session.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
              {session.tags?.map((tag, idx) => (
                <Chip key={idx} label={tag} size="small" />
              ))}
            </Stack>
          </div>
        )}

        <div className={styles.author}>
          <span className="font-medium">-
          {isAuthor ? "You" : session.author}</span>
        </div>

        {isAuthor && (
          <div
            className={styles.hoverOverlay}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/editSession/${session._id}`);
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
      </CardContent>
    </Card>
  );
};

export default SessionCard;
