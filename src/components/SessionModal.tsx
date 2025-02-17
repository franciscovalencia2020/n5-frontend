import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import UserService from '@services/UserService';
import { useNavigate } from 'react-router-dom';

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await UserService.refreshAuthToken();
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/signin');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, backgroundColor: 'white', margin: 'auto', mt: '20vh', borderRadius: 2, boxShadow: 24, width: '300px' }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Sesión expirada
        </Typography>
        <Typography variant="body1" gutterBottom textAlign="center">
          Tu sesión ha expirado. ¿Deseas mantenerla activa?
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={handleRefresh} fullWidth>
              Mantener Sesión
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/signin')} fullWidth>
              Cerrar Sesión
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SessionModal;
