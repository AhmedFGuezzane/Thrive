import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

export default function UserHome() {
    // Define glassmorphism colors for UserHome
    const glassHomeBg = 'rgba(255, 240, 245, 0.2)'; // Light pastel pink/lavender for transparency
    const glassHomeBorderColor = 'rgba(255, 255, 255, 0.1)'; // Subtle border

    // State for the timer
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
        // Cleanup function to clear the interval when the component unmounts
        // or when isRunning changes to false
        return () => clearInterval(intervalId);
    }, [isRunning]);

    // Function to handle Play/Pause/Resume
    const handlePlayPause = () => {
        setIsRunning(prev => !prev);
    };

    // Function to handle Stop
    const handleStop = () => {
        setIsRunning(false);
        setTime(0); // Reset time
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

    // Define glassmorphism colors for the timer bar
    const glassTimerBarBg = 'rgba(200, 160, 255, 0.3)'; // A slightly darker, more opaque pastel purple
    const glassTimerBarBorderColor = 'rgba(255, 255, 255, 0.2)'; // More prominent border for distinction

    return (
        <Box
            width="98%" // Take 98% width of the parent (the 'content' Box)
            height="100%" // Take 100% height of the parent
            mx="1rem"
            sx={{
                backgroundColor: glassHomeBg,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${glassHomeBorderColor}`,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                p: 3, // Add some padding inside the content box
                display: 'flex',
                flexDirection: 'column', // Changed to column to stack content and timer bar
                justifyContent: 'space-between', // Distribute space
                alignItems: 'center',
                color: '#333',
                position: 'relative',
            }}
        >
            {/* Main content area - now a flex container for two columns */}
            <Box
                flexGrow={1} // Allows this box to take available vertical space
                display="flex"
                flexDirection="row" // Arrange children horizontally
                width="100%" // Ensure it takes full width of its parent
                gap={2} // Gap between the two columns
                pb={2} // Padding bottom to separate from the timer bar
            >
                {/* Left Column: Tasks Table */}
                <Box
                    width="50%" // 50% width of the main content area
                    height="100%" // Take full height of the main content area
                    sx={{
                        backgroundColor: glassHomeBg, // Reuse home background style
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${glassHomeBorderColor}`,
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px', // Slightly smaller radius for inner boxes
                        p: 2, // Padding inside tasks box
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        overflow: 'auto' // Enable scrolling if content overflows
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" color="#333" mb={1}>
                        My Tasks
                    </Typography>
                    {/* Placeholder for table content */}
                    {[...Array(10)].map((_, index) => (
                        <Box key={index} sx={{
                            p: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.1)', // Slightly opaque row background
                            borderRadius: '8px',
                            mb: 0.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#444'
                        }}>
                            <Typography variant="body1">Task {index + 1}: Study React</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Due: 2024-12-{15 + index}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Right Column Container */}
                <Box
                    width="50%" // 50% width of the main content area
                    height="100%" // Take full height of the main content area
                    display="flex"
                    flexDirection="column" // Stack children vertically
                    gap={2} // Gap between Tips and Empty Box
                >
                    {/* Top Right Box: Tips */}
                    <Box
                        flexGrow={1} // Takes available space
                        height="50%" // Explicitly define height as 50%
                        sx={{
                            backgroundColor: glassHomeBg, // Reuse home background style
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${glassHomeBorderColor}`,
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" color="#333" mb={1}>
                            Study Tips
                        </Typography>
                        <Typography variant="body2" color="#555">
                            "Break your study sessions into smaller, manageable chunks. Use the Pomodoro Technique!"
                        </Typography>
                    </Box>

                    {/* Bottom Right Box: Empty for now */}
                    <Box
                        flexGrow={1} // Takes remaining available space
                        height="50%" // Explicitly define height as 50%
                        sx={{
                            backgroundColor: glassHomeBg, // Reuse home background style
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${glassHomeBorderColor}`,
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#777'
                        }}
                    >
                        <Typography variant="body1">
                            (Empty Box for Future Content)
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Study Session Timer Bar at the bottom */}
            <Box
                width="22rem" // Fixed width to fit content
                height="4rem" // Fixed height for the timer bar (unchanged)
                mx="auto" // Center the bar horizontally
                sx={{
                    backgroundColor: glassTimerBarBg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${glassTimerBarBorderColor}`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Distribute items horizontally
                    px: 2, // Padding left and right
                    mt: 3,
                    color: '#fff',
                }}
            >
                {/* Timer Display */}
                <Typography variant="h5" fontWeight="medium">
                    {formatTime(time)}
                </Typography>

                {/* Buttons Container for better grouping and spacing */}
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
                                ml: 2, // Margin left to separate from timer display
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
                                ml: 1, // Margin left to separate from play/pause button
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
