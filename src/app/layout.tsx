import React from 'react'
import localFont from 'next/font/local'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'

import AppProviders from '@/components/Layout/AppProviders'

// Local fonts - Roboto & Montserrat (latin subset, from Fontsource)
// Stored in the repo, so the build doesn't depend on Google Fonts
const roboto = localFont({
    src: [
        { path: './fonts/roboto/roboto-latin-400-normal.woff2', weight: '400' },
        { path: './fonts/roboto/roboto-latin-500-normal.woff2', weight: '500' },
        { path: './fonts/roboto/roboto-latin-700-normal.woff2', weight: '700' },
    ],
    display: 'swap',
    variable: '--font-roboto',
})

const montserrat = localFont({
    src: [
        {
            path: './fonts/montserrat/montserrat-latin-400-normal.woff2',
            weight: '400',
        },
        {
            path: './fonts/montserrat/montserrat-latin-500-normal.woff2',
            weight: '500',
        },
        {
            path: './fonts/montserrat/montserrat-latin-600-normal.woff2',
            weight: '600',
        },
        {
            path: './fonts/montserrat/montserrat-latin-700-normal.woff2',
            weight: '700',
        },
    ],
    display: 'swap',
    variable: '--font-montserrat',
})

// Server component
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" className={`${roboto.variable} ${montserrat.variable}`}>
            <head>
                <title>Managefy</title>
                <meta
                    name="description"
                    content="Easy-to-use resource management for your business"
                />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}
