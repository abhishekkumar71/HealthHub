import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
export default function AuthModal({ open, setOpen, mode, setMode, onSuccess }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setServerError(null);
    setServerSuccess(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const validateFields = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (!isLogin) {
      if (!username) newErrors.name = "Username is required";
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setServerSuccess(null);
    if (!validateFields()) return;

    try {
      const url = `http://localhost:5173/${
        isLogin ? "login" : "register"
      }`;
      const payload = isLogin ? { email, password } : { username, email, password };

      const { data } = await axios.post(url, payload, {
        withCredentials: true,
      });

      const { success, message } = data;
      if (success) {
        setServerSuccess(message);
        const me = await axios.get(
          "https://healthhub-backend-sldu.onrender.com/me",
          {
            withCredentials: true,
          }
        );
        onSuccess?.(me.data);
      } else {
        setServerError(message);
      }
    } catch (error) {
      setServerError("Something went wrong. Try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {isLogin ? "Login to HealthHub" : "Create an Account"}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        {serverSuccess && <Alert severity="success">{serverSuccess}</Alert>}

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          onSubmit={handleSubmit}
        >
          {!isLogin && (
            <TextField
              label="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          )}

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            variant="contained"
            type="submit"
            sx={{ backgroundColor: "#075b07" }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            onClick={() => {
              setMode(isLogin ? "register" : "login");
              setErrors({});
              setServerError(null);
              setServerSuccess(null);
            }}
            sx={{ textTransform: "none" }}
          >
            {isLogin ? "Register" : "Login"}
          </Button>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
