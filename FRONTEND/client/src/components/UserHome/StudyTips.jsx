import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useTranslation } from 'react-i18next';

export default function StudyTips() {
  const theme = useTheme();
  const { t } = useTranslation();

  const outerBox = theme.palette.custom.box.outer;
  const innerBox = theme.palette.custom.box.inner;
  const middleBox = theme.palette.custom.box.middleBox;

  const specialColor = theme.palette.custom.color.special;
  const specialText = theme.palette.custom.text.special;
  const primaryText = theme.palette.custom.text.primary;
  const whiteBorder = theme.palette.custom.border.white;
  const softBoxShadow = theme.palette.custom.boxShadow.soft;

  const tips = t('studyTips.list', { returnObjects: true });

  const [tipIndex, setTipIndex] = useState(0);
  const tipDuration = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, tipDuration);
    return () => clearInterval(interval);
  }, [tipIndex, tips.length]);

  const currentTip = tips[tipIndex];

  return (
    <Box
      flexBasis="25%"
      flexShrink={0}
      height="100%"
      sx={{
        backgroundColor: middleBox,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        borderRadius: '16px',
        p: 3,
        boxShadow: softBoxShadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          bgcolor: innerBox,
          borderRadius: '12px',
          border: `1px solid ${whiteBorder}`,
          boxShadow: softBoxShadow,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <LightbulbOutlinedIcon
          sx={{
            fontSize: 35,
            color: specialText,
            mb: 1,
            filter: `drop-shadow(0px 0px 10px ${alpha(specialColor, 0.7)})`,
          }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: specialText,
            mb: 0.5,
            letterSpacing: '0.5px',
          }}
        >
          {currentTip.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.4,
            color: primaryText,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            minHeight: '4.2em',
          }}
        >
          {currentTip.description}
        </Typography>
      </Box>
    </Box>
  );
}
