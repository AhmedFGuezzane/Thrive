import React from 'react';
import {
  Box, Typography, Button, TextField, Divider, Grid,
  IconButton, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { useTranslation } from 'react-i18next';
import { useAccountManagement } from '../../hooks/useAccountManagement';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useSnackbar } from '../../contexts/SnackbarContext';

import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ChangePasswordDialog from '../../components/UserAccount/ChangePasswordDialog';

const UserAccount = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const {
    outerBox, whiteBorder, primaryText, secondaryText, specialColor,
    warningColor, errorColor, primaryColor, whiteColor, specialText
  } = useCustomTheme();

  const {
    userInfo, editable, setEditable,
    nom, setNom,
    prenom, setPrenom,
    email, setEmail,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmNewPassword, setConfirmNewPassword,
    showPasswordForm, setShowPasswordForm,
    confirmDialogOpen, setConfirmDialogOpen,
    actionToConfirm, setActionToConfirm,
    handleUpdateProfile,
    handleChangePassword,
    handleDeactivate,
    handleDelete,
    logout,
  } = useAccountManagement(showSnackbar);

  const openConfirmation = (actionType) => {
    setActionToConfirm(actionType);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    setConfirmDialogOpen(false);
    switch (actionToConfirm) {
      case 'changePassword': handleChangePassword(); break;
      case 'deactivate': handleDeactivate(); break;
      case 'delete': handleDelete(); break;
      case 'logout': logout(); break;
      case 'updateProfile': handleUpdateProfile(); break;
      default: break;
    }
    setActionToConfirm(null);
  };

  const getDialogContent = () => {
    switch (actionToConfirm) {
      case 'changePassword':
        return {
          title: t('account.confirmPasswordChange.title'),
          text: t('account.confirmPasswordChange.text'),
          confirmButtonText: t('account.confirmPasswordChange.button'),
          confirmButtonColor: "primary"
        };
      case 'deactivate':
        return {
          title: t('account.confirmDeactivate.title'),
          text: t('account.confirmDeactivate.text'),
          confirmButtonText: t('account.confirmDeactivate.button'),
          confirmButtonColor: "warning"
        };
      case 'delete':
        return {
          title: t('account.confirmDelete.title'),
          text: t('account.confirmDelete.text'),
          confirmButtonText: t('account.confirmDelete.button'),
          confirmButtonColor: "error"
        };
      case 'logout':
        return {
          title: t('account.confirmLogout.title'),
          text: t('account.confirmLogout.text'),
          confirmButtonText: t('account.confirmLogout.button'),
          confirmButtonColor: "inherit"
        };
      case 'updateProfile':
        return {
          title: t('account.confirmUpdate.title'),
          text: t('account.confirmUpdate.text'),
          confirmButtonText: t('account.confirmUpdate.button'),
          confirmButtonColor: "primary"
        };
      default:
        return { title: "", text: "", confirmButtonText: "", confirmButtonColor: "primary" };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Box width="98%" height="100%" mx="1rem">
      <Box p={3} borderRadius={3} width="100%" height="100%" sx={{
        backdropFilter: 'blur(10px)',
        bgcolor: outerBox,
        border: `1px solid ${whiteBorder}`,
      }}>
        <Typography variant="h5" fontWeight="bold" color={primaryText}>
          {t('account.title')}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color={primaryText}>{t('account.profileInfo')}</Typography>
          <IconButton onClick={() => setEditable(!editable)}>
            <EditIcon sx={{ color: secondaryText }} />
          </IconButton>
        </Box>

        <Grid container spacing={2} mb={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label={t('account.nom')} value={nom} onChange={(e) => setNom(e.target.value)} disabled={!editable}
              sx={inputStyle(primaryText, whiteBorder)} InputLabelProps={labelStyle(primaryText, specialColor)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label={t('account.prenom')} value={prenom} onChange={(e) => setPrenom(e.target.value)} disabled={!editable}
              sx={inputStyle(primaryText, whiteBorder)} InputLabelProps={labelStyle(primaryText, specialColor)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label={t('account.email')} value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editable}
              sx={inputStyle(primaryText, whiteBorder)} InputLabelProps={labelStyle(primaryText, specialColor)} />
          </Grid>
        </Grid>

        {editable && (
          <Button onClick={() => openConfirmation('updateProfile')} variant="contained"
            sx={{ mt: 2, bgcolor: specialColor, color: whiteColor, '&:hover': { bgcolor: primaryColor } }}>
            {t('account.saveChanges')}
          </Button>
        )}

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" color={primaryText}>{t('account.metadata')}</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label={t('account.role')} value={userInfo.role || ''} disabled
              sx={inputStyle(primaryText, whiteBorder)} InputLabelProps={labelStyle(primaryText, specialColor)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label={t('account.active')} value={userInfo.actif ? t('account.yes') : t('account.no')} disabled
              sx={inputStyle(primaryText, whiteBorder)} InputLabelProps={labelStyle(primaryText, specialColor)} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" color={primaryText}>{t('account.otherActions')}</Typography>
        <Box display="flex" flexDirection="column" gap={1} mt={1}>
          <ActionButton text={t('account.changePassword')} onClick={() => setShowPasswordForm(true)} />
          <ActionButton text={t('account.deactivate')} onClick={() => openConfirmation('deactivate')} />
          <ActionButton text={t('account.delete')} onClick={() => openConfirmation('delete')} />
          <ActionButton text={t('account.logout')} onClick={() => openConfirmation('logout')} />
        </Box>

        <ChangePasswordDialog
          open={showPasswordForm}
          onClose={() => setShowPasswordForm(false)}
          onSave={() => openConfirmation('changePassword')}
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmNewPassword={confirmNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
        />

        <ConfirmationDialog
          open={confirmDialogOpen}
          onClose={() => { setConfirmDialogOpen(false); setActionToConfirm(null); }}
          onConfirm={handleConfirmAction}
          content={dialogContent}
        />
      </Box>
    </Box>
  );
};

const inputStyle = (primary, border) => ({
  '& .MuiInputBase-input': { color: primary },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: primary },
    '&:hover fieldset': { borderColor: border },
    '&.Mui-focused fieldset': { borderColor: border }
  }
});

const labelStyle = (primary, focusColor) => ({
  style: { color: primary },
  sx: { '&.Mui-focused': { color: focusColor } }
});

const ActionButton = ({ text, onClick }) => (
  <Button variant="text" onClick={onClick} sx={{
    justifyContent: 'flex-start',
    color: 'inherit',
    textTransform: 'none',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent'
    }
  }}>{text}</Button>
);

export default UserAccount;
