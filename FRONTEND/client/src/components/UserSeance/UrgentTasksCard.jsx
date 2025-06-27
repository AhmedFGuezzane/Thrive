// src/components/UserSeance/UrgentTasksCard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, Chip, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import { TimerContext } from '../../contexts/TimerContext';
import { fetchTasksBySeanceId } from '../../utils/taskService.jsx';
import { getImportanceDisplay } from '../../utils/taskUtils.js';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function UrgentTasksCard() {
  // --- ADDED useTheme hook for dynamic styling ---
    const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  

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
        bgcolor: middleBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        display: 'flex',
        flexDirection: 'column',

      }}
    >
      <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom color={primaryColor}>
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
            pt : 1.5,
            // --- UPDATED: Dynamic scrollbar colors for both modes ---
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: "theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'",
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
                bgcolor: innerBox,
                borderRadius: '10px',
                border: `1px solid ${whiteBorder}`,
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
              <Typography variant="body1" fontWeight="medium" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: primaryColor }}>
                {task.titre}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}