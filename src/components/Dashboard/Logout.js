// src/components/Dashboard/Logout.js
import React, { useEffect } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doSignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        navigate("/login", { replace: true });
      }
    };
    doSignOut();
  }, [navigate]);

  return null;
};

export default Logout;