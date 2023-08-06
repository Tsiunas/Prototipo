import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#3C096C',
        },
        secondary: {
            main: '#E0AAFF',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;