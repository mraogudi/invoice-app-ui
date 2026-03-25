import { useState } from "react";

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
  ProductionQuantityLimitsRounded,
  Payments,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Menu as MenuDropdown, MenuItem } from "@mui/material";

const drawerWidth = 240;
const collapsedWidth = 72;

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  const { logout, userName } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToProfile = () => {
    handleMenuClose();
    nav("/profile"); // create this route
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/",
    },
    {
      text: "Invoices",
      icon: <ReceiptLong />,
      path: "/invoices",
    },
    {
      text: "Customers",
      icon: <People />,
      path: "/clients",
    },
    {
      text: "Reports",
      icon: <BarChart />,
      path: "/reports",
    },
    {
      text: "Payments",
      icon: <Payments />,
      path: "/payments",
    },
    {
      text: "Products",
      icon: <ProductionQuantityLimitsRounded />,
      path: "/products",
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "95vh", bgcolor: "#f8faff" }}>
      {/* ---------------- Top Bar ---------------- */}
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
          {/* Toggle Button */}
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            {open ? <MenuOpen /> : <Menu />}
          </IconButton>

          <Description sx={{ mr: 1 }} />

          <Typography variant="h6" fontWeight="600" sx={{ flexGrow: 1 }}>
            Invoice Management
          </Typography>

          {/* Logout */}
          <Tooltip title={localStorage.getItem("name")}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#6366f1",
                  fontWeight: 600,
                }}
              >
                {localStorage.getItem("name")?.[0] || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <MenuDropdown
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 3,
                minWidth: 180,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              },
            }}
          >
            <MenuItem onClick={goToProfile}>
              <ListItemIcon>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: "#6366f1",
                    fontSize: 12,
                  }}
                >
                  {localStorage.getItem("name")?.[0] || "U"}
                </Avatar>
              </ListItemIcon>
              Profile
            </MenuItem>

            <Divider />

            <MenuItem onClick={logout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </MenuDropdown>
        </Toolbar>
      </AppBar>

      {/* ---------------- Sidebar ---------------- */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s",

          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : collapsedWidth,
            mt: "64px",
            border: "none",
            overflowX: "hidden",
            transition: "width 0.3s",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
          },
        }}
      >
        {/* User Info */}
        <Box
          display="flex"
          alignItems="center"
          gap={open ? 2 : 0}
          justifyContent={open ? "flex-start" : "center"}
          p={2}
        >
          <Avatar
            onClick={goToProfile}
            sx={{
              bgcolor: "#6366f1",
              width: 40,
              height: 40,
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {localStorage.getItem("name")?.[0] || "U"}
          </Avatar>

          {open && (
            <Box>
              <Typography fontWeight="600">
                {localStorage.getItem("name").split(" ")[0] || "User"}
              </Typography>

              <Typography variant="caption" color="green">
                Online
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Menu */}
        <List sx={{ px: 1, mt: 1 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Tooltip
                key={item.text}
                title={!open ? item.text : ""}
                placement="right"
              >
                <ListItemButton
                  onClick={() => nav(item.path)}
                  sx={{
                    mb: 0.5,
                    minHeight: 48,
                    borderRadius: 2,

                    justifyContent: open ? "flex-start" : "center",

                    background: active
                      ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                      : "transparent",

                    color: active ? "white" : "text.primary",

                    "&:hover": {
                      background: active
                        ? "linear-gradient(90deg,#4f46e5,#7c3aed)"
                        : "#eef2ff",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",

                      color: active ? "white" : "#6366f1",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: active ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Drawer>

      {/* ---------------- Main Content ---------------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          minHeight: "95vh",
          background: "rgba(255,255,255,0.75)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
