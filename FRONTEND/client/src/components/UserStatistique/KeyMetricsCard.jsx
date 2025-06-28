import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { formatDate } from '../../utils/StatisticsUtils';

export default function KeyMetricsCard({ stats }) {
    const { primaryText, secondaryText, softBoxShadow, outerBox, whiteBorder } = useCustomTheme();

    if (!stats) return null;

    return (
        <Box
            sx={{
                bgcolor: outerBox,
                border: `1px solid ${whiteBorder}`,
                boxShadow: softBoxShadow,
                borderRadius: '16px',
                p: 3,
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h6" color={primaryText} fontWeight="bold">Key Metrics</Typography>
            {/* --- UPDATED Grid for better item spacing and layout --- */}
            <Grid container spacing={4} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Tasks Completed:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{stats.nbre_taches_completees}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Completion Rate:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{(stats.taux_completion_taches * 100).toFixed(0)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Tasks Per Day:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{stats.nbre_taches_par_jour.toFixed(1)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Overdue Tasks:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{stats.nbre_taches_retard}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Active Days Streak:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{stats.nbre_jours_consecutifs_actifs}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Best Day:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{stats.meilleur_jour || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" color={secondaryText}>Focus Score:</Typography>
                    <Typography variant="h4" color={primaryText} fontWeight="bold">{stats.focus_score.toFixed(0)}</Typography>
                </Grid>
            </Grid>
            <Box mt={3}>
                <Typography variant="body2" color={secondaryText}>
                    Last Active: {formatDate(stats.derniere_date_active) || 'N/A'}
                </Typography>
                <Typography variant="body2" color={secondaryText}>
                    Metrics Last Updated: {formatDate(stats.date_mise_a_jour) || 'N/A'}
                </Typography>
            </Box>
        </Box>
    );
}