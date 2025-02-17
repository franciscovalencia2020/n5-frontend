// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#FFD700',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#003366',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#003366',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#003366',
    },
    body1: {
      fontSize: '1rem',
      color: '#555555',
    },
  },
  spacing: 8,
});

export default theme;