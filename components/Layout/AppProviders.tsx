'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import Theme from '@/app/theme'
import Layout from '@/components/Layout/Layout'

// Detect the user's theme preference (dark or light)
const colorSchemeManager = localStorageColorSchemeManager({
    key: 'mantine-color-scheme',
})

interface AppProvidersProps {
    children: React.ReactNode
}

// Client side of the root layout: Mantine providers and the app layout
const AppProviders = (props: AppProvidersProps) => {
    const { children } = props

    const pathname = usePathname()

    // Printable pages are shown without the app layout
    const isPrintable =
        pathname?.includes('/invoice') || pathname?.includes('/stats/report')

    return (
        <MantineProvider
            theme={Theme}
            colorSchemeManager={colorSchemeManager}
            defaultColorScheme="dark">
            {isPrintable ? (
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
    )
}

export default AppProviders
