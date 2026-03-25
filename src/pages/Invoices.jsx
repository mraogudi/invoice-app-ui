import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Chip,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Add,
  Search,
  Visibility,
  NoteAlt,
  Download,
  Delete,
} from "@mui/icons-material";

import invoiceService from "../services/invoiceService";
import InvoicePreview from "./InvoicePreview";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CustomConfirmDialog from "../utils/CustomConfirmDialog";
import CustomAlert from "../utils/CustomAlert";

export default function Invoices() {
  const nav = useNavigate();
  dayjs.extend(utc);
  dayjs.extend(timezone);

  /* ---------------- State ---------------- */

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  // View Items Dialog
  const [openView, setOpenView] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const hasCalledApi = useRef(false);

  // Invoice Preview Popup
  const [openPreview, setOpenPreview] = useState(false);
  const [previewInvoiceId, setPreviewInvoiceId] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteRecord, setDeteleRecord] = useState(null);

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

  /* ---------------- Load Data ---------------- */

  useEffect(() => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      loadInvoices();
    }
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const res = await invoiceService.getAllInvoices();
      setInvoices(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- View Items ---------------- */

  const handleViewItems = async (invoice) => {
    try {
      setItemsLoading(true);

      const res = await invoiceService.getInvoiceItems(invoice.invoiceId);

      if (res.length !== 0) {
        setInvoiceItems(res);
        setOpenView(true);
        setSelectedInvoice(invoice);
      } else {
        alert("No items found for this invoice");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setItemsLoading(false);
    }
  };

  function handleCloseView() {
    setOpenView(false);
    setInvoiceItems([]);
    setSelectedInvoice(null);
  }

  const downloadInvoice = (row) => {
    setPreviewInvoiceId(row.invoiceId);
    setOpenPreview(true);
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const handleDelete = (row) => {
    setDeteleRecord(row);
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    console.log("Item Deleted");
    setOpenConfirm(false);
    console.log(deleteRecord);
    setDeteleRecord(null);
    showAlert("Record deleted", "success");
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    setDeteleRecord(null);
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box>
      {/* ---------------- Header ---------------- */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
          color: "white",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight="600">
              Invoices
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage all your invoices
            </Typography>
          </Box>

          {!loading && invoices.length > 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => nav("/create-invoice")}
              sx={{
                bgcolor: "white",
                color: "#6366f1",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#eef2ff",
                },
              }}
            >
              Create Invoice
            </Button>
          )}
        </Box>
      </Paper>

      {/* ---------------- Filters ---------------- */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
        }}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search invoice"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />

          {/* Status Filter */}
          <TextField
            size="small"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* ---------------- Table ---------------- */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8faff" }}>
                <TableCell>Invoice</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Sub</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {/* No Data */}
              {!loading && invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Box
                      sx={{
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        color: "#94A3B8",
                      }}
                    >
                      <NoteAlt sx={{ fontSize: 45, opacity: 0.4 }} />

                      <Typography fontWeight={600}>
                        No Invoices Available
                      </Typography>

                      <Typography fontSize={13}>
                        You haven't created any invoices yet
                      </Typography>

                      {/* Show button ONLY here */}
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => nav("/create-invoice")}
                        sx={{
                          mt: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          bgcolor: "#6366f1",
                          "&:hover": { bgcolor: "#4f46e5" },
                        }}
                      >
                        Create First Invoice
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Data */}
              {!loading &&
                invoices.map((row) => (
                  <TableRow key={row.invoiceId} hover>
                    {/* Invoice */}
                    <TableCell sx={{ cursor: "pointer", fontWeight: 600 }}>
                      {row.invoiceId}
                    </TableCell>

                    <TableCell>{row.clientName}</TableCell>

                    <TableCell>
                      {dayjs
                        .utc(row.invoiceDate)
                        .tz("Asia/Kolkata")
                        .format("DD MMM YYYY")}
                    </TableCell>

                    <TableCell>
                      {row.dueDate
                        ? dayjs
                            .utc(row.dueDate)
                            .tz("Asia/Kolkata")
                            .format("DD MMM YYYY")
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      ₹ {row.totalAmount ? formatINR(row.totalAmount) : "0.0"}
                    </TableCell>

                    <TableCell>
                      ₹ {row.subtotal ? formatINR(row.subtotal) : "0.0"}
                    </TableCell>

                    <TableCell>
                      ₹ {row.taxTotal ? formatINR(row.taxTotal) : "0.0"}
                    </TableCell>

                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      {/* View */}
                      <Tooltip title="View Invoice Items">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewItems(row);
                          }}
                          sx={{
                            color: "#6366f1",

                            "&:hover": {
                              bgcolor: "#eef2ff",
                            },
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Notes */}
                      <Tooltip title={row.notes || "No notes"}>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#8b5cf6",
                            ml: 0.5,

                            "&:hover": {
                              bgcolor: "#f3e8ff",
                            },
                          }}
                        >
                          <NoteAlt fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Downlaod */}
                      <Tooltip title={`Download ${row.invoiceId}`}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadInvoice(row);
                          }}
                          sx={{
                            color: "orange",
                            ml: 0.5,

                            "&:hover": {
                              bgcolor: "#f3e8ff",
                            },
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Delete */}
                      <Tooltip title={`Delete ${row.invoiceId}`}>
                        <IconButton
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              productId: p.id,
                              productName: p.name,
                            })
                          }
                          sx={{
                            color: "#FDA4AF",
                            "&:hover": { color: "#E11D48", bgcolor: "#FFF1F2" },
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
      </Paper>

      {/* ---------------- View Items Dialog ---------------- */}

      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Invoice Items — {selectedInvoice?.invoiceId}
        </DialogTitle>

        <DialogContent dividers>
          {itemsLoading && (
            <Box textAlign="center" py={3}>
              <CircularProgress />
            </Box>
          )}

          {!itemsLoading && invoiceItems.length === 0 && (
            <Typography align="center" py={3}>
              No items found
            </Typography>
          )}

          {!itemsLoading && invoiceItems.length > 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8faff" }}>
                    <TableCell>Item</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Tax %</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {invoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName}</TableCell>

                      <TableCell>{item.itemName}</TableCell>

                      <TableCell>{item.quantity}</TableCell>

                      <TableCell>
                        ₹ {item.unitPrice?.toLocaleString()}
                      </TableCell>

                      <TableCell>₹ {item.total?.toLocaleString()}</TableCell>

                      <TableCell>{item.taxPercentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseView} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- Invoice Preview Dialog ---------------- */}

      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Invoice Preview</DialogTitle>

        <DialogContent dividers>
          <InvoicePreview invoiceId={previewInvoiceId} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPreview(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <CustomConfirmDialog
        open={openConfirm}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <CustomAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        handleClose={handleClose}
      />
    </Box>
  );
}

/* ---------------- Status Chip ---------------- */

function StatusChip({ status }) {
  const styles = {
    PAID: {
      bg: "#dcfce7",
      color: "#166534",
    },
    PENDING: {
      bg: "#fef9c3",
      color: "#854d0e",
    },
    OVERDUE: {
      bg: "#fee2e2",
      color: "#991b1b",
    },
    SENT: {
      bg: "#e0e7ff",
      color: "#3730a3",
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
