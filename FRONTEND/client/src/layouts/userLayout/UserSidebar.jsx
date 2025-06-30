import React, { useState } from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';

import { useColorMode } from '../../contexts/ThemeContext2';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useTaskManagement } from '../../hooks/useTaskManagement';

import { useTranslation } from 'react-i18next';
import LanguageSelectionDialog from '../../components/common/LanguageSelectionDialog';

export default function UserSidebar() {
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  const { i18n } = useTranslation();

  const [showUtilityIcons, setShowUtilityIcons] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);

  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();
  const { prefetchTasksIfAllowed } = useTaskManagement(null, showSnackbar, 'all_tasks');

  const toggleUtilityIcons = () => {
    setShowUtilityIcons(prev => !prev);
  };

  const handleHover = () => {
    prefetchTasksIfAllowed();
  };

  const handleLanguageDialogOpen = () => setIsLanguageDialogOpen(true);
  const handleLanguageDialogClose = () => setIsLanguageDialogOpen(false);
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
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
      <Box display="flex" flexDirection="column" alignItems="center">
        <Tooltip title="Home" placement="right">
          <IconButton onClick={() => navigate('/user/userHome')} onMouseEnter={handleHover} sx={iconButtonSx}>
            <HomeIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Séance d'étude" placement="right">
          <IconButton onClick={() => navigate('/user/userSeance')} onMouseEnter={handleHover} sx={iconButtonSx}>
            <SchoolIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Tasks" placement="right">
          <IconButton onClick={() => navigate('/user/userTasks')} onMouseEnter={handleHover} sx={iconButtonSx}>
            <AssignmentIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mt="auto" >
        {showUtilityIcons && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Tooltip title="Account" placement="right">
              <IconButton onClick={() => navigate('/user/userAccount')} onMouseEnter={handleHover} sx={iconButtonSx}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Statistics" placement="right">
              <IconButton onClick={() => navigate('/user/userStatistique')} onMouseEnter={handleHover} sx={iconButtonSx}>
                <BarChartIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title={theme.palette.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="right">
              <IconButton onClick={toggleColorMode} sx={{ ...iconButtonSx, mb: 2 }}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Change Language" placement="right">
                <IconButton onClick={handleLanguageDialogOpen} sx={{ ...iconButtonSx, mb: 0 }}>
                    <LanguageIcon fontSize="large" />
                </IconButton>
            </Tooltip>
          </Box>
        )}

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

        <LanguageSelectionDialog
            open={isLanguageDialogOpen}
            onClose={handleLanguageDialogClose}
            currentLanguage={i18n.language}
            onLanguageChange={handleLanguageChange}
        />
    </Box>
  );
}