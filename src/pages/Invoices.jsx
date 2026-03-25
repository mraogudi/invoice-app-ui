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
  TablePagination, // ✅ Added
} from "@mui/material";

import {
  Add,
  Search,
  Visibility,
  NoteAlt,
  Download,
  Delete,
  SearchRounded,
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

  const [page, setPage] = useState(0); // ✅ Pagination
  const [rowsPerPage] = useState(15);

  const [openView, setOpenView] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const hasCalledApi = useRef(false);

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
    setAlert({ open: true, message, severity });
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

  /* ---------------- Filtering ---------------- */

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceId?.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "ALL" || inv.status?.toUpperCase() === status;

    return matchesSearch && matchesStatus;
  });

  /* ---------------- Pagination ---------------- */

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setPage(0);
  }, [search, status, invoices]);

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
    setOpenConfirm(false);
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
      {/* Header */}
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
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight="600">
              Invoices
            </Typography>
            <Typography variant="body2">Manage all your invoices</Typography>
          </Box>

          {!loading && invoices.length > 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => nav("/create-invoice")}
              sx={{
                bgcolor: "white",
                color: "#6366f1",
                "&:hover": { bgcolor: "#eef2ff" },
              }}
            >
              Create Invoice
            </Button>
          )}
        </Box>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Box display="flex" gap={2}>
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
          />

          <TextField
            size="small"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="SENT">Sent</MenuItem>
            <MenuItem value="OVERDUE">Overdue</MenuItem>
          </TextField>

          <Button>
            <Tooltip title="Search">
              <SearchRounded />
            </Tooltip>
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 3 }}>
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedInvoices.map((row) => (
                  <TableRow key={row.invoiceId} hover>
                    <TableCell>{row.invoiceId}</TableCell>
                    <TableCell>{row.clientName}</TableCell>
                    <TableCell>
                      {dayjs(row.invoiceDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      {row.dueDate
                        ? dayjs(row.dueDate).format("DD MMM YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell>₹ {formatINR(row.totalAmount)}</TableCell>
                    <TableCell>₹ {formatINR(row.subtotal)}</TableCell>
                    <TableCell>₹ {formatINR(row.taxTotal)}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>

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
                            color: "#4f46e5",
                            bgcolor: "#eef2ff",
                            mr: 0.5,
                            "&:hover": {
                              bgcolor: "#e0e7ff",
                              transform: "scale(1.08)",
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
                            color: "#7c3aed",
                            bgcolor: "#f3e8ff",
                            mr: 0.5,
                            "&:hover": {
                              bgcolor: "#ede9fe",
                              transform: "scale(1.08)",
                            },
                          }}
                        >
                          <NoteAlt fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Download */}
                      <Tooltip title={`Download ${row.invoiceId}`}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadInvoice(row);
                          }}
                          sx={{
                            color: "#ea580c",
                            bgcolor: "#fff7ed",
                            mr: 0.5,
                            "&:hover": {
                              bgcolor: "#ffedd5",
                              transform: "scale(1.08)",
                            },
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Delete */}
                      <Tooltip
                        title={
                          row.status === "PAID"
                            ? "Paid invoices cannot be deleted"
                            : `Delete ${row.invoiceId}`
                        }
                      >
                        <span>
                          {" "}
                          {/* IMPORTANT: required for tooltip on disabled button */}
                          <IconButton
                            size="small"
                            disabled={row.status === "PAID"}
                            onClick={() => handleDelete(row)}
                            sx={{
                              color:
                                row.status === "PAID" ? "#94a3b8" : "#dc2626",
                              bgcolor:
                                row.status === "PAID" ? "#f1f5f9" : "#fef2f2",
                              cursor:
                                row.status === "PAID"
                                  ? "not-allowed"
                                  : "pointer",

                              "&:hover": {
                                bgcolor:
                                  row.status === "PAID" ? "#f1f5f9" : "#fee2e2",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <TablePagination
            component="div"
            count={filteredInvoices.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[15]}
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>

      <CustomConfirmDialog
        open={openConfirm}
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

/* Status Chip */
function StatusChip({ status }) {
  const styles = {
    PAID: {
      bg: "#dcfce7",
      color: "#15803d",
      border: "#86efac",
    },
    PENDING: {
      bg: "#fef9c3",
      color: "#a16207",
      border: "#fde68a",
    },
    OVERDUE: {
      bg: "#fee2e2",
      color: "#b91c1c",
      border: "#fecaca",
    },
    SENT: {
      bg: "#e0e7ff",
      color: "#3730a3",
      border: "#c7d2fe",
    },
  };

  const s = styles[status] || {
    bg: "#f1f5f9",
    color: "#334155",
    border: "#e2e8f0",
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 700,
        border: `1px solid ${s.border}`,
        letterSpacing: "0.3px",
        px: 0.5,
      }}
    />
  );
}
