import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import { Person as PersonIcon, Email as EmailIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import useUsers from '@hooks/UseUsers';
import UserActions from './UserActions';
import FormDialog from './FormDialog';
import Table from './Table';
import CustomSnackbar from './CustomSnackbar';
import AddButton from './AddButton';
import ConfirmDialog from './ConfirmDialog';
import { formatDateToEST } from '@utils/utils';
import UserService from '@services/UserService';
import { User } from '@interfaces/interfaces';
import SettingsIcon from '@mui/icons-material/Settings';
import SessionModal from '@components/SessionModal';
import { AxiosError } from 'axios';

const Users: React.FC = () => {
  const { users, totalCount, paginationModel, setPaginationModel, fetchUsers, showSessionModal, setShowSessionModal } = useUsers();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ id: 0, firstName: '', lastName: '', email: '', password: '', isDeleted: false });
  const [errors, setErrors] = useState({ firstName: false, lastName: false, email: false, password: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  const handleOpenDialog = (id: GridRowId) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (selectedId !== null) {
      try {
        await UserService.deleteUser(selectedId as number);
        fetchUsers();
        setSnackbarMessage('Usuario eliminado con éxito');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbarMessage('Error al eliminar el usuario');
        setSnackbarOpen(true);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleEdit = (user: User) => {
    setNewUser({ ...user, id: user.id });
    setErrors({ firstName: false, lastName: false, email: false, password: false });
    setDialogMode('edit');
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewUser({ id: 0, firstName: '', lastName: '', email: '', password: '', isDeleted: false });
    setDialogMode('add');
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !newUser.firstName,
      lastName: !newUser.lastName,
      email: !newUser.email,
      password: !newUser.password,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    try {
      if (dialogMode === 'add') {
        await UserService.createUser({ ...newUser, isDeleted: false });
        setSnackbarMessage('Usuario agregado con éxito');
      } else {
        await UserService.updateUser(newUser.id, newUser);
        setSnackbarMessage('Usuario actualizado con éxito');
      }
      fetchUsers();
      setOpenAddDialog(false);
      setNewUser({ id: 0, firstName: '', lastName: '', email: '', password: '', isDeleted: false });
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      setSnackbarSeverity('error');
      if (error instanceof AxiosError && error.response?.data?.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error al guardar el usuario');
      }
      setSnackbarOpen(true);
    }
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
      field: 'firstName',
      headerName: 'Nombre',
      flex: 2,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <PersonIcon sx={{ mr: 1 }} />
          <span>Nombre</span>
        </Box>
      ),
    },
    {
      field: 'lastName',
      headerName: 'Apellido',
      flex: 2,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <PersonIcon sx={{ mr: 1 }} />
          <span>Apellido</span>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Correo Electrónico',
      flex: 3,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <EmailIcon sx={{ mr: 1 }} />
          <span>Correo Electrónico</span>
        </Box>
      ),
    },
    {
      field: 'createdDate',
      headerName: 'Fecha de Creación',
      flex: 2,
      valueGetter: (params) => formatDateToEST(params),
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <CalendarIcon sx={{ mr: 1 }} />
          <span>Fecha de Creación</span>
        </Box>
      ),
    },
    {
      field: 'updatedDate',
      headerName: 'Fecha de Actualización',
      flex: 2,
      valueGetter: (params) => formatDateToEST(params),
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <CalendarIcon sx={{ mr: 1 }} />
          <span>Fecha de Actualización</span>
        </Box>
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
  ], []);

  return (
    <Box sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff', width: '80%', margin: '150px auto' }}>
      {showSessionModal && <SessionModal open={showSessionModal} onClose={() => setShowSessionModal(false)} />}
      <AddButton
        title="Lista de Usuarios Registrados"
        buttonText="Agregar Usuario"
        onButtonClick={() => setOpenAddDialog(true)}
        Icon={PersonIcon}
      />

      <Table<User>
        rows={users}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalCount={totalCount}
      />

      <ConfirmDialog
        open={openDialog}
        title="Confirmar Eliminación"
        content="¿Estás seguro de que deseas eliminar este usuario?"
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="secondary"
      />

      <FormDialog<User>
        open={openAddDialog}
        title={dialogMode === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}
        description={dialogMode === 'add' ? 'Ingresa los datos del nuevo usuario.' : 'Edita los datos del usuario.'}
        data={newUser}
        errors={errors}
        setData={setNewUser}
        onClose={handleCloseAddDialog}
        onSave={handleSaveUser}
        fields={[
          { label: 'Nombre', key: 'firstName' },
          { label: 'Apellido', key: 'lastName' },
          { label: 'Correo Electrónico', key: 'email' },
          { label: 'Contraseña', key: 'password', type: 'password' },
        ]}
      />

      <CustomSnackbar open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} />
    </Box>
  );
};

export default Users;