import Navbar from "../../components/NavBar"
import { Outlet } from 'react-router-dom';
import { Box } from "@mui/material"
import UserSidebar from '../userLayout/UserSidebar' // Assuming this path is correct

export default function UserLayout() {
  return (
    <Box width="100vw" height="100vh" sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* This Box is now exclusively for the blurred background */}
      <Box
        sx={{
          position: 'fixed', // Fixed to cover the entire viewport
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url("assets/images/user/user_background.jpg")', // Your background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)', // Apply blur only to this background Box
          zIndex: -1, // Place it behind other content
        }}
      />

      {/* This Box holds all the actual UI content, on top of the blurred background */}
      <Box
        width="100%"
        height="100%"
        sx={{
          position: 'relative', // Position relative to contain children
          zIndex: 0, // Ensure content is above the blurred background
          display: 'flex',
          flexDirection: 'column', // Navbar and main content stacked vertically
        }}
      >

        <Box display="flex" height="100%" width="100%" alignItems="center"flexGrow={1}>
          <UserSidebar />
          <Box className="content"  height="98%" width="100%">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
