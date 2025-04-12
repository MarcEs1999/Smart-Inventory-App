// src/components/Inventory/AddItem.js
/**
 * AddItem.js
 * 
 * This component renders a form for adding a new inventory item.
 * It validates the input, saves the item to Firestore (in the 'inventory' collection),
 * and logs the creation event to the 'auditLogs' collection.
 * 
 * The form uses Material-UI components styled with a dark frosted theme.
 */

import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";

const AddItem = () => {
  // Define state for each input field in the form.
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shelf, setShelf] = useState("");
  const [bin, setBin] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [color, setColor] = useState("#ffffff");

  // handleAddItem: Called when the form is submitted.
  // It validates the input, writes the new item to Firestore, and logs the action.
  const handleAddItem = async (e) => {
    e.preventDefault();

    // Validate quantity input.
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      alert("Quantity must be a non-negative number!");
      return;
    }

    // Validate low stock threshold if provided.
    const threshold = parseInt(lowStockThreshold, 10);
    if (lowStockThreshold !== "" && (isNaN(threshold) || threshold < 0)) {
      alert("Low stock threshold must be a non-negative number!");
      return;
    }

    try {
      // Create a new inventory document in Firestore.
      await addDoc(collection(db, "inventory"), {
        name: itemName,
        quantity: qty,
        shelf,
        bin,
        sectionNumber,
        lowStockThreshold: !isNaN(threshold) ? threshold : null,
        description,
        barcode,
        color,
        createdBy: auth.currentUser?.uid || null,
        createdAt: serverTimestamp(),
      });

      // Log the item creation in the auditLogs collection.
      await addDoc(collection(db, "auditLogs"), {
        action: "create",
        itemId: barcode, // Using barcode as the item identifier.
        user: auth.currentUser?.uid || "unknown",
        timestamp: serverTimestamp(),
        newData: {
          name: itemName,
          quantity: qty,
          shelf,
          bin,
          sectionNumber,
          lowStockThreshold: !isNaN(threshold) ? threshold : null,
          description,
          barcode,
          color,
        },
      });

      // Clear form fields after successful submission.
      setItemName("");
      setQuantity("");
      setShelf("");
      setBin("");
      setSectionNumber("");
      setLowStockThreshold("");
      setDescription("");
      setBarcode("");
      setColor("#ffffff");

      alert(`Item (“${itemName}”) added successfully!`);
    } catch (error) {
      console.error("Error adding item:", error);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "1rem auto", // Centers the container with modest margin
        color: "#fff",
        p: 4,
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 2,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Title placed above the form for clarity */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 3,
          fontFamily: '"Press Start 2P", cursive',
          fontSize: "1.75rem",
        }}
      >
        Add New Inventory Item
      </Typography>

      {/* Form to add a new item */}
      <Box
        component="form"
        onSubmit={handleAddItem}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          variant="outlined"
          fullWidth
          required
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Shelf"
          value={shelf}
          onChange={(e) => setShelf(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Bin"
          value={bin}
          onChange={(e) => setBin(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Section #"
          value={sectionNumber}
          onChange={(e) => setSectionNumber(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Low Stock Threshold"
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <TextField
          label="Barcode (Item #)"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          variant="outlined"
          fullWidth
          required
          InputProps={{ sx: { color: "#fff" } }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            Color:
          </Typography>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              p: 1,
              borderRadius: 1,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "50px",
                height: "30px",
                cursor: "pointer",
                background: "transparent",
                border: "none",
              }}
            />
          </Box>
        </Stack>

        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Add Item
        </Button>
      </Box>
    </Box>
  );
};

export default AddItem;