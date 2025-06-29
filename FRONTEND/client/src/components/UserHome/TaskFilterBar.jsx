import React from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskFilterBar({
  searchTerm,
  setSearchTerm,
  selectedImportance,
  setSelectedImportance,
  selectedStatus,
  setSelectedStatus,
  refreshTasks,
  loading,
  setIsAddTaskDialogOpen,
  getImportanceDisplay,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    innerBox, secondaryColor, primaryText, primaryColor,
    specialColor, whiteBorder, softBoxShadow
  } = useCustomTheme();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: innerBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '8px',
        p: 1.5,
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <TextField
        fullWidth={false}
        variant="outlined"
        size="small"
        placeholder={t('taskFilter.search_placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          flexGrow: 1,
          minWidth: '150px',
          bgcolor: secondaryColor,
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            },
            '&:hover fieldset': { borderColor: specialColor },
            '&.Mui-focused fieldset': { borderColor: specialColor },
            color: primaryText,
          },
          '& .MuiInputBase-input::placeholder': { color: primaryColor },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: primaryColor }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: 120,
          bgcolor: secondaryColor,
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            },
            '&:hover fieldset': { borderColor: specialColor },
            '&.Mui-focused fieldset': { borderColor: specialColor },
            color: primaryColor,
          },
        }}
      >
        <InputLabel>{t('taskFilter.importance')}</InputLabel>
        <Select
          value={selectedImportance}
          onChange={(e) => setSelectedImportance(e.target.value)}
          label={t('taskFilter.importance')}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: secondaryColor,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${whiteBorder}`,
              },
            },
          }}
        >
          <MenuItem value="">{t('taskFilter.all')}</MenuItem>
          {[1, 2, 3, 4, 5].map((importance) => (
            <MenuItem key={importance} value={importance}>
              {getImportanceDisplay(importance).label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: 120,
          bgcolor: secondaryColor,
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            },
            '&:hover fieldset': { borderColor: specialColor },
            '&.Mui-focused fieldset': { borderColor: specialColor },
            color: primaryColor,
          },
        }}
      >
        <InputLabel>{t('taskFilter.status')}</InputLabel>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          label={t('taskFilter.status')}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: secondaryColor,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${whiteBorder}`,
              },
            },
          }}
        >
          <MenuItem value="">{t('taskFilter.all')}</MenuItem>
          <MenuItem value="en cours">{t('taskFilter.in_progress')}</MenuItem>
          <MenuItem value="en attente">{t('taskFilter.pending')}</MenuItem>
          <MenuItem value="terminée">{t('taskFilter.completed')}</MenuItem>
        </Select>
      </FormControl>

      <IconButton
        onClick={() => setIsAddTaskDialogOpen(true)}
        sx={{
          color: specialColor,
          bgcolor: secondaryColor,
          borderRadius: '8px',
          p: '8px',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${specialColor}`
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      <IconButton
        onClick={refreshTasks}
        disabled={loading}
        sx={{
          color: specialColor,
          bgcolor: secondaryColor,
          borderRadius: '8px',
          p: '8px',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${specialColor}`
          },
        }}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: specialColor }} />
        ) : (
          <RefreshIcon fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
}
