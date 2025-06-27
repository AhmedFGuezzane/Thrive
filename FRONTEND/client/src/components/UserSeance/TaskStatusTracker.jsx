// src/components/UserSeance/TaskStatusTracker.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, Grid, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import { TimerContext } from '../../contexts/TimerContext';
import { fetchTasksBySeanceId } from '../../utils/taskService.jsx';
import { getStatusDisplay } from '../../utils/taskUtils.js';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskStatusTracker() {
    // --- ADDED useTheme hook for dynamic styling ---
      const theme = useTheme();
    const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
    

    const { activeSeanceId } = useContext(TimerContext);
    const [taskCounts, setTaskCounts] = useState({ 'en attente': 0, 'en cours': 0, 'terminée': 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndCountTasks = async () => {
            if (!activeSeanceId) {
                setTaskCounts({ 'en attente': 0, 'en cours': 0, 'terminée': 0 });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const tasks = await fetchTasksBySeanceId(activeSeanceId);
                const counts = tasks.reduce((acc, task) => {
                    const status = String(task.statut).toLowerCase();
                    if (status === 'en attente') {
                        acc['en attente']++;
                    } else if (status === 'en cours') {
                        acc['en cours']++;
                    } else if (['terminée', 'complétée', 'complete'].includes(status)) {
                        acc['terminée']++;
                    }
                    return acc;
                }, { 'en attente': 0, 'en cours': 0, 'terminée': 0 });
                setTaskCounts(counts);
            } catch (error) {
                console.error("Failed to fetch tasks for the session:", error);
                setTaskCounts({ 'en attente': 0, 'en cours': 0, 'terminée': 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchAndCountTasks();
    }, [activeSeanceId]);

    const statusOrder = ['en attente', 'en cours', 'terminée'];

    return (
        <Box
        bgcolor= {middleBox}
            sx={{
                flex: '1 1 30%',
                width: '30%',
                height:'98%',
                p: 2,
                borderRadius: '16px',
                // --- UPDATED to use dynamic theme colors for glassmorphism ---
                
                backdropFilter: 'blur(10px)',
                border: `1px solid ${whiteBorder}`,
                boxShadow: softBoxShadow,
                // --- Added a dynamic color for the text inside ---
                color: primaryText,
            }}
        >
            <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom color={primaryText}>
                Progression des tâches
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50%">
                    <CircularProgress size={30} sx={{ color: primaryText}} />
                </Box>
            ) : (
                <Grid mt={5} display="flex" flexDirection="column" container spacing={2} justifyContent="space-around">
                    {statusOrder.map(status => {
                        const display = getStatusDisplay(status);
                        return (
                            <Grid item xs={4} key={status}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                        borderRadius: '12px',
                                        // --- UPDATED to use a more opaque dynamic theme color ---
                                        bgcolor: innerBox,
                                        border: `1px solid ${whiteBorder}`,
                                    }}
                                >
                                    {/* --- UPDATED: Text color for the count is now primary text --- */}
                                    <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                                        {taskCounts[status]}
                                    </Typography>
                                    {/* --- UPDATED: Text color for the label is now secondary text --- */}
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                        {display.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}