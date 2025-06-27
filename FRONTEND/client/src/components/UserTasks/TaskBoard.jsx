import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard'; // Import the new TaskCard component
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskBoard({ displayedTasks, onViewDetailsClick, getImportanceDisplay, getStatusDisplay }) {

  const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow } = useCustomTheme();


  const glassBorderColor = 'rgba(255, 255, 255, 0.1)';

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'rgba(255, 255, 255, 0.57)' : middleBox,
    padding: '8px',
    borderRadius: '12px',
    border: `1px solid ${whiteBorder}`,
    flexGrow: 1,
    minHeight: '100px',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::WebkitScrollbar': { display: 'none' },
    msOverflowStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
  });

return (
    <>
      {Object.entries(displayedTasks).map(([columnId, columnTasks]) => (
        <Droppable key={columnId} droppableId={columnId}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
              sx={{
                // This is the outer flex container for the column.
                // It contains a sticky header and a scrollable body.
                border: `1px solid ${glassBorderColor}`,
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column', // This is essential for the layout
                flexBasis: '33%',
                minWidth: '200px',
                p: 2,
                position: 'relative', // --- ADDED: This is the scrolling context for the sticky element ---
              }}
            >
              {/* --- NEW: This Box is the sticky header --- */}
              <Box
                sx={{
                  position: 'sticky', // --- CHANGED: Use sticky position ---
                  top: 0, // Stick to the top of the container
                  zIndex: 10, // Ensure it sits on top of scrolling content
                  mb: 2, // Margin below the header
                  p: '0 16px 8px 16px', // Add padding to match the container's p: 2
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" fontWeight="bold" color={primaryText} sx={{ textTransform: 'capitalize' }}>
                  {columnId.replace('en attente', 'En attente').replace('en cours', 'En cours').replace('terminée', 'Terminée')}
                </Typography>
              </Box>

              {/* --- NEW: This Box is the scrollable content container --- */}
              <Box
                sx={{
                  flexGrow: 1, // Allow this box to take up remaining vertical space
                  overflowY: 'auto', // --- ADDED: The scrolling now happens here ---
                  scrollbarWidth: 'none',
                  '&::WebkitScrollbar': { display: 'none' },
                  msOverflowStyle: 'none',
                  // Ensure this box starts right after the sticky header
                }}
              >
                {columnTasks.length === 0 && (
                  <Typography variant="body2" color="#777" sx={{ textAlign: 'center', p: 2 }}>
                    Aucune tâche ici.
                  </Typography>
                )}
                {columnTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onViewDetailsClick={onViewDetailsClick}
                    getImportanceDisplay={getImportanceDisplay}
                    getStatusDisplay={getStatusDisplay}
                  />
                ))}
                {provided.placeholder}
              </Box>
            </Box>
          )}
        </Droppable>
      ))}
    </>
  );
}