// src/components/Inventory/BulkOperations.js
import React from "react";
import Papa from "papaparse";
import { db } from "../../firebase";
import {
  collection,
  getDocs
} from "firebase/firestore";

const BulkOperations = () => {
  // Export CSV only
  const handleExport = async () => {
    try {
      const snapshot = await getDocs(collection(db, "inventory"));
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      const fields = [
        "name",
        "quantity",
        "shelf",
        "bin",
        "sectionNumber",
        "lowStockThreshold",
        "description",
        "barcode",
      ];

      const csv = Papa.unparse({
        fields,
        data: items,
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      alert(err.message);
    }
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3></h3>
      <button onClick={handleExport} style={{ marginRight: "1rem" }}>
        Export (csv)
      </button>
    </div>
  );
};

export default BulkOperations;