// src/skeleton/TaskItemSkeleton.jsx
import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useCustomTheme } from '../hooks/useCustomeTheme';

export default function TaskItemSkeleton() {
  const { innerBox, whiteBorder, softBoxShadow } = useCustomTheme();

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: innerBox,
        borderRadius: '12px',
        mb: 1.5,
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Skeleton variant="text" width="60%" height={28} />
      <Skeleton variant="text" width="30%" height={18} />
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
    </Box>
  );
}
