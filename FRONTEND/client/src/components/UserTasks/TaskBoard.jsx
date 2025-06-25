import React from 'react';
import { Box, Typography } from "@mui/material";
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard'; // Import the new TaskCard component

export default function TaskBoard({ displayedTasks, onViewDetailsClick, getImportanceDisplay, getStatusDisplay }) {
  const glassBorderColor = 'rgba(255, 255, 255, 0.1)';

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'rgba(200, 160, 255, 0.3)' : 'rgba(255, 240, 245, 0.15)',
    padding: '8px',
    borderRadius: '12px',
    flexGrow: 1,
    minHeight: '100px',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
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
                border: `1px solid ${glassBorderColor}`,
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '33%',
                minWidth: '200px',
                p: 2,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#333" mb={2} sx={{ textTransform: 'capitalize' }}>
                {columnId.replace('en attente', 'En attente').replace('en cours', 'En cours').replace('terminée', 'Terminée')}
              </Typography>
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
          )}
        </Droppable>
      ))}
    </>
  );
}