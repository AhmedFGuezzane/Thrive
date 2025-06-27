// src/contexts/ThemeContext.jsx
import React, { createContext, useMemo, useState, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a context to hold the theme mode and toggle function
const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeContextProvider({ children }) {
  // Use state to track the current mode, with 'light' as the default
  const [mode, setMode] = useState('light');

  // Memoize the toggle function to prevent unnecessary re-renders
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  // Memoize the theme object. It will only be re-created if the 'mode' changes.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // --- Custom Palettes based on mode ---
          ...(mode === 'light'
            ? {
                // LIGHT MODE: Warm Orange Palette
                primary: {
                  main: '#ff9800', // Orange
                  light: '#ffc947',
                  dark: '#c66900',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#f50057', // Pink accent
                },
                background: {
                  default: '#f4f6f8', // Very light grey background
                  // The 'paper' color is the background for your glassmorphism cards/boxes
                  paper: 'rgba(255, 255, 255, 0.2)', // Translucent white for glass effect
                },
                text: {
                  primary: 'rgba(0, 0, 0, 0.87)',
                  secondary: 'rgba(0, 0, 0, 0.6)',
                },
              }
            : {
                // DARK MODE: Cool Blue/Purple Palette
                primary: {
                  main: '#673ab7', // Deep Purple
                  light: '#9a67ea',
                  dark: '#320b86', // This is still a deep color, good for buttons but not text
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#2196f3', // Blue accent
                },
                background: {
                  default: '#1a1a2e', // Dark blue background
                  // The 'paper' color for the dark glassmorphism effect
                  paper: 'rgba(255, 255, 255, 0.05)', // A very subtle translucent white/grey
                },
                // --- CORRECTED TEXT COLORS FOR DARK MODE ---
                text: {
                  primary: '#e0e0e0', // A soft white/light grey for main text
                  secondary: 'rgba(224, 224, 224, 0.7)', // A translucent version for secondary text
                },
              }),
        },
        // --- Shared styles for both modes ---
        typography: {
          fontFamily: 'Poppins, sans-serif', // Using a more modern font
          h3: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 400,
          },
        },
        // You can add more global styles here if needed
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}