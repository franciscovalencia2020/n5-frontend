import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'secondary'
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{cancelText}</Button>
      <Button onClick={onConfirm} color={confirmColor}>{confirmText}</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
