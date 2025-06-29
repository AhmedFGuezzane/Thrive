// src/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import ClientLayout from "./layouts/clientLayout/ClientLayout";
import AdminLayout from "./layouts/adminLayout/AdminLayout";
import UserLayout from "./layouts/userLayout/UserLayout";

import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/client/Home";
import About from "./pages/client/About";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Contact from "./pages/client/Contact";

import UserHome from "./pages/user/UserHome";
import UserTasks from "./pages/user/UserTasks";
import UserAccount from "./pages/user/UserAccount";
import UserStatistique from "./pages/user/UserStatistique";
import UserSeance from "./pages/user/UserSeance";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* 🔐 Admin-Protected Routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* your admin routes here */}
        </Route>
      </Route>

      {/* 👤 Client-Protected Routes */}
      <Route element={<PrivateRoute allowedRoles={["client"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route path="userHome" element={<UserHome />} />
          <Route path="userTasks" element={<UserTasks />} />
          <Route path="userSeance" element={<UserSeance />} />
          <Route path="userAccount" element={<UserAccount />} />
          <Route path="userStatistique" element={<UserStatistique />} />
        </Route>
      </Route>
    </Routes>
  );
}
