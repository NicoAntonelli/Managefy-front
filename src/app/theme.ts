import { createTheme } from '@mantine/core'

// Mantine theme
const Theme = createTheme({
    primaryColor: 'blue',
    shadows: {
        md: '1px 1px 3px rgba(0, 0, 0, .25)',
        xl: '5px 5px 3px rgba(0, 0, 0, .25)',
    },
    fontFamily: 'Roboto, Verdana, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Montserrat, Greycliff CF, sans-serif' },
    breakpoints: {
        xs: '36rem',
        sm: '72rem',
        md: '96rem',
        lg: '124rem',
        xl: '150rem',
    },
})

export default Theme
