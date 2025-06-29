import React, { useState, useCallback } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useTaskManagement } from '../../hooks/useTaskManagement';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../common/AddTaskDialog';
import TaskFilterBar from './TaskFilterBar';
import TaskItem from './TaskItem';
import TaskItemSkeleton from '../../skeleton/TaskItemSkeleton';

import {
  getImportanceDisplay as getImportanceDisplayUtil,
  getStatusDisplay as getStatusDisplayUtil
} from '../../utils/taskUtils';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskList({ sx }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    innerBox,
    whiteBorder,
    softBoxShadow,
    primaryText,
    secondaryText
  } = useCustomTheme();

  const activeSeanceId = localStorage.getItem('active_seance_id');

  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarLoading, setSnackbarLoading] = useState(false);

  const showSnackbar = useCallback((message, severity, loading = false) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarLoading(loading);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSnackbarLoading(false);
  }, []);

  const handleExpandClick = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const {
    filteredTasks: allTasks,
    loading,
    primaryFetchTasks: refreshTasks,
    searchTerm,
    setSearchTerm,
    selectedImportance,
    setSelectedImportance,
    selectedStatus,
    setSelectedStatus,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance
  } = useTaskManagement(null, showSnackbar, 'all_tasks');

  const getImportanceDisplay = (importance) => getImportanceDisplayUtil(importance, theme);
  const getStatusDisplay = (status) => getStatusDisplayUtil(status, theme);

  const filteredBySeance = activeSeanceId
    ? allTasks.filter(task => String(task.seance_etude_id) === String(activeSeanceId))
    : [];

  return (
    <Box
      width="100%"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        height: '100%',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: primaryText,
        ...sx
      }}
    >
      <TaskFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedImportance={selectedImportance}
        setSelectedImportance={setSelectedImportance}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        refreshTasks={refreshTasks}
        loading={loading}
        setIsAddTaskDialogOpen={setIsAddTaskDialogOpen}
        getImportanceDisplay={getImportanceDisplay}
      />

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none'
        }}
      >
        {loading && allTasks.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <TaskItemSkeleton key={i} />
            ))}
          </Box>
        ) : activeSeanceId ? (
          filteredBySeance.length === 0 ? (
            <Typography
              variant="body2"
              color={secondaryText}
              sx={{ textAlign: 'center', mt: 2 }}
            >
              {t('taskList.no_tasks')}
            </Typography>
          ) : (
            filteredBySeance.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={task.id === expandedTaskId}
                onExpandClick={handleExpandClick}
                getImportanceDisplay={getImportanceDisplay}
                getStatusDisplay={getStatusDisplay}
              />
            ))
          )
        ) : (
          <Typography
            variant="body2"
            color={secondaryText}
            sx={{ textAlign: 'center', mt: 2 }}
          >
            {t('taskList.no_seance')}
          </Typography>
        )}
      </Box>

      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        newTaskData={newTaskData}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={handleAddTask}
        getImportanceDisplay={getImportanceDisplay}
        getStatusDisplay={getStatusDisplay}
        addToActiveSeance={addToActiveSeance}
        onToggleAddToActiveSeance={onToggleAddToActiveSeance}
        activeSeanceExists={!!activeSeanceId}
      />

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        loading={snackbarLoading}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}
