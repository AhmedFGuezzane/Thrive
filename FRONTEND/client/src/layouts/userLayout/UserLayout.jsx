import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

// The import path you provided. Make sure it is correct for your file structure.
import UserSidebar from '../userLayout/UserSidebar';
import { TimerProvider } from '../../contexts/TimerContext';

export default function UserLayout() {
  return (
    <TimerProvider>
      {/*
        This top-level Box now acts as a container for your layout,
        and its background is handled by App.jsx, which sits above it in the component tree.
      */}
      <Box
        width="100vw"
        height="100vh"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex', // This flex container holds the foreground layout
          flexDirection: 'column',
        }}
      >
        {/*
          I have removed the "Background Blur Image" Box from here.
          It is no longer needed as the background is set dynamically in App.jsx.
          This ensures your dark/light mode background works correctly.
        */}

        {/* Foreground Layout */}
        <Box
          width="100%"
          height="100%"
          sx={{
            position: 'relative',
            zIndex: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main content row: sidebar + page content */}
          <Box display="flex" height="100%" width="100%" flexGrow={1} alignItems="center">
            <UserSidebar />
            <Box
              className="content"
              flexGrow={1}
              display="flex"
              flexDirection="column"
              height="98%"
              width="100%"
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </TimerProvider>
  );
}