import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useCustomTheme } from '../hooks/useCustomeTheme';

export default function SkeletonActivityChart() {
  const { outerBox, whiteBorder, softBoxShadow } = useCustomTheme();

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
        gap: 2,
      }}
    >
      <Skeleton variant="text" width="50%" height={30} sx={{ mx: 'auto' }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          flexGrow: 1,
          gap: 2,
          height: '200px',
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" width={30} height={`${50 + Math.random() * 100}px`} />
        ))}
      </Box>
    </Box>
  );
}
