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
import AddIcon from "@mui/icons-material/Add";
const SessionForm = ({ sessionId = null, isEdit = false }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaType, setMediaType] = useState("video");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [steps, setSteps] = useState([
    {
      title: "",
      description: "",
    },
  ]);

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
            setMediaType(session.mediaType || "video");
            setMediaUrls(session.mediaUrls || []);
            setSteps(session.steps || [{ title: "", description: "" }]);
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
  }, [title, tags, steps, mediaType, mediaFiles]);
  const handleUpload = async () => {
    const formData = new FormData();
    mediaFiles.forEach((file) => formData.append("files", file));
    const res = await axios.post("/api/upload", formData);
    return res.data.urls;
  };

  const handleSave = async (saveStatus = "draft", silent = false) => {
    setLoading(true);
    try {
      let urls = mediaUrls;
      if (urls.length === 0 && mediaFiles.length > 0) {
        urls = await handleUpload();
        setMediaUrls(urls);
      }

      const payload = {
        title,
        tags,
        mediaType,
        mediaUrls: urls,
        steps,
        status: saveStatus,
        updatedAt: new Date(),
      };

      let res;
      if (isEdit) {
        res = await axios.put(
          `https://healthhub-backend-sldu.onrender.com/edit/${sessionId}`,
          payload,
          {
            withCredentials: true,
          }
        );
      } else {
        res = await axios.post(
          "https://healthhub-backend-sldu.onrender.com/newsession",
          payload,
          {
            withCredentials: true,
          }
        );

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
        setSnackbarMsg(
          saveStatus === "published" ? "Session Published!" : "Draft Saved"
        );
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

        <Stack direction="row" spacing={2}>
          <label>
            <input
              type="radio"
              value="video"
              checked={mediaType === "video"}
              onChange={() => setMediaType("video")}
            />
            Video
          </label>
          <label>
            <input
              type="radio"
              value="images"
              checked={mediaType === "images"}
              onChange={() => setMediaType("images")}
            />
            Images
          </label>
        </Stack>

        <input
          type="file"
          accept={mediaType === "video" ? "video/*" : "image/*"}
          multiple={mediaType === "images"}
          onChange={(e) => {
            setMediaFiles([...e.target.files]);
            isDirty.current = true;
          }}
        />

        {steps.map((step, i) => (
          <Box
            key={i}
            sx={{ mt: 2, border: "1px solid #ccc", p: 2, borderRadius: 1 }}
          >
            <TextField
              label={`Step ${i + 1} Title`}
              value={step.title}
              onChange={(e) => {
                const updated = [...steps];
                updated[i].title = e.target.value;
                setSteps(updated);
                isDirty.current = true;
              }}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Description"
              value={step.description}
              onChange={(e) => {
                const updated = [...steps];
                updated[i].description = e.target.value;
                setSteps(updated);
                isDirty.current = true;
              }}
              fullWidth
              multiline
            />
          </Box>
        ))}
        {mediaUrls.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <strong>Uploaded Media:</strong>
            <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
              {mediaType === "images" &&
                mediaUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`media-${i}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                ))}
              {mediaType === "video" && (
                <video controls style={{ width: 250, borderRadius: 4 }}>
                  <source src={mediaUrls[0]} type="video/mp4" />
                </video>
              )}
            </Stack>
          </Box>
        )}

        <Button
          onClick={() => setSteps([...steps, { title: "", description: "" }])}
          variant="text"
        >
          <AddIcon /> Add Step
        </Button>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" onClick={() => handleSave("draft")}>
            Save Draft
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSave("published")}
            disabled={
              !title || (mediaFiles.length == 0 && mediaUrls.length == 0)
            }
          >
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
