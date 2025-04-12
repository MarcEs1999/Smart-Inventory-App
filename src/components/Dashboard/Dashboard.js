// src/components/Dashboard/Dashboard.js
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// Material-UI icons for the dashboard tiles
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

// Import route components (inventory, settings, etc.)
import AddItem from "../Inventory/AddItem";
import ListItem from "../Inventory/ListItem";
import UserSettings from "../User/UserSettings";
import AuditLog from "./AuditLog";
import AdminUserManagement from "../User/AdminUserManagement";
import UsageReports from "../Reports/UsageReports";

// Import UI components: NavBar and Sidebar
import NavBar from "../UI/NavBar";
import Sidebar from "./Sidebar";

// Background image for the dashboard
import BgImage from "../Images/bg-image.png";

/**
 * HomeDashboard component
 * - Displays the dashboard landing page with tiles for navigation.
 * - Each tile is clickable and navigates to a specific sub-route.
 */
const HomeDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Define the dashboard tiles with label, icon, and route path.
  const tiles = [
    { label: "Add Item", icon: <AddIcon fontSize="large" />, path: "add-item" },
    { label: "Inventory", icon: <Inventory2Icon fontSize="large" />, path: "inventory" },
    { label: "Audit", icon: <EditIcon fontSize="large" />, path: "audit" },
    { label: "Reports", icon: <BarChartIcon fontSize="large" />, path: "reports" },
    { label: "Settings", icon: <SettingsIcon fontSize="large" />, path: "settings" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 2,
          color: "#f0f0f0",
          fontFamily: '"Press Start 2P", cursive',
          fontSize: "2.5rem",
        }}
      >
        Home
      </Typography>

      <Typography
        variant="body1"
        align="center"
        sx={{
          mb: 3,
          color: "#e0e0e0",
          fontSize: "1rem",
          fontFamily: '"Press Start 2P", cursive',
        }}
      >
        Welcome! Select an option below or use the sidebar.
      </Typography>

      {/* Dashboard Tiles: clickable Paper components */}
      <Grid container spacing={4} justifyContent="center">
        {tiles.map((tile) => (
          <Grid item key={tile.label}>
            <Paper
              elevation={6}
              sx={{
                width: 160,
                height: 160,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                background: "linear-gradient(135deg, #4b4b4b 0%, #bfbfbf 100%)",
                color: "#111",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 12,
                  transform: "scale(1.05)",
                  background: "linear-gradient(135deg, #5c5c5c 0%, #d0d0d0 100%)",
                },
                "& .MuiSvgIcon-root": {
                  color: "#111",
                  fontSize: "2rem",
                },
              }}
              onClick={() => navigate(`/dashboard/${tile.path}`)}
            >
              <Stack spacing={1} alignItems="center">
                {tile.icon}
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#111" }}>
                  {tile.label}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

/**
 * Dashboard component
 * - Wraps the whole dashboard layout.
 * - Includes a fixed NavBar at the top, a Sidebar on the left, and a main content area.
 * - The background uses a blurred image for a modern look.
 */
const Dashboard = () => {
  const [isAdmin] = useState(true); // For demo purposes; in a real app, derive this from user auth.
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        // Blurred background image covering entire viewport
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
      <NavBar /> {/* Fixed top navigation bar */}

      {/* Container for Sidebar and main content */}
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)", position: "relative", zIndex: 1 }}>
        <Sidebar isAdmin={isAdmin} />

        {/* Main content area where routes are rendered */}
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: "0px",
            p: 2,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 2,
            minHeight: "calc(100vh - 64px)",
            overflow: "auto",
          }}
        >
          <Routes>
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/inventory" element={<ListItem />} />
            {isAdmin && <Route path="/audit" element={<AuditLog />} />}
            {isAdmin && (
              <>
                <Route path="/users" element={<AdminUserManagement />} />
                <Route path="/users/:uid" element={<UserSettings />} />
              </>
            )}
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/reports" element={<UsageReports />} />
            <Route path="/" element={<HomeDashboard />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;