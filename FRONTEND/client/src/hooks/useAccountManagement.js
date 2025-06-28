// src/hooks/useAccountManagement.js
import { useState, useEffect, useCallback } from 'react';
import config from '../config'; // Adjust path if your config file is elsewhere
import { useSnackbar } from './useSnackbar'; // Import the useSnackbar hook

export const useAccountManagement = () => {
    // --- State for Profile Info ---
    const [userInfo, setUserInfo] = useState({});
    const [editable, setEditable] = useState(false);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    
    // --- State for Password Management ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState(''); // <-- ADDED THIS STATE
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    
    // --- State for Confirmation Dialog ---
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    // Use the useSnackbar hook for consistent snackbar management
    const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar();

    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (!token) {
            showSnackbar("Authentication token not found. Please log in again.", 'error');
            // Potentially redirect to login if token is missing on mount
            // logoutAndRedirect(); // Uncomment if you want to force redirect here
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/me`, { headers });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Failed to fetch user info.");
                }
                const data = await res.json();
                setUserInfo(data);
                setNom(data.nom || '');
                setPrenom(data.prenom || '');
                setEmail(data.email || '');
            } catch (error) {
                console.error("Error fetching user info:", error);
                showSnackbar(error.message || "Erreur lors du chargement des informations utilisateur.", 'error');
            }
        };

        fetchUserInfo();
    }, [token, showSnackbar]);

    // Centralized logout function
    const logoutAndRedirect = () => {
        localStorage.clear(); // Clears all localStorage (including JWT and session data)
        window.location.href = '/login'; // Redirect to login
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/update-profile`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ nom, prenom, email })
            });
            const result = await res.json();
            if (res.ok) {
                showSnackbar(result.message || 'Profile updated!', 'success');
                setEditable(false);
                // Update userInfo state directly after successful update
                setUserInfo(prev => ({ ...prev, nom, prenom, email }));
            } else {
                throw new Error(result.error || 'Update failed');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            showSnackbar(err.message, 'error');
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showSnackbar('Veuillez remplir tous les champs de mot de passe.', 'warning');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showSnackbar('Les nouveaux mots de passe ne correspondent pas.', 'warning');
            return;
        }
        if (currentPassword === newPassword) {
            showSnackbar('Le nouveau mot de passe doit être différent de l\'actuel.', 'warning');
            return;
        }
        try {
            const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/change-password`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
            });
            const result = await res.json();
            if (res.ok) {
                showSnackbar(result.message || 'Mot de passe changé avec succès !', 'success');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword(''); // <-- CLEAR THE NEW STATE ON SUCCESS
                setShowPasswordForm(false);
            } else {
                throw new Error(result.error || 'Échec du changement de mot de passe.');
            }
        } catch (err) {
            console.error("Error changing password:", err);
            showSnackbar(err.message, 'error');
        }
    };

    const handleDeactivate = async () => {
        try {
            const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/deactivate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({})
            });
            const result = await res.json();
            if (res.ok) {
                showSnackbar(result.message || 'Compte désactivé.', 'success');
                logoutAndRedirect();
            } else {
                throw new Error(result.error || 'Échec de la désactivation.');
            }
        } catch (err) {
            console.error("Error deactivating account:", err);
            showSnackbar(err.message, 'error');
        }
    };

    const handleDelete = async () => {
        setConfirmDialogOpen(false);
        try {
            const res = await fetch(`${config.authMicroserviceBaseUrl}/auth/delete-account`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({})
            });
            const result = await res.json();
            if (res.ok) {
                showSnackbar(result.message || 'Compte supprimé.', 'success');
                logoutAndRedirect();
            } else {
                throw new Error(result.error || 'Échec de la suppression.');
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            showSnackbar(err.message, 'error');
        }
    };

    return {
        userInfo,
        editable,
        setEditable,
        nom, setNom,
        prenom, setPrenom,
        email, setEmail,
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmNewPassword, setConfirmNewPassword, // <-- NOW RETURNING THE NEW STATE AND SETTER
        showPasswordForm, setShowPasswordForm,
        confirmDialogOpen, setConfirmDialogOpen,
        actionToConfirm, setActionToConfirm,
        handleUpdateProfile,
        handleChangePassword,
        handleDeactivate,
        handleDelete,
        logout: logoutAndRedirect,
        snackbarOpen, snackbarMessage, snackbarSeverity, handleSnackbarClose,
    };
};