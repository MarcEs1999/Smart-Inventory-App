// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2d3748" }, // dark blue-gray, can be used for NavBar and Sidebar
    secondary: { main: "#3182ce" }, // bright blue accent
    background: { default: "#ffffff" }, // light background
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

export default theme;