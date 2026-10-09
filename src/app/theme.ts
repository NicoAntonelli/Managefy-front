import { createTheme } from '@mantine/core'

// Mantine theme
const Theme = createTheme({
    primaryColor: 'blue',
    other: {
        secondaryColor: 'orange.6',
        warning: 'yellow.6',
        danger: 'red.8',
        success: 'green.8',
        neutral: 'gray.8',
        printText: '#111', // Printable pages look the same in light and dark mode
        printBackground: '#fff',
    },
    shadows: {
        md: '1px 1px 3px rgba(0, 0, 0, .25)',
        xl: '5px 5px 3px rgba(0, 0, 0, .25)',
    },
    fontFamily: 'var(--font-roboto), Verdana, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
        fontFamily: 'var(--font-montserrat), Greycliff CF, sans-serif',
    },
    breakpoints: {
        xs: '36rem',
        sm: '72rem',
        md: '96rem',
        lg: '124rem',
        xl: '150rem',
    },
})

export default Theme
