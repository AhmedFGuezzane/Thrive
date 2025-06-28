import React from 'react';
import { Box, Typography } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function MetricCard({ label, value }) {
    const { innerBox, outerBox, whiteBorder, primaryText, secondaryText, softBoxShadow } = useCustomTheme();
    return (
        <Box
            sx={{
                // --- ADDED: Tell the box to grow and take equal space ---
                flexGrow: 1,
                flexBasis: 0, // Recommended to ensure equal distribution from a zero base
                // ---
                bgcolor: outerBox,
                boxShadow: softBoxShadow,
                border: `1px solid ${whiteBorder}`,
                borderRadius: '12px',
                p: 2,
                minHeight: '100px',
                width: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Typography variant="body2" color={secondaryText} mb={1}>{label}</Typography>
            <Typography variant="h5" color={primaryText} fontWeight="bold">{value}</Typography>
        </Box>
    );
}