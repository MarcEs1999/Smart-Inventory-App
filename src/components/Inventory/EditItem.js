// src/components/Inventory/EditItem.js
/**
 * EditItem.js
 * 
 * This component renders a modal form that allows users to update an existing inventory item.
 * - It fetches the current item data from Firestore and stores it as both `itemData` and `oldData`.
 * - When the form is submitted, it validates the quantity and low-stock threshold, updates Firestore,
 *   and logs the change by writing both the old and new data to the 'auditLogs' collection.
 * - A BarcodePrintModal can be triggered from here for printing the item's barcode.
 */

import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import BarcodePrintModal from "./BarcodePrintModal";

const EditItem = ({ itemId, onClose }) => {
  // itemData holds the current form values, and oldData is used to log changes
  const [itemData, setItemData] = useState(null);
  const [oldData, setOldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(false);

  // Fetch the current item from Firestore upon component mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "inventory", itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemData(data);
          setOldData(data); // Save the original data for diff logging
        }
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchItem();
  }, [itemId]);

  // handleUpdate validates updated fields and writes changes to Firestore,
  // then logs the update to the 'auditLogs' collection along with old data.
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Validate quantity
      const updatedQuantity = parseInt(itemData.quantity, 10);
      if (isNaN(updatedQuantity) || updatedQuantity < 0) {
        alert("Quantity must be a non-negative number!");
        return;
      }

      // Validate lowStockThreshold if provided
      let updatedThreshold = null;
      if (itemData.lowStockThreshold !== "" && itemData.lowStockThreshold !== undefined) {
        const parsedThresh = parseInt(itemData.lowStockThreshold, 10);
        if (!isNaN(parsedThresh) && parsedThresh >= 0) {
          updatedThreshold = parsedThresh;
        } else {
          alert("Low stock threshold must be a non-negative number!");
          return;
        }
      }

      // Update the item in Firestore
      const docRef = doc(db, "inventory", itemId);
      await updateDoc(docRef, {
        ...itemData,
        quantity: updatedQuantity,
        lowStockThreshold: updatedThreshold,
      });

      // Log the update with both old and new data in the 'auditLogs' collection
      await addDoc(collection(db, "auditLogs"), {
        action: "update",
        itemId: itemData.barcode, // Using barcode as the item identifier
        user: auth.currentUser?.uid || "unknown",
        timestamp: serverTimestamp(),
        oldData: oldData,
        newData: { ...itemData },
      });

      alert("Item updated!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading item data...</p>;
  if (!itemData) return <p>Item not found.</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "1rem auto" }}>
      <h2>Edit Item</h2>
      <form onSubmit={handleUpdate}>
        {/* Name field */}
        <div>
          <label>Name</label>
          <input
            value={itemData.name || ""}
            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
          />
        </div>

        {/* Quantity field */}
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={itemData.quantity || 0}
            onChange={(e) => setItemData({ ...itemData, quantity: e.target.value })}
          />
        </div>

        {/* Shelf field */}
        <div>
          <label>Shelf</label>
          <input
            value={itemData.shelf || ""}
            onChange={(e) => setItemData({ ...itemData, shelf: e.target.value })}
          />
        </div>

        {/* Bin field */}
        <div>
          <label>Bin</label>
          <input
            value={itemData.bin || ""}
            onChange={(e) => setItemData({ ...itemData, bin: e.target.value })}
          />
        </div>

        {/* Section Number field */}
        <div>
          <label>Section #</label>
          <input
            value={itemData.sectionNumber || ""}
            onChange={(e) => setItemData({ ...itemData, sectionNumber: e.target.value })}
          />
        </div>

        {/* Low Stock Threshold field */}
        <div>
          <label>Low Stock Threshold</label>
          <input
            type="number"
            value={itemData.lowStockThreshold || ""}
            onChange={(e) => setItemData({ ...itemData, lowStockThreshold: e.target.value })}
          />
        </div>

        {/* Description field */}
        <div>
          <label>Description</label>
          <input
            value={itemData.description || ""}
            onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
          />
        </div>

        {/* Barcode field */}
        <div>
          <label>Barcode</label>
          <input
            value={itemData.barcode || ""}
            onChange={(e) => setItemData({ ...itemData, barcode: e.target.value })}
          />
        </div>

        {/* Color field */}
        <div>
          <label>Color</label>
          <input
            type="color"
            value={itemData.color || "#ffffff"}
            onChange={(e) => setItemData({ ...itemData, color: e.target.value })}
          />
        </div>

        {/* Save and Print buttons */}
        <button type="submit">Save Changes</button>
        <button
          type="button"
          onClick={() => setShowPrint(true)}
          style={{ marginLeft: "1rem" }}
        >
          Print Barcode
        </button>
      </form>

      {/* Trigger the barcode print modal if showPrint is true */}
      {showPrint && (
        <BarcodePrintModal
          barcode={itemData.barcode}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
};

export default EditItem;