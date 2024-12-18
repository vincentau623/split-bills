import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    cssVariables: true,
    
    palette: {
        mode: 'dark',

        primary: {
            // light: '#d3c6f2',
            main: '#9779e3',
            // dark: '#653ed2',
            // contrastText: '#fff',
        },
        secondary: {
            // light: '#f5e4e1',
            main: '#e39779',
            // dark: '#cf521a',
            // contrastText: '#000',
        },
    },
});


export default theme;