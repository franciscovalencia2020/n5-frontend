import React from 'react';
import { Box, TextField, Button, FormControl } from '@mui/material';

interface AuthFormProps {
  formData: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  buttonText: string;
  additionalFields?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ formData, handleChange, handleSubmit, buttonText, additionalFields }) => {
  return (
    <form onSubmit={handleSubmit}>
      {additionalFields}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          required
        />
      </FormControl>
      <Box mt={2}>
        <Button fullWidth variant="contained" color="primary" type="submit">
          {buttonText}
        </Button>
      </Box>
    </form>
  );
};

export default AuthForm;
