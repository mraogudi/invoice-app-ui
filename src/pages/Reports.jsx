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
          value={stats.totalInvoices ?? "NA"}
          gradient="linear-gradient(135deg,#ecfeff,#cffafe)"
        />

        <StatCard
          icon={<Payments />}
          title="Payments"
          value={stats.totalPayments ?? "NA"}
          gradient="linear-gradient(135deg,#f0fdf4,#dcfce7)"
        />

        <StatCard
          icon={<WarningAmber />}
          title="Overdue"
          value={stats.overdueInvoices ?? "NA"}
          gradient="linear-gradient(135deg,#fef2f2,#fee2e2)"
          danger
        />
      </Grid>

      {/* Charts */}
      {hasData && (
        <Grid container spacing={3}>
          {/* Revenue */}
          <Grid item xs={12} md={8} width={"30%"}>
            <ChartCard title="Monthly Revenue">
              <Box sx={{ width: "100%", minWidth: 0 }}>
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
              </Box>
            </ChartCard>
          </Grid>

          {/* Payment Methods */}
          <Grid item xs={12} md={4} width={"30%"}>
            <ChartCard title="Payment Methods">
              <Box sx={{ width: "100%", minWidth: 250 }}>
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
                          fill={
                            ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"][i % 4]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </ChartCard>
          </Grid>

          {/* Invoices */}
          <Grid item xs={12} width={"30%"}>
            <ChartCard title="Monthly Invoices">
              <Box sx={{ width: "100%", minWidth: 0 }}>
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
              </Box>
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
      {/* ❌ removed width: "23%" */}
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
                  value === "NA" ? "red" : danger ? "#dc2626" : "text.primary",
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

      <Box sx={{ width: "100%", overflow: "hidden" }}>{children}</Box>
    </Paper>
  );
}
