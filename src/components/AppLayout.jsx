// src/components/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

export default function AppLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Box p={2} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ p: 1, bgcolor: 'primary.main', color: '#fff', borderRadius: 2 }}>
          <Typography variant="h5" align="center" fontSize={24} padding={'2px'} margin={'2px'}>
            Inspection Data Sheet App
          </Typography>
        </Box>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}
