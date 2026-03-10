import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomAlert = ({ open, message, severity, handleClose }) => {
  const colorMap = {
    success: "#e8f5e9",
    error: "#fdecea",
    warning: "#fff4e5",
    info: "#e3f2fd",
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          backgroundColor: colorMap[severity],
          color: "#1a1a1a",
          fontWeight: 500,
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
