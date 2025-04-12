// src/components/UI/NavBar.js
/**
 * NavBar.js
 *
 * This component renders the application's top navigation bar.
 * It displays the app logo, the app title ("StockFlow"), and
 * navigation buttons linking to the Dashboard as well as a Logout button.
 * The Logout button triggers Firebase's signOut function and redirects the user to the login page.
 */

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Logo from "../Images/Logo_W_Name.png";

const NavBar = () => {
  // useNavigate is used to programmatically redirect the user after logout.
  const navigate = useNavigate();

  // handleLogout signs the user out using Firebase Auth and navigates to the login page.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AppBar
      position="static" // For a sticky header, consider position="sticky"
      sx={{
        backgroundColor: "#181818", // Dark background color
        boxShadow: "0 2px 4px rgba(0,0,0,0.5)", // Subtle shadow for depth
      }}
    >
      <Toolbar>
        {/* App Logo */}
        <img
          src={Logo}
          alt="StockFlow Logo"
          style={{
            width: 40,
            marginRight: 8,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        {/* App Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1, // This ensures the title expands and pushes the buttons to the right.
            color: "#fff",
            fontFamily: '"Press Start 2P", cursive',
          }}
        >
          StockFlow
        </Typography>
        {/* Navigation Button to Dashboard */}
        <Button
          color="inherit"
          component={Link}
          to="/dashboard"
          sx={{ color: "#fff" }}
        >
          Dashboard
        </Button>
        {/* Logout Button */}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{ color: "#fff" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;