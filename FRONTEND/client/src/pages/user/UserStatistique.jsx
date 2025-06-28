import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Divider,
    useTheme,
    CircularProgress
} from '@mui/material';

import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useStatisticsManagement } from '../../hooks/useStatisticsManagement';
import { formatActivityDataForChart } from '../../utils/StatisticsUtils.js';
import KeyMetricsCard from '../../components/UserStatistique/KeyMetricsCard';
import ActivityChart from '../../components/UserStatistique/ActivityChart';
import TaskStatusProgressBar from '../../components/UserStatistique/TaskStatusProgressBar';

export default function UserStatistique() {
    const theme = useTheme();
    const { outerBox, softBoxShadow, whiteBorder, primaryText, specialColor } = useCustomTheme();
    
    const { stats, loading, error } = useStatisticsManagement();

    const activityChartData = useMemo(() => {
        return formatActivityDataForChart(stats?.activite_par_jour_semaine, theme);
    }, [stats, theme]);

    let content;
    if (loading) {
        content = (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: specialColor }} />
            </Box>
        );
    } else if (error) {
        content = (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    } else if (!stats) {
        content = (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color={primaryText}>No statistics available yet.</Typography>
            </Box>
        );
    } else {
        // --- CORRECTED LAYOUT: Use Box with flex and responsive widths ---
        content = (
            <Box
                display="flex"
                flexDirection="column"
                gap={theme.spacing(3)} // Use theme spacing for a nice gap
                mt={2}
                alignItems="center" // Center the half-width chart horizontally
            >
                {/* 1. Progress Bar (100% width) */}
                <Box width="100%">
                    <TaskStatusProgressBar 
                        data={stats.tasks_by_status}
                        total={stats.total_tasks}
                    />
                </Box>
                
                {/* 2. Key Metrics Card (100% width) */}
                <Box width="100%">
                    <KeyMetricsCard stats={stats} />
                </Box>
                
                {/* 3. Activity Chart (100% on mobile, 50% on desktop, centered) */}
                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <ActivityChart 
                        title="Activity by Day of the Week"
                        data={activityChartData}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            width="98%"
            height="100%"
            mx="auto"
            sx={{
                backgroundColor: outerBox,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${whiteBorder}`,
                boxShadow: softBoxShadow,
                borderRadius: '16px',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: theme.palette.text.primary,
                position: 'relative',
                overflowY: 'auto',
            }}
        >
            <Typography variant="h5" fontWeight="bold" color={primaryText}>
                Statistiques de l'utilisateur
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* The main content that changes based on loading/error state */}
            {content}
        </Box>
    );
}