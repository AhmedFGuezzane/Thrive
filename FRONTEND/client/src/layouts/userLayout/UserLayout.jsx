import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import UserSidebar from '../userLayout/UserSidebar';
import { TimerProvider } from '../../contexts/TimerContext';

export default function UserLayout() {
  return (
    <TimerProvider>
      <Box width="100vw" height="100vh" sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Blur Image */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url("/assets/images/user/user_background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            zIndex: -1,
          }}
        />

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
