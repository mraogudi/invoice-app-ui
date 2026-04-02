import { useState, useEffect, useRef } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Avatar,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu as MenuDropdown,
  MenuItem,
} from "@mui/material";

import {
  Dashboard,
  ReceiptLong,
  People,
  BarChart,
  Logout,
  Description,
  MenuOpen,
  Menu,
  Payments,
  ProductionQuantityLimitsRounded,
  LogoutTwoTone,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const drawerWidth = 170;
  const collapsedWidth = 70;

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // ---------------- SESSION TIMEOUT ----------------
  const [timeoutOpen, setTimeoutOpen] = useState(false);

  const mainTimerRef = useRef(null);
  const graceTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const TIMEOUT = 900000; // ✅ 15 minutes

  const [countdown, setCountdown] = useState(15);
  const [sessionTime, setSessionTime] = useState(900); // 15 mins in seconds

  const startMainTimer = () => {
    // clear previous timers
    if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const expiry = Date.now() + TIMEOUT;
    localStorage.setItem("session_expiry", expiry);

    // ✅ FIX: update every second
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));

      setSessionTime(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    mainTimerRef.current = setTimeout(() => {
      setTimeoutOpen(true);
      startGraceTimer();
    }, TIMEOUT);
  };

  const startGraceTimer = () => {
    setCountdown(10);

    if (graceTimerRef.current) clearInterval(graceTimerRef.current);

    graceTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(graceTimerRef.current);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // init
  useEffect(() => {
    startMainTimer();

    return () => {
      if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
      if (graceTimerRef.current) clearInterval(graceTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // cross-tab sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "session_expiry") {
        startMainTimer();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleContinue = () => {
    setTimeoutOpen(false);

    if (graceTimerRef.current) clearInterval(graceTimerRef.current);

    startMainTimer();
  };

  const handleLogoutSession = () => {
    if (graceTimerRef.current) clearInterval(graceTimerRef.current);
    logout();
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Invoices", icon: <ReceiptLong />, path: "/invoices" },
    { text: "Customers", icon: <People />, path: "/clients" },
    { text: "Reports", icon: <BarChart />, path: "/reports" },
    { text: "Payments", icon: <Payments />, path: "/payments" },
    {
      text: "Products",
      icon: <ProductionQuantityLimitsRounded />,
      path: "/products",
    },
    { text: "Logout", icon: <LogoutTwoTone />, path: "/logout" },
  ];

  // ---------------- MENU ----------------
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleMenuClose();
    nav("/profile");
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getTimerColor = (time) => {
    if (time <= 300) return "#ef4444"; // <5 min
    if (time <= 600) return "#f59e0b"; // <10 min
    return "#22c55e"; // >10 min
  };

  return (
    <Box sx={{ display: "flex", minHeight: "95vh" }}>
      {/* TOP BAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1300,
          backdropFilter: "blur(10px)",
          background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            {open ? <MenuOpen /> : <Menu />}
          </IconButton>

          <Tooltip title="Navigate to Dashboard">
            <Description
              onClick={() => nav("/")}
              sx={{
                mr: 1,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
          </Tooltip>

          <Typography variant="h6" fontWeight="600" sx={{ flexGrow: 1 }}>
            Invoice Management
          </Typography>

          {/* TIMER */}
          <Box
            sx={{
              mr: 2,
              px: 2,
              py: 0.6,
              borderRadius: 2,
              minWidth: 100,
              textAlign: "center",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: 1,
              color: "white",
              background:
                sessionTime <= 300
                  ? "rgba(239,68,68,0.2)"
                  : sessionTime <= 600
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(34,197,94,0.2)",
              border: `1px solid ${getTimerColor(sessionTime)}`,
              boxShadow:
                sessionTime <= 300
                  ? "0 0 12px rgba(239,68,68,0.6)"
                  : sessionTime <= 600
                    ? "0 0 10px rgba(245,158,11,0.5)"
                    : "0 0 8px rgba(34,197,94,0.5)",
              transition: "all 0.3s ease",
            }}
          >
            {formatTime(sessionTime)}
          </Box>

          <Tooltip title={localStorage.getItem("name")}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{ bgcolor: "white", color: "#6366f1", fontWeight: 600 }}
              >
                {localStorage.getItem("name")?.[0] || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <MenuDropdown
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={goToProfile}>
              {localStorage.getItem("name")}
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            mt: "64px",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.7)",
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItemButton
                key={index}
                onClick={() => {
                  if (item.path === "/logout") {
                    logout();
                  } else {
                    nav(item.path);
                  }
                }}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  justifyContent: open ? "initial" : "center",
                  px: 2,

                  // ✅ ACTIVE STYLE
                  background: isActive
                    ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                    : "transparent",

                  color: isActive ? "white" : "inherit",

                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                      : "rgba(99,102,241,0.1)",
                  },
                }}
              >
                {/* ICON */}
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",

                    // ✅ ICON COLOR CHANGE
                    color: isActive ? "white" : "#6366f1",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {/* TEXT */}
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.2s",

                    // ✅ TEXT COLOR
                    "& span": {
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "white" : "inherit",
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/* CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          transition: "margin 0.3s ease",
        }}
      >
        {children}
      </Box>

      {/* SESSION TIMEOUT DIALOG */}
      <Dialog
        open={timeoutOpen}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            minWidth: 340,
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.2rem",
            textAlign: "center",
            pb: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          Session Timeout
          <Box
            sx={{
              bgcolor: "#ef4444",
              color: "white",
              px: 1.2,
              py: 0.3,
              borderRadius: 1,
              fontSize: "0.8rem",
              fontWeight: 600,
              minWidth: 28,
              textAlign: "center",
            }}
          >
            {countdown}s
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: "0.95rem",
            px: 3,
          }}
        >
          Your session expired due to inactivity.
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            pb: 2,
            pt: 1,
          }}
        >
          <Button
            onClick={handleContinue}
            variant="contained"
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
            }}
          >
            Continue
          </Button>

          <Button
            onClick={handleLogoutSession}
            variant="outlined"
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#ef4444",
              color: "#ef4444",
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
