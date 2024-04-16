import React from "react";
import { Routes, Route } from "react-router-dom";
import LogsPage from "../pages/logsPage/logs";
import Verify from "../components/verify/verify";
import MainLayout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import MainClass from "../pages/Class/MainClass";
import StudentList from "../pages/Class/MainClass/StudenList";

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LogsPage />} />
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/class" element={<MainLayout />}>
        <Route index element={<MainClass />} />
      </Route>
      <Route path="/verify" element={<Verify />} />
    </Routes>
  );
};

export default MyRoutes;
