import React from 'react';
import { Box, Skeleton } from '@mui/material';
import SkeletonMetricCard from './SkeletonMetricCard';
import { useCustomTheme } from '../hooks/useCustomeTheme';

export default function SkeletonKeyMetricsCard() {
  const { primaryText } = useCustomTheme();

  return (
    <Box
      sx={{
        borderRadius: '16px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 1,
      }}
    >
      <Skeleton variant="text" width="30%" height={30} sx={{ mx: 'auto' }} />
      <Box display="flex" justifyContent="space-between" gap={1}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonMetricCard key={idx} />
        ))}
      </Box>
      <Box mt={3} display="flex" justifyContent="space-between">
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    </Box>
  );
}
