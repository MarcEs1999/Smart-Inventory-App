// src/components/Reports/UsageHelper.js
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

// Returns an array of updates for the given item (by barcode)
// Sorted in ascending order by timestamp.
export async function fetchQuantityTimeline(itemId) {
  const q = query(collection(db, "auditLogs"), orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  const timeline = [];
  snapshot.forEach((docSnap) => {
    const log = docSnap.data();
    if (
      log.action === "update" &&
      log.itemId === itemId &&
      log.newData &&
      log.timestamp
    ) {
      const newQty = parseInt(log.newData.quantity || 0, 10);
      const dateStr = new Date(log.timestamp.seconds * 1000).toLocaleString();
      timeline.push({ dateStr, newQty });
    }
  });
  return timeline;
}

// Returns an array of update logs with both old and new quantities.
export async function fetchAllUpdatesForItem(itemId) {
  const q = query(collection(db, "auditLogs"), orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);
  const logs = [];
  snapshot.forEach((docSnap) => {
    const log = docSnap.data();
    if (
      log.action === "update" &&
      log.itemId === itemId &&
      log.oldData &&
      log.newData &&
      log.timestamp
    ) {
      const oldQty = parseInt(log.oldData.quantity || 0, 10);
      const newQty = parseInt(log.newData.quantity || 0, 10);
      const dateStr = new Date(log.timestamp.seconds * 1000).toLocaleString();
      logs.push({ dateStr, oldQty, newQty });
    }
  });
  return logs;
}