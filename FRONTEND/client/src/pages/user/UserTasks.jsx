import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Initial tasks for each column
const initialTasks = {
    'todo': [
        { id: 'task-1', content: 'Review React Hooks documentation', priority: 'High' },
        { id: 'task-2', content: 'Plan next study session topics', priority: 'Medium' },
        { id: 'task-3', content: 'Read article on CSS-in-JS', priority: 'Low' },
    ],
    'doing': [],
    'done': []
};

export default function UserTasks() {
    // Glassmorphism colors (matching UserHome for consistency)
    const glassPageBg = 'rgba(255, 240, 245, 0.2)'; // Light pastel pink/lavender for transparency
    const glassBorderColor = 'rgba(255, 255, 255, 0.1)'; // Subtle border

    // State for tasks in each column
    const [tasks, setTasks] = useState(initialTasks);

    // State for the timer (same as UserHome)
    const [time, setTime] = useState(0); // Time in seconds
    const [isRunning, setIsRunning] = useState(false); // Timer running status

    // Effect to manage the timer interval
    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);

    // Function to handle Play/Pause/Resume
    const handlePlayPause = () => {
        setIsRunning(prev => !prev);
    };

    // Function to handle Stop
    const handleStop = () => {
        setIsRunning(false);
        setTime(0);
    };

    // Function to format time into HH:MM:SS
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map(unit => String(unit).padStart(2, '0'))
            .join(':');
    };

    // Glassmorphism colors for the timer bar (same as UserHome)
    const glassTimerBarBg = 'rgba(200, 160, 255, 0.3)';
    const glassTimerBarBorderColor = 'rgba(255, 255, 255, 0.2)';

    // Function to handle drag end event
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside a droppable area
        if (!destination) {
            return;
        }

        // If dropped in the same column at the same position, do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Get the list that the item came from
        const start = tasks[source.droppableId];
        // Get the list that the item was dropped into
        const finish = tasks[destination.droppableId];

        // Moving within the same list
        if (start === finish) {
            const newTasks = Array.from(start);
            const [reorderedItem] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, reorderedItem);

            setTasks(prevTasks => ({
                ...prevTasks,
                [source.droppableId]: newTasks,
            }));
            return;
        }

        // Moving from one list to another
        const startTasks = Array.from(start);
        const [movedItem] = startTasks.splice(source.index, 1); // Remove from source
        const finishTasks = Array.from(finish);
        finishTasks.splice(destination.index, 0, movedItem); // Add to destination

        setTasks(prevTasks => ({
            ...prevTasks,
            [source.droppableId]: startTasks,
            [destination.droppableId]: finishTasks,
        }));
    };

    // Function to get the background color of the draggable item based on its state
    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        padding: '8px',
        margin: '0 0 8px 0',
        borderRadius: '8px',
        background: isDragging ? 'rgba(128, 0, 128, 0.6)' : 'rgba(255, 255, 255, 0.1)', // Highlight when dragging
        color: isDragging ? '#fff' : '#333',
        border: isDragging ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isDragging ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        // styles we are applying to the draggable look spread on the body tag
        ...draggableStyle,
    });

    // Function to get the background color of the droppable area
    const getListStyle = (isDraggingOver) => ({
        background: isDraggingOver ? 'rgba(200, 160, 255, 0.4)' : glassPageBg, // Highlight when dragging over
        padding: '8px',
        borderRadius: '12px',
        flexGrow: 1, // Allow columns to grow
        minHeight: '100px', // Minimum height for droppable area
        overflowY: 'auto', // Scroll for content
    });


    return (
        <Box
            width="98%"
            height="100%"
            mx="1rem"
            sx={{
                backgroundColor: glassPageBg, // Base background for the entire page content area
                backdropFilter: 'blur(8px)',
                border: `1px solid ${glassBorderColor}`,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                p: 3,
                display: 'flex',
                flexDirection: 'column', // Stack columns area and timer bar vertically
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#333',
                position: 'relative',
            }}
        >
            {/* Main content area for tasks (takes up remaining vertical space) */}
            <Box
                flexGrow={1}
                width="100%"
                display="flex"
                flexDirection="row" // Arrange task columns horizontally
                gap={2}
                pb={2} // Padding bottom to separate from the timer bar
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.entries(tasks).map(([columnId, columnTasks]) => (
                        <Droppable key={columnId} droppableId={columnId}>
                            {(provided, snapshot) => (
                                <Box
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                    sx={{
                                        border: `1px solid ${glassBorderColor}`, // Glassmorphism border for columns
                                        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)', // Soft shadow
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexBasis: '33%', // Each column takes roughly 1/3rd of the width
                                        minWidth: '200px', // Minimum width to prevent shrinking too much
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" color="#333" mb={2} sx={{ textTransform: 'capitalize' }}>
                                        {columnId.replace('todo', 'To Do').replace('doing', 'Doing').replace('done', 'Done')}
                                    </Typography>
                                    {columnTasks.length === 0 && (
                                        <Typography variant="body2" color="#777" sx={{ textAlign: 'center', p: 2 }}>
                                            No tasks here yet.
                                        </Typography>
                                    )}
                                    {columnTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided, snapshot) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <Typography variant="body1">{task.content}</Typography>
                                                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
                                                        {task.priority}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder} {/* Important for drag-and-drop to work correctly */}
                                </Box>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </Box>

            {/* Study Session Timer Bar at the bottom */}
            <Box
                width="22rem"
                height="4rem"
                mx="auto"
                sx={{
                    backgroundColor: glassTimerBarBg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${glassTimerBarBorderColor}`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    mt: 3,
                    color: '#fff',
                }}
            >
                {/* Timer Display */}
                <Typography variant="h5" fontWeight="medium">
                    {formatTime(time)}
                </Typography>

                {/* Buttons Container */}
                <Box display="flex" alignItems="center">
                    {/* Play/Pause Button */}
                    <Tooltip title={isRunning ? "Pause Timer" : "Start/Resume Timer"}>
                        <IconButton
                            onClick={handlePlayPause}
                            sx={{
                                color: '#fff',
                                bgcolor: 'rgba(128, 0, 128, 0.4)',
                                '&:hover': {
                                    bgcolor: 'rgba(128, 0, 128, 0.6)',
                                },
                                borderRadius: '50%',
                                p: 1,
                                ml: 2,
                            }}
                        >
                            {isRunning ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                        </IconButton>
                    </Tooltip>

                    {/* Stop Button */}
                    <Tooltip title="Stop Session">
                        <IconButton
                            onClick={handleStop}
                            sx={{
                                color: '#fff',
                                bgcolor: 'rgba(255, 99, 71, 0.4)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 99, 71, 0.6)',
                                },
                                borderRadius: '50%',
                                p: 1,
                                ml: 1,
                            }}
                        >
                            <StopIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
}
