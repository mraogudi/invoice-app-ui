import { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";

import {
  Add,
  Delete,
  Inventory,
  Close,
  WarningAmber,
  LocalOffer,
  PaidOutlined,
} from "@mui/icons-material";

export default function Products() {
  /* ---------------- State ---------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasCalledApi = useRef(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: "",
  });

  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    tax: "",
    description: "",
  });

  /* ---------------- Load Products ---------------- */
  useEffect(() => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = [
        {
          id: 1,
          name: "Premium Wireless Mouse",
          code: "WMS-02",
          price: 2499,
          tax: 18,
        },
        {
          id: 2,
          name: "Ergonomic Office Chair",
          code: "CHR-44",
          price: 15500,
          tax: 12,
        },
      ];
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", code: "", price: "", tax: "", description: "" });
  };

  const handleAddProduct = () => {
    if (!form.name || !form.price) return;
    const newProduct = {
      id: Date.now(),
      name: form.name,
      code: form.code,
      price: Number(form.price),
      tax: Number(form.tax || 0),
    };
    setProducts([...products, newProduct]);
    setOpenAdd(false);
    resetForm();
  };

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== deleteDialog.productId));
    setDeleteDialog({ open: false, productId: null, productName: "" });
  };

  /* ---------------- Styled Palettes ---------------- */
  const COLORS = {
    bg: "#F8FAFC",
    primary: "#6366F1",
    primaryLight: "#EEF2FF",
    textMain: "#1E293B",
    textSub: "#64748B",
    border: "#E2E8F0",
    inputBg: "#F1F5F9",
  };

  const fieldStyle = {
    "& .MuiFilledInput-root": {
      borderRadius: "12px",
      border: "1px solid transparent",
      "&.Mui-focused": {
        backgroundColor: "#FFF",
        borderColor: COLORS.primary,
        boxShadow: `0 0 0 4px rgba(99, 102, 241, 0.08)`,
      },
      "&:before, &:after": { display: "none" },
    },
    /* REMOVES ARROWS FROM NUMBER FIELDS */
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: COLORS.bg, p: { xs: 2, md: 6 } }}>
      {/* ---------------- Header ---------------- */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "24px",
          background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #FFFFFF 100%)`,
          border: `1px solid ${COLORS.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box display="flex" gap={2} alignItems="center">
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#FFF",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <Inventory sx={{ color: COLORS.primary, fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={COLORS.textMain}>
              Product Inventory
            </Typography>
            <Typography variant="body2" color={COLORS.textSub}>
              Manage your warehouse and pricing
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAdd(true)}
          sx={{
            bgcolor: COLORS.primary,
            color: "#FFF",
            fontWeight: 700,
            borderRadius: "14px",
            px: 4,
            py: 1.5,
            textTransform: "none",
            boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          Add Product
        </Button>
      </Paper>

      {/* ---------------- Table ---------------- */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "24px",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "none",
          bgcolor: "#FFF",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: COLORS.textSub }}>
                  PRODUCT NAME
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.textSub }}>
                  SKU CODE
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.textSub }}>
                  PRICE
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORS.textSub }}>
                  TAX
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, color: COLORS.textSub }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={30} sx={{ my: 4 }} />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow
                    key={p.id}
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: COLORS.textMain }}>
                      {p.name}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: COLORS.inputBg,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                          fontWeight: 700,
                          color: COLORS.textSub,
                        }}
                      >
                        {p.code || "---"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      ₹{p.price.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textSub }}>
                      {p.tax}%
                    </TableCell>
                    <TableCell align="center">
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ---------------- Stylish Add Dialog ---------------- */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "28px",
            p: 1,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color={COLORS.textMain}>
              New Product
            </Typography>
            <Typography variant="caption" color={COLORS.textSub}>
              Create a new entry in your database
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenAdd(false)}
            sx={{ bgcolor: COLORS.bg }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                variant="filled"
                sx={fieldStyle}
                value={form.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU / Code"
                name="code"
                variant="filled"
                sx={fieldStyle}
                value={form.code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                variant="filled"
                sx={fieldStyle}
                value={form.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Product Description"
                name="description"
                variant="filled"
                sx={fieldStyle}
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenAdd(false)}
            sx={{
              color: COLORS.textSub,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            onClick={handleAddProduct}
            sx={{
              bgcolor: COLORS.primary,
              fontWeight: 700,
              borderRadius: "12px",
              px: 4,
              textTransform: "none",
              boxShadow: "0 8px 16px rgba(99, 102, 241, 0.2)",
            }}
          >
            Create Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- Light Delete Dialog ---------------- */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 800,
            color: "#E11D48",
          }}
        >
          <WarningAmber /> Remove Item?
        </DialogTitle>
        <DialogContent>
          <DialogContentText color={COLORS.textSub}>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.productName}</strong>? This cannot be
            reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            sx={{ color: COLORS.textSub, fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#FB7185",
              fontWeight: 700,
              borderRadius: "10px",
              "&:hover": { bgcolor: "#E11D48" },
            }}
          >
            Delete Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
