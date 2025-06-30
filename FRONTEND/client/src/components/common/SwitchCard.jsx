
import React from 'react';
import { Box, Typography, Switch, useTheme } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function SwitchCard({
  label,
  name,
  checked,
  onChange,
  disabled,
  sx,
  ...otherProps
}) {
  const theme = useTheme();
  const { innerBox, whiteBorder, primaryText, softBoxShadow, specialText } = useCustomTheme();
  const { t } = useTranslation();

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
    ...(disabled && {
      opacity: 0.6,
      pointerEvents: 'none',
    }),
  };

  return (
    <Box sx={{ ...baseSwitchCardStyles, ...sx }} {...otherProps}>
      <Typography variant="body2" color={primaryText}>
        {t(label)}
      </Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        name={name}
        disabled={disabled}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: specialText,
            '&:hover': {
              bgcolor: 'transparent',
            },
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            bgcolor: specialText,
            opacity: 1,
          },
          '& .MuiSwitch-switchBase': {
            color: theme.palette.grey[400],
            '&:hover': {
              bgcolor: 'transparent',
            }
          },
          '& .MuiSwitch-track': {
            bgcolor: theme.palette.grey[600],
            opacity: 0.5,
          },
          '& .MuiSwitch-switchBase.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
          '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
            bgcolor: theme.palette.action.disabledBackground,
            opacity: 0.5,
          },
        }}
      />
    </Box>
  );
}
