// src/pages/user/Settings.jsx

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, TextField, Divider, Grid,
    IconButton, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import config from '../../config';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import { logout } from '../../utils/accountUtils';

const Settings = () => {
    const theme = useTheme();
    const [userInfo, setUserInfo] = useState({});
    const [editable, setEditable] = useState(false);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        fetch(`${config.authMicroserviceBaseUrl}/auth/me`, { headers })
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
                setNom(data.nom || '');
                setPrenom(data.prenom || '');
                setEmail(data.email || '');
            });
    }, [token]);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleUpdateProfile = async () => {
        const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/update-profile`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ nom, prenom, email })
        });
        const result = await res.json();
        if (res.ok) {
            showSnackbar(result.message || 'Profile updated!', 'success');
            setEditable(false);
        } else {
            showSnackbar(result.error || 'Update failed', 'error');
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            showSnackbar('Fill in both password fields.', 'warning'); return;
        }
        if (currentPassword === newPassword) {
            showSnackbar('New password must be different.', 'warning'); return;
        }
        const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/change-password`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
        });
        const result = await res.json();
        if (res.ok) {
            showSnackbar(result.message || 'Password changed!', 'success');
            setCurrentPassword(''); setNewPassword('');
        } else {
            showSnackbar(result.error || 'Change failed', 'error');
        }
    };

    const handleDeactivate = async () => {
        const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/deactivate`, {
            method: 'POST', headers, body: JSON.stringify({})
        });
        const result = await res.json();
        if (res.ok) {
            showSnackbar(result.message || 'Account deactivated.', 'success');
            localStorage.removeItem('jwt_token');
        } else {
            showSnackbar(result.error || 'Failed to deactivate.', 'error');
        }
    };

    const handleDelete = async () => {
        setConfirmDialogOpen(false);
        const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/delete-account`, {
            method: 'DELETE', headers, body: JSON.stringify({})
        });
        const result = await res.json();
        if (res.ok) {
            showSnackbar(result.message || 'Account deleted.', 'success');
            localStorage.removeItem('jwt_token');
        } else {
            showSnackbar(result.error || 'Deletion failed.', 'error');
        }
    };

    return (
        <Box width="98%" height="100%" mx="1rem">
            <Box p={3} borderRadius={3} bgcolor="rgba(255,255,255,0.1)" backdropFilter="blur(10px)">
                <Typography variant="h5" fontWeight="bold">Account Settings</Typography>
                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Profile Info</Typography>
                    <IconButton onClick={() => setEditable(!editable)}><EditIcon /></IconButton>
                </Box>

                <Grid container spacing={2} mb={2} mt={1}>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} disabled={!editable} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} disabled={!editable} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editable} /></Grid>
                </Grid>
                {editable && <Button onClick={handleUpdateProfile} variant="contained">Save Changes</Button>}

                <Divider sx={{ my: 3 }} />
                <Typography variant="h6">Account Metadata</Typography>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Role" value={userInfo.role || ''} disabled /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Actif" value={userInfo.actif ? 'Yes' : 'No'} disabled /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Last Login" value={userInfo.derniere_connexion ? new Date(userInfo.derniere_connexion).toLocaleString() : ''} disabled /></Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Typography variant="h6">Other Actions</Typography>
                <Box display="flex" flexDirection="column" gap={1} mt={1}>
                    <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: theme.palette.primary.main, textDecoration: 'underline' }}
                        onClick={() => setShowPasswordForm(true)}
                    >
                        Change Password
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: theme.palette.warning.main, textDecoration: 'underline' }}
                        onClick={handleDeactivate}
                    >
                        Deactivate Account
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: theme.palette.error.main, textDecoration: 'underline' }}
                        onClick={() => setConfirmDialogOpen(true)}
                    >
                        Delete Account
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: theme.palette.grey[700], textDecoration: 'underline' }}
                        onClick={logout}
                    >
                        Logout
                    </Typography>
                </Box>

                {showPasswordForm && (
                    <Box mt={3}>
                        <Typography variant="h6">Change Password</Typography>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></Grid>
                        </Grid>
                        <Button onClick={handleChangePassword} variant="contained" sx={{ mt: 2 }}>Save Password</Button>
                    </Box>
                )}
            </Box>

            <SnackbarAlert open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={handleSnackbarClose} />

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Settings;
