// src/components/UserHome/StudyTips.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export default function StudyTips() {
  const theme = useTheme();

        const outerBox = theme.palette.custom.box.outer;
    const innerBox = theme.palette.custom.box.inner;
    const middleBox = theme.palette.custom.box.middleBox;
  
    const primaryColor = theme.palette.custom.color.primary;
    const specialColor = theme.palette.custom.color.special;
    const secondaryColor = theme.palette.custom.color.secondary;
  
   const specialText = theme.palette.custom.text.special;
    const secondaryText = theme.palette.custom.text.secondary;
    const primaryText = theme.palette.custom.text.primary;
  
    const whiteBorder = theme.palette.custom.border.white;
    const blackBorder = theme.palette.custom.border.black;
    const specialBorder = theme.palette.custom.border.special;
  
    const softBoxShadow = theme.palette.custom.boxShadow.soft;

  const studyTips = [
    {
      title: "Technique Pomodoro",
      description: "Utilise la technique Pomodoro pour rester concentré sans t'épuiser. Travaille par intervalles intenses suivis de courtes pauses."
    },
    {
      title: "Objectifs Clairs",
      description: "Fixe-toi des objectifs clairs et réalisables avant chaque séance d'étude. Cela te donne une direction et te motive."
    },
    {
      title: "Musique pour la Concentration",
      description: "Écoute de la musique douce ou ambiante. Certaines fréquences peuvent améliorer ta concentration et bloquer les distractions."
    },
    {
      title: "Pauses Régulières",
      description: "Prends une pause toutes les 25 minutes pour recharger ton cerveau. Les courtes pauses améliorent la rétention et réduisent la fatigue."
    },
    {
      title: "Respiration Profonde",
      description: "Respire profondément et détends-toi avant de commencer. Une bonne respiration oxygène ton cerveau et calme ton esprit."
    },
    {
      title: "Élimine les Distractions",
      description: "Mets ton téléphone en mode avion, ferme les onglets inutiles. Un environnement sans distraction est clé pour un focus intense."
    },
    {
      title: "Prends des Notes à la Main",
      description: "Prends des notes à la main pour mieux retenir les informations. L'acte physique d'écrire active différentes zones du cerveau."
    },
    {
      title: "Récompense-toi",
      description: "Récompense-toi après une bonne séance d'étude. Cela renforce les habitudes positives et rend l'apprentissage plus agréable."
    },
    {
      title: "Heures de Pointe",
      description: "Étudie aux heures où tu es naturellement le plus concentré. Identifie ton rythme circadien pour optimiser tes sessions."
    },
    {
      title: "Hydratation",
      description: "Bois de l’eau régulièrement pour rester alerte. La déshydratation peut affecter ta concentration et tes performances cognitives."
    }
  ];

  const [tipIndex, setTipIndex] = useState(0);
  const tipDuration = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % studyTips.length);
    }, tipDuration);
    return () => clearInterval(interval);
  }, [tipIndex, studyTips.length]);

  const currentTip = studyTips[tipIndex];

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
        width: '100%'
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
