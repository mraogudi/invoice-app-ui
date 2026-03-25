import { useEffect, useState, useRef } from "react";
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
  TablePagination, // ✅ Added
} from "@mui/material";

import { Delete, Payments } from "@mui/icons-material";

import paymentService from "../services/paymentService";

export default function PaymentsList() {
  const nav = useNavigate();

  /* ---------------- State ---------------- */

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const hasCalledApi = useRef(false);

  // ✅ Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15); // fixed limit

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

  /* ---------------- Pagination Handlers ---------------- */

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // reset page when data changes
  useEffect(() => {
    setPage(0);
  }, [payments]);

  /* ---------------- Delete ---------------- */

  const handleDeleteConfirm = async () => {
    try {
      setPayments(payments.filter((p) => p.id !== selectedPayment.id));
      setDeleteDialog(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  /* ---------------- Styles ---------------- */

  const cardStyle = {
    p: 3,
    borderRadius: 4,
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  };

  // ✅ Paginated Data
  const paginatedPayments = payments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fc", p: 2 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg,#e0e7ff,#f5f3ff)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
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

      {/* Table */}
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading && payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Payments Available
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedPayments.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {p.invoiceId}
                    </TableCell>
                    <TableCell>{p.clientName}</TableCell>
                    <TableCell>
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹ {formatINR(p.amount)}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>
                      <PaymentStatus status={p.status} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={"Delete"}>
                        <IconButton
                          onClick={() => {
                            setSelectedPayment(p);
                            setDeleteDialog(true);
                          }}
                          sx={{
                            color: "#FDA4AF",
                            "&:hover": {
                              color: "#E11D48",
                              bgcolor: "#FFF1F2",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination UI */}
        <TablePagination
          component="div"
          count={payments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[15]}
          showFirstButton // ✅ ADD THIS
          showLastButton // ✅ ADD THIS
        />
      </Paper>

      {/* Delete Dialog */}
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
            <strong>{selectedPayment?.invoiceId}</strong>?
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

/* Status Chip */
function PaymentStatus({ status }) {
  const styles = {
    SUCCESS: { bg: "#dcfce7", color: "#166534" },
    PENDING: { bg: "#fef9c3", color: "#854d0e" },
    FAILED: { bg: "#fee2e2", color: "#991b1b" },
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
