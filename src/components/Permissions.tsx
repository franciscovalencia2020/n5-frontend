import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import PermissionService from '@services/PermissionService';
import Table from './Table';
import FormDialog from './FormDialog';
import ConfirmDialog from './ConfirmDialog';
import { Permission, PaginatedResponse, PermissionType } from '@interfaces/interfaces';
import PermissionTypeService from '@services/PermissionTypeService';
import CustomSnackbar from './CustomSnackbar';
import { Person as PersonIcon, Description as DescriptionIcon, Lock as LockIcon } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import UserActions from './UserActions';
import AddButton from './AddButton';
import { AxiosError } from 'axios';

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState<GridRowId | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [errors, setErrors] = useState({ description: false });
  const [newPermission, setNewPermission] = useState({ id: 0, permissionTypeId: 0, description: '', isDeleted: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([]);

  const fetchPermissions = async () => {
    try {
      const response: PaginatedResponse<Permission> = await PermissionService.getPermissionsPaginated(
        paginationModel.page + 1, 
        paginationModel.pageSize
      );
      setPermissions(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchPermissionTypes = async () => {
    try {
      const response: PermissionType[] = await PermissionTypeService.getPermissionsType();
      setPermissionTypes(response);
    } catch (error) {
      console.error('Error fetching permission types:', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchPermissionTypes();
  }, [paginationModel]);

  const handleOpenDialog = (id: GridRowId) => {
    setSelectedPermissionId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPermissionId(null);
  };

  const handleDelete = async () => {
    if (selectedPermissionId !== null) {
      try {
        await PermissionService.deletePermission(selectedPermissionId as number);
        fetchPermissions();
        setSnackbarMessage('Permiso eliminado con éxito');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting permission:', error);
        setSnackbarMessage('Error al eliminar el permiso');
        setSnackbarOpen(true);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      description: !newPermission.description,
      permissionTypeId: !newPermission.permissionTypeId
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSavePermission = async () => {
    if (!validateForm()) return;
  
    try {
      let updatedPermissions = [...permissions];
  
      if (dialogMode === 'add') {
        const createdPermission = await PermissionService.createPermission({ ...newPermission, isDeleted: false });
        updatedPermissions.push(createdPermission);
        setSnackbarMessage('Permiso agregado con éxito');
      } else {
        await PermissionService.updatePermission(newPermission.id, newPermission);
        updatedPermissions = updatedPermissions.map(permission =>
          permission.id === newPermission.id ? { ...permission, ...newPermission } : permission
        );
        setSnackbarMessage('Permiso actualizado con éxito');
      }
  
      setPermissions(updatedPermissions);
      setOpenAddDialog(false);
      setNewPermission({ id: 0, permissionTypeId: 0, description: '', isDeleted: false });
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error al guardar el permiso:', error);
      setSnackbarSeverity('error');
      if (error instanceof AxiosError && error.response?.data?.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error al guardar el permiso');
      }
      setSnackbarOpen(true);
    }
  };
  

  const handleEdit = (permission: Permission) => {
    setNewPermission({ ...permission, id: permission.id });
    setErrors({ description: false });
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
      field: 'permissionType',
      headerName: 'Tipo de Permiso',
      flex: 2,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <LockIcon sx={{ mr: 1 }} />
          <span>Tipo de Permiso</span>
        </Box>
      ),
      renderCell: (params) => (
        <span>{params.row.permissionType.description}</span>
      ),
    },
    { 
      field: 'description', 
      headerName: 'Descripción', 
      flex: 2,
      renderHeader: () => (
        <Box display="flex" alignItems="center">
          <DescriptionIcon sx={{ mr: 1 }} />
          <span>Descripción</span>
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
      <AddButton
        title="Lista de Permisos"
        buttonText="Agregar Permiso"
        onButtonClick={() => setOpenAddDialog(true)}
        Icon={PersonIcon}
      />

      <Table 
        rows={permissions} 
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalCount={totalCount}
      />

      <FormDialog<Permission>
        open={openAddDialog}
        title={dialogMode === 'add' ? 'Agregar Permiso' : 'Editar Permiso'}
        description={dialogMode === 'add' ? 'Ingresa los datos del nuevo permiso.' : 'Edita los datos del permiso.'}
        data={newPermission}
        errors={errors}
        setData={setNewPermission}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleSavePermission}
        fields={[
          { label: 'Descripción', key: 'description' },
          { label: 'Tipo de Permiso', key: 'permissionTypeId', type: 'select' },
        ]}
        permissionTypes={permissionTypes}
      />

      <ConfirmDialog
        open={openDialog}
        title="Confirmar Eliminación"
        content="¿Estás seguro de que deseas eliminar este permiso?"
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
      />

      <CustomSnackbar open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} />
    </Box>
  );
};

export default Permissions;
