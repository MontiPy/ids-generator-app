import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#da251d', // Honda red
    },
    secondary: {
      main: '#000000',
    },
  },
  typography: {
    allVariants: {
      fontFamily: 'Yu Gothic',
      fontSize: 14,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontFamily: 'Yu Gothic',
        },
      },
    },
  },
});

export default theme;
