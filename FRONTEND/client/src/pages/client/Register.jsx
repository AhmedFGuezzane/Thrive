import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import Email from '@mui/icons-material/Email';
import Person from '@mui/icons-material/Person';
import config from '../../config'; // Adjust the path to your config.js file
import SnackbarAlert from '../../components/common/SnackbarAlert'; // Import the SnackbarAlert component

export default function Register() {
    const navigate = useNavigate();

    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');

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

    const handleRegister = async () => {
        // Basic validation
        if (!firstName || !lastName || !email || !password || !verifyPassword) {
            showSnackbar('Please fill in all fields.', 'warning');
            return;
        }

        if (password !== verifyPassword) {
            showSnackbar('Passwords do not match.', 'error');
            setPassword('');
            setVerifyPassword('');
            return;
        }

        showSnackbar('Attempting to register...', 'info');

        try {
            // Assuming register endpoint is /auth/register
            const response = await fetch(`${config.authMicroserviceBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    mot_de_passe: password,
                    nom: lastName, // 'nom' from the requested body format
                    prenom: firstName, // 'prenom' from the requested body format
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data); // Log the full response

                showSnackbar('Register successful. An admin will review your application.', 'success');
                // Redirect to home page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 2000); // Give user time to read the message

            } else {
                const errorData = await response.json(); // Attempt to read error message from body
                showSnackbar(`Registration failed: ${errorData.message || 'Please try again.'}`, 'error');
                // Clear password fields on failure
                setPassword('');
                setVerifyPassword('');
            }
        } catch (error) {
            console.error('Network or other error during registration:', error);
            showSnackbar('Registration failed: Could not connect to the server.', 'error');
            // Clear password fields on network error
            setPassword('');
            setVerifyPassword('');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                backgroundImage: 'url(/assets/images/login/login_background.png)', // reuse same background
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
                    maxWidth: '400px', // Max width for the register box
                    width: '90%', // Responsive width
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
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person sx={{ color: '#fff' }} />
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
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person sx={{ color: '#fff' }} />
                            </InputAdornment>
                        ),
                        style: { color: 'white' },
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
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: '#fff' }} />
                            </InputAdornment>
                        ),
                        style: { color: 'white' },
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
                        style: { color: 'white' },
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
                    placeholder="Verify Password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: '#fff' }} />
                            </InputAdornment>
                        ),
                        style: { color: 'white' },
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
                    onClick={handleRegister} // Attach the new handler
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
                    Create Account
                </Button>

                <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 2, color: 'white' }}
                >
                    Vous avez déjà un compte ?{" "}
                    <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Se connecter
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
