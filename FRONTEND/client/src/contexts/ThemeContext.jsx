
import React, { createContext, useMemo, useState, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('light');

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
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#ff9800',
                  light: '#ffc947',
                  dark: '#c66900',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#f50057',
                },
                background: {
                  default: '#f4f6f8',
                 
                  paper: 'rgba(255, 255, 255, 0.2)', 
                },
                text: {
                  primary: 'rgba(0, 0, 0, 0.87)',
                  secondary: 'rgba(0, 0, 0, 0.6)',
                },
              }
            : {

                primary: {
                  main: '#673ab7', 
                  light: '#9a67ea',
                  dark: '#320b86', 
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#2196f3',
                },
                background: {
                  default: '#1a1a2e', 
                 
                  paper: 'rgba(255, 255, 255, 0.05)',
                },
                text: {
                  primary: '#e0e0e0',
                  secondary: 'rgba(224, 224, 224, 0.7)',
                },
              }),
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