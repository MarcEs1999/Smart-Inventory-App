// src/components/Auth/Register.js
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

// Same images used in Login
import Logo from "../Images/Logo_W_Name.png";
import BgImage from "../Images/bg-image.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState(""); // for deciding admin vs. employee

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Decide role based on adminKey
      let userRole = "employee";
      if (adminKey === "12345") {
        userRole = "admin";
      }

      // Store user doc in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role: userRole,
        createdAt: serverTimestamp(),
      });

      alert(`Registered as ${userRole}`);
      setEmail("");
      setPassword("");
      setAdminKey("");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
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
        // Blurred background from same bg-image
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
            Register
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleRegister}
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Admin Key (optional)"
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter 12345 if admin"
            fullWidth
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button variant="text" component={Link} to="/login" sx={{ color: "#333" }}>
              ALREADY HAVE AN ACCOUNT?
            </Button>
            <Button variant="contained" type="submit">
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;