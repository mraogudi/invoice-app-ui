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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Fade,
  Slide,
  LinearProgress,
} from "@mui/material";

import {
  Save,
  Edit,
  Visibility,
  VisibilityOff,
  Close,
  Person,
  Email,
  PhoneIphone,
  ShieldRounded,
  History,
} from "@mui/icons-material";

import { TablePagination } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import userService from "../services/userService";
import { useSnackbar } from "notistack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// TabPanel
function TabPanel({ children, value, index }) {
  return (
    <Fade in={value === index} timeout={200}>
      <div hidden={value !== index}>
        {value === index && <Box mt={2}>{children}</Box>}
      </div>
    </Fade>
  );
}

export default function Profile() {
  const { userName } = useAuth();
  const handleApiCall = useRef(false);

  const [tab, setTab] = useState(0);

  const [loading, setLoading] = useState(false);
  const [passErrors, setPassErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [history, setHistory] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

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

  const colors = {
    primary: "#6366f1",
    secondary: "#a78bfa",
  };

  // 🔥 Styles
  const styles = {
    tabs: {
      mb: 3,

      "& .MuiTabs-flexContainer": {
        background: "#f1f5f9",
        borderRadius: 3,
        p: "4px", // reduced padding
      },

      "& .MuiTab-root": {
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
        color: "#64748b",

        minHeight: "36px", // 🔥 reduce height
        padding: "6px 12px", // 🔥 tighter spacing
        fontSize: "0.9rem", // slightly compact

        transition: "all 0.3s ease",
      },

      "& .MuiTab-root:not(.Mui-selected):hover": {
        background: "#e2e8f0",
      },

      "& .Mui-selected": {
        color: "#fff !important",
        background: "linear-gradient(90deg, #6366f1, #a78bfa)",
        transform: "scale(1.03)", // reduced scale for compact look
        pointerEvents: "none",
      },

      "& .MuiTabs-indicator": {
        display: "none",
      },
    },

    primaryBtn: {
      borderRadius: 3,
      textTransform: "none",
      px: 3,
      fontWeight: 600,
      background: "linear-gradient(90deg, #6366f1, #a78bfa)",
      boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(90deg, #4f46e5, #8b5cf6)",
        transform: "translateY(-1px)",
        boxShadow: "0 6px 18px rgba(99,102,241,0.5)",
      },
    },

    secondaryBtn: {
      borderRadius: 3,
      textTransform: "none",
      color: "#475569",
      "&:hover": { background: "#f1f5f9" },
    },
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      transition: "all 0.25s ease",
      "&:hover fieldset": {
        borderColor: "#6366f1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6366f1",
        boxShadow: "0 0 0 2px rgba(99,102,241,0.15)",
      },
    },
  };

  const passwordRuleContainer = {
    mt: 1,
    px: 2,
    py: 1.5,
    borderRadius: 3,
  };

  const passwordRuleItem = (index) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.8,
    opacity: 0,
    transform: "translateY(6px)",
    animation: "fadeInUp 0.3s ease forwards",
    animationDelay: `${index * 0.08}s`,
    "@keyframes fadeInUp": {
      to: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  });

  const ruleIconValid = {
    fontSize: 18,
    color: "#22c55e",
  };

  const ruleIconDefault = {
    fontSize: 18,
    color: "#9ca3af",
  };

  const ruleText = (valid) => ({
    fontSize: "0.85rem",
    fontWeight: 500,
    letterSpacing: "0.2px",
    fontFamily: "JetBrains Mono, Fira Code, monospace",
    color: valid ? "#16a34a" : "#6b7280",
    transition: "all 0.2s ease",
  });

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

      const historyRsp = await userService.getLoginHistory();
      setHistory(historyRsp || []);
    } finally {
      setLoading(false);
    }
  };

  const paginatedHistory = history.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (e, newPage) => setPage(newPage);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "NA";

  const formatTime = (value) => {
    if (!value) return "NA";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "NA";
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handlePasswordClear = () => {
    setPassword({ current: "", newPass: "", confirm: "" });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await userService.updateUser(profile);
    } finally {
      setSavingProfile(false);
    }
  };

  const validatePassword = async () => {
    if (!password.current || password.newPass !== password.confirm) return;
    setSavingPassword(true);
    const payload = {
      currentPassword: password.current,
      newPassword: password.newPass,
    };
    const response = await userService.changePassword(payload);
    if (response.status === "200" || response.status === "201") {
      enqueueSnackbar("Password updated successfully!", {
        variant: "success",
      });
      handlePasswordClear();
    } else {
      enqueueSnackbar("Password not updated try again!", {
        variant: "error",
      });
    }
    setSavingPassword(false);
  };

  const passwordRulesList = [
    {
      key: "length",
      label: "At least 10 characters",
      test: (val) => val.length >= 10,
    },
    {
      key: "uppercase",
      label: "One uppercase letter",
      test: (val) => /[A-Z]/.test(val),
    },
    {
      key: "lowercase",
      label: "One lowercase letter",
      test: (val) => /[a-z]/.test(val),
    },
    {
      key: "number",
      label: "One number",
      test: (val) => /[0-9]/.test(val),
    },
    {
      key: "special",
      label: "One special character",
      test: (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
    },
  ];

  // evaluate rules
  const evaluatedRules = passwordRulesList.map((rule) => ({
    ...rule,
    valid: rule.test(password.newPass),
  }));

  // progressive visibility (show next only after previous satisfied)
  const visibleRules = [];
  for (let i = 0; i < evaluatedRules.length; i++) {
    visibleRules.push(evaluatedRules[i]);
    if (!evaluatedRules[i].valid) break;
  }

  return (
    <Box
      sx={{
        height: "100vh", // full viewport height
        overflow: "hidden", // 🚀 removes vertical scroll
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          overflow: "hidden", // allow inner scroll if needed
          py: 4,
        }}
      >
        {/* HEADER */}
        <Stack direction="row" spacing={2} mb={4}>
          <Avatar
            sx={{
              bgcolor: "#A24857",
              color: "white",
              fontWeight: 600,
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4">Account Settings</Typography>
        </Stack>

        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="fullWidth"
          sx={styles.tabs}
        >
          <Tab label="Profile" icon={<Person />} iconPosition="start" />
          <Tab label="Password" icon={<ShieldRounded />} iconPosition="start" />
          <Tab label="History" icon={<History />} iconPosition="start" />
        </Tabs>

        {/* PROFILE */}
        <TabPanel value={tab} index={0}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              width: "93%",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Grid container spacing={1}>

              {/* NAME */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#6366f1" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* EMAIL */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#6366f1" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* PHONE */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphone sx={{ color: "#6366f1" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

            </Grid>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button sx={styles.secondaryBtn}>Cancel</Button>

              <Button
                variant="contained"
                onClick={handleSaveProfile}
                sx={styles.primaryBtn}
              >
                {savingProfile ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Box>
          </Paper>
        </TabPanel>

        {/* PASSWORD */}
        <TabPanel value={tab} index={1}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* 🔥 PASSWORD STRENGTH LOGIC (MATCHED) */}
            {(() => {
              const pwd = password.newPass || "";
              let score = 0;
              if (pwd.length >= 10) score += 25;
              if (/[A-Z]/.test(pwd)) score += 25;
              if (/[0-9]/.test(pwd)) score += 25;
              if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

              const strengthLabel =
                score < 50 ? "Weak" : score < 75 ? "Medium" : "Strong";

              return (
                <Grid container spacing={3}>

                  {/* LEFT SIDE */}
                  <Grid item xs={12} md={8} width={"50%"}>
                    <Stack spacing={2}>

                      <TextField
                        fullWidth
                        type={showPass ? "text" : "password"}
                        label="Current Password"
                        name="current"
                        value={password.current}
                        onChange={handlePasswordChange}
                        sx={inputStyles}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setShowPass(!showPass)}>
                              {showPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        name="newPass"
                        value={password.newPass}
                        onChange={handlePasswordChange}
                        sx={inputStyles}
                      />

                      {/* 🔥 STRENGTH BAR */}
                      {password.newPass && (
                        <Box sx={{ mt: -1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={score}
                            sx={{
                              height: 6,
                              borderRadius: 5,
                              mb: 0.5,
                              "& .MuiLinearProgress-bar": {
                                background:
                                  score < 50
                                    ? "#ef4444"
                                    : score < 75
                                      ? "#f59e0b"
                                      : "#22c55e",
                              },
                            }}
                          />
                          <Typography variant="caption">
                            Strength: <b>{strengthLabel}</b>
                          </Typography>
                        </Box>
                      )}

                      <TextField
                        fullWidth
                        type="password"
                        label="Confirm Password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        sx={inputStyles}
                        error={
                          !!password.confirm &&
                          password.newPass !== password.confirm
                        }
                        helperText={
                          password.confirm &&
                            password.newPass !== password.confirm
                            ? "Passwords do not match"
                            : ""
                        }
                      />
                    </Stack>
                  </Grid>

                  {/* RIGHT SIDE - RULES */}
                  <Grid item xs={12} md={4} width={"45%"}>
                    <Box sx={passwordRuleContainer}>
                      {[
                        {
                          label: "At least 10 characters",
                          valid: password.newPass.length >= 10,
                        },
                        {
                          label: "One uppercase letter",
                          valid: /[A-Z]/.test(password.newPass),
                        },
                        {
                          label: "One lowercase letter",
                          valid: /[a-z]/.test(password.newPass),
                        },
                        {
                          label: "One number",
                          valid: /[0-9]/.test(password.newPass),
                        },
                        {
                          label: "One special character",
                          valid: /[^A-Za-z0-9]/.test(password.newPass),
                        },
                      ].map((rule, index) => (
                        <Box key={index} sx={passwordRuleItem(index)}>
                          {rule.valid ? (
                            <CheckCircleIcon sx={ruleIconValid} />
                          ) : (
                            <RadioButtonUncheckedIcon sx={ruleIconDefault} />
                          )}

                          <Typography sx={ruleText(rule.valid)}>
                            {rule.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              );
            })()}

            {/* ACTIONS */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button sx={styles.secondaryBtn} onClick={handlePasswordClear}>
                Clear
              </Button>

              <Button
                variant="contained"
                onClick={validatePassword}
                sx={styles.primaryBtn}
              >
                {savingPassword ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </Box>
          </Paper>
        </TabPanel>

        {/* HISTORY */}
        <TabPanel value={tab} index={2}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedHistory.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        background: "#f1f5f9",
                      },
                    }}
                  >
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{formatDate(row.loginDate)}</TableCell>
                    <TableCell>{formatTime(row.loginTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={history.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5]}
            />
          </Paper>
        </TabPanel>
      </Container>
    </Box >
  );
}
