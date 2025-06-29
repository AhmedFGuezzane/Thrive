// src/components/UserTasks/UserTasksFilterBar.jsx
import React from 'react';
import {
  Box, TextField, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, IconButton, CircularProgress, useTheme
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function UserTasksFilterBar({
  searchTerm, setSearchTerm, selectedImportance, setSelectedImportance,
  taskViewMode, setTaskViewMode, activeSeanceExists,
  onAddTaskClick, onRefreshClick, loading, getImportanceDisplay,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { innerBox, middleBox, secondaryColor, specialColor, primaryText, whiteBorder, softBoxShadow } = useCustomTheme();

  return (
    <Box sx={{
      width: '100%', mb: 3, p: 1.5,
      bgcolor: middleBox, backdropFilter: 'blur(10px)',
      border: `1px solid ${whiteBorder}`, borderRadius: '8px',
      boxShadow: softBoxShadow, display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
      gap: 1.5, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0,
    }}>
      <TextField
        size="small"
        placeholder={t("filterBar.search_placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1, minWidth: '150px', bgcolor: secondaryColor, borderRadius: '8px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          )
        }}
      />
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, bgcolor: secondaryColor, borderRadius: '8px' }}>
        <InputLabel>{t("filterBar.importance")}</InputLabel>
        <Select
          value={selectedImportance}
          onChange={(e) => setSelectedImportance(e.target.value)}
          label={t("filterBar.importance")}
        >
          <MenuItem value="">{t("filterBar.all")}</MenuItem>
          {[1, 2, 3, 4, 5].map((importance) => (
            <MenuItem key={importance} value={importance}>
              {getImportanceDisplay(importance).label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, bgcolor: secondaryColor, borderRadius: '8px' }}>
        <InputLabel>{t("filterBar.view_mode")}</InputLabel>
        <Select
          value={taskViewMode}
          onChange={(e) => setTaskViewMode(e.target.value)}
          label={t("filterBar.view_mode")}
        >
          <MenuItem value="all_tasks">{t("filterBar.all_tasks")}</MenuItem>
          <MenuItem value="current_seance" disabled={!activeSeanceExists}>
            {t("filterBar.active_seance_tasks")}
          </MenuItem>
        </Select>
      </FormControl>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={onRefreshClick} disabled={loading} sx={{ color: primaryText }}>
          {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
        <IconButton onClick={onAddTaskClick} sx={{
          backgroundColor: specialColor,
          color: theme.palette.getContrastText(specialColor),
          '&:hover': {
            backgroundColor: alpha(specialColor, 0.8),
          },
        }}>
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
