// src/components/UI/Modal.js
import React from "react";
import { Box, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Modal({ children, onClose }) {
  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        top: 90,
        left: 0,
        right: 0,
        bottom: 30,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Paper
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "relative",
          p: 3,
          width: { xs: "90%", sm: "400px" },
          maxWidth: "90%",
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "grey.700",
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Paper>
    </Box>
  );
}