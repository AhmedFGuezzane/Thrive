import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, InputAdornment
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';

import config from '../../config';
import SnackbarAlert from '../../components/common/SnackbarAlert';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // --- Validation logic ---
  const validateEmail = (value) => {
    if (!value) return 'Email requis.';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return 'Email invalide.';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Mot de passe requis.';
    return '';
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) {
      showSnackbar('Veuillez corriger les erreurs du formulaire.', 'error');
      return;
    }

    showSnackbar('Tentative de connexion...', 'info');

    try {
      const response = await fetch(`${config.authMicroserviceBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: password }),
      });

      if (response.ok) {
        const { access_token } = await response.json();
        localStorage.setItem('jwt_token', access_token);

        showSnackbar('Connexion réussie !', 'success');
        setTimeout(() => navigate('/user'), 1500);
      } else {
        const errorData = await response.json();
        showSnackbar(`Échec de la connexion : ${errorData.message || 'Identifiants invalides'}`, 'error');
        setPassword('');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      showSnackbar('Échec de la connexion : problème de serveur.', 'error');
      setPassword('');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      backgroundImage: 'url(/assets/images/login/login_background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1,
      }} />

      <Box
        className="glass-container"
        sx={{
          zIndex: 2,
          padding: 4,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <Typography variant="h6" align="center" color="white" fontWeight="bold">
          LOGIN
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
          error={!!emailError}
          helperText={emailError}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            style: { color: 'white' },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(validatePassword(e.target.value));
          }}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            style: { color: 'white' },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size='large'
          onClick={handleLogin}
          disabled={!email || !password || emailError || passwordError}
          sx={{
            background: 'linear-gradient(45deg, rgba(205, 80, 255, 0.7) 30%, rgba(128, 0, 128, 0.7) 90%)',
            border: 0,
            borderRadius: '8px',
            color: 'white',
            height: 48,
            padding: '0 30px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(205, 80, 255, 0.8) 30%, rgba(128, 0, 128, 0.9) 90%)',
            },
          }}
        >
          Sign In
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'white' }}>
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" style={{ color: '#fff', textDecoration: 'underline' }}>
            Créer un compte
          </Link>
        </Typography>
      </Box>

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}
