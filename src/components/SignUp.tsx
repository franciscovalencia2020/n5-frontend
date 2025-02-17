import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import { AxiosError } from 'axios';
import AuthForm from './AuthForm';
import CustomSnackbar from './CustomSnackbar';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UserService.createUser({ ...formData, id: 0, isDeleted: false });
      setSnackbarMessage('Usuario registrado exitosamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => navigate('/signin'), 1000);
      }, 1000);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof AxiosError && error.response?.data?.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error al registrar el usuario');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 500, borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <AccountCircleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" align="center" gutterBottom color="primary">Registrarse</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <AuthForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} buttonText="Registrarse"
            additionalFields={
              <>
                <TextField label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth margin="normal" required />
              </>
            }
          />
        )}
        <Box mt={2} textAlign="center">
          <Button variant="text" color="primary" onClick={() => navigate('/signin')}>¿Ya tienes una cuenta? Inicia Sesión</Button>
        </Box>
      </Paper>
      <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} />
    </Box>
  );
};

export default SignUp;