import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/authService";
import { useSnackbar } from "notistack";

export default function ChangePassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [show, setShow] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("");

  // Redirect if no token is found
  useEffect(() => {
    if (!token) {
      enqueueSnackbar("Invalid access. Missing security token.", {
        variant: "error",
      });
      navigate("/login");
    }
  }, [token, navigate, enqueueSnackbar]);

  const toggle = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));
  localStorage.setItem("token", token);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setError("");
    setErrorColor("");

    if (!form.newPassword || !form.confirmPassword) {
      setError("Please fill all fields");
      setErrorColor("error");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      setErrorColor("error");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setErrorColor("error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        token: token,
        newPassword: form.newPassword,
      };

      const response = await authService.changePassword(payload);
      if (response.status === "200" || response.status === "201") {
        setError("Password updated successfully! Please login.");
        setErrorColor("success");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Password not updated successfully! Please try again.");
        setErrorColor("error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password";
      setError(msg);
      setErrorColor("error");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const pwd = form.newPassword;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  })();

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 460,
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(79,70,229,0.12)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <Stack alignItems="center" spacing={1} mb={3}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
            }}
          >
            <LockReset sx={{ color: "#fff", fontSize: 32 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Set New Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Create a secure password to protect your account.
          </Typography>
        </Stack>

        <Stack spacing={2.5}>
          {error && (
            <Typography
              color="error"
              variant="caption"
              sx={{
                bgcolor: "#ffeeee",
                p: 1,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}

          <TextField
            label="New Password"
            name="newPassword"
            autoComplete="new-password"
            type={show.new ? "text" : "password"}
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggle("new")} edge="end">
                    {show.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {form.newPassword && (
            <Box sx={{ mt: -1 }}>
              <LinearProgress
                variant="determinate"
                value={strength}
                sx={{
                  height: 6,
                  borderRadius: 5,
                  mb: 0.5,
                  "& .MuiLinearProgress-bar": {
                    background:
                      strength < 50
                        ? "#ef4444"
                        : strength < 75
                          ? "#f59e0b"
                          : "#22c55e",
                  },
                }}
              />
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Strength:{" "}
                <b>
                  {strength < 50 ? "Weak" : strength < 75 ? "Medium" : "Strong"}
                </b>
              </Typography>
            </Box>
          )}

          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            autoComplete="new-password"
            type={show.confirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
            error={
              !!form.confirmPassword &&
              form.newPassword !== form.confirmPassword
            }
            helperText={
              form.confirmPassword && form.newPassword !== form.confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />

          <Stack direction="row" spacing={2} pt={1}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                height: 48,
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleUpdate}
              disabled={loading || !token}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                height: 48,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Password"
              )}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
