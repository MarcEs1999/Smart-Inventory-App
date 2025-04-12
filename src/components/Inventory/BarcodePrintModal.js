// src/components/Inventory/BarcodePrintModal.js
import React from "react";
import Modal from "../UI/Modal";
import BarcodePrint from "./BarcodePrint";
import { Box, Typography, Button } from "@mui/material";

const BarcodePrintModal = ({ barcode, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal onClose={onClose}>
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontFamily: '"Press Start 2P", cursive',
            color: "#000",
          }}
        >
          Barcode Print Preview
        </Typography>
        <BarcodePrint barcode={barcode} />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handlePrint} sx={{ mr: 2 }}>
            Print
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BarcodePrintModal;