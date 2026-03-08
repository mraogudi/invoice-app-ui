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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../api/api";
import { useGoogleLogin } from "@react-oauth/google";
import socialService from "../services/soacialService";
import { useMsal } from "@azure/msal-react";
import { useSnackbar } from "notistack";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { instance } = useMsal();
  const { enqueueSnackbar } = useSnackbar();

  const nav = useNavigate();

  /* Handle Change */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* Submit */
  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (form.password !== form.confirmPassword) {
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Passwords do not match
        </Typography>,
        { variant: "info" },
      );
      return;
    }

    if (form.phone.length !== 10) {
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Phone Number length should be 10
        </Typography>,
        { variant: "info" },
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Registration successful!
        </Typography>,
        { variant: "success" },
      );
      nav("/login");
    } catch {
      enqueueSnackbar(
        <Typography
          sx={{
            fontFamily: "Monospace",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Registration failed
        </Typography>,
        { variant: "error" },
      );
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    setShowPass(false);
    setShowConfirm(false);
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      try {
        const body = {
          code: tokenResponse.code,
        };
        const res = await socialService.githubLogin(body);
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
    try {
      const loginRes = await instance.loginPopup({
        scopes: ["openid", "profile", "email"],
      });

      const idToken = loginRes.idToken;

      const res = socialService.microsoftLogin({ idToken: idToken });
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
          Microsoft login failed
        </Typography>,
        { variant: "error" },
      );
    }
  };

  // ================= GITHUB LOGIN =================
  const githubLogin = () => {
    const clientId = "Ov23li3ivGURfUZEV4cA";
    const redirect = `${window.location.origin}/github/callback`;

    window.location.href =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&scope=user:email&redirect_uri=${redirect}`;
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

          /* Light modern background */
          // background: "linear-gradient(135deg,#f8fbff,#eef5ff,#e3f2fd)",
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

      {/* RIGHT REGISTER FORM */}
      <Grid
        width="50%"
        item
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 5,
              width: "100%",
              maxWidth: 480,
              borderRadius: 4,
              background:
                "radial-gradient(circle at top right, rgba(100,181,246,.15), transparent 50%)",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight="bold"
              mb={1}
            >
              Create Account
            </Typography>

            <Typography textAlign="center" color="text.secondary" mb={3}>
              Register to get started
            </Typography>

            <Box
              component="form"
              onSubmit={submit}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              {/* ROW 1 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} width="48%">
                  <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} width="48%">
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* ROW 2 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} width="48%">
                  <TextField
                    name="password"
                    label="Password"
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPass(!showPass)}>
                            {showPass ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} width="48%">
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* ROW 3 */}

              <TextField
                name="phone"
                label="Phone"
                fullWidth
                required
                value={form.phone}
                onChange={handleChange}
                type="number"
              />

              {/* Clear + Register Buttons */}
              <Box display="flex" gap={2} mt={1}>
                {/* Clear Button - 30% */}
                <Button
                  type="button"
                  variant="outlined"
                  onClick={clearForm}
                  disabled={loading}
                  sx={{
                    width: "35%",
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Clear
                </Button>

                {/* Register Button - 70% */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    width: "65%",
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </Box>

              <Divider>OR</Divider>

              {/* Social Register */}
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
                            <stop offset="0%" stopColor="#4285F4" />{" "}
                            {/* Blue */}
                            <stop offset="25%" stopColor="#EA4335" />{" "}
                            {/* Red */}
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

              {/* Login Link */}
              <Typography textAlign="center" mt={2}>
                Already have an account? <Link href="/login">Login</Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );
}
