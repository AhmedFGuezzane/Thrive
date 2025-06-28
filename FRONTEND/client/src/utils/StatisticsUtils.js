// This file can contain helper functions to format data for the UI
import { useTheme } from '@mui/material';

// Function to format a date string for display
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Function to format the activity by weekday data for a chart
export const formatActivityDataForChart = (data, theme) => {
    if (!data) return [];
    
    const colors = {
        bar: theme.palette.custom.color.special,
        text: theme.palette.custom.text.primary,
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return daysOfWeek.map(day => ({
        day: day.substring(0, 3), // e.g., "Mon"
        value: data[day] || 0,
        color: colors.bar,
    }));
};