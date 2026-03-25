import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import authService from "../services/authService";

export default function FirstTimeChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const location = useLocation();

  const userName = location.state?.userName;
  const token = location.state?.token;

  // Password rules
  const rules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isValidPassword =
    Object.values(rules).every(Boolean) && newPassword === confirmPassword;

  const handleUpdate = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!isValidPassword) {
      setError("Password does not meet required criteria");
      return;
    }

    const payload = {
      token: token,
      newPassword: newPassword,
    };

    try {
      const response = await authService.changePassword(payload);

      if (response.status === "200" || response.status === "201") {
        enqueueSnackbar("Password updated successfully!", {
          variant: "success",
        });
        handleClear();
        navigate("/");
      } else {
        throw new Error();
      }
    } catch {
      enqueueSnackbar("Password not updated successfully! Please try again.", {
        variant: "error",
      });
    }
  };

  const handleClear = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const passwordRules = [
    { label: "Minimum 8 characters", valid: rules.length },
    { label: "One uppercase letter", valid: rules.upper },
    { label: "One lowercase letter", valid: rules.lower },
    { label: "One number", valid: rules.number },
    { label: "One special character", valid: rules.special },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Change Password
          </Typography>

          {/* Username */}
          <Typography
            variant="subtitle2"
            textAlign="center"
            mb={3}
            color="text.secondary"
          >
            {userName ? `User: ${userName}` : ""}
          </Typography>

          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* New Password */}
            <TextField
              label="New Password"
              type={showNew ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(!showNew)}>
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Styled Rules */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: "#f9fbfc",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="subtitle2" mb={1} fontWeight="600">
                Password must contain:
              </Typography>

              <Stack spacing={1}>
                {passwordRules.map((rule, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      transition: "0.3s",
                      backgroundColor: rule.valid ? "#e8f5e9" : "transparent",
                    }}
                  >
                    {rule.valid ? (
                      <CheckCircle sx={{ color: "green", fontSize: 18 }} />
                    ) : (
                      <RadioButtonUnchecked
                        sx={{ color: "#aaa", fontSize: 18 }}
                      />
                    )}

                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: rule.valid ? "green" : "#555",
                        fontWeight: rule.valid ? 500 : 400,
                      }}
                    >
                      {rule.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Confirm Password */}
            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Match Indicator */}
            {confirmPassword && (
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color:
                    newPassword === confirmPassword ? "green" : "error.main",
                }}
              >
                {newPassword === confirmPassword
                  ? "✅ Passwords match"
                  : "❌ Passwords do not match"}
              </Typography>
            )}

            {/* Buttons */}
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" fullWidth onClick={handleClear}>
                Clear
              </Button>

              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isValidPassword}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
