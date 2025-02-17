import React from 'react';
import { Box, Button } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface UserActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onEdit, onDelete }) => (
  <Box display="flex" gap={1} justifyContent="center" flexWrap="nowrap">
    <Button variant="contained" color="secondary" size="small" startIcon={<DeleteIcon />} onClick={onDelete}>
      Eliminar
    </Button>
    <Button variant="contained" color="primary" size="small" startIcon={<EditIcon />} onClick={onEdit}>
      Editar
    </Button>
  </Box>
);

export default UserActions;
