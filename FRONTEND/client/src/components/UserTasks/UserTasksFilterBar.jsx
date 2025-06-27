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

  return (
    <Box
      sx={{
        width: '100%',
        mb: 3,
        p: 1.5,
        // --- UPDATED: Main background for a consistent dark glass effect ---
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
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
          // --- UPDATED: Text field background for consistency ---
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            // --- UPDATED: Borders for contrast ---
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            // --- UPDATED: Text color for readability ---
            color: theme.palette.text.primary,
          },
          // --- UPDATED: Placeholder color for readability ---
          '& .MuiInputBase-input::placeholder': { color: theme.palette.text.secondary },
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
          // --- UPDATED: Select background for consistency ---
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            // --- UPDATED: Borders for contrast ---
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            // --- UPDATED: Text color for readability ---
            color: theme.palette.text.primary,
          },
          // --- UPDATED: Label color for readability ---
          '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
          flexShrink: 0,
        }}
      >
        <InputLabel>Importance</InputLabel>
        <Select
          value={selectedImportance}
          onChange={(e) => setSelectedImportance(e.target.value)}
          label="Importance"
          // --- NEW: Style the dropdown menu popover for better visibility ---
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
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
          // --- UPDATED: Select background for consistency ---
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            // --- UPDATED: Borders for contrast ---
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            // --- UPDATED: Text color for readability ---
            color: theme.palette.text.primary,
          },
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
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
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
          color: theme.palette.primary.main,
          // --- UPDATED: Icon button background for better visibility ---
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          p: '8px',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={onRefreshClick}
        disabled={loading}
        sx={{
          color: theme.palette.primary.main,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          p: '8px',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          },
        }}
      >
        {loading ? (<CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />) : (<RefreshIcon fontSize="small" />)}
      </IconButton>
    </Box>
  );
}