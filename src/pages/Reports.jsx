import { useEffect, useState, useRef } from "react";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import {
  TrendingUp,
  ReceiptLong,
  Payments,
  WarningAmber,
} from "@mui/icons-material";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import reportService from "../services/reportService";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [methodData, setMethodData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      loadReports();
    }
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const res = await reportService.getReports(userId);
      const data = res?.data || {};

      setStats({
        totalRevenue: data.totalRevenue ?? null,
        totalInvoices: data.totalInvoices ?? null,
        totalPayments: data.totalPayments ?? null,
        overdueInvoices: data.overdueInvoices ?? null,
      });

      setRevenueData(data.monthlyRevenue || []);
      setMethodData(data.paymentMethods || []);
      setInvoiceData(data.monthlyInvoices || []);
    } catch (err) {
      console.error("Reports API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Proper data check
  const hasData =
    revenueData.length > 0 || methodData.length > 0 || invoiceData.length > 0;

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, pb: 4, minHeight: "95vh" }}>
      {/* Title */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Reports
        </Typography>
        <Typography color="text.secondary">
          Revenue insights and business analytics
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <StatCard
          icon={<TrendingUp />}
          title="Total Revenue"
          value={
            stats.totalRevenue ? `₹ ${formatINR(stats.totalRevenue)}` : "NA"
          }
          gradient="linear-gradient(135deg,#eef2ff,#e0e7ff)"
        />

        <StatCard
          icon={<ReceiptLong />}
          title="Invoices"
          value={stats.totalInvoices ? stats.totalInvoices : "NA"}
          gradient="linear-gradient(135deg,#ecfeff,#cffafe)"
        />

        <StatCard
          icon={<Payments />}
          title="Payments"
          value={stats.totalPayments ? stats.totalPayments : "NA"}
          gradient="linear-gradient(135deg,#f0fdf4,#dcfce7)"
        />

        <StatCard
          icon={<WarningAmber />}
          title="Overdue"
          value={stats.overdueInvoices ? stats.overdueInvoices : "NA"}
          gradient="linear-gradient(135deg,#fef2f2,#fee2e2)"
          danger
        />
      </Grid>

      {/* Empty State */}
      {!hasData && (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            mb: 3,
            background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            color="#94A3B8"
          >
            <ReceiptLong sx={{ fontSize: 45, opacity: 0.4 }} />

            <Typography fontWeight={600}>No Report Data Available</Typography>

            <Typography fontSize={13}>
              No invoices or payments found to generate reports
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Charts */}
      {hasData && (
        <Grid container spacing={3}>
          {/* Revenue */}
          <Grid item xs={12} md={8}>
            <ChartCard title="Monthly Revenue">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Payment Methods */}
          <Grid item xs={12} md={4}>
            <ChartCard title="Payment Methods">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={methodData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {methodData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={["#6366f1", "#22c55e", "#f59e0b", "#ef4444"][i]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Invoices */}
          <Grid item xs={12}>
            <ChartCard title="Monthly Invoices">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={invoiceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="invoices"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

/* ---------------- Stat Card ---------------- */

function StatCard({ icon, title, value, gradient, danger }) {
  return (
    <Grid item xs={12} sm={6} md={3} width={"23%"}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          background: gradient,
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-3px)",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={value === "NA" ? 900 : 800}
              sx={{
                color:
                  value === "NA"
                    ? "red" // grey for NA
                    : danger
                      ? "#dc2626"
                      : "text.primary",
                letterSpacing: value === "NA" ? "1px" : "normal",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.6)",
              borderRadius: 2,
              p: 1,
            }}
          >
            {icon}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

/* ---------------- Chart Card ---------------- */

function ChartCard({ title, children }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(180deg,#ffffff,#f8fafc)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
      }}
    >
      <Typography fontWeight={700} mb={2}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
