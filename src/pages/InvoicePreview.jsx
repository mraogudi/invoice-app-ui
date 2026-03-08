import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";

import { Print, Download } from "@mui/icons-material";
import dayjs from "dayjs";
import invoiceService from "../services/InvoiceService";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { encryptInvoiceData } from "../utils/qrCrypto";

export default function InvoicePreview({ invoiceId }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subTotalAmt, setSubTotalAmt] = useState(0.0);
  const [totalTax, setTotalTax] = useState(0.0);
  const [grandTotal, setGrandTotal] = useState(0.0);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const invoiceRef = useRef();

  const statusColor = {
    PAID: "success",
    PENDING: "warning",
    CANCELLED: "error",
    OVERDUE: "warning",
    SENT: "success",
  };

  useEffect(() => {
    if (invoiceId) fetchInvoice(invoiceId);
  }, [invoiceId]);

  const fetchInvoice = async (id) => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoicePdf(id);
      const data = response?.data || response;

      calculateTotals(data.items);

      setInvoice({
        items: [],
        client: {},
        ...data,
      });
    } catch (err) {
      console.error("Failed to load invoice", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const calculateTotals = (items) => {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach((item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemTax = itemSubtotal * (item.taxPercentage / 100);

      subtotal += itemSubtotal;
      taxTotal += itemTax;
    });

    setTotalTax(taxTotal);
    setSubTotalAmt(subtotal);
    setGrandTotal(taxTotal + subtotal);
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const handleDownload = async () => {
    const element = invoiceRef.current;

    const noPrintElements = element.querySelectorAll(".no-print");
    noPrintElements.forEach((el) => (el.style.display = "none"));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    noPrintElements.forEach((el) => (el.style.display = ""));

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save(`Invoice-${invoice.invoiceId}.pdf`);
  };

  const generateQrPayload = () => {
    if (!invoice) return "";

    const qrData = {
      id: invoice.invoiceId,
      date: invoice.invoiceDate,
      client: invoice.clientName,
      total: grandTotal,
      currency: "INR",
      items: invoice.items,
    };

    const encrypted = encryptInvoiceData(qrData);

    const payload = {
      type: "INVOICE_QR",
      version: "1.0",
      data: encrypted,
    };

    return JSON.stringify(payload);
  };

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box p={5} textAlign="center">
        <Typography color="error">Invoice not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        ref={invoiceRef}
        elevation={0}
        sx={{
          maxWidth: 920,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Box sx={{ color: "black", p: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700}>Invoice</Typography>
              <Typography sx={{ opacity: 0.85 }}>
                #{invoice.invoiceId}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Chip
                label={invoice.status}
                color={statusColor[invoice.status] || "default"}
                sx={{
                  fontWeight: 700,
                  color: "white",
                }}
              />

              {/* QR Code */}
              <Box
                sx={{
                  bgcolor: "white",
                  p: 1,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <QRCodeCanvas
                  value={generateQrPayload()}
                  size={90}
                  includeMargin={true}
                />
              </Box>
            </Box>
          </Grid>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Billing */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography fontWeight={700} mb={1}>
                Bill To
              </Typography>
              <Typography fontWeight={600}>{invoice.clientName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {invoice.clientEmail || ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {invoice.clientPhone || ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {invoice.clientAddress || ""}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} textAlign="right">
              <Typography>
                <strong>Date:</strong>{" "}
                {invoice.invoiceDate
                  ? dayjs(invoice.invoiceDate)
                      .tz("Asia/Kolkata")
                      .format("DD MMM YYYY")
                  : "-"}
              </Typography>

              <Typography>
                <strong>Time:</strong>{" "}
                {invoice.invoiceDate
                  ? dayjs
                      .utc(invoice.invoiceDate)
                      .tz("Asia/Kolkata")
                      .format("hh:mm A")
                  : "-"}
              </Typography>

              <Typography>
                <strong>Invoice No:</strong> {invoice.invoiceId}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Items Table */}
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f1f5ff" }}>
                <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Unit
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Tax %
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoice.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                invoice.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ₹{formatINR(item.unitPrice)}
                    </TableCell>
                    <TableCell align="right">{item.taxPercentage}%</TableCell>
                    <TableCell align="right">
                      ₹{formatINR(item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Divider sx={{ my: 3 }} />

          {/* Totals */}
          <Box display="flex" justifyContent="flex-end">
            <Box
              sx={{
                width: 280,
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#f8faff",
                border: "1px solid #e0e7ff",
              }}
            >
              <Row label="Subtotal" value={subTotalAmt} />
              <Row label="Tax" value={totalTax} />

              <Divider sx={{ my: 1.5 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Grand Total</Typography>
                <Typography fontWeight={700} color="primary">
                  ₹{formatINR(grandTotal)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box
            className="no-print"
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Print
            </Button>

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function Row({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" mb={0.8}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>₹{Number(value || 0).toFixed(2)}</Typography>
    </Box>
  );
}
