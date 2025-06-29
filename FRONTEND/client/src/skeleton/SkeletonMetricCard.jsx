import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useCustomTheme } from '../hooks/useCustomeTheme';

export default function SkeletonMetricCard() {
  const { outerBox, whiteBorder, softBoxShadow } = useCustomTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        flexBasis: 0,
        bgcolor: outerBox,
        boxShadow: softBoxShadow,
        border: `1px solid ${whiteBorder}`,
        borderRadius: '12px',
        p: 2,
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="40%" height={30} />
    </Box>
  );
}
