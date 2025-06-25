// src/components/UserHome/SeanceReviewStep.jsx
import React from 'react';
import { Box, Grid } from '@mui/material';
import DisplayCard from './DisplayCard';
import ConfirmationItem from './ConfirmationItem';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function SeanceReviewStep({ formData }) {
  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: '12px',
        p: 2,
        border: '1px solid rgba(255,255,255,0.2)',
        maxHeight: '60vh',
        overflowY: 'auto',
        pr: 1.5
      }}
    >
      <Grid container spacing={2} alignItems="stretch" justifyContent='space-between'>
        {[
          {
            title: "Détails de la Séance",
            icon: <InfoOutlinedIcon />,
            items: [
              { label: "Type de séance", value: formData.type_seance },
              { label: "Nom de la séance", value: formData.nom }
            ]
          },
          {
            title: "Durées",
            icon: <HourglassTopIcon />,
            items: [
              { label: "Séance", value: `${formData.pomodoro.duree_seance}s` },
              { label: "Pause courte", value: `${formData.pomodoro.duree_pause_courte}s` },
              { label: "Pause longue", value: `${formData.pomodoro.duree_pause_longue}s` }
            ]
          },
          {
            title: "Configuration",
            icon: <TuneIcon />,
            items: [
              { label: "Cycles", value: formData.pomodoro.nbre_pomodoro_avant_pause_longue },
              { label: "Nom du Thème", value: formData.pomodoro.theme },
              { label: "Préconfiguration", value: formData.pomodoro.nom_preconfiguration }
            ]
          }
        ].map((card, index) => (
          <Grid width="32%" item xs={12} md={4} key={index}>
            <Box sx={{ height: '100%', display: 'flex' }}>
              <DisplayCard title={card.title} icon={card.icon}>
                {card.items.map((item, idx) => (
                  <ConfirmationItem key={idx} label={item.label} value={item.value} />
                ))}
              </DisplayCard>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} width="100%">
          <Box sx={{ height: '100%', display: 'flex' }}>
            <DisplayCard title="Alertes et Automatisation" icon={<NotificationsActiveIcon />}>
              <Grid container spacing={1} justifyContent="space-between">
                {[
                  "auto_demarrage",
                  "alerte_sonore",
                  "notification",
                  "vibration",
                  "suivi_temps_total"
                ].map((key, i) => (
                  <Grid item xs={6} sm={4} key={i}>
                    <ConfirmationItem label={key} value={formData.pomodoro[key]} />
                  </Grid>
                ))}
              </Grid>
            </DisplayCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
