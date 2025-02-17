import React from 'react';
import { Drawer, Button, Stack, Typography, Box, Divider } from '@mui/material';
import {
  PermIdentity as PermIdentityIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
    { text: 'Permisos de Usuarios', icon: <PermIdentityIcon />, path: '/user-permissions' },
    { text: 'Mis Permisos', icon: <PermIdentityIcon />, path: '/my-permissions' },
    { text: 'Tipos de Permisos', icon: <CategoryIcon />, path: '/permission-types' },
    { text: 'Permisos', icon: <AssignmentIcon />, path: '/permissions' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/signin');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 300, sm: 350, md: 400 },
        flexShrink: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        borderRight: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
        '& .MuiDrawer-paper': {
          width: { xs: 300, sm: 350, md: 400 },
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {user?.firstName && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonIcon sx={{ fontSize: 30, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
            <Typography variant="body2">{user.email}</Typography>
            <Typography variant="body2">ID: {user.id}</Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <Stack spacing={4} sx={{ p: 3, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Button
            key={item.text}
            startIcon={React.cloneElement(item.icon, { style: { fontSize: 32 } })}
            onClick={() => navigate(item.path)}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '20px',
              p: '20px 24px',
              width: '100%',
              borderRadius: '8px',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '20px' }}>
              {item.text}
            </Typography>
          </Button>
        ))}
      </Stack>

      <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          startIcon={<ExitToAppIcon sx={{ fontSize: 32 }} />}
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontSize: '20px',
            p: '20px 24px',
            width: '100%',
            borderRadius: '8px',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '20px', color: 'error.main' }}>
            Cerrar Sesión
          </Typography>
        </Button>
      </Box>

      <Divider />
      <Box sx={{ textAlign: 'center', p: 2, mt: 'auto', borderTop: '1px solid #e0e0e0' }}>
        <PersonIcon sx={{ fontSize: 28, mb: 1, color: 'primary.main' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Created By Francisco Valencia
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Full Stack Developer
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Navbar;