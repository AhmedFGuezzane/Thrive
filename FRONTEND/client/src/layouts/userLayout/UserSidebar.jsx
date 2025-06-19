import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // Icon for 'More Options'
import CloseIcon from '@mui/icons-material/Close'; // Icon for 'Close' when expanded
import { useNavigate } from 'react-router-dom';

export default function UserSidebar() {
  const [darkMode, setDarkMode] = useState(true);
  const [showUtilityIcons, setShowUtilityIcons] = useState(false); // New state to control visibility
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const toggleUtilityIcons = () => {
    setShowUtilityIcons(prev => !prev);
  };

  const glassSidebarBg = darkMode ? 'rgba(205, 80, 255, 0.2)' : 'rgba(240, 248, 255, 0.2)';
  const glassBorderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const iconColor = darkMode ? '#e0ffff' : '#4682b4';
  const buttonBgColor = darkMode ? 'rgba(205, 80, 255, 0.4)' : 'rgba(255, 192, 203, 0.5)';
  const buttonHoverBgColor = darkMode ? 'rgba(205, 80, 255, 0.6)' : 'rgba(255, 192, 203, 0.8)';

  return (
    <Box
      width="5rem"
      height="calc(98vh)"
      ml="1rem"
      borderRadius="16px"
      sx={{
        backgroundColor: glassSidebarBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${glassBorderColor}`,
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
          <IconButton
            onClick={() => navigate('/user/userHome')}
            sx={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '8px',
              mb: 2,
              color: iconColor,
              bgcolor: buttonBgColor,
              '&:hover': {
                bgcolor: buttonHoverBgColor,
              },
            }}
          >
            <HomeIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Séance d'étude" placement="right">
          <IconButton
            sx={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '8px',
              mb: 2,
              color: iconColor,
              bgcolor: buttonBgColor,
              '&:hover': {
                bgcolor: buttonHoverBgColor,
              },
            }}
          >
            <SchoolIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Timer" placement="right">
          <IconButton
            sx={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '8px',
              mb: 2,
              color: iconColor,
              bgcolor: buttonBgColor,
              '&:hover': {
                bgcolor: buttonHoverBgColor,
              },
            }}
          >
            <TimerIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Tasks" placement="right">
          <IconButton
            onClick={() => navigate('/user/userTasks')}
            sx={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '8px',
              mb: 2,
              color: iconColor,
              bgcolor: buttonBgColor,
              '&:hover': {
                bgcolor: buttonHoverBgColor,
              },
            }}
          >
            <AssignmentIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Bottom Section: Collapsible Utility Icons and Toggle Button */}
      <Box display="flex" flexDirection="column" alignItems="center" mt="auto">
        {showUtilityIcons && (
          // Conditionally rendered Box for Account, Settings, and Dark Mode Toggle
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}> {/* Added mb for spacing */}
            <Tooltip title="Account" placement="right">
              <IconButton
                // onClick={() => navigate('/user/account')} // Add navigation as needed
                sx={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '8px',
                  mb: 2,
                  color: iconColor,
                  bgcolor: buttonBgColor,
                  '&:hover': {
                    bgcolor: buttonHoverBgColor,
                  },
                }}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings" placement="right">
              <IconButton
                onClick={() => navigate('/user/userSettings')}
                sx={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '8px',
                  mb: 2,
                  color: iconColor,
                  bgcolor: buttonBgColor,
                  '&:hover': {
                    bgcolor: buttonHoverBgColor,
                  },
                }}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="right">
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '8px',
                  // No mb here as it's the last icon in this group
                  color: iconColor,
                  bgcolor: buttonBgColor,
                  '&:hover': {
                    bgcolor: buttonHoverBgColor,
                  },
                }}
              >
                {darkMode ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
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
              // No mb or mt here, its position is controlled by its parent Box's flex rules
              color: iconColor,
              bgcolor: buttonBgColor,
              '&:hover': {
                bgcolor: buttonHoverBgColor,
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
