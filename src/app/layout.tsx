import React from 'react'
import { Montserrat, Roboto } from 'next/font/google'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'

import AppProviders from '@/components/Layout/AppProviders'

// Google Fonts - Roboto & Montserrat
const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
    variable: '--font-roboto',
})

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-montserrat',
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // Server component
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
