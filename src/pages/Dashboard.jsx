import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import invoiceService from "../services/InvoiceService";
import dashboardService from "../services/dashboardService";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userName } = useAuth();

  /* ---------------- State ---------------- */

  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasCalledApi = useRef(false);

  /* ---------------- API Calls ---------------- */

  useEffect(() => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      loadDashboard();
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const statsRsp = await dashboardService.getStats();
      setStats(statsRsp);

      const invoiceRsp = await invoiceService.getRecentInvoices();
      setInvoices(invoiceRsp);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ---------------- Error ---------------- */

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <Box
      sx={{
        p: 3,
        width: "95%",
      }}
    >
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Hi, {userName}!
        </Typography>

        <Typography color="text.secondary">
          Welcome to Invoice Management System
        </Typography>
      </Box>

      {/* Stats Tiles */}
      <Grid container spacing={3} mb={4} alignItems="stretch">
        <Grid width="23%" item xs={12} sm={6} md={3} display="flex">
          <GradientCard
            title="Invoices"
            value={stats.totalInvoices}
            colors={["#c7d2fe", "#e0e7ff"]}
          />
        </Grid>

        <Grid width="23%" item xs={12} sm={6} md={3} display="flex">
          <GradientCard
            title="Revenue"
            value={`₹ ${formatINR(stats.totalRevenue)}`}
            colors={["#bbf7d0", "#ecfdf5"]}
          />
        </Grid>

        <Grid width="23%" item xs={12} sm={6} md={3} display="flex">
          <GradientCard
            title="Pending"
            value={stats.pendingInvoices}
            colors={["#fde68a", "#fffbeb"]}
          />
        </Grid>

        <Grid width="23%" item xs={12} sm={6} md={3} display="flex">
          <GradientCard
            title="Customers"
            value={stats.totalCustomers}
            colors={["#fbcfe8", "#fdf2f8"]}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Invoices */}
        <Grid item xs={12} md={8} width="75%">
          <GlassPaper>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="600">
                Recent Invoices
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate("/invoices")}
                sx={{
                  borderRadius: 2,
                  background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                }}
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer sx={{ width: "100%" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>INVOICE</TableCell>
                    <TableCell>CLIENT</TableCell>
                    <TableCell>NO OF ITEMS</TableCell>
                    <TableCell>AMOUNT</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/invoices/${row.id}`)}
                      >
                        <TableCell>{row.invoiceId}</TableCell>
                        <TableCell>{row.clientName}</TableCell>
                        <TableCell>
                          {row.items ? row.items.length : 0}
                        </TableCell>
                        <TableCell>₹ {formatINR(row.totalAmount)}</TableCell>
                        <TableCell>
                          <StatusChip status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    /* This row displays if the invoices array is empty */
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Box sx={{ opacity: 0.5 }}>
                          <Typography variant="h6" fontWeight="500">
                            No Invoices Found
                          </Typography>
                          <Typography variant="body2">
                            Once you create an invoice, it will appear here.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassPaper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4} width="20%">
          <GlassPaper>
            <Typography variant="h6" fontWeight="600" mb={2}>
              Quick Actions
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" flexDirection="column" gap={2}>
              <GradientButton onClick={() => navigate("/create-invoice")}>
                Create Invoice
              </GradientButton>

              <GradientButton onClick={() => navigate("/add-customer")}>
                Add Customer
              </GradientButton>

              <GradientButton onClick={() => navigate("/reports")}>
                Reports
              </GradientButton>

              <GradientButton onClick={() => navigate("/payments")}>
                Payments
              </GradientButton>
            </Box>
          </GlassPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

/* ---------------- Reusable Components ---------------- */

function GradientCard({ title, value, colors, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        flex: 1,
        minHeight: 120,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        <Typography color="text.secondary" fontWeight="500">
          {title}
        </Typography>

        <Typography variant="h4" fontWeight="bold" mt={1}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function GlassPaper({ children }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </Paper>
  );
}

function GradientButton({ children, onClick }) {
  return (
    <Button
      fullWidth
      variant="contained"
      onClick={onClick}
      sx={{
        py: 1.3,
        borderRadius: 2,
        fontWeight: 600,
        textTransform: "none",
        background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
        boxShadow: "0 5px 15px rgba(99,102,241,0.4)",

        "&:hover": {
          background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
        },
      }}
    >
      {children}
    </Button>
  );
}

function StatusChip({ status }) {
  const styles = {
    PAID: {
      bg: "#dcfce7",
      color: "#166534",
    },
    SENT: {
      bg: "#fef9c3",
      color: "#854d0e",
    },
    PENDING: {
      bg: "#fef9c3",
      color: "#854d0e",
    },
    OVERDUE: {
      bg: "#fee2e2",
      color: "#991b1b",
    },
  };

  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        fontSize: "0.8rem",
        fontWeight: 600,
        backgroundColor: styles[status]?.bg,
        color: styles[status]?.color,
        width: "fit-content",
      }}
    >
      {status}
    </Box>
  );
}
