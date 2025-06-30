import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Tooltip,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TaskItem({
  task,
  isExpanded,
  onExpandClick,
  getImportanceDisplay,
  getStatusDisplay,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    innerBox, primaryText, whiteBorder,
    whiteColor, specialBorder
  } = useCustomTheme();

  const importanceDisplay = getImportanceDisplay(task.importance);
  const statusDisplay = getStatusDisplay(task.statut);

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
        width: "100%",
        border: `1px solid ${whiteBorder}`,
        color: primaryText,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.81)' : 'rgba(255, 255, 255, 0.86)',
          border: `1px solid ${specialBorder}`,
        },
        flexShrink: 0,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" alignItems="baseline" sx={{ flexGrow: 1, mr: 1, gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color={primaryText}
          >
            {task.titre}
          </Typography>
          {task.date_fin && (
            <Typography
              variant="caption"
              fontStyle="italic"
              color={primaryText}
              sx={{
                flexShrink: 0,
                minWidth: 'fit-content',
              }}
            >
              {t('taskItem.due')}: {new Date(task.date_fin).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title={`${t('taskItem.importance')}: ${importanceDisplay.label}`} placement="top">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                bgcolor: importanceDisplay.color,
                color: primaryText,
                p: 0.5,
              }}
            >
              {importanceDisplay.icon}
            </Box>
          </Tooltip>

          {task.statut && (
            <Tooltip title={`${t('taskItem.status')}: ${statusDisplay.label}`} placement="top">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  bgcolor: statusDisplay.color,
                  color: whiteColor,
                  p: 0.5,
                }}
              >
                {statusDisplay.icon}
              </Box>
            </Tooltip>
          )}

          <IconButton size="small" sx={{ color: primaryText, ml: 1 }}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
          {task.description && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
              <Typography component="span" fontWeight="bold" sx={{ color: primaryText }}>
                {t('taskItem.description')}:{' '}
              </Typography>
              {task.description}
            </Typography>
          )}

          <Typography variant="body2" color="textSecondary">
            <Typography component="span" fontWeight="bold" sx={{ color: primaryText }}>
              {t('taskItem.details')}:{' '}
            </Typography>
            {task.date_creation &&
              `${t('taskItem.created')}: ${new Date(task.date_creation).toLocaleDateString()} `}
            {task.date_modification &&
              `${t('taskItem.updated')}: ${new Date(task.date_modification).toLocaleDateString()}`}
            {!task.date_creation && !task.date_modification && t('taskItem.no_info')}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
