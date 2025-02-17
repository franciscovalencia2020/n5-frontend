import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { GridColDef, GridRowId } from '@mui/x-data-grid';
import PermissionTypeService from '@services/PermissionTypeService';
import Table from './Table';
import FormDialog from './FormDialog';
import ConfirmDialog from './ConfirmDialog';
import { PermissionType, PaginatedResponse } from '@interfaces/interfaces';
import CustomSnackbar from './CustomSnackbar';
import { Person as PersonIcon, Description as DescriptionIcon } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import UserActions from './UserActions';
import AddButton from './AddButton';
import { AxiosError } from 'axios';

const PermissionTypes: React.FC = () => {
  const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedPermissionTypeId, setSelectedPermissionTypeId] = useState<GridRowId | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [errors, setErrors] = useState({ description: false });
  const [newPermissionType, setNewPermissionType] = useState({ id: 0, description: '', isDeleted: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchPermissionTypes = async () => {
    try {
      const response: PaginatedResponse<PermissionType> = await PermissionTypeService.getPermissionsTypePaginated(
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      setPermissionTypes(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching permission types:', error);
    }
  };

  useEffect(() => {
    fetchPermissionTypes();
  }, [paginationModel]);

  const handleOpenDialog = (id: GridRowId) => {
    setSelectedPermissionTypeId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPermissionTypeId(null);
  };

  const handleDelete = async () => {
    if (selectedPermissionTypeId !== null) {
      try {
        await PermissionTypeService.deletePermissionType(selectedPermissionTypeId as number);
        fetchPermissionTypes();
        setSnackbarMessage('Tipo de permiso eliminado con éxito');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting permission type:', error);
        setSnackbarMessage('Error al eliminar el tipo de permiso');
        setSnackbarOpen(true);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      description: !newPermissionType.description
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSavePermissionType = async () => {
    if (!validateForm()) return;

    try {
      if (dialogMode === 'add') {
        await PermissionTypeService.createPermissionType({ ...newPermissionType, isDeleted: false });
        setSnackbarMessage('Tipo de permiso agregado con éxito');
      } else {
        await PermissionTypeService.updatePermissionType(newPermissionType.id, newPermissionType);
        setSnackbarMessage('Tipo de permiso actualizado con éxito');
      }
      fetchPermissionTypes();
      setOpenAddDialog(false);
      setNewPermissionType({ id: 0, description: '', isDeleted: false });
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error al guardar el tipo de permiso:', error);
      setSnackbarSeverity('error');
      if (error instanceof AxiosError && error.response?.data?.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error al guardar el tipo de permiso');
      }
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (permissionType: PermissionType) => {
    setNewPermissionType({ ...permissionType, id: permissionType.id });
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
        title="Lista de tipos de permisos"
        buttonText="Agregar Tipo de Permiso"
        onButtonClick={() => setOpenAddDialog(true)}
        Icon={PersonIcon}
      />

      <Table
        rows={permissionTypes}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        totalCount={totalCount}
      />

      <FormDialog<PermissionType>
        open={openAddDialog}
        title={dialogMode === 'add' ? 'Agregar Tipo de Permiso' : 'Editar Tipo de Permiso'}
        description={dialogMode === 'add' ? 'Ingresa los datos del nuevo tipo de permiso.' : 'Edita los datos del tipo de permiso.'}
        data={newPermissionType}
        errors={errors}
        setData={setNewPermissionType}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleSavePermissionType}
        fields={[
          { label: 'Descripción', key: 'description' },
        ]}
      />

      <ConfirmDialog
        open={openDialog}
        title="Confirmar Eliminación"
        content="¿Estás seguro de que deseas eliminar este tipo de permiso?"
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
      />

      <CustomSnackbar open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} />
    </Box>
  );
};

export default PermissionTypes;