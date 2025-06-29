import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    useTheme,
} from '@mui/material';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function LanguageSelectionDialog({ open, onClose, currentLanguage, onLanguageChange }) {
    const theme = useTheme();
    const { innerBox, outerBox, primaryText, secondaryText, specialColor, softBoxShadow, whiteBorder } = useCustomTheme();

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'es', label: 'Español' },
        { code: 'ar', label: 'العربية' },
    ];

    const handleLanguageSelect = (lng) => {
        onLanguageChange(lng);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: outerBox,
                    color: primaryText,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${whiteBorder}`,
                    boxShadow: softBoxShadow,
                    borderRadius: '16px',
                    p: 2,
                    minWidth: { xs: '90%', sm: '400px' }
                }
            }}
        >
            <DialogTitle sx={{ color: specialColor, textAlign: 'center', fontWeight: 'bold' }}>
                Select Language
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    mt={1}
                >
                    {languages.map((lng) => (
                        <Button
                            key={lng.code}
                            variant={currentLanguage === lng.code ? 'contained' : 'outlined'}
                            onClick={() => handleLanguageSelect(lng.code)}
                            disabled={currentLanguage === lng.code}
                            sx={{
                                justifyContent: 'center',
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                color: currentLanguage === lng.code ? secondaryText : primaryText,
                                bgcolor: currentLanguage === lng.code ? specialColor : innerBox,
                                border: `1px solid ${currentLanguage === lng.code ? 'transparent' : secondaryText}`,
                                '&:hover': {
                                    bgcolor: currentLanguage === lng.code ? specialColor : theme.palette.action.hover,
                                    opacity: 0.9,
                                },
                            }}
                        >
                            {lng.label}
                        </Button>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: secondaryText }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}