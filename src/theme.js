import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: 'Yu Gothic',
            fontSize: 14
        },
    },
    components: {
      MuiButton: {
        defaultProps: {
          size: "small",
          variant: "outlined"
        }
      },
      MuiListSubheader: {
        styleOverrides: {
            root: {
                fontFamily: 'Yu Gothic'
        }
      }
  }}});

export default theme;