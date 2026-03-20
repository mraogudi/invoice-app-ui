import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Slide,
} from "@mui/material";
import { WarningAmber, Delete } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomConfirmDialog({
  open,
  title = "Confirmation",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 4,
          minWidth: 360,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg,#eef2ff,#e0f2fe)",
          color: "#1e293b",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <WarningAmber sx={{ color: "#f59e0b" }} />
        {title}
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Delete
            sx={{
              fontSize: 40,
              color: "#ef4444",
              bgcolor: "#fee2e2",
              borderRadius: "50%",
              p: 1,
            }}
          />

          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          startIcon={<Delete />}
          onClick={onConfirm}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(90deg,#fb7185,#f43f5e)",
            boxShadow: "0 4px 12px rgba(244,63,94,0.25)",

            "&:hover": {
              background: "linear-gradient(90deg,#f43f5e,#e11d48)",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
