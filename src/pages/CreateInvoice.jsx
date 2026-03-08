import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Autocomplete,
  MenuItem,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import {
  Add,
  Delete,
  ArrowBack,
  PersonSearch,
  Description,
} from "@mui/icons-material";
import clientService from "../services/clientService";
import invoiceService from "../services/invoiceService";
import productService from "../services/productService";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "SENT", label: "Sent" },
];

// Beautiful Soft Color Palette
const COLORS = {
  background: "#F0F2F5",
  cardBg: "#FFFFFF",
  primary: "#6366F1", // Indigo
  primaryLight: "#EEF2FF",
  secondary: "#64748B", // Slate
  border: "#E2E8F0",
  headerGradient: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
  tableHeader: "#F8FAFC",
};

export default function CreateInvoice() {
  const nav = useNavigate();
  const handleApiCall = useRef(false);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Form State ---------------- */
  const [invoice, setInvoice] = useState({
    clientId: null,
    clientName: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "DRAFT",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      productId: null,
      itemName: "",
      quantity: 1,
      unitPrice: 0,
      taxPercentage: 0,
    },
  ]);

  useEffect(() => {
    if (!handleApiCall.current) {
      handleApiCall.current = true;
      initData();
    }
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      const [clientRes, productsRsp] = await Promise.all([
        clientService.getAllClients(),
        productService.getAllProducts(),
      ]);
      setClients(
        clientRes.map((c) => ({ id: c.id, name: c.name, email: c.email })),
      );
      setProducts(
        productsRsp.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          tax: p.taxPercentage,
        })),
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Handlers (Unchanged) ---------------- */
  const handleInvoiceChange = (e) =>
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  const handleClientSearchChange = (event, newValue) => {
    if (newValue && newValue.id) {
      setInvoice({
        ...invoice,
        clientName: newValue.name,
        clientId: newValue.id,
      });
    } else {
      setInvoice({
        ...invoice,
        clientName: typeof newValue === "string" ? newValue : "",
        clientId: null,
      });
    }
  };
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };
  const handleProductSelect = (index, product) => {
    const updated = [...items];
    if (product && product.id) {
      updated[index].productId = product.id;
      updated[index].itemName = product.name;
      updated[index].unitPrice = product.price;
      updated[index].taxPercentage = product.tax;
      updated[index].quantity = product.quantity;
      const total =
        product.quantity *
        product.unitPrice *
        (1 + product.taxPercentage / 100);
      updated[index].total = total;
    } else {
      updated[index].productId = null;
    }
    setItems(updated);
  };
  const addItem = () =>
    setItems([
      ...items,
      {
        productId: null,
        itemName: "",
        quantity: 1,
        unitPrice: 0,
        taxPercentage: 0,
      },
    ]);
  const removeItem = (index) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  /* ---------------- Calculations ---------------- */
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const tax = items.reduce(
    (sum, i) => sum + (i.quantity * i.unitPrice * i.taxPercentage) / 100,
    0,
  );
  const total = subtotal + tax;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedItems = items.map((item) => ({
        productId: item.productId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxPercent: item.taxPercentage,
        total: Number((item.quantity * item.unitPrice).toFixed(2)),
      }));
      const payload = {
        ...invoice,
        items: formattedItems,
        subtotal,
        taxTotal: tax,
        grandTotal: total,
      };
      const response = await invoiceService.createInvoice(payload);
      if (response) nav("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    p: 3,
    mb: 3,
    borderRadius: "16px",
    background: COLORS.cardBg,
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    border: `1px solid ${COLORS.border}`,
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#FCFDFF",
      "&:hover fieldset": { borderColor: COLORS.primary },
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(4px)",
        }}
        open={loading}
      >
        <Box textAlign="center">
          <CircularProgress
            size={60}
            thickness={4}
            sx={{ color: COLORS.primary }}
          />
          <Typography
            variant="body1"
            sx={{ mt: 2, fontWeight: 600, color: "white" }}
          >
            Processing Invoice...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "24px",
          // A very light, airy gradient for a "clean" feel
          background: "linear-gradient(135deg, #F5F7FF 0%, #FFFFFF 100%)",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)",
        }}
      >
        {/* Decorative subtle background circle */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.04)",
            zIndex: 0,
          }}
        />

        <Box display="flex" alignItems="center" gap={3} sx={{ zIndex: 1 }}>
          <IconButton
            onClick={() => nav(-1)}
            sx={{
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "#F8FAFC", transform: "translateX(-2px)" },
              transition: "all 0.2s ease",
            }}
          >
            <ArrowBack sx={{ color: "#64748B" }} />
          </IconButton>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#1E293B",
                letterSpacing: "-1px",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              New Invoice
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", fontWeight: 500, mt: 0.5 }}
            >
              Fill in the details below to generate your billing statement
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Invoice Details Section */}
      <Paper sx={cardStyle}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          mb={3}
          sx={{
            color: COLORS.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 18,
              bgcolor: COLORS.primary,
              borderRadius: 1,
            }}
          />
          Invoice Configuration
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} width="25%">
            <Autocomplete
              options={clients}
              getOptionLabel={(o) =>
                typeof o === "string"
                  ? o
                  : o.email
                    ? `${o.name} (${o.email})`
                    : o.name || ""
              }
              filterOptions={(options, params) =>
                options.filter(
                  (option) =>
                    option.name
                      .toLowerCase()
                      .includes(params.inputValue.toLowerCase()) ||
                    option.email
                      .toLowerCase()
                      .includes(params.inputValue.toLowerCase()),
                )
              }
              onChange={handleClientSearchChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client Name & Email"
                  placeholder="Search..."
                  sx={inputStyle}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <PersonSearch sx={{ color: COLORS.secondary, mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2.5} width="15%">
            <TextField
              fullWidth
              type="date"
              label="Invoice Date"
              name="invoiceDate"
              InputLabelProps={{ shrink: true }}
              value={invoice.invoiceDate}
              onChange={handleInvoiceChange}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} md={2.5} width="15%">
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              name="dueDate"
              InputLabelProps={{ shrink: true }}
              value={invoice.dueDate}
              onChange={handleInvoiceChange}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} md={3} width="15%">
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={invoice.status}
              onChange={handleInvoiceChange}
              sx={inputStyle}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} width="20%">
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Notes"
              name="notes"
              placeholder="Terms, conditions or internal notes..."
              value={invoice.notes}
              onChange={handleInvoiceChange}
              sx={inputStyle}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Items Table Section */}
      <Paper sx={{ ...cardStyle, overflow: "hidden", p: 0 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: COLORS.secondary }}
          >
            Billing Items
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={addItem}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: COLORS.primary,
              color: COLORS.primary,
            }}
          >
            Add New Item
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: COLORS.tableHeader }}>
              <TableRow>
                <TableCell
                  width="35%"
                  sx={{ fontWeight: 700, color: COLORS.secondary }}
                >
                  Product/Item Name
                </TableCell>
                <TableCell
                  width="10%"
                  sx={{ fontWeight: 700, color: COLORS.secondary }}
                >
                  Qty
                </TableCell>
                <TableCell
                  width="15%"
                  sx={{ fontWeight: 700, color: COLORS.secondary }}
                >
                  Unit Price
                </TableCell>
                <TableCell
                  width="10%"
                  sx={{ fontWeight: 700, color: COLORS.secondary }}
                >
                  Tax %
                </TableCell>
                <TableCell
                  width="15%"
                  sx={{ fontWeight: 700, color: COLORS.secondary }}
                >
                  Line Total
                </TableCell>
                <TableCell width="5%" />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:hover": { bgcolor: "#FBFCFF" } }}
                >
                  <TableCell>
                    <Autocomplete
                      freeSolo
                      options={products}
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.name
                      }
                      onInputChange={(e, val) =>
                        handleItemChange(index, "itemName", val)
                      }
                      onChange={(e, val) => handleProductSelect(index, val)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Item name"
                          sx={inputStyle}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      sx={inputStyle}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "unitPrice",
                          Number(e.target.value),
                        )
                      }
                      sx={inputStyle}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.taxPercentage}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "taxPercentage",
                          Number(e.target.value),
                        )
                      }
                      sx={inputStyle}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1E293B" }}>
                    ₹{" "}
                    {(
                      item.quantity *
                      item.unitPrice *
                      (1 + item.taxPercentage / 100)
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => removeItem(index)}
                      sx={{
                        bgcolor: "#FFF1F2",
                        "&:hover": { bgcolor: "#FFE4E6" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Row */}
      <Paper sx={{ ...cardStyle, bgcolor: "#FCFDFF" }}>
        <Grid container>
          <Grid item xs={12} md={7} />
          <Grid item xs={12} md={5}>
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Tax Amount" value={tax} />
            <Divider sx={{ my: 2, borderStyle: "dashed" }} />
            <SummaryRow label="Grand Total" value={total} bold />
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={2} mb={6}>
        <Button
          variant="text"
          onClick={() => nav(-1)}
          sx={{ color: COLORS.secondary, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: "12px",
            bgcolor: COLORS.primary,
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
            "&:hover": { bgcolor: "#4F46E5" },
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {loading ? "Creating..." : "Confirm & Save Invoice"}
        </Button>
      </Box>
    </Box>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <Box display="flex" justifyContent="space-between" mb={1.5}>
      <Typography
        variant={bold ? "h6" : "body1"}
        fontWeight={bold ? 800 : 500}
        color={bold ? "primary" : "text.secondary"}
      >
        {label}
      </Typography>
      <Typography
        variant={bold ? "h6" : "body1"}
        fontWeight={bold ? 800 : 600}
        color={bold ? "primary" : "text.primary"}
      >
        ₹ {value.toFixed(2)}
      </Typography>
    </Box>
  );
}
