// src/components/Auth/PasswordReset.js
import React, { useState } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

// Same images as in Login/Register
import Logo from "../Images/Logo_W_Name.png";
import BgImage from "../Images/bg-image.png";

const PasswordReset = () => {
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage(`A reset link has been sent to ${resetEmail}.`);
      setResetEmail("");
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          zIndex: -1,
        },
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 350,
          boxShadow: 4,
          borderRadius: 2,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            component="img"
            src={Logo}
            alt="App Logo"
            sx={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              objectFit: "cover",
              mb: 1,
              filter: "drop-shadow(0 0 4px rgba(0,0,0,1))",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#333",
              mb: 0,
              fontFamily: '"Press Start 2P", cursive',
              fontSize: "1.75rem",
            }}
          >
            StockFlow
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 1,
              color: "#333",
              fontFamily: '"Press Start 2P", cursive',
              fontSize: "1.25rem",
            }}
          >
            Reset Password
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleReset}
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your email"
            required
            fullWidth
          />
          <Button variant="contained" type="submit">
            Send Reset Email
          </Button>
        </Box>

        {message && (
          <Typography sx={{ mt: 2, color: "#333" }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PasswordReset;