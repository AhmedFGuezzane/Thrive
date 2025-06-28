import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

/**
 * A reusable confirmation dialog component.
 * @param {object} props
 * @param {boolean} props.open - Controls whether the dialog is visible.
 * @param {function} props.onClose - Function to call when the dialog is closed.
 * @param {function} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {object} props.content - An object containing dialog content (title, text, button text, color).
 */
export default function ConfirmationDialog({ open, onClose, onConfirm, content }) {
    const { outerBox,middleBox, whiteBorder, primaryText, secondaryText, specialColor, specialText } = useCustomTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            // Style the dialog's paper (the background)
            PaperProps={{
                sx: {
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${whiteBorder}`,
                }
            }}
        >
            <DialogTitle sx={{ color: primaryText, fontWeight: 'bold' }}>
                {content.title}
            </DialogTitle>
            
            <DialogContent>
                <DialogContentText sx={{ color: primaryText }}>
                    {content.text}
                </DialogContentText>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'flex-end' }}>
                <Button 
                    onClick={onClose}
                    sx={{ color: primaryText }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color={content.confirmButtonColor}
                    variant="contained"
                    sx={{
                        bgcolor: alpha(specialText,1), // Use the dynamically mapped color
                        color: primaryText,      // Set the text color
                        '&:hover': {
                            // You can even style the hover state
                            bgcolor: alpha(specialText,0.8), // Keep the same color on hover or change it
                            opacity: 0.9,
                        }
                    }}
                >
                    {content.confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}