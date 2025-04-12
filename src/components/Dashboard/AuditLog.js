// src/components/Dashboard/AuditLog.js
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/** Helper function to remove certain fields (like createdAt)
 * from oldData/newData if you wish.
 */
function stripUnwanted(obj) {
  if (!obj) return obj;
  const copy = { ...obj };
  delete copy.createdAt; // remove if not relevant
  return copy;
}

/** Example function to render object fields in a small table-like style. */
function renderObjFields(currentObj, oldObj = null) {
  if (!currentObj) return null;

  // Choose the keys you want in a specific order
  const keys = [
    "name",
    "quantity",
    "description",
    "shelf",
    "bin",
    "sectionNumber",
    "barcode",
    "color",
    "lowStockThreshold",
  ];
  const labels = {
    name: "Name",
    quantity: "Quantity",
    description: "Description",
    shelf: "Shelf",
    bin: "Bin",
    sectionNumber: "Section",
    barcode: "Barcode",
    color: "Color",
    lowStockThreshold: "Low Stock",
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 0.5,
        columnGap: 2,
      }}
    >
      {keys.map((k) => {
        if (!(k in currentObj)) return null;
        let displayValue = currentObj[k];
        // highlight changed fields if oldObj is provided
        let highlight = {};
        if (oldObj && String(displayValue) !== String(oldObj[k])) {
          highlight = { backgroundColor: "rgba(144, 238, 144, 0.3)" };
        }
        const label = labels[k] || k;

        // If color field, maybe show a small color swatch
        if (k === "color") {
          return (
            <React.Fragment key={k}>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#ddd" }}>
                {label}:
              </Typography>
              <Box
                sx={{
                  px: 1,
                  ...highlight,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    border: "1px solid #ccc",
                    backgroundColor: displayValue,
                    marginRight: 1,
                  }}
                />
                <Typography variant="body2">{displayValue}</Typography>
              </Box>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={k}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#ddd" }}>
              {label}:
            </Typography>
            <Box sx={{ px: 1, ...highlight }}>
              <Typography variant="body2">{String(displayValue)}</Typography>
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
}

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setLogs(fetchedLogs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Example: fetching user display names from /users collection
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const map = {};
      snap.forEach((ds) => {
        map[ds.id] = ds.data();
      });
      setUsersMap(map);
    };
    fetchUsers();
  }, []);

  const renderUserName = (uid) => {
    if (!uid) return "Unknown User";
    if (usersMap[uid]?.displayName) {
      return usersMap[uid].displayName;
    }
    return uid; // fallback
  };

  const renderUpdateDetails = (log) => {
    const oldCopy = stripUnwanted(log.oldData);
    const newCopy = stripUnwanted(log.newData);
    return (
      <Accordion sx={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            View Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "#bbb", mb: 1 }}>
                Original
              </Typography>
              {renderObjFields(oldCopy)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "#bbb", mb: 1 }}>
                Adjustment
              </Typography>
              {renderObjFields(newCopy, oldCopy)}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderCard = (log) => {
    const oldCopy = stripUnwanted(log.oldData);
    const newCopy = stripUnwanted(log.newData);

    const timeString = log.timestamp
      ? new Date(log.timestamp.seconds * 1000).toLocaleString()
      : "";

    return (
      <Card
        key={log.id}
        sx={{
          mb: 2,
          border: "1px solid rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#fff",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip
                label={log.action || "Unknown"}
                color={log.action === "update" ? "primary" : "secondary"}
                variant="filled"
                sx={{ fontWeight: "bold" }}
              />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Item ID: {log.itemId}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                By: {renderUserName(log.user)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              {timeString}
            </Typography>
          </Stack>

          {/* If it's an update with oldData/newData, show details in an Accordion */}
          {log.action === "update" && oldCopy && newCopy ? (
            renderUpdateDetails(log)
          ) : (
            // For create/delete or if oldData missing, show single details
            <Box sx={{ mt: 1 }}>
              {renderObjFields(stripUnwanted(log.newData || log.updatedData))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
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
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 3,
          fontFamily: '"Press Start 2P", cursive',
          fontSize: "2rem",
        }}
      >
        Audit Log
      </Typography>

      {logs.length === 0 ? (
        <Typography variant="body1">No audit log entries available.</Typography>
      ) : (
        logs.map((log) => renderCard(log))
      )}
    </Box>
  );
}