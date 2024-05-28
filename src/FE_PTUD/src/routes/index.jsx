import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogsPage from "../pages/logsPage/logs";
import Verify from "../components/verify/verify";
import MainLayout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import MainClass from "../pages/Class/MainClass";
import StudentList from "../pages/Class/MainClass/StudenList";
import { useAuth } from "../provider/authContext";

const MyRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/home" /> : <LogsPage />}
      />
      <Route
        path="/home"
        element={isAuthenticated() ? <MainLayout /> : <Navigate to="/" />}
      >
        <Route index element={<Dashboard />} />
      </Route>
      <Route
        path="/class"
        element={isAuthenticated() ? <MainLayout /> : <Navigate to="/" />}
      >
        <Route index element={<MainClass />} />
      </Route>
      <Route path="/verify" element={<Verify />} />
    </Routes>
  );
};

export default MyRoutes;
