import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useCustomTheme } from '../hooks/useCustomeTheme';

export default function SkeletonTaskStatusProgressBar() {
  const { outerBox, whiteBorder, softBoxShadow } = useCustomTheme();

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
      <Skeleton variant="text" width="30%" height={25} />
      <Skeleton variant="rectangular" width="100%" height={25} sx={{ borderRadius: '6px' }} />
      <Box display="flex" justifyContent="space-around" mt={1} gap={1}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="text" width="60px" height={20} />
        ))}
      </Box>
      <Skeleton variant="text" width="30%" height={20} sx={{ mx: 'auto' }} />
    </Box>
  );
}
