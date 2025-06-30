import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function ChangePasswordDialog({
    open,
    onClose,
    onSave,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
}) {
    const { outerBox,middleBox,innerBox, whiteBorder, primaryText, specialColor, whiteColor, specialText, primaryColor } = useCustomTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${whiteBorder}`,
                }
            }}
        >
            <DialogTitle sx={{ color: primaryColor, textAlign:'center', fontWeight: 'bold' }}>
                Change Password
            </DialogTitle>
            
            <DialogContent>
                <Typography variant="body2" color={primaryText} mb={2}>
                    Enter your current password and a new password.
                </Typography>
                <Grid container display="flex" flexDirection="column" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{
                                '& .MuiInputBase-input': { color: primaryText },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: primaryText },
                                    '&:hover fieldset': { borderColor: specialColor },
                                    '&.Mui-focused fieldset': { borderColor: specialColor },
                                },
                            }}
                            InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{
                                '& .MuiInputBase-input': { color: primaryText },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: primaryText },
                                    '&:hover fieldset': { borderColor: specialColor },
                                    '&.Mui-focused fieldset': { borderColor: specialColor },
                                },
                            }}
                            InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            sx={{
                                '& .MuiInputBase-input': { color: primaryText },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: primaryText },
                                    '&:hover fieldset': { borderColor: specialColor },
                                    '&.Mui-focused fieldset': { borderColor: specialColor },
                                },
                            }}
                            InputLabelProps={{ style: { color: primaryText }, sx: { '&.Mui-focused': { color: specialColor } } }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={{ color: primaryText }}>Cancel</Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    sx={{ bgcolor: alpha(specialText,1), color: whiteColor, '&:hover': { bgcolor: alpha(specialText,0.8) } }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}