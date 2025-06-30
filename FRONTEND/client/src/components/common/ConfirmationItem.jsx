
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ConfirmationItem({ label, value }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const translatedLabel = t(`confirmationItem.labels.${label}`, label.replace(/_/g, ' '));
  const translatedValue =
    typeof value === 'boolean'
      ? t(value ? 'confirmationItem.values.enabled' : 'confirmationItem.values.disabled')
      : value;

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          textTransform: 'capitalize',
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {translatedLabel}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {translatedValue}
      </Typography>
    </Box>
  );
}
