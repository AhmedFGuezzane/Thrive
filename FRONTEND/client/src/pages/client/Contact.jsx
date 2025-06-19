import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';

export default function Contact() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        backgroundImage: 'url(/assets/images/contact/contact_background.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Overlay blur */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      />

      {/* Glass card */}
      <Box className="glass-container">
        <Typography
          variant="h6"
          align="center"
          color="white"
          fontWeight="bold"
          mb={2}
        >
          Contactez-nous
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Votre nom"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
          }}
          className="glassy-input"
        />

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Votre email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
          }}
          className="glassy-input"
        />

        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          placeholder="Votre message"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MessageIcon sx={{ color: '#fff', alignSelf: 'flex-start', mt: 1 }} />
              </InputAdornment>
            ),
          }}
          className="glassy-input"
        />

        <Button fullWidth variant="contained" className="glassy-button">
          Envoyer
        </Button>
      </Box>
    </Box>
  );
}
