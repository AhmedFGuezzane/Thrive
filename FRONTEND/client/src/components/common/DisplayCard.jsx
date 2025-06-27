// src/components/UserHome/DisplayCard.jsx
import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material'; // <-- ADDED useTheme hook

import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function DisplayCard({ title, icon, children }) {
  // --- Moved cardStyle inside the component to access the theme ---
    const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  

  const cardStyle = {
    // --- UPDATED to use dynamic theme colors for the glass effect ---
    bgcolor: innerBox,
    borderRadius: '12px',
    border: `1px solid ${whiteBorder}`,
    p: 2,
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: "primaryText", // <-- Added dynamic text color for the card
  };

  return (
    <Box sx={cardStyle}>
      <Box display="flex" alignItems="center" mb={1.5}>
        {/* --- UPDATED icon color to use theme text color --- */}
        {icon && React.cloneElement(icon, { sx: { mr: 1, color: specialText } })}
        <Typography variant="h6" fontWeight="bold" color= {specialText}>
          {title}
        </Typography>
      </Box>
      {/* --- UPDATED Divider color to use dynamic theme color --- */}
      <Divider sx={{ mb: 1.5, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
      {children}
    </Box>
  );
}