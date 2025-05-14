// src/components/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function AppLayout() {
  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Inspection Data Sheet App
      </Typography>
      <Outlet />
    </Box>
  );
}
