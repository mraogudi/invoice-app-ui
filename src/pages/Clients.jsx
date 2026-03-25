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
} from "@mui/material";

import { Add, Delete, Edit, Person } from "@mui/icons-material";
import clientService from "../services/clientService";

// import clientService from "../services/ClientService";

export default function Clients() {
  const nav = useNavigate();

  /* ---------------- State ---------------- */

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

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

  /* ---------------- Delete ---------------- */

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // await clientService.deleteClient(selectedClient.id);

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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f9fc",
        p: 2,
      }}
    >
      {/* ---------------- Header ---------------- */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg,#e0e7ff,#f5f3ff)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
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

                "&:hover": {
                  bgcolor: "#4f46e5",
                },
              }}
            >
              Add Customer
            </Button>
          )}
          ;
        </Box>
      </Paper>

      {/* ---------------- Client Table ---------------- */}

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
              {/* Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {/* Empty */}
              {!loading && clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box
                      sx={{
                        py: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        color: "#94A3B8",
                      }}
                    >
                      <Person sx={{ fontSize: 40, opacity: 0.4 }} />

                      <Typography fontWeight={600}>
                        No Customers Available
                      </Typography>

                      <Typography fontSize={13}>
                        You haven't added any customers yet
                      </Typography>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => nav("/add-customer")}
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          textTransform: "none",
                          bgcolor: "#6366f1",
                          "&:hover": { bgcolor: "#4f46e5" },
                        }}
                      >
                        Add Customer
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Data */}
              {!loading &&
                clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {client.name}
                    </TableCell>

                    <TableCell>{client.email}</TableCell>

                    <TableCell>{client.phone}</TableCell>

                    <TableCell>{client.address}</TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      {/* Delete */}
                      <Tooltip title="Delete Client">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(client)}
                          sx={{
                            color: "#dc2626",
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

      {/* ---------------- Delete Dialog ---------------- */}

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={600}>Delete Client</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete
            <strong> {selectedClient?.name}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
