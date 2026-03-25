import { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination, // ✅ Added
} from "@mui/material";

import { Add, Delete, Person } from "@mui/icons-material";
import clientService from "../services/clientService";

export default function Clients() {
  const nav = useNavigate();

  /* ---------------- State ---------------- */

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);

  /* ---------------- Load Clients ---------------- */

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Pagination ---------------- */

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setPage(0);
  }, [clients]);

  const paginatedClients = clients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  /* ---------------- Delete ---------------- */

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setClients(clients.filter((c) => c.id !== selectedClient.id));
      setDeleteDialog(false);
      setSelectedClient(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Styles ---------------- */

  const cardStyle = {
    p: 3,
    mb: 3,
    borderRadius: 4,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  };

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
            <Person sx={{ color: "#4f46e5" }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Customers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your customers
              </Typography>
            </Box>
          </Box>

          {clients.length !== 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => nav("/add-customer")}
              sx={{
                bgcolor: "#6366f1",
                fontWeight: 600,
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              Add Customer
            </Button>
          )}
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={cardStyle}>
        <Typography fontWeight={600} mb={2} color="primary">
          Customer List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f7ff" }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {client.name}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.address}</TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Tooltip title={`Delete '${client.name}'`}>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(client)}
                          sx={{
                            color: "#dc2626",
                            bgcolor: "#fef2f2",
                            "&:hover": {
                              bgcolor: "#fee2e2",
                              transform: "scale(1.1)",
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

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
          <TablePagination
            component="div"
            count={clients.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[15]}
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>

      {/* Custom Delete Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>
          ⚠ Confirm Deletion
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            <Typography fontWeight={500}>
              Are you sure you want to delete
              <strong> {selectedClient?.name}</strong>?
            </Typography>

            <Typography fontSize={13} color="text.secondary" mt={1}>
              This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
