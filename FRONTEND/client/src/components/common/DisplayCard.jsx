// src/components/UserHome/DisplayCard.jsx
import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function DisplayCard({ title, icon, children }) {
  const theme = useTheme();
  const {
    innerBox,
    whiteBorder,
    specialText,
  } = useCustomTheme();

  return (
    <Box
      sx={{
        bgcolor: innerBox,
        borderRadius: '12px',
        border: `1px solid ${whiteBorder}`,
        p: 2,
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: specialText, // Ensures consistent text coloring
      }}
    >
      <Box display="flex" alignItems="center" mb={1.5}>
        {icon && React.cloneElement(icon, { sx: { mr: 1, color: specialText } })}
        <Typography variant="h6" fontWeight="bold" color={specialText}>
          {title}
        </Typography>
      </Box>

      <Divider
        sx={{
          mb: 1.5,
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.1)'
        }}
      />

      {children}
    </Box>
  );
}
