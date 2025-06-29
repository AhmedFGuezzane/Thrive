// src/components/UserSeance/UrgentTasksCard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, Chip, useTheme } from '@mui/material';
import { TimerContext } from '../../contexts/TimerContext';
import { fetchTasksBySeanceId } from '../../utils/taskService.jsx';
import { getImportanceDisplay } from '../../utils/taskUtils.js';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function UrgentTasksCard() {
  const theme = useTheme();
  const { innerBox, whiteBorder, softBoxShadow, primaryColor } = useCustomTheme();
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
        width: '33%',
        height: '98%',
        p: 2,
        borderRadius: '16px',
        bgcolor: innerBox,
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
          }}
        >
          {urgentTasks.map(task => (
            <Box
              key={task.id}
              sx={{
                p: 1.5,
                mb: 1,
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
