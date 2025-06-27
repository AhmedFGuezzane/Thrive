import React from 'react';
import { Box, Typography, Chip, IconButton, useTheme } from "@mui/material";
import { Draggable } from '@hello-pangea/dnd';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskCard({ task, index, onViewDetailsClick, getImportanceDisplay, getStatusDisplay }) {

    const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    background: isDragging ? specialColor : innerBox,
    color: isDragging ? primaryText : secondaryText,
    border: isDragging ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: softBoxShadow,
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
          <Box display="flex"justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="body1" fontWeight="bold" color= {primaryText} sx={{ flexGrow: 1, mr: 1 }}>
              {task.titre}
            </Typography>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent drag from triggering view details
                onViewDetailsClick(task);
              }}
              sx={{ color: '{primaryText}' }}
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