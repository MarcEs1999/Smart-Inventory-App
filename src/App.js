import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import PasswordReset from "./components/Auth/PasswordReset";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes for authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<PasswordReset />} />

        {/* Protected Dashboard route */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* Default route: redirect to login or show a welcome page */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;