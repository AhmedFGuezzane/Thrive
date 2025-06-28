import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, Tooltip } from "@mui/material";
import { Droppable } from '@hello-pangea/dnd';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TaskCard from './TaskCard';
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

    // --- ADDED STATE FOR SORT ORDER PER COLUMN ---
    const [sortOrder, setSortOrder] = useState({}); // e.g., { 'en attente': 'asc', 'en cours': 'desc' }

    // Function to toggle the sort order for a specific column
    const toggleSortOrder = (columnId) => {
        setSortOrder(prev => {
            const currentOrder = prev[columnId];
            // Cycle through 'asc' -> 'desc' -> null (no sort)
            const newOrder = currentOrder === 'asc' ? 'desc' : (currentOrder === 'desc' ? null : 'asc');
            return { ...prev, [columnId]: newOrder };
        });
    };
    // ---------------------------------------------

    return (
        <>
            {Object.entries(displayedTasks).map(([columnId, columnTasks]) => {
                // --- CORRECTED SORTING LOGIC FOR EACH COLUMN ---
                const columnSortOrder = sortOrder[columnId];
                let sortedColumnTasks = [...columnTasks]; // Create a copy
                
                if (columnSortOrder) {
                    sortedColumnTasks.sort((a, b) => {
                        const importanceA = a.importance || Infinity; // Treat null/0 as Infinity to push to end
                        const importanceB = b.importance || Infinity;

                        // Sort by importance, pushing N/A to the end
                        if (columnSortOrder === 'asc') {
                            return importanceA - importanceB;
                        } else { // 'desc'
                            return importanceB - importanceA;
                        }
                    });
                }
                // ------------------------------------------

                return ( // <-- Explicit return from the map callback
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
                                    position: 'relative',
                                }}
                            >
                                {/* --- Header with the sort button --- */}
                                <Box
                                    sx={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        mb: 2,
                                        p: '0 16px 8px 16px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" color={primaryText} sx={{ textTransform: 'capitalize' }}>
                                        {columnId.replace('en attente', 'En attente').replace('en cours', 'En cours').replace('terminée', 'Terminée')}
                                    </Typography>
                                    {/* Sort Button */}
                                    <IconButton size="small" onClick={() => toggleSortOrder(columnId)} sx={{ color: primaryText }}>
                                        <Tooltip title={columnSortOrder ? `Sort by Importance ${columnSortOrder === 'asc' ? '(Asc)' : '(Desc)'}` : 'Sort by Importance'} placement="top">
                                            {columnSortOrder === 'asc' ? <ArrowUpwardIcon /> : columnSortOrder === 'desc' ? <ArrowDownwardIcon /> : <SortIcon />}
                                        </Tooltip>
                                    </IconButton>
                                </Box>

                                {/* --- Scrollable content container --- */}
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        overflowY: 'auto',
                                        scrollbarWidth: 'none',
                                        '&::WebkitScrollbar': { display: 'none' },
                                        msOverflowStyle: 'none',
                                    }}
                                >
                                    {sortedColumnTasks.length === 0 && (
                                        <Typography variant="body2" color="#777" sx={{ textAlign: 'center', p: 2 }}>
                                            Aucune tâche ici.
                                        </Typography>
                                    )}
                                    {sortedColumnTasks.map((task, index) => (
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
                ); // <-- End of the outer map's return
            })}
        </>
    );
}