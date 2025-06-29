// src/hooks/useAccountManagement.js
import { useState, useEffect } from 'react';
import { useSnackbar } from './useSnackbar';
import {
  getMe,
  updateProfile,
  changePassword,
  deactivateAccount,
  deleteAccount,
} from '../utils/accountService';

export const useAccountManagement = () => {
  const [userInfo, setUserInfo] = useState({});
  const [editable, setEditable] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  } = useSnackbar();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getMe();
        setUserInfo(data);
        setNom(data.nom || '');
        setPrenom(data.prenom || '');
        setEmail(data.email || '');
      } catch (error) {
        console.error("Error fetching user info:", error);
        showSnackbar(error.message, 'error');
      }
    };

    fetchUserInfo();
  }, [showSnackbar]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleUpdateProfile = async () => {
    try {
      const result = await updateProfile({ nom, prenom, email });
      showSnackbar(result.message || 'Profil mis à jour !', 'success');
      setUserInfo(prev => ({ ...prev, nom, prenom, email }));
      setEditable(false);
    } catch (err) {
      console.error("Update profile failed:", err);
      showSnackbar(err.message, 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return showSnackbar('Veuillez remplir tous les champs.', 'warning');
    }
    if (newPassword !== confirmNewPassword) {
      return showSnackbar('Les mots de passe ne correspondent pas.', 'warning');
    }
    if (currentPassword === newPassword) {
      return showSnackbar('Le nouveau mot de passe doit être différent.', 'warning');
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      showSnackbar(result.message || 'Mot de passe changé avec succès !', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Password change error:", err);
      showSnackbar(err.message, 'error');
    }
  };

  const handleDeactivate = async () => {
    try {
      const result = await deactivateAccount();
      showSnackbar(result.message || 'Compte désactivé.', 'success');
      logout();
    } catch (err) {
      console.error("Deactivation failed:", err);
      showSnackbar(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    setConfirmDialogOpen(false);
    try {
      const result = await deleteAccount();
      showSnackbar(result.message || 'Compte supprimé.', 'success');
      logout();
    } catch (err) {
      console.error("Account deletion failed:", err);
      showSnackbar(err.message, 'error');
    }
  };

  return {
    userInfo,
    editable,
    setEditable,
    nom,
    setNom,
    prenom,
    setPrenom,
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showPasswordForm,
    setShowPasswordForm,
    confirmDialogOpen,
    setConfirmDialogOpen,
    actionToConfirm,
    setActionToConfirm,
    handleUpdateProfile,
    handleChangePassword,
    handleDeactivate,
    handleDelete,
    logout,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  };
};
