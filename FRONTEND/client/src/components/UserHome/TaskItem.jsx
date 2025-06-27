// src/components/UserHome/TaskItem.jsx
import React from 'react';
import { Box, Typography, Chip, useTheme, Collapse, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskItem({
  task,
  isExpanded,
  onExpandClick,
  getImportanceDisplay,
  getStatusDisplay,
}) {
    const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  

  return (
    <Box
      key={task.id}
      onClick={() => onExpandClick(task.id)}
      sx={{
        p: 3,
        bgcolor: innerBox,
        borderRadius: '12px',
        mb: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width:"100%",
        border: `1px solid ${whiteBorder}`,
        color: primaryText,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.81)' : 'rgba(255, 255, 255, 0.86)',
          border : `1px solid ${specialBorder}`,
          
        },
        flexShrink: 0,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color= {primaryColor}
          sx={{ flexGrow: 1, mr: 1 }}
        >
          {task.titre}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={getImportanceDisplay(task.importance).label}
            size="small"
            icon={getImportanceDisplay(task.importance).icon}
            sx={{
              backgroundColor: getImportanceDisplay(task.importance).bgColor,
              color: getImportanceDisplay(task.importance).textColor,
              fontWeight: 'bold',
              borderRadius: '6px',
              '.MuiChip-icon': { color: 'inherit !important' },
              opacity: 0.9,
              height: '24px',
              px: '8px',
            }}
          />
          {task.statut && (
            <Chip
              label={getStatusDisplay(task.statut).label}
              size="small"
              icon={getStatusDisplay(task.statut).icon}
              sx={{
                backgroundColor: getStatusDisplay(task.statut).bgColor,
                color: getStatusDisplay(task.statut).textColor,
                fontWeight: 'bold',
                borderRadius: '6px',
                '.MuiChip-icon': { color: 'inherit !important' },
                opacity: 0.9,
                height: '24px',
                px: '8px',
              }}
            />
          )}
        </Box>
        <IconButton size="small" sx={{ color: theme.palette.text.primary, ml: 1 }}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
          {task.description && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1, whiteWhiteSpace: 'pre-wrap' }}>
              <Typography component="span" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                Description :{' '}
              </Typography>
              {task.description}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary">
            <Typography component="span" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
              Autres détails :{' '}
            </Typography>
            {task.date_creation &&
              `Créée le: ${new Date(task.date_creation).toLocaleDateString()} `}
            {task.date_modification &&
              `Dernière modification: ${new Date(task.date_modification).toLocaleDateString()}`}
            {!task.date_creation && !task.date_modification && 'Aucune information supplémentaire.'}
          </Typography>
        </Box>
      </Collapse>

      {task.date_fin && (
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary, mt: 1 }}>
          Échéance : {new Date(task.date_fin).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}