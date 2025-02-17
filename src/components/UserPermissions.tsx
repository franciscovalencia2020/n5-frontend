import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import UserPermissionService from '@services/UserPermissionService';
import Table from './Table';
import FormDialog from './FormDialog';
import ConfirmDialog from './ConfirmDialog';
import { UserPermission, PaginatedResponse, User, Permission } from '@interfaces/interfaces';
import UserService from '@services/UserService';
import PermissionService from '@services/PermissionService';
import CustomSnackbar from './CustomSnackbar';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import UserActions from './UserActions';
import AddButton from './AddButton';
import { AxiosError } from 'axios';

const UserPermissions: React.FC = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedUserPermissionId, setSelectedUserPermissionId] = useState<GridRowId | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [errors, setErrors] = useState({ userId: false, permissionId: false });
  const [newUserPermission, setNewUserPermission] = useState({ id: 0, userId: 0, permissionId: 0, isDeleted: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const fetchUserPermissions = async () => {
    try {
      const response: PaginatedResponse<UserPermission> = await UserPermissionService.getUserPermissionsPaginated(
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      setUserPermissions(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response: User[] = await UserService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response: Permission[] = await PermissionService.getPermissions();
      setPermissions(response);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
    fetchUsers();
    fetchPermissions();
  }, [paginationModel]);

  const handleOpenDialog = (id: GridRowId) => {
    setSelectedUserPermissionId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserPermissionId(null);
  };

  const handleDelete = async () => {
    if (selectedUserPermissionId !== null) {
      try {
        await UserPermissionService.deleteUserPermission(selectedUserPermissionId as number);
        fetchUserPermissions();
        setSnackbarMessage('Permiso de usuario eliminado con éxito');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting user permission:', error);
        setSnackbarMessage('Error al eliminar el permiso de usuario');
        setSnackbarOpen(true);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      userId: !newUserPermission.userId,
      permissionId: !newUserPermission.permissionId
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSaveUserPermission = async () => {
    if (!validateForm()) return;

    try {
      let updatedUserPermissions = [...userPermissions];

      if (dialogMode === 'add') {
        const createdUserPermission = await UserPermissionService.createUserPermission({ ...newUserPermission, isDeleted: false });
        updatedUserPermissions.push(createdUserPermission);
        setSnackbarMessage('Permiso de usuario agregado con éxito');
      } else {
        await UserPermissionService.updateUserPermission(newUserPermission.id, newUserPermission);
        updatedUserPermissions = updatedUserPermissions.map(userPermission =>
          userPermission.id === newUserPermission.id ? { ...userPermission, ...newUserPermission } : userPermission
        );
        setSnackbarMessage('Permiso de usuario actualizado con éxito');
      }

      setUserPermissions(updatedUserPermissions);
      setOpenAddDialog(false);
      setNewUserPermission({ id: 0, userId: 0, permissionId: 0, isDeleted: false });
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error al guardar el permiso de usuario:', error);
      setSnackbarSeverity('error');
      if (error instanceof AxiosError && error.response?.data?.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error al guardar el permiso de usuario');
      }
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (userPermission: UserPermission) => {
    setNewUserPermission({ ...userPermission, id: userPermission.id });
    setErrors({ userId: false, permissionId: false });
    setDialogMode('edit');
    setOpenAddDialog(true);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <PersonIcon sx={{ mr: 1 }} />
          <span>ID</span>
        </Box>
      ),
    },
    {
      field: 'userId',
      headerName: 'Usuario',
      flex: 2,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <PersonIcon sx={{ mr: 1 }} />
          <span>Usuario</span>
        </Box>
      ),
      renderCell: (params) => (
        <span>{users.find(user => user.id === params.row.userId)?.firstName} {users.find(user => user.id === params.row.userId)?.lastName}</span>
      ),
    },
    {
      field: 'permissionId',
      headerName: 'Permiso',
      flex: 2,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <LockIcon sx={{ mr: 1 }} />
          <span>Permiso</span>
        </Box>
      ),
      renderCell: (params) => (
        <span>{permissions.find(permission => permission.id === params.row.permissionId)?.description}</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 2,
      minWidth: 200,
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <SettingsIcon sx={{ mr: 1 }} />
          <span>Acciones</span>
        </Box>
      ),
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%', padding: '0 0' }}
        >
          <UserActions onEdit={() => handleEdit(params.row)} onDelete={() => handleOpenDialog(params.id)} />
        </Box>
      ),
    }
  ], [users, permissions]);

  return (
    <Box sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff', width: '80%', margin: '150px auto' }}>
      <AddButton
        title="Lista de Permisos de Usuario"
        buttonText="Agregar Permiso de Usuario"
        onButtonClick={() => setOpenAddDialog(true)}
        Icon={PersonIcon}
      />

      <Table
        rows={userPermissions}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalCount={totalCount}
      />

      <FormDialog<UserPermission>
        open={openAddDialog}
        title={dialogMode === 'add' ? 'Agregar Permiso de Usuario' : 'Editar Permiso de Usuario'}
        description={dialogMode === 'add' ? 'Ingresa los datos del nuevo permiso de usuario.' : 'Edita los datos del permiso de usuario.'}
        data={newUserPermission}
        errors={errors}
        setData={setNewUserPermission}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleSaveUserPermission}
        fields={[
          { label: 'Usuario', key: 'userId', type: 'select' },
          { label: 'Permiso', key: 'permissionId', type: 'select' },
        ]}
        users={users}
        permissions={permissions}
      />

      <ConfirmDialog
        open={openDialog}
        title="Confirmar Eliminación"
        content="¿Estás seguro de que deseas eliminar este permiso de usuario?"
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
      />

      <CustomSnackbar open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} />
    </Box>
  );
};

export default UserPermissions;