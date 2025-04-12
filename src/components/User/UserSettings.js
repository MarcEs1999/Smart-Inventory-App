// src/components/User/UserSettings.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const UserSettings = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Effective UID: either the param or the current user's
  const effectiveUid = uid || auth.currentUser?.uid;

  // Local state for form fields
  const [displayName, setDisplayName] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!effectiveUid) {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", effectiveUid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserData(data);
          setDisplayName(data.displayName || "");
          setDob(data.dob || "");
          setRole(data.role || "employee");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [effectiveUid]);

  const handleSave = async () => {
    if (!effectiveUid) return;
    try {
      const docRef = doc(db, "users", effectiveUid);
      await updateDoc(docRef, {
        displayName,
        dob,
        role,
      });
      alert("User info updated!");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user data:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 2 }}>
        Loading user info...
      </Typography>
    );
  }
  if (!userData) {
    return (
      <Typography sx={{ textAlign: "center", mt: 2 }}>
        No user data found.
      </Typography>
    );
  }

  // If admin is editing a different user
  const isAdminEditingOtherUser = uid && uid !== auth.currentUser?.uid;

  return (
    <Box
      sx={{
        p: 4,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 2,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        maxWidth: 600,
        margin: "2rem auto",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          fontFamily: '"Press Start 2P", cursive',
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        User Settings {isAdminEditingOtherUser && "(Admin View)"}
      </Typography>

      {!editMode ? (
        <Box>
          <Typography sx={{ mb: 1 }}>
            <strong>Display Name:</strong>{" "}
            {userData.displayName || "N/A"}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Date of Birth:</strong> {userData.dob || "N/A"}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Email:</strong> {userData.email || "N/A"}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Role:</strong> {userData.role || "employee"}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setEditMode(true)}
            sx={{ mt: 2 }}
          >
            Edit
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          <TextField
            label="Display Name"
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
              },
              input: { color: "#fff" },
              label: { color: "#ccc" },
            }}
          />
          <TextField
            label="Date of Birth"
            variant="outlined"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
              },
              input: { color: "#fff" },
              label: { color: "#ccc" },
            }}
          />
          <Typography sx={{ color: "#fff" }}>
            <strong>Email:</strong> {userData.email || "N/A"}
          </Typography>

          {/* If an admin is editing someone else or the user is admin, allow role change */}
          {(isAdminEditingOtherUser || userData.role === "admin") && (
            <FormControl
              fullWidth
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                },
                "& .MuiFormLabel-root": { color: "#ccc" },
              }}
            >
              <InputLabel sx={{ color: "#ccc" }}>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                sx={{ color: "#fff" }}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default UserSettings;