import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Email,
  Lock,
  VpnKey,
  ArrowBack,
  PersonAdd,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useSnackbar } from "notistack";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [userId, setUserId] = useState(0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  // ================= EMAIL =================
  const handleEmailSubmit = async () => {
    setError("");
    if (!email) return setError("Email is required");

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setServerOtp(res.data.otp); // demo only
      setUserId(res.data.userId);
      setStep(2);
    } catch {
      setError("Invalid email or user not found");
    } finally {
      setLoading(false);
    }
  };

  // ================= OTP =================
  const handleOtpVerify = () => {
    setError("");

    if (!otp) return setError("OTP is required");

    if (otp !== serverOtp) return setError("Invalid OTP");

    setStep(3);
  };

  // ================= PASSWORD RULES =================
  const rules = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const isValid =
    rules.length && rules.upper && rules.lower && rules.number && rules.special;

  const handleReset = async () => {
    setError("");

    if (!isValid) return setError("Password does not meet requirements");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      const payload = {
        userId: userId,
        newPassword: password,
      };
      await authService.updatePassword(payload);
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Password reset successful
        </Typography>,
        { variant: "success" },
      );
      nav("/login");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const ruleUI = (valid, text) => (
    <Box display="flex" alignItems="center" gap={1}>
      {valid ? (
        <CheckCircle sx={{ color: "#22c55e", fontSize: 18 }} />
      ) : (
        <Cancel sx={{ color: "#ef4444", fontSize: 18 }} />
      )}
      <Typography fontSize="0.85rem">{text}</Typography>
    </Box>
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="95vh"
      sx={{
        background: "linear-gradient(135deg, #eef2ff, #fdf2f8, #ecfeff)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 420,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          🔐 Forgot Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              }}
              onClick={handleEmailSubmit}
              disabled={loading}
              startIcon={<VpnKey />}
            >
              {loading ? <CircularProgress size={22} /> : "Send OTP"}
            </Button>

            <Box display="flex" gap={2} mt={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => nav("/login")}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => nav("/register")}
              >
                Register
              </Button>
            </Box>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <Typography mt={1}>Enter OTP sent to your email</Typography>

            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              }}
              onClick={handleOtpVerify}
              startIcon={<Lock />}
            >
              Verify OTP
            </Button>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* RULES */}
            <Box mt={2}>
              {ruleUI(rules.length, "Minimum 10 characters")}
              {ruleUI(rules.upper, "One uppercase letter")}
              {ruleUI(rules.lower, "One lowercase letter")}
              {ruleUI(rules.number, "One number")}
              {ruleUI(rules.special, "One special character")}
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              }}
              onClick={handleReset}
              disabled={loading}
              startIcon={<Lock />}
            >
              {loading ? <CircularProgress size={22} /> : "Reset Password"}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
