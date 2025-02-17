import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import UserPermissionService from '@services/UserPermissionService';
import { UserPermission } from '@interfaces/interfaces';
import { formatDateToEST } from '@utils/utils';

const MyPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.id) {
        try {
          const userPermissions = await UserPermissionService.getUserPermissionsByUserId(user.id);
          setPermissions(userPermissions);
        } catch (error) {
          console.error('Error fetching user permissions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPermissions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Permisos
      </Typography>
      <Typography variant="body1" gutterBottom>
        Aquí puedes ver los permisos que tienes asignados.
      </Typography>

      {permissions.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No tienes permisos asignados.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {permissions.map((permission) => (
            <Grid item xs={12} sm={6} md={4} key={permission.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Permiso #{permission.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID de Permiso: {permission.permissionId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Description: {permission?.permission?.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Asignado el: {formatDateToEST(permission.createdDate || '')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyPermissions;