import React, { useState } from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material'; // Import useTheme
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Import the global color mode context hook
import { useColorMode } from '../../contexts/ThemeContext2';

export default function UserSidebar() {
  // Use the global theme hooks instead of local state
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();

  const [showUtilityIcons, setShowUtilityIcons] = useState(false);
  const navigate = useNavigate();

  const toggleUtilityIcons = () => {
    setShowUtilityIcons(prev => !prev);
  };




  const outerBox = theme.palette.custom.box.outer;
  const innerBox = theme.palette.custom.box.inner;

  const primaryColor = theme.palette.custom.color.primary;
  const specialColor = theme.palette.custom.color.special;

  const secondaryText = theme.palette.custom.text.secondary;

  const whiteBorder = theme.palette.custom.border.white;
  const blackBorder = theme.palette.custom.border.black;
  const specialBorder = theme.palette.custom.border.special;

  const softBoxShadow = theme.palette.custom.boxShadow.soft;

  // Helper for consistent button styling
  const iconButtonSx = {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '8px',
    mb: 2,
    color: specialColor,
    bgcolor: innerBox,
    transition: 'all 0.3s ease-in-out',
    boxShadow: softBoxShadow,
    '&:hover': {
      bgcolor: specialColor,
      color: secondaryText,
      transform: 'scale(1.05)',
    },
  };

  return (
    <Box
      width="5rem"
      height="calc(98vh)"
      ml="1rem"
      borderRadius="16px"
      sx={{
        backgroundColor: outerBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        justifyContent: 'space-between',
      }}
    >
      {/* Top Section: Main Navigation Buttons */}
      <Box display="flex" flexDirection="column" alignItems="center">
        <Tooltip title="Home" placement="right">
          <IconButton onClick={() => navigate('/user/userHome')} sx={iconButtonSx}>
            <HomeIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Séance d'étude" placement="right">
          <IconButton onClick={() => navigate('/user/userSeance')} sx={iconButtonSx}>
            <SchoolIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Timer" placement="right">
          <IconButton sx={iconButtonSx}>
            <TimerIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Tasks" placement="right">
          <IconButton onClick={() => navigate('/user/userTasks')} sx={iconButtonSx}>
            <AssignmentIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Bottom Section: Collapsible Utility Icons and Toggle Button */}
      <Box display="flex" flexDirection="column" alignItems="center" mt="auto" >
        {showUtilityIcons && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Tooltip title="Account" placement="right">
              <IconButton onClick={() => navigate('/user/userAccount')} sx={iconButtonSx}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Statistics" placement="right">
              <IconButton onClick={() => navigate('/user/userStatistique')} sx={iconButtonSx}>
                <BarChartIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            {/* The theme toggle button now uses the global context */}
            <Tooltip title={theme.palette.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="right">
              <IconButton onClick={toggleColorMode} sx={{ ...iconButtonSx, mb: 0 }}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Toggle Button for Utility Icons */}
        <Tooltip title={showUtilityIcons ? 'Hide Options' : 'More Options'} placement="right">
          <IconButton
            onClick={toggleUtilityIcons}
            sx={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '8px',
              color: specialColor,
              bgcolor: innerBox,
              transition: 'all 0.3s ease-in-out',
              boxShadow: softBoxShadow,
              '&:hover': {
                bgcolor: specialColor,
                color: secondaryText,
                transform: 'scale(1.05)',
              },
            }}
          >
            {showUtilityIcons ? <CloseIcon fontSize="large" /> : <MoreHorizIcon fontSize="large" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}