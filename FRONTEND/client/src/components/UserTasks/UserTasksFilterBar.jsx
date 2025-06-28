import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme, // <-- ADDED useTheme hook
} from "@mui/material";
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function UserTasksFilterBar({


  searchTerm,
  setSearchTerm,
  selectedImportance,
  setSelectedImportance,
  taskViewMode,
  setTaskViewMode,
  activeSeanceExists,
  onAddTaskClick,
  onRefreshClick,
  loading,
  getImportanceDisplay,
}) {
    const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  

  return (
    <Box
      sx={{
        width: '100%',
        mb: 3,
        p: 1.5,
        // --- UPDATED: Main background for a consistent dark glass effect ---
        bgcolor: middleBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        borderRadius: '8px',
        boxShadow: softBoxShadow,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        alignItems: 'center',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}
    >
      <TextField
        fullWidth={false}
        variant="outlined"
        size="small"
        placeholder="Rechercher tâche..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          flexGrow: 1,
          minWidth: '150px',
          bgcolor: secondaryColor,
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset':  {borderColor: specialColor },
            '&.Mui-focused fieldset': {borderColor: specialColor },
            color: primaryText,
          },
          '& .MuiInputBase-input::placeholder': { color: primaryColor },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
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
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset': {borderColor: specialColor },
            '&.Mui-focused fieldset': {borderColor: specialColor },
            color: primaryColor,
          },
          '& .MuiInputLabel-root': {borderColor: specialColor },
          flexShrink: 0,
        }}
      >
        <InputLabel>Importance</InputLabel>
                <Select
                  value={selectedImportance}
                  onChange={(e) => setSelectedImportance(e.target.value)}
                  label="Importance"
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
          <MenuItem value="">Toutes</MenuItem>
          {[1, 2, 3, 4, 5].map((importance) => (<MenuItem key={importance} value={importance}>{getImportanceDisplay(importance).label}</MenuItem>))}
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
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset': {borderColor: specialColor },
            '&.Mui-focused fieldset': {borderColor: specialColor },
            color: primaryColor,
          },
          '& .MuiInputLabel-root': {borderColor: specialColor },
          flexShrink: 0,
        }}
      >
        <InputLabel>Mode Vue</InputLabel>
        <Select
          value={taskViewMode}
          onChange={(e) => setTaskViewMode(e.target.value)}
          label="Mode Vue"
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
          <MenuItem value="all_tasks">Toutes les tâches</MenuItem>
          <MenuItem value="current_seance" disabled={!activeSeanceExists}>
            Tâches de la séance active
          </MenuItem>
        </Select>
      </FormControl>

      <IconButton
        onClick={onAddTaskClick}
        sx={{
          color: specialColor,
          // --- UPDATED: Icon button background for better visibility ---
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
        onClick={onRefreshClick}
        disabled={loading}
        sx={{
          color: specialColor,
          // --- UPDATED: Icon button background for better visibility ---
          bgcolor: secondaryColor,
          borderRadius: '8px',
          p: '8px',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            border: `1px solid ${specialColor}`
          },
        }}
      >
        {loading ? (<CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />) : (<RefreshIcon fontSize="small" />)}
      </IconButton>
    </Box>
  );
}