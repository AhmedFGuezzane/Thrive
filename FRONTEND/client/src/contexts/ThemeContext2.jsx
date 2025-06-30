// src/contexts/ThemeContext.jsx
import React, { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeContextProvider({ children }) {
  // Initialize from localStorage or default to 'light'
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  // Save to localStorage whenever mode changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === 'light' ? '#FFA500' : '#000000',
            paper: mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
          },
          custom: {
            box: {
              inner: mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0, 0, 0, 0.51)',
              middle: mode === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              outer: mode === 'light' ? 'rgba(255,255,255,0.15)' : 'rgba(255, 255, 255, 0.15)',
              special: mode === 'light' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
            },
            text: {
              primary: mode === 'light' ? '#000000' : '#ffffff',
              secondary: mode === 'light' ? '#ffffff' : '#000000',
              special: mode === 'light' ? '#FF6600' : '#B39DDB',
            },
            color: {
              primary: mode === 'light' ? '#000000' : '#ffffff',
              secondary: mode === 'light' ? '#ffffff' : '#000000',
              special: mode === 'light' ? '#FF8C00' : '#B39DDB',
              white: mode === 'light' ? '#FFFFFF' : '#FFFFFF',
              black: mode === 'light' ? '#000000' : '#000000',
            },
            button: {
              primary: mode === 'light' ? '#FF8C00' : '#ffa500',
              secondary: mode === 'light' ? '#FFA500' : '#ffcc00',
              special: mode === 'light' ? '#FFD580' : '#B39DDB',
            },
            border: {
              white: mode === 'light' ? 'rgba(255, 255, 255, 0.57)' : 'rgba(255, 255, 255, 0.42)',
              black: mode === 'light' ? 'rgb(0, 0, 0)' : 'rgb(0, 0, 0)',
              special: mode === 'light' ? 'rgb(255, 115, 0)' : '#B39DDB',
            },
            boxShadow : {
                soft : mode === 'light' ? '0 0px 10px 0 rgba(0, 0, 0, 0.29)' : '0 0 4px 0 rgba(255, 255, 255, 0.29)',
            }
          },
        },
        typography: {
          fontFamily: 'Poppins, sans-serif',
          h3: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 400,
          },
        },
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
