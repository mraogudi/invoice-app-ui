import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
  Microsoft,
  ReceiptLong,
  PictureAsPdf,
  BarChart,
  Security,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import api from "../api/api";
import socialService from "../services/soacialService";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";
import CustomAlert from "../utils/CustomAlert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const nav = useNavigate();
  const { instance } = useMsal();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  /* Load remembered email */
  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  // ================= NORMAL LOGIN =================
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.otpRequired) {
        setLoading(false);

        enqueueSnackbar(
          <Typography
            sx={{
              fontFamily: "Monospace",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            OTP sent to your email
          </Typography>,
          { variant: "info" },
        );

        if (remember) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        nav("/verify-otp", {
          state: { tempToken: res.data.tempToken, email: email },
        });
      } else {
        enqueueSnackbar(
          <Typography
            sx={{
              fontFamily: "Monospace",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            Invalid email or password
          </Typography>,
          { variant: "error" },
        );
      }
    } catch {
      setLoading(false);
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Invalid email or password
        </Typography>,
        { variant: "error" },
      );
    }
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      try {
        const body = {
          code: tokenResponse.code,
        };
        const res = await socialService.googleLogin(body);
        if (res.status === 302) {
          enqueueSnackbar(
            <Typography
              sx={{
                fontFamily: "Monospace",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {res.data.message}
            </Typography>,
            { variant: "info" },
          );
        } else {
          enqueueSnackbar(
            <Typography
              sx={{
                fontFamily: "Monospace",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {res.data.message}
            </Typography>,
            { variant: "success" },
          );
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.user.id);
        }
      } catch {
        enqueueSnackbar(
          <Typography
            sx={{
              fontFamily: "Monospace",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            Google login failed
          </Typography>,
          { variant: "error" },
        );
      }
    },
  });

  // ================= MICROSOFT LOGIN =================
  const microsoftLogin = async () => {
    showAlert("Coming Soon..!", "info");
    // try {
    //   const loginRes = await instance.loginPopup({
    //     scopes: ["openid", "profile", "email"],
    //     prompt: "select_account", // This forces the Microsoft account picker to show
    //   });

    //   const idToken = loginRes.idToken;

    //   const res = await socialService.microsoftLogin({ idToken: idToken });
    //   if (res.status === 302) {
    //     enqueueSnackbar(
    //       <Typography
    //         sx={{
    //           fontFamily: "Monospace",
    //           fontWeight: "bold",
    //           fontSize: "0.9rem",
    //         }}
    //       >
    //         {res.data.message}
    //       </Typography>,
    //       { variant: "info" },
    //     );
    //   } else {
    //     enqueueSnackbar(
    //       <Typography
    //         sx={{
    //           fontFamily: "Monospace",
    //           fontWeight: "bold",
    //           fontSize: "0.9rem",
    //         }}
    //       >
    //         {res.data.message}
    //       </Typography>,
    //       { variant: "success" },
    //     );
    //     localStorage.setItem("token", res.data.token);
    //     localStorage.setItem("userId", res.data.user.id);
    //   }
    // } catch {
    //   enqueueSnackbar(
    //     <Typography
    //       sx={{
    //         fontFamily: "Monospace",
    //         fontWeight: "bold",
    //         fontSize: "0.9rem",
    //       }}
    //     >
    //       Microsoft login failed
    //     </Typography>,
    //     { variant: "success" },
    //   );
    // }
  };

  // ================= GITHUB LOGIN =================
  const githubLogin = () => {
    showAlert("Coming Soon..!", "info");
    // const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    // const redirect = `${window.location.origin}/github/callback`;

    // window.location.href =
    //   `https://github.com/login/oauth/authorize?` +
    //   `client_id=${clientId}&scope=user:email&redirect_uri=${redirect}`;
  };

  // ================= ICON CLICK HANDLER =================
  const handleSocial = (provider) => {
    if (provider === "Google") googleLogin();
    if (provider === "Microsoft") microsoftLogin();
    if (provider === "GitHub") githubLogin();
  };

  return (
    <Grid container minHeight="95vh">
      {/* LEFT IMAGE SECTION */}
      <Grid
        width="50%"
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft Light Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(100,181,246,.15), transparent 50%)",
          }}
        />

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          style={{ zIndex: 2 }}
        >
          <Box
            sx={{
              maxWidth: 420,
              p: 5,
              borderRadius: 4,
              backdropFilter: "blur(15px)",

              /* Light glass style */
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(0,0,0,0.05)",
              color: "#1a237e",

              boxShadow: "0 20px 40px rgba(0,0,0,.1)",
            }}
          >
            <Typography variant="h3" fontWeight="bold" mb={1}>
              Invoice Manager
            </Typography>

            <Typography variant="h6" mb={3} sx={{ opacity: 0.8 }}>
              All-in-One Smart Billing Platform
            </Typography>

            {/* Features */}
            {[
              { icon: <ReceiptLong />, text: "GST Ready Invoicing" },
              { icon: <PictureAsPdf />, text: "Auto PDF Generation" },
              { icon: <BarChart />, text: "Business Reports" },
              { icon: <Security />, text: "Secure Cloud Storage" },
            ].map((item, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(25,118,210,.1)",
                    color: "#1976d2",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography fontSize={16}>{item.text}</Typography>
              </Box>
            ))}

            {/* CTA */}
            <Box mt={4}>
              <Typography fontSize={14} sx={{ opacity: 0.7 }}>
                Trusted by 10,000+ businesses worldwide
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Grid>
      <Grid
        width="50%"
        item
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            width: 380,
            borderRadius: 4,
            background:
              "radial-gradient(circle at top right, rgba(100,181,246,.15), transparent 50%)",
          }}
        >
          <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1}>
            Welcome Back 👋
          </Typography>

          <Typography textAlign="center" color="text.secondary" mb={3}>
            Login to your dashboard
          </Typography>

          <Box
            component="form"
            onSubmit={submit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {/* Email */}
            <TextField
              label="Email"
              fullWidth
              required
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  disabled={loading}
                  onChange={(e) => setRemember(e.target.checked)}
                />
              }
              label="Remember me"
            />

            {/* Login */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

            <Divider>OR</Divider>

            {/* SOCIAL ICONS */}
            {/* SOCIAL ICONS */}
            {/* SOCIAL ICONS */}
            <Box display="flex" justifyContent="center" gap={2}>
              {[
                { icon: <Google />, color: "#DB4437", label: "Google" },
                { icon: <Microsoft />, color: "#00A4EF", label: "Microsoft" },
                { icon: <GitHub />, color: "#000", label: "GitHub" },
              ].map((item, i) => (
                <Tooltip key={i} title={item.label} arrow>
                  <IconButton
                    onClick={() => handleSocial(item.label)}
                    sx={{
                      border: "1px solid #ddd",
                      width: 46,
                      height: 46,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden", // Ensures the gradient doesn't bleed out
                      "&:hover": {
                        backgroundColor: "#fff",
                        borderColor:
                          item.label === "Google" ? "red" : item.color,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                      "& .MuiSvgIcon-root": {
                        transition: "all 0.3s ease",
                      },
                      /* The Magic for Google Hover */
                      "&:hover .MuiSvgIcon-root":
                        item.label === "Google"
                          ? {
                              fill: "url(#google-gradient)", // Links to the SVG gradient below
                            }
                          : {
                              color: item.color,
                            },
                    }}
                  >
                    {/* We inject a small SVG definition for the gradient only once */}
                    {item.label === "Google" && (
                      <svg
                        width="0"
                        height="0"
                        style={{ position: "absolute" }}
                      >
                        <linearGradient
                          id="google-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#4285F4" /> {/* Blue */}
                          <stop offset="25%" stopColor="#EA4335" /> {/* Red */}
                          <stop offset="50%" stopColor="#FBBC05" />{" "}
                          {/* Yellow */}
                          <stop offset="100%" stopColor="#34A853" />{" "}
                          {/* Green */}
                        </linearGradient>
                      </svg>
                    )}
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            {/* Register Link */}
            <Typography textAlign="center" mt={2}>
              Create an account? <Link href="/register">Register</Link>
            </Typography>
          </Box>
          <CustomAlert
            open={alert.open}
            message={alert.message}
            severity={alert.severity}
            handleClose={handleClose}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
