import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import UserService from '@services/UserService';
import { AxiosError } from 'axios';
import AuthForm from './AuthForm';
import CustomSnackbar from './CustomSnackbar';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await UserService.login(formData.email, formData.password);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setSnackbarMessage('Inicio de sesión exitoso');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/users'), 1000);
    } catch (error) {
      console.error('Error during login:', error);
      if (error instanceof AxiosError && error.response?.data?.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error al iniciar sesión');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => navigate('/users'), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, navigate]);

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 500, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <AccountCircleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Iniciar Sesión
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <AuthForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            buttonText="Iniciar Sesión"
            additionalFields={[]}
          />
        )}
        <Box mt={2} textAlign="center">
          <Button variant="text" color="primary" onClick={() => navigate('/')}>¿Aun no estas registrado? Registrarse</Button>
        </Box>
      </Paper>
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} />
    </Box>
  );
};

export default SignIn;
