import React from 'react';
import {
  Box, Typography, Button, TextField, Divider, Grid,
  IconButton, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { useAccountManagement } from '../../hooks/useAccountManagement';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useSnackbar } from '../../contexts/SnackbarContext'; // ✅ Use global snackbar

// Dialogs
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ChangePasswordDialog from '../../components/UserAccount/ChangePasswordDialog';

const UserAccount = () => {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar(); // ✅ Use snackbar context
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
  } = useAccountManagement(showSnackbar); // ✅ Inject showSnackbar

  const openConfirmation = (actionType) => {
    setActionToConfirm(actionType);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    setConfirmDialogOpen(false);
    switch (actionToConfirm) {
      case 'changePassword':
        handleChangePassword();
        break;
      case 'deactivate':
        handleDeactivate();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'logout':
        logout();
        break;
      case 'updateProfile':
        handleUpdateProfile();
        break;
      default:
        break;
    }
    setActionToConfirm(null);
  };

  const getDialogContent = () => {
    switch (actionToConfirm) {
      case 'changePassword':
        return {
          title: "Confirm Password Change",
          text: "Are you sure you want to change your password? You will need to log in with the new password.",
          confirmButtonText: "Change",
          confirmButtonColor: "primary"
        };
      case 'deactivate':
        return {
          title: "Confirm Account Deactivation",
          text: "Are you sure you want to deactivate your account? You will be logged out and unable to access it until re-activated.",
          confirmButtonText: "Deactivate",
          confirmButtonColor: "warning"
        };
      case 'delete':
        return {
          title: "Confirm Account Deletion",
          text: "Are you sure you want to permanently delete your account? This action cannot be undone.",
          confirmButtonText: "Delete",
          confirmButtonColor: "error"
        };
      case 'logout':
        return {
          title: "Confirm Logout",
          text: "Are you sure you want to log out of your account?",
          confirmButtonText: "Logout",
          confirmButtonColor: "inherit"
        };
      case 'updateProfile':
        return {
          title: "Confirm Profile Update",
          text: "Are you sure you want to save these profile changes?",
          confirmButtonText: "Save",
          confirmButtonColor: "primary"
        };
      default:
        return { title: "", text: "", confirmButtonText: "", confirmButtonColor: "primary" };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Box width="98%" height="100%" mx="1rem">
      <Box
        p={3}
        borderRadius={3}
        width="100%"
        height="100%"
        sx={{
          backdropFilter: 'blur(10px)',
          bgcolor: outerBox,
          border: `1px solid ${whiteBorder}`,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color={primaryText}>
          Account Settings
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color={primaryText}>Profile Info</Typography>
          <IconButton onClick={() => setEditable(!editable)}>
            <EditIcon sx={{ color: secondaryText }} />
          </IconButton>
        </Box>

        <Grid container spacing={2} mb={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} disabled={!editable}
              sx={{
                '& .MuiInputBase-input': { color: primaryText },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: primaryText },
                  '&:hover fieldset': { borderColor: whiteBorder },
                  '&.Mui-focused fieldset': { borderColor: whiteBorder }
                }
              }}
              InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} disabled={!editable}
              sx={{
                '& .MuiInputBase-input': { color: primaryText },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: primaryText },
                  '&:hover fieldset': { borderColor: whiteBorder },
                  '&.Mui-focused fieldset': { borderColor: whiteBorder }
                }
              }}
              InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editable}
              sx={{
                '& .MuiInputBase-input': { color: primaryText },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: primaryText },
                  '&:hover fieldset': { borderColor: whiteBorder },
                  '&.Mui-focused fieldset': { borderColor: whiteBorder }
                }
              }}
              InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
            />
          </Grid>
        </Grid>

        {editable && (
          <Button onClick={() => openConfirmation('updateProfile')} variant="contained"
            sx={{ mt: 2, bgcolor: specialColor, color: whiteColor, '&:hover': { bgcolor: primaryColor } }}>
            Save Changes
          </Button>
        )}

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" color={primaryText}>Account Metadata</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Role" value={userInfo.role || ''} disabled
              sx={{
                '& .MuiInputBase-input': { color: primaryText },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: primaryText },
                  '&:hover fieldset': { borderColor: whiteBorder },
                  '&.Mui-focused fieldset': { borderColor: whiteBorder }
                }
              }}
              InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Actif" value={userInfo.actif ? 'Yes' : 'No'} disabled
              sx={{
                '& .MuiInputBase-input': { color: primaryText },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: primaryText },
                  '&:hover fieldset': { borderColor: whiteBorder },
                  '&.Mui-focused fieldset': { borderColor: whiteBorder }
                }
              }}
              InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" color={primaryText}>Other Actions</Typography>
        <Box display="flex" flexDirection="column" gap={1} mt={1}>
          <Button variant="text" onClick={() => setShowPasswordForm(true)}
            sx={{
              justifyContent: 'flex-start',
              color: primaryText,
              textTransform: 'none',
              '&:hover': {
                color: specialText,
                textDecoration: 'underline',
                backgroundColor: 'transparent'
              }
            }}
          >
            Change Password
          </Button>

          <Button variant="text" onClick={() => openConfirmation('deactivate')}
            sx={{
              justifyContent: 'flex-start',
              color: primaryText,
              textTransform: 'none',
              '&:hover': {
                color: specialText,
                textDecoration: 'underline',
                backgroundColor: 'transparent'
              }
            }}
          >
            Deactivate Account
          </Button>

          <Button variant="text" onClick={() => openConfirmation('delete')}
            sx={{
              justifyContent: 'flex-start',
              color: primaryText,
              textTransform: 'none',
              '&:hover': {
                color: specialText,
                textDecoration: 'underline',
                backgroundColor: 'transparent'
              }
            }}
          >
            Delete Account
          </Button>

          <Button variant="text" onClick={() => openConfirmation('logout')}
            sx={{
              justifyContent: 'flex-start',
              color: primaryText,
              textTransform: 'none',
              '&:hover': {
                color: specialText,
                textDecoration: 'underline',
                backgroundColor: 'transparent'
              }
            }}
          >
            Logout
          </Button>
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

export default UserAccount;
