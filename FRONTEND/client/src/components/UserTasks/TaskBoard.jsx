import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, Tooltip } from '@mui/material';
import { Droppable } from '@hello-pangea/dnd';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import TaskCard from './TaskCard';
import SkeletonTaskCard from '../../skeleton/SkeletonTaskCard';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function TaskBoard({
  displayedTasks,
  onViewDetailsClick,
  getImportanceDisplay,
  getStatusDisplay,
  loading
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    middleBox,
    primaryText,
    whiteBorder,
    innerBox,
    outterBox,
    secondaryColor,
    specialColor,
    specialText,
    secondaryText,
    primaryColor,
    softBoxShadow
  } = useCustomTheme();

  const [sortOrder, setSortOrder] = useState({});

  const toggleSortOrder = (columnId) => {
    setSortOrder(prev => {
      const currentOrder = prev[columnId];
      const newOrder = currentOrder === 'asc' ? 'desc' : currentOrder === 'desc' ? null : 'asc';
      return { ...prev, [columnId]: newOrder };
    });
  };

  return (
    <>
      {Object.entries(displayedTasks).map(([columnId, columnTasks]) => {
        const columnSortOrder = sortOrder[columnId];
        let sortedColumnTasks = [...columnTasks];

        if (columnSortOrder) {
          sortedColumnTasks.sort((a, b) => {
            const impA = a.importance ?? Infinity;
            const impB = b.importance ?? Infinity;
            return columnSortOrder === 'asc' ? impA - impB : impB - impA;
          });
        }

        return (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flexBasis: '33%',
                  minWidth: '200px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.57)' : middleBox,
                  borderRadius: '12px',
                  border: `1px solid ${whiteBorder}`,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      px: 2,
                      py: 1,
                      backgroundColor: secondaryColor,
                      borderBottom: `1px solid ${whiteBorder}`,
                      boxShadow:softBoxShadow,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color={primaryText} sx={{ textTransform: 'capitalize' }}>
                      {t(`taskBoard.columns.${columnId}`, columnId)}
                    </Typography>
                    <Tooltip
                      title={
                        columnSortOrder
                          ? t('taskBoard.sortByImportance', { order: columnSortOrder })
                          : t('taskBoard.sort')
                      }
                      placement="top"
                    >
                      <IconButton size="small" onClick={() => toggleSortOrder(columnId)} sx={{ color: primaryText }}>
                        {columnSortOrder === 'asc' ? (
                          <ArrowUpwardIcon />
                        ) : columnSortOrder === 'desc' ? (
                          <ArrowDownwardIcon />
                        ) : (
                          <SortIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2, py: 1 }}>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonTaskCard key={`skeleton-${columnId}-${i}`} />
                      ))
                    ) : sortedColumnTasks.length === 0 ? (
                      <Typography variant="body2" color="#777" sx={{ textAlign: 'center', p: 2 }}>
                        {t('taskBoard.empty')}
                      </Typography>
                    ) : (
                      sortedColumnTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onViewDetailsClick={onViewDetailsClick}
                          getImportanceDisplay={getImportanceDisplay}
                          getStatusDisplay={getStatusDisplay}
                        />
                      ))
                    )}
                    {provided.placeholder}
                  </Box>
                </Box>
              </Box>
            )}
          </Droppable>
        );
      })}
    </>
  );
}
