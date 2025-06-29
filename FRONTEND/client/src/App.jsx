// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, useTheme } from "@mui/material";

import AppRoutes from "./AppRoutes";
import SnackbarAlert from "./components/common/SnackbarAlert";
import GlobalPhaseTransition from "./components/common/GlobalPhaseTransition";
import ErrorBoundary from "./components/common/ErrorBoundary";

import { SnackbarProvider } from "./contexts/SnackbarContext";
import { TimerProvider } from "./contexts/TimerContext";

import "./App.css";

function App() {
  const theme = useTheme();

  const lightBackground = "/assets/images/user/user_background.jpg";
  const darkBackground = "/assets/images/user/user_background_dark.jpg";
  const backgroundImage =
    theme.palette.mode === "light" ? lightBackground : darkBackground;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <Router>
        <SnackbarProvider>
          <TimerProvider>
            <ErrorBoundary>
              <GlobalPhaseTransition />
              <AppRoutes />
              <SnackbarAlert />
            </ErrorBoundary>
          </TimerProvider>
        </SnackbarProvider>
      </Router>
    </Box>
  );
}

export default App;
