import React, { useEffect, useRef, useState } from 'react'
import {
    AppShell,
    useComputedColorScheme,
    useMantineColorScheme,
} from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'

import Header from './Header/Header'
import Navbar from './Navbar/Navbar'

import useGetUserOrAuthenticate from '@/hooks/users/useGetUserOrAuthenticate'
import useSelectedBusinessStore from '@/hooks/stores/useSelectedBusinessStore'
import useSidebarStore from '@/hooks/stores/useSidebarStore'

import SplashLogo from '@/components/Common/Loader/SplashLogo'

interface Layout {
    children: React.ReactNode
}

const Layout = (props: Layout) => {
    const opened = useSidebarStore((state) => state.opened)
    const [unloaded, setUnloaded] = useState(true)

    const { user, loading } = useGetUserOrAuthenticate(false)

    // Reload selected business when the user's ID changes
    const setSelectedBusiness = useSelectedBusinessStore(
        (state) => state.setSelectedBusiness
    )
    const sessionUserID = loading ? undefined : (user?.id ?? null)
    const prevSessionUserID = useRef<number | null | undefined>(undefined)

    useEffect(() => {
        if (sessionUserID === undefined) return

        // Refresh when the userID changes (except if there wasn't any userID before)
        const previousUserID = prevSessionUserID.current
        const userChanged =
            previousUserID !== undefined &&
            previousUserID !== null &&
            previousUserID !== sessionUserID
        if (userChanged) setSelectedBusiness(null)

        prevSessionUserID.current = sessionUserID
    }, [sessionUserID, setSelectedBusiness])

    // Change between theme preferences
    const { setColorScheme } = useMantineColorScheme()
    const computedColorScheme = useComputedColorScheme('dark')
    const toggleColorScheme = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
    }

    // Hotkeys
    useHotkeys([['mod+J', () => toggleColorScheme()]])

    useEffect(() => {
        setUnloaded(false)
    }, [])

    const layoutSet = () => {
        // Unloaded page
        if (unloaded) return <SplashLogo />

        // Layout
        return (
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: { base: 270 },
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}>
                <AppShell.Header>
                    <Header
                        toggleColorScheme={toggleColorScheme}
                        showNavbar={true}
                        currentUser={user}
                    />
                </AppShell.Header>
                <AppShell.Navbar>
                    <Navbar currentUser={user} loading={loading} />
                </AppShell.Navbar>
                <AppShell.Main>{props.children}</AppShell.Main>
            </AppShell>
        )
    }

    return layoutSet()
}

export default Layout
