import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function TaskStatusProgressBar({ data, total }) {
  const { t } = useTranslation();
  const { outerBox, whiteBorder, primaryText, secondaryText, softBoxShadow } = useCustomTheme();

  if (!data || total === 0) {
    return (
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
          borderRadius: '8px',
          bgcolor: outerBox,
          border: `1px solid ${whiteBorder}`,
        }}
      >
        <Typography variant="body2" color={secondaryText}>
          {t('taskStatus.no_tasks')}
        </Typography>
      </Box>
    );
  }

  const statuses = [
    { label: t('taskStatus.completed'), status: 'terminée', color: '#4CAF50' },
    { label: t('taskStatus.in_progress'), status: 'en cours', color: '#FFC107' },
    { label: t('taskStatus.pending'), status: 'en attente', color: '#2196F3' },
    { label: t('taskStatus.other'), status: 'autre', color: '#9E9E9E' },
  ];

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: '8px',
        bgcolor: outerBox,
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
      }}
    >
      <Typography variant="h6" color={primaryText} fontWeight="bold">{t('taskStatus.title')}</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '25px',
          borderRadius: '6px',
          overflow: 'hidden',
          border: `1px solid ${whiteBorder}`,
          boxShadow: softBoxShadow,
        }}
      >
        {statuses.map((statusItem) => {
          const count = data[statusItem.status] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          if (percentage === 0) return null;

          return (
            <Tooltip
              key={statusItem.status}
              title={`${statusItem.label}: ${count} (${percentage.toFixed(1)}%)`}
              placement="top"
            >
              <Box
                sx={{
                  width: `${percentage}%`,
                  height: '100%',
                  bgcolor: statusItem.color,
                  transition: 'width 0.5s ease-in-out',
                }}
              />
            </Tooltip>
          );
        })}
      </Box>

      <Box display="flex" justifyContent="space-around" flexWrap="wrap" mt={1} gap={1}>
        {statuses.map(statusItem => (
          <Box key={statusItem.status} display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: statusItem.color }} />
            <Typography variant="body2" color={primaryText}>{statusItem.label}</Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="body2" color={secondaryText} align="center" mt={1}>
        {t('taskStatus.total')}: {total}
      </Typography>
    </Box>
  );
}
