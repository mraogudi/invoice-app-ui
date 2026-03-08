import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Stack,
  Tooltip,
} from "@mui/material";

import {
  Save,
  Edit,
  Lock,
  Visibility,
  VisibilityOff,
  Close,
  Clear,
  Person,
  Email,
  PhoneIphone,
  ShieldRounded,
} from "@mui/icons-material";

import { useAuth } from "../auth/AuthContext";
import userService from "../services/userService";

export default function Profile() {
  const { userName } = useAuth();
  const handleApiCall = useRef(false);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passErrors, setPassErrors] = useState({});
  const [userDetailsTemp, setUserDetailsTemp] = useState();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    name: userName || "",
    email: "user@email.com",
    phone: "9876543210",
  });

  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [showPass, setShowPass] = useState(false);

  // Styles Palette
  const colors = {
    primary: "#6366f1",
    secondary: "#a78bfa",
    bgGradient: "linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)",
    glass: "rgba(255, 255, 255, 0.8)",
    border: "rgba(99, 102, 241, 0.12)",
  };

  useEffect(() => {
    if (!handleApiCall.current) {
      handleApiCall.current = true;
      fetchUserDetails();
    }
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserDetails();
      setProfile(response);
      setUserDetailsTemp(response);
    } catch (err) {
      console.error("Failed to load details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
    setPassErrors({ ...passErrors, [e.target.name]: "" });
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    try {
      setSavingProfile(true);
      const updated = await userService.updateUser(profile);
      setProfile(updated);
      setUserDetailsTemp(updated);
      setEditMode(false);
    } finally {
      setSavingProfile(false);
    }
  };

  // ... (validateProfile and validatePassword logic remain the same as your snippet)
  const validateProfile = () => {
    const e = {};
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      e.email = "Valid email required";
    if (!profile.phone || !/^[6-9]\d{9}$/.test(profile.phone))
      e.phone = "Valid 10-digit phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePassword = () => {
    const e = {};
    if (!password.current) e.current = "Required";
    if (password.newPass.length < 6) e.newPass = "Min 6 characters";
    if (password.newPass !== password.confirm) e.confirm = "Mismatch";
    setPassErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleClose = () => {
    setProfile(userDetailsTemp);
    setEditMode(false);
    setErrors({});
  };

  // Reusable Field Style
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      transition: "0.3s",
      "&:hover": { backgroundColor: "#fff" },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(99,102,241,0.1)",
      },
    },
  };

  return (
    <Box sx={{ minHeight: "90vh", py: 6, px: 2 }}>
      <Container maxWidth="md">
        {/* Header Section */}
        <Stack direction="row" alignItems="center" spacing={2} mb={5}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: "0 8px 16px rgba(99,102,241,0.25)",
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: "#1e293b", letterSpacing: "-0.5px" }}
            >
              Account Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your personal information and security preferences.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ position: "relative" }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                background: "rgba(255,255,255,0.4)",
              }}
            >
              <CircularProgress
                size={50}
                thickness={4}
                sx={{ color: colors.primary }}
              />
            </Box>
          )}

          {/* PROFILE CARD */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              mb: 4,
              borderRadius: 6,
              background: colors.glass,
              backdropFilter: "blur(12px)",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Person sx={{ color: colors.primary }} /> Personal Details
              </Typography>

              {!editMode ? (
                <Button
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => setEditMode(true)}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={handleClose}
                    sx={{ color: "text.secondary" }}
                  >
                    <Close />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={
                      savingProfile ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <Save />
                      )
                    }
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      px: 3,
                      background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                      boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                    }}
                  >
                    Save Changes
                  </Button>
                </Stack>
              )}
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  disabled={!editMode}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  disabled={!editMode}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  disabled={!editMode}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphone fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* PASSWORD CARD */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 6,
              background: colors.glass,
              backdropFilter: "blur(12px)",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              display="flex"
              alignItems="center"
              gap={1}
              mb={4}
            >
              <ShieldRounded sx={{ color: colors.primary }} /> Security &
              Password
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type={showPass ? "text" : "password"}
                  label="Current Password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  error={!!passErrors.current}
                  helperText={passErrors.current}
                  sx={textFieldStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPass(!showPass)}
                          edge="end"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPass"
                  value={password.newPass}
                  onChange={handlePasswordChange}
                  error={!!passErrors.newPass}
                  helperText={passErrors.newPass}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  error={!!passErrors.confirm}
                  helperText={passErrors.confirm}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() =>
                  setPassword({ current: "", newPass: "", confirm: "" })
                }
                variant="text"
                sx={{ color: "text.secondary", textTransform: "none" }}
              >
                Clear Fields
              </Button>
              <Button
                variant="contained"
                onClick={validatePassword}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  textTransform: "none",
                  backgroundColor: "#1e293b",
                  "&:hover": { backgroundColor: "#0f172a" },
                }}
              >
                {savingPassword ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
