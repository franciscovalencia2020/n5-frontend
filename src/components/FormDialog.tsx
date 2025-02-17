import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { PermissionType, User, Permission } from '@interfaces/interfaces';

interface FormDialogProps<T> {
  open: boolean;
  title: string;
  description: string;
  data: T;
  errors: Partial<Record<keyof T, boolean>>;
  setData: (data: T) => void;
  onClose: () => void;
  onSave: () => void;
  fields: { label: string; key: keyof T; type?: string }[];
  permissionTypes?: PermissionType[];
  users?: User[];
  permissions?: Permission[];
}

const FormDialog = <T,>({
  open,
  title,
  description,
  data,
  errors,
  setData,
  onClose,
  onSave,
  fields,
  permissionTypes = [],
  users = [],
  permissions = [],
}: FormDialogProps<T>) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {fields.map((field) => {
          if (field.key === 'permissionTypeId' && field.type === 'select') {
            return (
              <FormControl fullWidth key={field.key as string} error={errors[field.key]}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  label={field.label}
                >
                  {permissionTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors[field.key] && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>Este campo es requerido</Box>}
              </FormControl>
            );
          }
          if (field.key === 'userId' && field.type === 'select') {
            return (
              <FormControl fullWidth key={field.key as string} error={errors[field.key]}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  label={field.label}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors[field.key] && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>Este campo es requerido</Box>}
              </FormControl>
            );
          }
          if (field.key === 'permissionId' && field.type === 'select') {
            return (
              <FormControl fullWidth key={field.key as string} error={errors[field.key]}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  label={field.label}
                >
                  {permissions.map((permission) => (
                    <MenuItem key={permission.id} value={permission.id}>
                      {permission.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors[field.key] && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>Este campo es requerido</Box>}
              </FormControl>
            );
          }
          return (
            <TextField
              key={field.key as string}
              label={field.label}
              type={field.type || 'text'}
              value={data[field.key] as string}
              onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
              fullWidth
              error={errors[field.key]}
              helperText={errors[field.key] ? 'Este campo es requerido' : ''}
            />
          );
        })}
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} color="primary">Guardar</Button>
    </DialogActions>
  </Dialog>
);

export default FormDialog;