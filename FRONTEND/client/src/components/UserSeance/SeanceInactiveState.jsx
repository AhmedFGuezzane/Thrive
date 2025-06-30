
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles'; 

export default function SeanceInactiveState({ onCreateSeanceClick }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        width: '65%', 
        maxWidth: '800px', 
        margin: 'auto',
        gap: 3,
        p: 5,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(25px) saturate(180%)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          boxShadow: '0 12px 48px 0 rgba(0, 0, 0, 0.3)',
          transform: 'scale(1.02) perspective(1000px) rotateX(2deg)',
        },
      }}
    >
      <Typography
        variant="h3"
        fontWeight={800}
        sx={{
          color: theme.palette.text.primary,
          textShadow: `0 1px 3px ${alpha(theme.palette.text.primary, 0.6)}`,
        }}
      >
        Aucune séance active
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: theme.palette.text.secondary,
          textAlign: 'center',
          mb: 2,
        }}
      >
        Commencez une nouvelle session pour suivre votre progression !
      </Typography>
      <Button
        variant="contained"
        onClick={onCreateSeanceClick}
        sx={{
          background: `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          borderRadius: '12px',
          px: 2.5, 
          py: 1, 
          fontSize: '1rem', 
          boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-3px) scale(1.05)',
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.6)}`,
            background: `linear-gradient(145deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          },
          '&:active': {
            transform: 'translateY(-1px) scale(0.98)',
            boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
        }}
        startIcon={<AddIcon sx={{ fontSize: '1.25rem' }} />}
      >
        Créer une séance
      </Button>
    </Box>
  );
}