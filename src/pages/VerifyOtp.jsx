import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Link,
  Fade,
} from "@mui/material";

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import authService from "../services/authService";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputs = useRef([]);
  const nav = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  // ✅ unified tempToken source
  const tempToken =
    location.state?.tempToken || localStorage.getItem("tempToken");
  const email = location.state?.email;
  const firstTimeLogin = location.state?.firstTimeLogin;

  /* ------------------ Focus ONLY once on mount ------------------ */
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /* ------------------ Countdown Timer ------------------ */
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ------------------ Auto-submit on full OTP ------------------ */
  useEffect(() => {
    if (otp.join("").length === 6) {
      verify();
    }
  }, [otp]);

  /* ------------------ Input Change ------------------ */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move forward
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  /* ------------------ Backspace Navigation ------------------ */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* ------------------ Paste Full OTP ------------------ */
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;

    const digits = paste.split("");
    setOtp(digits);

    digits.forEach((d, i) => {
      if (inputs.current[i]) inputs.current[i].value = d;
    });

    inputs.current[5]?.focus();
  };

  /* ------------------ Verify OTP ------------------ */
  const verify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6 || loading) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        otp: finalOtp,
        tempToken,
      });

      if (res.status === 200) {
        login(res.data.token, res.data.userName);
        localStorage.setItem("name", res.data.userName);
        localStorage.setItem("token", res.data.token);
        if (firstTimeLogin) {
          nav("/firstTimePwd", {
            state: {
              name: res.data.userName,
              token: res.data.token,
            },
          });
        } else {
          nav("/");
        }
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Resend OTP ------------------ */
  const resendOtp = async () => {
    try {
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      await authService.resentOtp(email);

      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      console.error("Resend failed:", err);
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tempToken");
    localStorage.removeItem("name");
    nav("/login");
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Fade in timeout={700}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            width: 420,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(14px)",
            background:
              "radial-gradient(circle at top right, rgba(100,181,246,.15), transparent 50%)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Verify OTP
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Enter the 6-digit code sent to your email
          </Typography>

          {/* OTP Inputs */}
          <Box
            display="flex"
            justifyContent="center"
            gap={1.5}
            mb={3}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  inputMode: "numeric",
                  style: {
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 700,
                  },
                }}
                sx={{
                  width: 52,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#f9fafc",
                    transition: "all .2s",
                    "&:hover": { background: "#eef2ff" },
                    "&.Mui-focused": {
                      background: "#fff",
                      boxShadow: "0 0 0 2px #6366f1",
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={1.5}>
            {/* Clear */}
            <Button
              variant="outlined"
              onClick={clearOtp}
              sx={{
                flex: 0.25,
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Clear
            </Button>

            {/* Verify */}
            <Button
              variant="contained"
              disabled={loading}
              onClick={verify}
              sx={{
                flex: 0.5,
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Verify OTP"
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
              sx={{
                flex: 0.25,
                py: 1.3,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Box>

          {/* Timer */}
          <Typography mt={3} fontSize={14} color="text.secondary">
            {canResend ? "Didn't receive the code?" : `Resend OTP in ${timer}s`}
          </Typography>

          {/* Resend */}
          {canResend && (
            <Link
              component="button"
              underline="none"
              onClick={resendOtp}
              sx={{
                mt: 1,
                fontWeight: 600,
                color: "#6366f1",
                "&:hover": { color: "#4f46e5" },
              }}
            >
              Resend OTP
            </Link>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}
