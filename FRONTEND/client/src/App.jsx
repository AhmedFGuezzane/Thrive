// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import './App.css';

import ClientLayout from './layouts/clientLayout/ClientLayout';
import AdminLayout from './layouts/adminLayout/AdminLayout';
import UserLayout from './layouts/userLayout/UserLayout';

import PrivateRoute from './components/PrivateRoute';

import Home from './pages/client/Home';
import About from './pages/client/About';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Contact from './pages/client/Contact';

import UserHome from './pages/user/UserHome';
import UserTasks from './pages/user/UserTasks';
import UserAccount from './pages/user/UserAccount';
import UserStatistique from './pages/user/UserStatistique';
import UserSeance from './pages/user/UserSeance';

function App() {
  const theme = useTheme();

  // Reference the images directly from the public folder
  const lightBackground = '/assets/images/user/user_background.jpg';
  const darkBackground = '/assets/images/user/user_background_dark.jpg'; // Corrected extension

  // Determine which background image to use based on the theme mode
  const backgroundImage = theme.palette.mode === 'light' ? lightBackground : darkBackground;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        // --- Dynamic Background Image based on the theme ---
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* ✅ Admin-protected routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              {/* your admin pages here */}
            </Route>
          </Route>

          {/* ✅ Client-protected routes */}
          <Route element={<PrivateRoute allowedRoles={['client']} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route path="userHome" element={<UserHome />} />
              <Route path="userTasks" element={<UserTasks />} />
              <Route path="userSeance" element={<UserSeance />} />
              <Route path="userAccount" element={<UserAccount />} />
              <Route path="userStatistique" element={<UserStatistique />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Box>
  );
}

export default App;