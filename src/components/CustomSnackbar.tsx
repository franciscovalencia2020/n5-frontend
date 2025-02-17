import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity?: 'success' | 'error' | 'warning' | 'info';
}

const CustomSnackbar: React.FC<SnackbarProps> = ({ open, message, onClose, severity = 'success' }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default CustomSnackbar;
