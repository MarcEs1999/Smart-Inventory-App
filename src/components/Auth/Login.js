// src/components/Auth/Login.js
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import Logo from "../Images/Logo_W_Name.png";
import BgImage from "../Images/bg-image.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserRole(userData.role);
        alert(`Logged in as ${userData.role}`);
      } else {
        setUserRole(null);
        alert("No additional user info found in Firestore.");
      }

      navigate("/dashboard");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
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
            Login
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleLogin}
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
            InputLabelProps={{ sx: { color: "#333" } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputLabelProps={{ sx: { color: "#333" } }}
          />
          {/* Added Forgot Password Link */}
          <Typography variant="body2" align="right">
            <Link to="/reset" style={{ textDecoration: "none", color: "#333" }}>
              Forgot Password?
            </Link>
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              component={Link}
              to="/register"
              variant="text"
              sx={{ textTransform: "none", color: "#333" }}
            >
              Register
            </Button>
            <Button variant="contained" type="submit">
              Sign In
            </Button>
          </Stack>
        </Box>

        {userRole && (
          <Typography sx={{ mt: 2, color: "#333" }}>
            Current user's role: <strong>{userRole}</strong>
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login;