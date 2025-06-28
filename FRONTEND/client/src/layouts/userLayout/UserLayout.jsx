import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import UserSidebar from '../userLayout/UserSidebar';
import { TimerProvider } from '../../contexts/TimerContext';
import GlobalPhaseTransition from '../../components/common/GlobalPhaseTransition'; // ✅ add this

export default function UserLayout() {
  return (
    <TimerProvider>
      {/* ✅ Global dialog rendered once for all user pages */}
      <GlobalPhaseTransition />

      <Box
        width="100vw"
        height="100vh"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
