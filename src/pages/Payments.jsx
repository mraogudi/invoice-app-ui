import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add,
  Delete,
  Visibility,
  Payments,
  DeleteForever,
} from "@mui/icons-material";
import { useRef } from "react";
import paymentService from "../services/paymentService";

// import paymentService from "../services/PaymentService";

export default function PaymentsList() {
  const nav = useNavigate();

  /* ---------------- State ---------------- */

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const hasCalledApi = useRef(false);

  /* ---------------- Load Payments ---------------- */

  useEffect(() => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      loadPayments();
    }
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAllPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete ---------------- */
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // await paymentService.deletePayment(selectedPayment.id);

      setPayments(payments.filter((p) => p.id !== selectedPayment.id));

      setDeleteDialog(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Styles ---------------- */

  const cardStyle = {
    p: 3,
    borderRadius: 4,
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f9fc",
        p: 2,
      }}
    >
      {/* ---------------- Header ---------------- */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg,#e0e7ff,#f5f3ff)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" gap={1.5} alignItems="center">
            <Payments sx={{ color: "#4f46e5" }} />

            <Box>
              <Typography variant="h5" fontWeight={700}>
                Payments
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Track all received payments
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ---------------- Payments Table ---------------- */}

      <Paper sx={cardStyle}>
        <Typography fontWeight={600} mb={2} color="primary">
          Payment History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7ff" }}>
                <TableCell>Invoice</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {/* Empty */}
              {!loading && payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box
                      sx={{
                        py: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        color: "#94A3B8",
                      }}
                    >
                      <Payments sx={{ fontSize: 40, opacity: 0.4 }} />

                      <Typography fontWeight={600}>
                        No Payments Available
                      </Typography>

                      <Typography fontSize={13}>
                        No transactions have been recorded yet
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Data */}
              {!loading &&
                payments.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {p.invoiceNo}
                    </TableCell>

                    <TableCell>{p.client}</TableCell>

                    <TableCell>
                      {new Date(p.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>₹ {p.amount.toLocaleString()}</TableCell>

                    <TableCell>{p.method}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <PaymentStatus status={p.status} />
                    </TableCell>
                    <TableCell>
                      <DeleteForever />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ---------------- Delete Dialog ---------------- */}

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={600}>Delete Payment</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete payment for invoice{" "}
            <strong>{selectedPayment?.invoiceNo}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ---------------- Payment Status Chip ---------------- */

function PaymentStatus({ status }) {
  const styles = {
    SUCCESS: {
      bg: "#dcfce7",
      color: "#166534",
    },
    PENDING: {
      bg: "#fef9c3",
      color: "#854d0e",
    },
    FAILED: {
      bg: "#fee2e2",
      color: "#991b1b",
    },
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: styles[status]?.bg,
        color: styles[status]?.color,
        fontWeight: 600,
      }}
    />
  );
}
