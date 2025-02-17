import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface AddButtonProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  Icon: SvgIconComponent;
}

const AddButton: React.FC<AddButtonProps> = ({ title, buttonText, onButtonClick, Icon }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{title}</Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<Icon />}
      onClick={onButtonClick}
    >
      {buttonText}
    </Button>
  </Box>
);

export default AddButton;
