
import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { formatDate } from '../../utils/StatisticsUtils';
import MetricCard from './MetricCard';

export default function KeyMetricsCard({ stats }) {
    const theme = useTheme();
    const { primaryText, secondaryText, softBoxShadow, outerBox, whiteBorder } = useCustomTheme();

    if (!stats) return null;
    const metrics = [
        { label: 'Tasks Completed', value: stats.nbre_taches_completees },
        { label: 'Completion Rate', value: `${(stats.taux_completion_taches * 100).toFixed(0)}%` },
        { label: 'Tasks Per Day', value: stats.nbre_taches_par_jour.toFixed(1) },
        { label: 'Overdue Tasks', value: stats.nbre_taches_retard },
        { label: 'Active Days Streak', value: stats.nbre_jours_consecutifs_actifs },
        { label: 'Best Day', value: stats.meilleur_jour || 'N/A' },
        { label: 'Focus Score', value: stats.focus_score.toFixed(0) },
    ];

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
            <Typography variant="h6" mb={2} textAlign="center" color={primaryText} fontWeight="bold">Key Metrics</Typography>
            <Box display="flex" justifyContent="space-between" gap={1}>
                {metrics.map((metric) => (

                        <MetricCard label={metric.label} value={metric.value} />
                ))}
            </Box>
            <Box mt={3}>
                <Typography variant="body2" textAlign="end" color={primaryText}>
                    Last Active: {formatDate(stats.derniere_date_active) || 'N/A'}
                </Typography>
                <Typography variant="body2" textAlign="end" color={primaryText}>
                    Metrics Last Updated: {formatDate(stats.date_mise_a_jour) || 'N/A'}
                </Typography>
            </Box>
        </Box>
    );
}