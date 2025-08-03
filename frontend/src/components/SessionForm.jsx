import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Chip,
  Stack,
  Snackbar,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SessionForm = ({ sessionId = null, isEdit = false }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [jsonUrl, setJsonUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const timerRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);
  const isDirty = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && sessionId) {
      axios
        .get(`/edit/${sessionId}`, { withCredentials: true })
        .then((res) => {
          const session = res.data.session;
          if (session) {
            setTitle(session.title);
            setTags(session.tags || []);
            setJsonUrl(session.jsonUrl);
            setStatus(session.status);
          }
        })
        .catch((err) => console.log("Fetch error:", err));
    }
  }, [isEdit, sessionId]);

  useEffect(() => {
    if (!isEdit) return;

    const saveDraft = () => {
      if (!isDirty.current) return;
      handleSave("draft", true);
      isDirty.current = false;
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(saveDraft, 5000);
    };

    window.addEventListener("keydown", resetTimer);
    autoSaveIntervalRef.current = setInterval(saveDraft, 30000);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(autoSaveIntervalRef.current);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [title, tags, jsonUrl]);

  const handleSave = async (saveStatus = "draft", silent = false) => {
    setLoading(true);
    try {
      const payload = {
        title,
        tags,
        jsonUrl,
        status: saveStatus,
        updatedAt: new Date(),
      };

      let res;
      if (isEdit) {
        res = await axios.put(`https://healthhub-backend-sldu.onrender.com/edit/${sessionId}`, payload, {
          withCredentials: true,
        });
      } else {
        res = await axios.post("https://healthhub-backend-sldu.onrender.com/newsession", payload, {
          withCredentials: true,
        });

        const newId = res.data.session?._id;

        if (saveStatus === "published") {
          navigate("/dashboard");
          return;
        } else if (newId) {
          navigate(`/edit/${newId}`);
          return;
        }
      }

      if (!silent) {
        setSnackbarMsg(saveStatus === "published" ? "Session Published!" : "Draft Saved");
      }
    } catch (err) {
      console.error("Save error:", err);
      setSnackbarMsg("Error saving session");
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
      isDirty.current = true;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            isDirty.current = true;
          }}
          fullWidth
          required
        />

        <TextField
          label="Add Tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyPress}
          helperText="Press Enter to add tag"
          fullWidth
        />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => {
                setTags((prev) => prev.filter((_, i) => i !== index));
                isDirty.current = true;
              }}
            />
          ))}
        </Stack>

        <TextField
          label="JSON URL"
          value={jsonUrl}
          onChange={(e) => {
            setJsonUrl(e.target.value);
            isDirty.current = true;
          }}
          fullWidth
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" onClick={() => handleSave("draft")}>
            Save Draft
          </Button>
          <Button variant="contained" onClick={() => handleSave("published")}>
            Publish
          </Button>
          {loading && <CircularProgress size={22} />}
        </Stack>
      </Stack>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        message={snackbarMsg}
        onClose={() => setSnackbarMsg("")}
      />
    </Box>
  );
};

export default SessionForm;
