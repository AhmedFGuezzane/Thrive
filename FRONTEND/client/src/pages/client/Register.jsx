import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
import Person from '@mui/icons-material/Person';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import config from '../../config';
import SnackbarAlert from '../../components/common/SnackbarAlert';

export default function Register() {
  const navigate = useNavigate();

  // Inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  // Snackbar
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

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = (name) => /^[^\d]+$/.test(name); // no digits
  const doPasswordsMatch = password === verifyPassword;

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !verifyPassword) {
      showSnackbar('Please fill in all fields.', 'warning');
      return;
    }

    if (!isNameValid(firstName) || !isNameValid(lastName)) {
      showSnackbar('Names cannot contain numbers.', 'warning');
      return;
    }

    if (!isEmailValid) {
      showSnackbar('Invalid email format.', 'error');
      return;
    }

    if (!doPasswordsMatch) {
      showSnackbar('Passwords do not match.', 'error');
      setPassword('');
      setVerifyPassword('');
      return;
    }

    showSnackbar('Attempting to register...', 'info');

    try {
      const response = await fetch(`${config.authMicroserviceBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          mot_de_passe: password,
          nom: lastName,
          prenom: firstName
        }),
      });

      if (response.ok) {
        showSnackbar('Registration successful. Awaiting admin validation.', 'success');
        setTimeout(() => navigate('/'), 2000);
      } else {
        const errorData = await response.json();
        showSnackbar(`Registration failed: ${errorData.message || 'Please try again.'}`, 'error');
        setPassword('');
        setVerifyPassword('');
      }
    } catch (err) {
      console.error('Registration error:', err);
      showSnackbar('Could not connect to server.', 'error');
      setPassword('');
      setVerifyPassword('');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        backgroundImage: 'url(/assets/images/login/login_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Overlay */}
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
          REGISTER
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={!!firstName && !isNameValid(firstName)}
          helperText={!!firstName && !isNameValid(firstName) ? 'First name must not contain numbers' : ' '}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: '#fff' }} />
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
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!lastName && !isNameValid(lastName)}
          helperText={!!lastName && !isNameValid(lastName) ? 'Last name must not contain numbers' : ' '}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: '#fff' }} />
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!email && !isEmailValid}
          helperText={!!email && !isEmailValid ? 'Invalid email format' : ' '}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#fff' }} />
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
          onChange={(e) => setPassword(e.target.value)}
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

        <TextField
          fullWidth
          variant="outlined"
          type="password"
          placeholder="Verify Password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          error={!!verifyPassword && password && !doPasswordsMatch}
          helperText={!!verifyPassword && password && !doPasswordsMatch ? 'Passwords do not match' : ' '}
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
          size="large"
          onClick={handleRegister}
          sx={{
            background: 'linear-gradient(45deg, rgba(205, 80, 255, 0.7), rgba(128, 0, 128, 0.7))',
            borderRadius: '8px',
            color: 'white',
            height: 48,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(205, 80, 255, 0.8), rgba(128, 0, 128, 0.9))',
            },
          }}
        >
          Create Account
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: 'white' }}
        >
          Vous avez déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>
            Se connecter
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
