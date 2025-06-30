import { useState, useEffect } from 'react';
import { useSnackbar } from './useSnackbar';
import {
  getMe,
  updateProfile,
  changePassword,
  deactivateAccount,
  deleteAccount,
} from '../utils/accountService';
import { useTranslation } from 'react-i18next';

export const useAccountManagement = () => {
  const { t } = useTranslation();
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
      showSnackbar(result.message || t('account.profile_updated'), 'success');
      setUserInfo(prev => ({ ...prev, nom, prenom, email }));
      setEditable(false);
    } catch (err) {
      console.error("Update profile failed:", err);
      showSnackbar(err.message, 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return showSnackbar(t('account.fill_all_fields'), 'warning');
    }
    if (newPassword !== confirmNewPassword) {
      return showSnackbar(t('account.passwords_do_not_match'), 'warning');
    }
    if (currentPassword === newPassword) {
      return showSnackbar(t('account.passwords_identical'), 'warning');
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      showSnackbar(result.message || t('account.password_changed'), 'success');
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
      showSnackbar(result.message || t('account.deactivated'), 'success');
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
      showSnackbar(result.message || t('account.deleted'), 'success');
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
