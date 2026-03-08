import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";

import {
  ArrowBack,
  PersonAdd,
  Save,
} from "@mui/icons-material";

export default function CreateClient() {

  const nav = useNavigate();

  /* ---------------- State ---------------- */

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });


  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {

    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = () => {

    console.log("Client Payload:", client);

    // Call API
    // clientService.createClient(client);

    alert("Client created (Demo)");

    nav("/clients");
  };



  /* ---------------- Shared Styles ---------------- */

  const cardStyle = {
    p: 4,
    borderRadius: 4,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.07)",
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
          background:
            "linear-gradient(135deg,#e0e7ff,#f5f3ff)",
        }}
      >

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >

          <IconButton onClick={() => nav(-1)}>
            <ArrowBack />
          </IconButton>


          <Avatar
            sx={{
              bgcolor: "#6366f1",
              width: 44,
              height: 44,
            }}
          >
            <PersonAdd />
          </Avatar>


          <Box>

            <Typography variant="h5" fontWeight={700}>
              Create Client
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Add a new customer profile
            </Typography>

          </Box>

        </Box>

      </Paper>



      {/* ---------------- Form ---------------- */}

      <Paper sx={cardStyle}>

        <Typography
          fontWeight={600}
          mb={3}
          color="primary"
        >
          Customer Information
        </Typography>

        <Grid container spacing={3}>

          {/* Name */}
          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={client.name}
              onChange={handleChange}
              placeholder="John Doe"
              sx={{
                bgcolor: "white",
                borderRadius: 2,
              }}
            />

          </Grid>


          {/* Email */}
          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              type="email"
              label="Email Address"
              name="email"
              value={client.email}
              onChange={handleChange}
              placeholder="john@email.com"
              sx={{
                bgcolor: "white",
                borderRadius: 2,
              }}
            />

          </Grid>


          {/* Phone */}
          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={client.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              sx={{
                bgcolor: "white",
                borderRadius: 2,
              }}
            />

          </Grid>


          {/* Address */}
          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Address"
              name="address"
              value={client.address}
              onChange={handleChange}
              placeholder="Street, City, State, Pincode"
              sx={{
                bgcolor: "white",
                borderRadius: 2,
              }}
            />

          </Grid>

        </Grid>



        {/* Divider */}
        <Divider sx={{ my: 4 }} />



        {/* ---------------- Actions ---------------- */}

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >

          <Button
            variant="outlined"
            onClick={() => nav(-1)}
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            startIcon={<Save />}
            sx={{
              bgcolor: "#6366f1",
              fontWeight: 600,

              "&:hover": {
                bgcolor: "#4f46e5",
              },
            }}
            onClick={handleSubmit}
          >
            Save Customer
          </Button>

        </Box>

      </Paper>

    </Box>
  );
}
