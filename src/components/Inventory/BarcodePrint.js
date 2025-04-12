// src/components/Inventory/BarcodePrint.js
import React from "react";
import Barcode from "react-barcode";
import { Box, Typography } from "@mui/material";

const BarcodePrint = ({ barcode }) => {
  // The container style approximates a 2.25" x 1.25" label at 216px by 120px.
  const containerStyle = {
    width: "216px",
    height: "120px",
    margin: "0 auto",
    border: "1px solid #000",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  };

  return (
    <Box id="printable" sx={containerStyle}>
      <Barcode value={barcode} />
      <Typography variant="caption" sx={{ mt: 1, color: "#000" }}>
        {barcode}
      </Typography>
    </Box>
  );
};

export default BarcodePrint;