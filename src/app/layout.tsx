'use client'
import React from 'react'

import { Inter } from 'next/font/google'

import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'

import Theme from './theme'
import Layout from '@/components/Layout/Layout'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // Detect the user's theme preference (dark or light)
    const colorSchemeManager = localStorageColorSchemeManager({
        key: 'mantine-color-scheme',
    })

    return (
        <html lang="es">
            <head>
                <title>Managefy</title>
                <meta
                    name="description"
                    content="Easy-to-use resource management for your business"
                />
                <link rel="icon" href="/favicon.ico" />
                {/* Google Fonts - Montserrat & Roboto */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={inter.className}>
                <MantineProvider
                    theme={Theme}
                    colorSchemeManager={colorSchemeManager}
                    defaultColorScheme="dark">
                    <Layout>
                        <main className="flex min-h-screen flex-col items-center justify-between p-24">
                            {children}
                        </main>
                    </Layout>
                </MantineProvider>
            </body>
        </html>
    )
}
