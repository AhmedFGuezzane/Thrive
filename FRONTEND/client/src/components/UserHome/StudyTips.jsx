// src/components/UserHome/StudyTips.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export default function StudyTips() {
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
  const tipDuration = 8000; // 8 seconds for each tip

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % studyTips.length);
    }, tipDuration);
    return () => clearInterval(interval);
  }, [tipIndex, studyTips.length, tipDuration]);

  const currentTip = studyTips[tipIndex];

  return (
    <Box
      flexBasis="25%"
      flexShrink={0}
      sx={{
        // Reverted outer box to previous, lighter glassmorphism style
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        p: 2, // Adjusted padding for the outer box
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center content vertically in the outer box
        alignItems: 'center', // Center content horizontally in the outer box
        overflow: 'hidden',
        position: 'relative',
        height: '100%', // Ensure it fills its allocated flexBasis height
      }}
    >
      {/* Translucent box for the tip content - Now matches the sticky filter bar */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 240, 245, 0.6)', // Matched the sticky bar's background color
          backdropFilter: 'blur(10px)', // Matched the sticky bar's backdropFilter
          border: '1px solid rgba(255, 255, 255, 0.5)', // Matched the sticky bar's border
          borderRadius: '8px', // Matched the sticky bar's border-radius
          p: 2, // Adjusted padding inside the translucent box
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', // Matched the sticky bar's boxShadow
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '99%', // Constrain width inside
          height: '100%', // Ensure it fills the vertical space of its parent (which is aligned center)
        }}
      >
        {/* Lightbulb Icon */}
        <LightbulbOutlinedIcon
          sx={{
            fontSize: 35, // Slightly larger icon for prominence
            color: 'rgba(255, 204, 0, 1)', // More vibrant yellow
            mb: 1, // Margin below the icon
            filter: 'drop-shadow(0px 0px 10px rgba(255, 204, 0, 0.7))', // Stronger glow effect
          }}
        />

        {/* Tip Title */}
        <Typography
          variant="h6" // Adjusted for better prominence and modern feel
          fontWeight="bold"
          sx={{
            color: 'rgba(128, 0, 128, 0.9)', // Richer purple for title
            mb: 0.5, // Margin below title
            letterSpacing: '0.5px', // Subtle letter spacing
          }}
        >
          {currentTip.title}
        </Typography>

        {/* Tip Description */}
        <Typography
          variant="body2" // Appropriate variant for description
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.4,
            color: 'rgba(51, 51, 51, 0.85)', // Clearer text for description
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3, // Limit description to 3 lines
            WebkitBoxOrient: 'vertical',
          }}
        >
          {currentTip.description}
        </Typography>
      </Box>
    </Box>
  );
}
