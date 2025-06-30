
import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import DisplayCard from './DisplayCard';
import ConfirmationItem from './ConfirmationItem';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useTranslation } from 'react-i18next';

export default function SeanceReviewStep({ formData }) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: '12px',
        p: 2,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        maxHeight: '60vh',
        overflowY: 'auto',
        pr: 1.5
      }}
    >
      <Grid container spacing={2} alignItems="stretch" justifyContent="space-between">
        {[
          {
            title: t("seanceReview.details.title"),
            icon: <InfoOutlinedIcon />,
            items: [
              { label: t("seanceReview.details.type"), value: formData.type_seance },
              { label: t("seanceReview.details.nom"), value: formData.nom }
            ]
          },
          {
            title: t("seanceReview.durations.title"),
            icon: <HourglassTopIcon />,
            items: [
              { label: t("seanceReview.durations.seance"), value: `${formData.pomodoro.duree_seance}s` },
              { label: t("seanceReview.durations.courte"), value: `${formData.pomodoro.duree_pause_courte}s` },
              { label: t("seanceReview.durations.longue"), value: `${formData.pomodoro.duree_pause_longue}s` }
            ]
          },
          {
            title: t("seanceReview.config.title"),
            icon: <TuneIcon />,
            items: [
              { label: t("seanceReview.config.cycles"), value: formData.pomodoro.nbre_pomodoro_avant_pause_longue },
              { label: t("seanceReview.config.theme"), value: formData.pomodoro.theme },
              { label: t("seanceReview.config.preconfig"), value: formData.pomodoro.nom_preconfiguration }
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
            <DisplayCard title={t("seanceReview.alertes.title")} icon={<NotificationsActiveIcon />}>
              <Grid container spacing={1} justifyContent="space-between">
                {[
                  "auto_demarrage",
                  "alerte_sonore",
                  "notification",
                  "vibration",
                  "suivi_temps_total"
                ].map((key, i) => (
                  <Grid item xs={6} sm={4} key={i}>
                    <ConfirmationItem label={t(`seanceReview.alertes.${key}`)} value={formData.pomodoro[key]} />
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
