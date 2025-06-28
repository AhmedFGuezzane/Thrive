import React, { useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useStatisticsManagement } from '../../hooks/useStatisticsManagement';
import { formatActivityDataForChart } from '../../utils/StatisticsUtils.js';
import KeyMetricsCard from '../../components/UserStatistique/KeyMetricsCard';
import ActivityChart from '../../components/UserStatistique/ActivityChart';
import TaskStatusProgressBar from '../../components/UserStatistique/TaskStatusProgressBar';
import { useSnackbar } from '../../contexts/SnackbarContext'; // ✅ NEW

export default function UserStatistique() {
  const theme = useTheme();
  const {
    outerBox, softBoxShadow, whiteBorder,
    primaryText, secondaryText, specialColor
  } = useCustomTheme();

  const { showSnackbar } = useSnackbar(); // ✅ NEW
  const { stats, loading, error, fetchStatistics } = useStatisticsManagement(showSnackbar); // ✅ PASS CONTEXT

  const activityChartData = useMemo(() => {
    return formatActivityDataForChart(stats?.activite_par_jour_semaine, theme);
  }, [stats, theme]);

  useEffect(() => {
    if (error) showSnackbar(error, 'error'); // ✅ Snackbar on error
  }, [error, showSnackbar]);

  let content;
  if (loading) {
    content = (
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: specialColor }} />
      </Box>
    );
  } else if (!stats) {
    content = (
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color={primaryText}>No statistics available yet.</Typography>
      </Box>
    );
  } else {
    content = (
      <Box
        display="flex"
        width="100%"
        height="100%"
        flexDirection="column"
        justifyContent="space-between"
        gap={3}
        mt={2}
        alignItems="center"
      >
        {/* 1. ROW 1: Note + Activity Chart */}
        <Box width="100%" display="flex" gap={3} alignItems="stretch" flexWrap="wrap">
          {/* Note Box */}
          <Box sx={{
            width: { xs: '100%', md: '50%' },
            flexGrow: 1,
            flexBasis: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            bgcolor: outerBox,
            border: `1px solid ${whiteBorder}`,
            boxShadow: softBoxShadow,
          }}>
            <Typography variant="h6" color={primaryText} fontWeight="bold" mb={1}>
              Note Importante
            </Typography>
            <Typography variant="body2" color={primaryText} fontStyle="italic" mb={1}>
              Les statistiques sont basées sur l'ensemble de vos séances enregistrées.
              Si certaines séances ont été démarrées par erreur, elles sont également prises en compte.
            </Typography>
            <Typography variant="body2" color={primaryText}>
              Ces données vous aident à visualiser vos habitudes de travail et à identifier les jours où votre concentration est optimale.
              Utilisez ces informations pour adapter vos objectifs et optimiser votre emploi du temps.
            </Typography>
          </Box>

          {/* Activity Chart */}
          <Box sx={{
            width: { xs: '100%', md: '50%' },
            flexGrow: 1,
            flexBasis: 0,
          }}>
            <ActivityChart
              title="Activity by Day of the Week"
              data={activityChartData}
            />
          </Box>
        </Box>

        {/* 2. ROW 2: Task Status Progress Bar */}
        <Box width="100%">
          <TaskStatusProgressBar
            data={stats.tasks_by_status}
            total={stats.total_tasks}
          />
        </Box>

        {/* 3. ROW 3: Key Metrics Card */}
        <Box width="100%">
          <KeyMetricsCard stats={stats} />
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
      <Typography variant="h5" textAlign="center" mb={2} fontWeight="bold" color={primaryText}>
        Statistiques
      </Typography>

      {content}

      {/* Floating Refresh Button */}
      <IconButton
        onClick={fetchStatistics}
        disabled={loading}
        sx={{
          position: 'fixed',
          bottom: theme.spacing(3),
          left: theme.spacing(3),
          zIndex: 1000,
          bgcolor: specialColor,
          color: secondaryText,
          border: `1px solid ${whiteBorder}`,
          boxShadow: softBoxShadow,
          '&:hover': {
            bgcolor: specialColor,
            opacity: 0.9,
          },
          transition: 'transform 0.3s ease-in-out',
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: secondaryText }} /> : <RefreshIcon />}
      </IconButton>
    </Box>
  );
}
