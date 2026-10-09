'use client'
import React from 'react'

import { usePathname } from 'next/navigation'
import { Montserrat, Roboto } from 'next/font/google'

import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'

import Theme from './theme'
import Layout from '@/components/Layout/Layout'

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
    // Detect the user's theme preference (dark or light)
    const colorSchemeManager = localStorageColorSchemeManager({
        key: 'mantine-color-scheme',
    })

    const pathname = usePathname()
    const isInvoice = pathname?.includes('/invoice')

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
                <MantineProvider
                    theme={Theme}
                    colorSchemeManager={colorSchemeManager}
                    defaultColorScheme="dark">
                    {isInvoice ? (
                        <>
                            {children}
                            <Notifications />
                        </>
                    ) : (
                        <Layout>
                            <main className="flex min-h-screen flex-col items-center justify-between p-12">
                                {children}
                            </main>
                            <Notifications />
                        </Layout>
                    )}
                </MantineProvider>
            </body>
        </html>
    )
}
