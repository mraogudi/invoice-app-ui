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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
  TablePagination,
} from "@mui/material";

import {
  Add,
  Delete,
  Inventory,
  Close,
  WarningAmber,
} from "@mui/icons-material";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import productService from "../services/productService";

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

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(0);
  const rowsPerPage = 15;

  /* ---------------- Load ---------------- */
  useEffect(() => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Reset page when data changes */
  useEffect(() => {
    setPage(0);
  }, [products.length]);

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

  /* ---------------- Pagination Handlers ---------------- */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleFirstPage = () => setPage(0);

  const handleLastPage = () =>
    setPage(Math.max(0, Math.ceil(products.length / rowsPerPage) - 1));

  /* ---------------- UI Colors ---------------- */
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
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: COLORS.bg, p: { xs: 2, md: 6 } }}>
      {/* Header */}
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
            <Typography variant="h5" fontWeight={800}>
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
            fontWeight: 700,
            borderRadius: "14px",
            px: 4,
          }}
        >
          Add Product
        </Button>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2, borderRadius: "24px", border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>PRODUCT NAME</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SKU CODE</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>PRICE</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TAX</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress sx={{ my: 4 }} />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Products Available
                  </TableCell>
                </TableRow>
              ) : (
                products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <TableRow key={p.id} sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>
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
                          }}
                        >
                          {p.code || "---"}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700 }}>
                        ₹{p.price.toLocaleString()}
                      </TableCell>

                      <TableCell>{p.tax}%</TableCell>

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
                            "&:hover": {
                              color: "#E11D48",
                              bgcolor: "#FFF1F2",
                            },
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

        {/* Pagination */}
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={15}
          rowsPerPageOptions={[15]}
          ActionsComponent={() => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleFirstPage} disabled={page === 0}>
                <FirstPageIcon />
              </IconButton>

              <IconButton
                onClick={(e) => handleChangePage(e, page - 1)}
                disabled={page === 0}
              >
                <KeyboardArrowLeft />
              </IconButton>

              <IconButton
                onClick={(e) => handleChangePage(e, page + 1)}
                disabled={
                  page >= Math.ceil(products.length / rowsPerPage) - 1
                }
              >
                <KeyboardArrowRight />
              </IconButton>

              <IconButton
                onClick={handleLastPage}
                disabled={
                  page >= Math.ceil(products.length / rowsPerPage) - 1
                }
              >
                <LastPageIcon />
              </IconButton>
            </Box>
          )}
        />
      </Paper>

      {/* Delete Dialog (UNCHANGED STYLE) */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmber color="error" /> Remove Item?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.productName}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({ ...deleteDialog, open: false })
            }
          >
            Cancel
          </Button>

          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}