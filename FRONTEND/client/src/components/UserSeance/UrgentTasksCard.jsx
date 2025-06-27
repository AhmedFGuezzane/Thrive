// src/components/UserSeance/UrgentTasksCard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, Chip, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import { TimerContext } from '../../contexts/TimerContext';
import { fetchTasksBySeanceId } from '../../utils/taskService.jsx';
import { getImportanceDisplay } from '../../utils/taskUtils.js';

export default function UrgentTasksCard() {
  // --- ADDED useTheme hook for dynamic styling ---
  const theme = useTheme();

  const { activeSeanceId } = useContext(TimerContext);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrgentTasks = async () => {
      if (!activeSeanceId) {
        setUrgentTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allTasks = await fetchTasksBySeanceId(activeSeanceId);
        // Filter for tasks with importance level 1 (Urgent) AND that are not completed
        const urgentAndPending = allTasks.filter(task => {
          const isUrgent = task.importance === 1;
          const isNotCompleted = !['terminée', 'complétée', 'complete'].includes(String(task.statut).toLowerCase());
          return isUrgent && isNotCompleted;
        });
        setUrgentTasks(urgentAndPending);
      } catch (error) {
        console.error("Failed to fetch urgent tasks:", error);
        setUrgentTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUrgentTasks();
  }, [activeSeanceId]);

  return (
    <Box
      sx={{
        width: '66%', // Twice the width of the 33% tracker
        height: '98%', // Same height as the tracker
        p: 2,
        borderRadius: '16px',
        // --- UPDATED to use dynamic theme colors for glassmorphism ---
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        mt: 1.5,
        display: 'flex',
        flexDirection: 'column',
        // --- Added a dynamic color for the text inside ---
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom color={theme.palette.text.primary}>
        Tâches Urgentes (Séance Active)
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <CircularProgress size={30} sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : urgentTasks.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            Aucune tâche urgente pour cette séance.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pr: 1, // Add padding for scrollbar
            // --- UPDATED: Dynamic scrollbar colors for both modes ---
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            },
            scrollbarWidth: 'thin',
          }}
        >
          {urgentTasks.map(task => (
            <Box
              key={task.id}
              sx={{
                p: 1.5,
                mb: 1,
                // --- UPDATED to use a more opaque dynamic theme color ---
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}`,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Chip
                label={getImportanceDisplay(task.importance).label}
                size="small"
                sx={{
                  bgcolor: getImportanceDisplay(task.importance).bgColor,
                  color: getImportanceDisplay(task.importance).textColor,
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              />
              <Typography variant="body1" fontWeight="medium" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: theme.palette.text.primary }}>
                {task.titre}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}