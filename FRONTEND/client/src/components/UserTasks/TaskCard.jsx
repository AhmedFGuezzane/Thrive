import React from 'react';
import { Box, Typography, Chip, IconButton } from "@mui/material";
import { Draggable } from '@hello-pangea/dnd';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function TaskCard({ task, index, onViewDetailsClick, getImportanceDisplay, getStatusDisplay }) {
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    background: isDragging ? 'rgba(128, 0, 128, 0.7)' : 'rgba(255, 255, 255, 0.15)',
    color: isDragging ? '#fff' : '#333',
    border: isDragging ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    flexShrink: 0,
    ...draggableStyle,
  });

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="body1" fontWeight="bold" color="#333" sx={{ flexGrow: 1, mr: 1 }}>
              {task.titre}
            </Typography>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent drag from triggering view details
                onViewDetailsClick(task);
              }}
              sx={{ color: 'rgba(0,0,0,0.6)' }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={getImportanceDisplay(task.importance).label}
              size="small"
              sx={{
                backgroundColor: getImportanceDisplay(task.importance).bgColor,
                color: getImportanceDisplay(task.importance).textColor,
                fontWeight: 'bold',
                borderRadius: '6px',
                opacity: 0.9,
                height: '24px',
                px: '8px',
              }}
            />
            <Chip
              label={getStatusDisplay(task.statut).label}
              size="small"
              sx={{
                backgroundColor: getStatusDisplay(task.statut).bgColor,
                color: getStatusDisplay(task.statut).textColor,
                fontWeight: 'bold',
                borderRadius: '6px',
                opacity: 0.9,
                height: '24px',
                px: '8px',
              }}
            />
          </Box>
        </Box>
      )}
    </Draggable>
  );
}