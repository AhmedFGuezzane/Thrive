import React from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { useCustomTheme } from '../hooks/useCustomeTheme';

export default function SkeletonTaskCard() {
  const theme = useTheme();
  const {
    innerBox,
    whiteBorder,
    softBoxShadow
  } = useCustomTheme();

  return (
    <Box
      sx={{
        bgcolor: innerBox,
        border: `1px solid ${whiteBorder}`,
        borderRadius: '12px',
        boxShadow: softBoxShadow,
        p: 2,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
      }}
    >
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="40%" height={18} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: '50%' }} />
      </Box>
      <Skeleton variant="rectangular" height={20} width="100%" />
    </Box>
  );
}
