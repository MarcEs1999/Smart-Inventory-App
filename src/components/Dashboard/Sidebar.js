// src/components/Dashboard/Sidebar.js
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

export const drawerWidthExpanded = 200;
export const drawerWidthCollapsed = 60;

const Sidebar = ({ isAdmin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);

  const currentWidth = open ? drawerWidthExpanded : drawerWidthCollapsed;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={true}
      onClose={() => {}}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "fixed",
          top: "64px",         
          bottom: 0,            
          left: 0,
          width: currentWidth,
          boxSizing: "border-box",
          backgroundColor: "#181818",
          backdropFilter: "blur(4px)",
          color: "#222",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
    >
      <List>
        {/* Toggle Button */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <IconButton onClick={toggleDrawer} sx={{ color: "#fff" }}>
            <MenuIcon />
          </IconButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard/add-item">
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: 0,
                mr: open ? 1 : 0,
                justifyContent: "center",
              }}
            >
              <AddIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Add" primaryTypographyProps={{ color: "#fff" }} />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard/inventory">
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: 0,
                mr: open ? 1 : 0,
                justifyContent: "center",
              }}
            >
              <Inventory2Icon />
            </ListItemIcon>
            {open && <ListItemText primary="Inventory" primaryTypographyProps={{ color: "#fff" }} />}
          </ListItemButton>
        </ListItem>

        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard/audit">
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: 0,
                    mr: open ? 1 : 0,
                    justifyContent: "center",
                  }}
                >
                  <EditIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Audit" primaryTypographyProps={{ color: "#fff" }} />}
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard/reports">
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: 0,
                    mr: open ? 1 : 0,
                    justifyContent: "center",
                  }}
                >
                  <BarChartIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Reports" primaryTypographyProps={{ color: "#fff" }} />}
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard/users">
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: 0,
                    mr: open ? 1 : 0,
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Users" primaryTypographyProps={{ color: "#fff" }} />}
              </ListItemButton>
            </ListItem>
          </>
        )}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard/settings">
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: 0,
                mr: open ? 1 : 0,
                justifyContent: "center",
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Settings" primaryTypographyProps={{ color: "#fff" }} />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;