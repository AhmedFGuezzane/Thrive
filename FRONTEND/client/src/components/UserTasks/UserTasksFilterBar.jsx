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
} from "@mui/material";
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
  return (
    <Box
      sx={{
        width: '100%',
        mb: 3,
        p: 1.5,
        bgcolor: 'rgba(255, 240, 245, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
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
          flexGrow: 1, minWidth: '150px', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px',
          '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' }, color: '#333' },
          '& .MuiInputBase-input::placeholder': { color: 'rgba(0,0,0,0.6)' },
        }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.5)' }} /></InputAdornment>) }}
      />
      <FormControl
        variant="outlined" size="small"
        sx={{
          minWidth: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px',
          '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' }, color: '#333' },
          '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.6)' }, flexShrink: 0,
        }}
      >
        <InputLabel>Importance</InputLabel>
        <Select value={selectedImportance} onChange={(e) => setSelectedImportance(e.target.value)} label="Importance">
          <MenuItem value="">Toutes</MenuItem>
          {[1, 2, 3, 4, 5].map((importance) => (<MenuItem key={importance} value={importance}>{getImportanceDisplay(importance).label}</MenuItem>))}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined" size="small"
        sx={{
          minWidth: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px',
          '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' }, color: '#333' },
          flexShrink: 0,
        }}
      >
        <InputLabel>Mode Vue</InputLabel>
        <Select value={taskViewMode} onChange={(e) => setTaskViewMode(e.target.value)} label="Mode Vue">
          <MenuItem value="all_tasks">Toutes les tâches</MenuItem>
          <MenuItem value="current_seance" disabled={!activeSeanceExists}>
            Tâches de la séance active
          </MenuItem>
        </Select>
      </FormControl>

      <IconButton
        onClick={onAddTaskClick}
        sx={{
          color: 'rgba(128, 0, 128, 0.9)',
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          p: '8px',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.2)',
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={onRefreshClick} disabled={loading} sx={{ color: 'rgba(128, 0, 128, 0.9)', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: '8px', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, }}>
        {loading ? (<CircularProgress size={20} sx={{ color: 'rgba(128, 0, 128, 0.7)' }} />) : (<RefreshIcon fontSize="small" />)}
      </IconButton>
    </Box>
  );
}