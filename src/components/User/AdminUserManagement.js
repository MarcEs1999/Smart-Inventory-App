// src/components/User/AdminUserManagement.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const allUsers = [];
        snap.forEach((docSnap) => {
          allUsers.push({ uid: docSnap.id, ...docSnap.data() });
        });
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

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
        User Management
      </Typography>

      {users.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          No users found.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "rgba(255,255,255,0.05)",
            boxShadow: 3,
            borderRadius: 1,
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: "rgba(0,0,0,0.8)",
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell sx={{ color: "#fff" }}>
                    {user.displayName || user.uid}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {user.email || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {user.role || "employee"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      component={Link}
                      to={`/dashboard/users/${user.uid}`}
                      sx={{ textTransform: "none" }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminUserManagement;