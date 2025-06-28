// src/components/UserHome/SwitchCard.jsx
import React from 'react';
import { Box, Typography, Switch, useTheme } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function SwitchCard({
  label,
  name,
  checked,
  onChange,
  // --- ADD THE 'disabled' PROP HERE ---
  disabled, // <--- Make sure your SwitchCard accepts this prop
  sx,
  ...otherProps
}) {
  const theme = useTheme();
  const { innerBox, whiteBorder, primaryText, softBoxShadow, specialColor, specialText } = useCustomTheme();

  const baseSwitchCardStyles = {
    bgcolor: innerBox,
    borderRadius: '12px',
    border: `1px solid ${whiteBorder}`,
    p: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    boxShadow: softBoxShadow,
    // --- Optional: Add styling for disabled state of the card itself ---
    ...(disabled && {
      opacity: 0.6, // Make the whole card look disabled
      pointerEvents: 'none', // Prevent clicks on the card if desired
    }),
  };

  return (
    <Box
      sx={{
        ...baseSwitchCardStyles,
        ...sx,
      }}
      {...otherProps}
    >
      <Typography variant="body2" color={primaryText}>
        {label}
      </Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        name={name}
        // --- PASS THE 'disabled' PROP TO THE MUI SWITCH ---
        disabled={disabled} // <--- THIS IS THE KEY FIX
        sx={{
          // When the switch is checked
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: specialText,
            '&:hover': {
              bgcolor: 'transparent',
            },
          },
          // Color of the track when checked
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            bgcolor: specialText,
            opacity: 1,
          },
          // Color of the thumb when unchecked
          '& .MuiSwitch-switchBase': {
             color: theme.palette.grey[400],
             '&:hover': {
                 bgcolor: 'transparent',
             }
          },
          // Color of the track when unchecked
          '& .MuiSwitch-track': {
            bgcolor: theme.palette.grey[600],
            opacity: 0.5,
          },
          // --- DISABLED STATE STYLING FOR THE SWITCH ITSELF ---
          // These ensure the actual switch looks disabled when the prop is applied
          '& .MuiSwitch-switchBase.Mui-disabled': {
            color: theme.palette.action.disabled, // Or a specific color for disabled thumb
          },
          '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
            bgcolor: theme.palette.action.disabledBackground, // Or a specific color for disabled track
            opacity: 0.5, // Ensure disabled track has some visibility
          },
        }}
      />
    </Box>
  );
}