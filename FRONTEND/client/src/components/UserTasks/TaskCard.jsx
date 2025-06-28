import React from 'react';
import { Box, Typography, IconButton, useTheme, Tooltip } from "@mui/material";
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    flexShrink: 0,
    ...draggableStyle,
  });

  // Get the display information for importance
  const importanceDisplay = getImportanceDisplay(task.importance);
  
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" gap={1}>
                {/* Importance Indicator */}
                <Tooltip title={`Importance: ${importanceDisplay.label}`} placement="top">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%',
                            // --- CORRECTED: Use the color from the utility for the background ---
                            bgcolor: importanceDisplay.color, 
                            // --- CORRECTED: Use the white color for the icon ---
                            color: whiteColor, 
                        }}
                    >
                        {importanceDisplay.icon}
                    </Box>
                </Tooltip>
            <Typography variant="body1" fontWeight="bold" color= {primaryText} sx={{ flexGrow: 1, ml: 1 }}>
              {task.titre}
            </Typography>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent drag from triggering view details
                onViewDetailsClick(task);
              }}
              sx={{ color: primaryText }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Draggable>
  );
}