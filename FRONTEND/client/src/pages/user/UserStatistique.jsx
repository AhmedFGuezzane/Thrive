import React, { useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useStatisticsManagement } from '../../hooks/useStatisticsManagement';
import { formatActivityDataForChart } from '../../utils/StatisticsUtils.js';
import KeyMetricsCard from '../../components/UserStatistique/KeyMetricsCard';
import ActivityChart from '../../components/UserStatistique/ActivityChart';
import TaskStatusProgressBar from '../../components/UserStatistique/TaskStatusProgressBar';
import { useSnackbar } from '../../contexts/SnackbarContext';

// ⏳ Skeletons
import SkeletonActivityChart from '../../skeleton/SkeletonActivityChart';
import SkeletonKeyMetricsCard from '../../skeleton/SkeletonKeyMetricsCard';
import SkeletonTaskStatusProgressBar from '../../skeleton/SkeletonTaskStatusProgressBar';

export default function UserStatistique() {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    outerBox, softBoxShadow, whiteBorder,
    primaryText, secondaryText, specialColor
  } = useCustomTheme();

  const { showSnackbar } = useSnackbar();
  const { stats, loading, error, fetchStatistics } = useStatisticsManagement(showSnackbar);

  const activityChartData = useMemo(() => {
    return formatActivityDataForChart(stats?.activite_par_jour_semaine, theme);
  }, [stats, theme]);

  useEffect(() => {
    if (error) showSnackbar(error, 'error');
  }, [error, showSnackbar]);

  let content;
  if (loading) {
    content = (
      <Box
        display="flex"
        width="100%"
        flexDirection="column"
        justifyContent="space-between"
        gap={3}
        mt={2}
        alignItems="center"
      >
        <Box width="100%" display="flex" gap={3} alignItems="stretch" flexWrap="wrap">
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              flexGrow: 1,
              flexBasis: 0,
              height: '220px',
              borderRadius: '12px',
              bgcolor: outerBox,
              border: `1px solid ${whiteBorder}`,
              boxShadow: softBoxShadow,
            }}
          />
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <SkeletonActivityChart />
          </Box>
        </Box>

        <Box width="100%">
          <SkeletonTaskStatusProgressBar />
        </Box>

        <Box width="100%">
          <SkeletonKeyMetricsCard />
        </Box>
      </Box>
    );
  } else if (!stats) {
    content = (
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color={primaryText}>{t('stats.no_data')}</Typography>
      </Box>
    );
  } else {
    content = (
      <Box
        display="flex"
        width="100%"
        flexDirection="column"
        justifyContent="space-between"
        gap={5}
        mt={2}
        alignItems="center"
      >
        <Box width="100%" display="flex" gap={3} alignItems="stretch" flexWrap="wrap">
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
              {t('stats.note_title')}
            </Typography>
            <Typography variant="body2" color={primaryText} fontStyle="italic" mb={1}>
              {t('stats.note_1')}
            </Typography>
            <Typography variant="body2" color={primaryText}>
              {t('stats.note_2')}
            </Typography>
          </Box>

          <Box sx={{
            width: { xs: '100%', md: '50%' },
            flexGrow: 1,
            flexBasis: 0,
          }}>
            <ActivityChart title={t('stats.chart_title')} data={activityChartData} />
          </Box>
        </Box>

        <Box width="100%">
          <TaskStatusProgressBar data={stats.tasks_by_status} total={stats.total_tasks} />
        </Box>

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
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.text.primary,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 3,
          pb: 3,
        }}
      >
        {content}
      </Box>

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
