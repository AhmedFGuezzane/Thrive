import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, InputAdornment, Snackbar, Alert } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import config from '../../config'; // Adjust the path to your config.js file
import SnackbarAlert from '../../components/common/SnackbarAlert';

export default function Login() {
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for Snackbar (Material UI Alert replacement)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error', 'info', 'warning'

  // Function to show Snackbar messages
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Function to close Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogin = async () => {
    showSnackbar('Attempting to log in...', 'info');

    try {
      // The URL should now correctly be http://localhost:5002/auth/login
      const response = await fetch(`${config.authMicroserviceBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          mot_de_passe: password, // Key name as per your microservice's expectation
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token } = data;

        // Store the JWT token (e.g., in localStorage)
        localStorage.setItem('jwt_token', access_token);

        // Optionally, decode and store user info if needed
        // For example, if you want to store role or email from the token payload
        // const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
        // localStorage.setItem('user_role', decodedToken.role);
        // localStorage.setItem('user_email', decodedToken.email);

        showSnackbar('Login successful!', 'success');
        // Redirect to /user after a short delay to show the success message
        setTimeout(() => {
          navigate('/user');
        }, 1500);

      } else {
        const errorData = await response.json(); // Attempt to read error message from body
        showSnackbar(`Login failed: ${errorData.message || 'Invalid credentials'}`, 'error');
        // Stay on login page, clear password for security
        setPassword('');
      }
    } catch (error) {
      console.error('Network or other error during login:', error);
      showSnackbar('Login failed: Could not connect to the server.', 'error');
      // Stay on login page, clear password for security
      setPassword('');
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
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Overlay blur layer */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      />

      {/* Glass container */}
      <Box
        className="glass-container" // Assuming external CSS defines this
        sx={{
          zIndex: 2, // Ensure it's above the blur overlay
          padding: 4,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(10px)', // Glassmorphism blur for the container itself
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Space between elements
          maxWidth: '400px', // Max width for the login box
          width: '90%', // Responsive width
        }}
      >
        <Typography variant="h6" align="center" color="white" fontWeight="bold">
          LOGIN
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Email" // Changed to Email as per request body
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            style: { color: 'white' }, // Text color
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5) !important' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8) !important' },
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
            style: { color: 'white' }, // Text color
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5) !important' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8) !important' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size='large'
          onClick={handleLogin} // Attach login handler to button click
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

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: 'white' }}
        >
          Vous n'avez pas de compte?{" "}
          <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>
            Créer un compte
          </Link>
        </Typography>
      </Box>

      {/* Snackbar for alerts */}
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}
