import { useState } from 'react'
import { Box } from '@mui/material'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ClientLayout from './layouts/clientLayout/ClientLayout'
import AdminLayout from './layouts/adminLayout/AdminLayout'
import UserLayout from './layouts/userLayout/UserLayout'

import Navbar from './components/NavBar'

import Home from './pages/client/Home'
import About from './pages/client/About'
import Login from './pages/client/Login'
import Register from './pages/client/Register'
import Contact from './pages/client/Contact'

import UserHome from './pages/user/UserHome'
import UserTasks from './pages/user/UserTasks'
import UserSettings from './pages/user/UserSettings'

function App() {

  return (
    <Router>
      <Routes >
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>

        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route path="userHome" element={<UserHome />} />
          <Route path="userTasks" element={<UserTasks />} />
          <Route path="userSettings" element={<UserSettings />} />
        </Route>
      </Routes>
    </Router>

  )
}

export default App
