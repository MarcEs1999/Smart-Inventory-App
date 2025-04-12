// src/components/Inventory/ListItem.js
/**
 * ListItem.js
 *
 * This component displays the inventory list using MUI's DataGrid.
 * It:
 * - Fetches inventory items in real time (using onSnapshot).
 * - Implements filtering by name, description, or barcode.
 * - Defines columns (with custom renderers for color, Edit, and Delete actions).
 * - Provides barcode scanning functionality via a modal.
 * - Supports deletion with audit logging.
 */

import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
// DataGrid for displaying items in a table layout
import { DataGrid } from "@mui/x-data-grid";
// Custom components
import EditItem from "./EditItem";
import Modal from "../UI/Modal";
import BarcodeScanning from "./BarcodeScanning";
import ZXingBarcodeScanning from "./ZXingBarcodeScanning";
import BulkOperations from "./BulkOperations";
import { Box, Button, Typography, Paper, TextField, Stack } from "@mui/material";

const ListItems = () => {
  // State for inventory items, search term, modals, and scanner mode.
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [scanningBarcode, setScanningBarcode] = useState(false);
  const [scannerMode, setScannerMode] = useState("camera");

  // Firestore subscription: Listen to changes in the 'inventory' collection in real time.
  useEffect(() => {
    const q = query(collection(db, "inventory"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setItems(fetched);
    });
    return () => unsubscribe();
  }, []);

  // Filter items based on searchTerm. It checks name, description, and barcode fields.
  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.barcode?.toLowerCase().includes(searchLower)
    );
  });

  // Opens the EditItem modal with the selected item's id.
  const handleEdit = (itemId) => {
    setEditItemId(itemId);
  };

  // Deletes an item from Firestore and creates an audit log entry.
  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // Fetch the document to retrieve the barcode (optional fallback)
        const docRef = doc(db, "inventory", itemId);
        const docSnap = await getDocs(docRef);
        let itemBarcode = null;
        if (docSnap.exists) {
          const data = docSnap.data();
          itemBarcode = data.barcode;
        }
        // Delete the document
        await deleteDoc(doc(db, "inventory", itemId));
        // Log the deletion in auditLogs
        await addDoc(collection(db, "auditLogs"), {
          action: "delete",
          itemId: itemBarcode || itemId,
          user: auth.currentUser?.uid || "unknown",
          timestamp: serverTimestamp(),
        });
        alert("Item deleted!");
      } catch (err) {
        console.error("Error deleting:", err);
        alert(err.message);
      }
    }
  };

  // Barcode scanning callback: Fetch an inventory item by its barcode.
  const handleBarcodeScanned = async (barcode) => {
    setScanningBarcode(false);
    try {
      const q = query(collection(db, "inventory"), where("barcode", "==", barcode));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setEditItemId(docSnap.id);
      } else {
        alert("No item found with that barcode.");
      }
    } catch (error) {
      console.error("Error querying barcode:", error);
      alert(error.message);
    }
  };

  // Close modals (EditItem and barcode scanner)
  const closeModal = () => {
    setEditItemId(null);
    setScanningBarcode(false);
  };

  // Define columns for the DataGrid, including custom renderers for action buttons and color circles.
  const columns = [
    {
      field: "color",
      headerName: "Color",
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: params.value || "#ffffff",
              border: "1px solid #ccc",
            }}
          />
        </Box>
      ),
    },
    { field: "name", headerName: "Name", width: 120, flex: 1 },
    { field: "quantity", headerName: "Qty", width: 80, type: "number" },
    { field: "shelf", headerName: "Shelf", width: 80 },
    { field: "bin", headerName: "Bin", width: 80 },
    {
      field: "sectionNumber",
      headerName: "Section #",
      width: 100,
    },
    {
      field: "lowStockThreshold",
      headerName: "Low Stock",
      width: 100,
      type: "number",
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      flex: 1,
    },
    { field: "barcode", headerName: "Barcode", width: 130 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      width: 70,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => handleEdit(params.row.id)}>
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row.id)}
        >
          X
        </Button>
      ),
    },
  ];

  // Returns a custom class name for rows that are considered "low stock."
  const getRowClassName = (params) => {
    const { lowStockThreshold, quantity } = params.row;
    if (lowStockThreshold != null && quantity != null && Number(quantity) <= Number(lowStockThreshold)) {
      return "low-stock-row";
    }
    return "";
  };

  return (
    <Box
      sx={{
        p: 4,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 2,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        maxWidth: "90%",
        margin: "2rem auto",
      }}
    >
      {/* Dashboard title */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 2,
          fontFamily: '"Press Start 2P", cursive',
          fontSize: "2rem",
        }}
      >
        Inventory
      </Typography>

      {/* Search input and Barcode scan button */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search by name, description, or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            sx: { color: "#fff" },
          }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
          }}
        />
        <Button variant="contained" onClick={() => setScanningBarcode(true)}>
          Scan Barcode
        </Button>
      </Stack>

      {/* Render DataGrid for the filtered and sorted inventory items */}
      <Box
        sx={{
          height: 400,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 2,
          "& .low-stock-row": {
            backgroundColor: "rgba(255, 0, 0, 0.3)",
          },
          "& .MuiDataGrid-root": {
            borderColor: "rgba(255,255,255,0.3)",
            color: "#fff",
            "--DataGrid-containerBackground": "rgba(0,0,0,0.8)",
            "& .MuiDataGrid-container--top[role='row'], & .MuiDataGrid-container--bottom[role='row']": {
              background: "rgba(0,0,0,0.8) !important",
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(0,0,0,0.8)",
            borderBottom: "2px solid rgba(255,255,255,0.6)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#fff",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgba(255,255,255,0.2)",
          },
        }}
      >
        <DataGrid
          rows={filteredItems}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          getRowClassName={getRowClassName}
          disableSelectionOnClick
        />
      </Box>

      {/* Barcode Scanner Modal */}
      {scanningBarcode && (
        <Modal onClose={() => setScanningBarcode(false)}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Scan Barcode
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <label>
              <input
                type="radio"
                value="hardware"
                checked={scannerMode === "hardware"}
                onChange={() => setScannerMode("hardware")}
              />
              Hardware
            </label>
            <label>
              <input
                type="radio"
                value="camera"
                checked={scannerMode === "camera"}
                onChange={() => setScannerMode("camera")}
              />
              Camera
            </label>
          </Stack>
          {scannerMode === "hardware" ? (
            <BarcodeScanning
              onScan={(data) => handleBarcodeScanned(data)}
              onError={(err) => {
                console.error("Hardware scan error:", err);
                setScanningBarcode(false);
              }}
            />
          ) : (
            <ZXingBarcodeScanning
              onScan={(data) => handleBarcodeScanned(data)}
              onError={(err) => {
                console.error("Camera scan error:", err);
                setScanningBarcode(false);
              }}
            />
          )}
          <Button variant="outlined" onClick={() => setScanningBarcode(false)}>
            Cancel
          </Button>
        </Modal>
      )}

      {/* Edit modal for updating an item */}
      {editItemId && (
        <Modal onClose={closeModal}>
          <EditItem itemId={editItemId} onClose={closeModal} />
        </Modal>
      )}

      {/* Bulk operations component */}
      <BulkOperations />
    </Box>
  );
};

export default ListItems;