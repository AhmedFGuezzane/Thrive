import React from 'react';
import { Box, Typography, useTheme, Tooltip } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function ActivityChart({ title, data }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { primaryText, secondaryText, specialColor, softBoxShadow, outerBox, whiteBorder } = useCustomTheme();

  const maxValue = data && data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;

  if (!data || data.length === 0 || maxValue === 0) {
    return (
      <Box
        sx={{
          bgcolor: outerBox,
          border: `1px solid ${whiteBorder}`,
          boxShadow: softBoxShadow,
          borderRadius: '16px',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}
      >
        <Typography color={secondaryText}>{t('activityChart.no_data')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: outerBox,
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '16px',
        p: 3,
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography textAlign="center" variant="h6" color={primaryText} fontWeight="bold">
        {title}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          gap: 2,
          p: 2,
          height: '200px',
        }}
      >
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: '100%',
              gap: 1,
              minWidth: '50px',
            }}
          >
            <Tooltip title={`${t('activityChart.tooltip')}: ${item.value.toFixed(1)}`} placement="top">
              <Box
                sx={{
                  width: '30px',
                  bgcolor: item.color,
                  height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  borderRadius: '4px',
                  transition: 'height 0.5s ease-in-out',
                  boxShadow: softBoxShadow,
                }}
              />
            </Tooltip>
            <Typography variant="body2" color={secondaryText}>{item.day}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
