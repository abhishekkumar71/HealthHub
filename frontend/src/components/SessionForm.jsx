import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const SessionForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [cover, setCover] = useState(initialData?.cover || null);
  const [steps, setSteps] = useState(
    initialData?.steps || [
      { title: "", description: "", media: null, link: "" },
    ]
  );

  const handleTagAdd = () => {
    if (!tagInput) return;

    const newTags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "" && !tags.includes(tag));

    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "healthhub_uploads");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dlslfhlpm/image/upload",
      formData,
      { withCredentials: false }
    );
    setCover(res.data.secure_url);
  };
  const handleStepMediaUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "healthhub_uploads");

    const fileType = file.type.startsWith("video") ? "video" : "image";

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dlslfhlpm/${fileType}/upload`,
      formData,
      {
        withCredentials: false,
      }
    );

    const updatedSteps = [...steps];
    updatedSteps[index].media = res.data.secure_url;
    setSteps(updatedSteps);
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, { title: "", description: "", media: null, link: "" }]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (status) => {
    const sessionData = {
      title,
      tags,
      cover,
      steps,
      status,
    };
    onSubmit(sessionData);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Add Tag"
        value={tagInput}
        onBlur={handleTagAdd}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleTagAdd()}
        margin="normal"
      />
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}
      >
        {tags.map((tag, index) => (
          <Paper
            key={index}
            sx={{ px: 1.5, py: 0.5, display: "flex", alignItems: "center" }}
          >
            <span>{tag}</span>
            <IconButton onClick={() => handleTagRemove(index)} size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: "30%",
            justifyContent: "space-evenly",
          }}
        >
          <Typography variant="subtitle1">Cover Photo</Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Cover
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
            />
          </Button>
        </Box>

        <Box sx={{ marginLeft: "30px" }}>
          {cover && (
            <img
              src={cover}
              alt="Cover"
              style={{ width: "30%", marginTop: 10, borderRadius: "10px" }}
            />
          )}
        </Box>
      </Box>

      <Typography variant="h6" mt={4} gutterBottom>
        Steps
      </Typography>

      {steps.map((step, index) => (
        <Paper key={index} sx={{ p: 2, my: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Step Title"
                fullWidth
                value={step.title}
                onChange={(e) =>
                  handleStepChange(index, "title", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Link (optional)"
                fullWidth
                value={step.link}
                onChange={(e) =>
                  handleStepChange(index, "link", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Step Description"
                fullWidth
                multiline
                minRows={2}
                value={step.description}
                onChange={(e) =>
                  handleStepChange(index, "description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Image/Video
                <input
                  hidden
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleStepMediaUpload(e, index)}
                />
              </Button>{" "}
              {step.media && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {step.media.includes("video") ? (
                    <video src={step.media} controls style={{ width: "30%" }} />
                  ) : (
                    <img
                      src={step.media}
                      alt="Step Media"
                      style={{ width: "30%", borderRadius: "10px" }}
                    />
                  )}
                  <Button
                    color="error"
                    onClick={() => handleStepChange(index, "media", null)}
                    sx={{ marginLeft: "20px", height: "50%" }}
                  >
                    Remove
                  </Button>
                </div>
              )}{" "}
            </Grid>
            <Grid item xs={12}>
              <Button color="error" onClick={() => handleRemoveStep(index)}>
                Remove Step
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button onClick={handleAddStep} sx={{ my: 2 }}>
        + Add Step
      </Button>

      <Grid container spacing={2}>
        <Grid item>
          <Button variant="outlined" onClick={() => handleSubmit("draft")}>
            Save as Draft
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => handleSubmit("published")}>
            Publish
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SessionForm;
