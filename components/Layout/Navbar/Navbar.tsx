import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { AppShell, Divider, rem } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
    IconBuildingStore,
    IconBulb,
    IconCashRegister,
    IconChartBar,
    IconDoorExit,
    IconEdit,
    IconHelp,
    IconMailCheck,
    IconRocket,
    IconUserCircle,
    IconUserCog,
    IconUserDollar,
} from '@tabler/icons-react'

import Helper from '@/services/helper'
import Users from '@/services/users'
import User from '@/entities/User'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'

import NavbarItem from './NavbarItem'
import UserBanner from './UserBanner'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'

// Icon properties
const iconSize = 40

const logout = async (
    router: AppRouterInstance,
    setCurrentUser: React.Dispatch<any>
) => {
    try {
        await Users.logout()
        setCurrentUser(null)
        router.push('/users/loginRegister')
    } catch (error) {
        notifications.show({
            title: 'Error',
            message: 'Could not log out. Please try again later.',
            color: 'red',
        })

        return null
    }
}

const Navbar = () => {
    const needReload = useSessionReloadStore((state) => state.needReload)
    const setNeedReload = useSessionReloadStore((state) => state.setNeedReload)

    // User data needed for showing it in the navbar
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const [userMenuOpened, userMenuHandlers] = useDisclosure(false)

    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await Helper.getUserOrAuthenticate(router, false)
                setCurrentUser(user)
            } catch (error) {
                setCurrentUser(null)
                notifications.show({
                    title: 'Error',
                    message:
                        'Error validating current session. Please try again later',
                    color: 'red',
                })
            } finally {
                setNeedReload(false)
                setLoading(false)
            }
        }
        fetchUser()
    }, [needReload])

    if (loading) {
        return <SkeletonSmall />
    }

    return (
        <>
            {currentUser ? (
                <AppShell.Section>
                    <UserBanner
                        profileIcon={<IconUserCircle size={iconSize} />}
                        name={currentUser.name}
                        email={currentUser.email}
                        onClick={userMenuHandlers.toggle}
                        isMenuOpen={userMenuOpened}
                    />
                    {userMenuOpened && (
                        <>
                            {!currentUser.validated && (
                                <NavbarItem
                                    text="Validar usuario"
                                    link="/users/validation"
                                    icon={
                                        <IconMailCheck
                                            style={{
                                                width: rem(14),
                                                height: rem(14),
                                            }}
                                        />
                                    }
                                    small
                                    background="var(--mantine-color-gray-lightest)"
                                />
                            )}
                            <NavbarItem
                                text="Editar perfil"
                                link="/account/profile"
                                icon={
                                    <IconEdit
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                small
                                background="var(--mantine-color-gray-lightest)"
                            />
                            <NavbarItem
                                text="Cerrar sesión"
                                icon={
                                    <IconDoorExit
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                small
                                background="var(--mantine-color-gray-lightest)"
                                onClick={() => logout(router, setCurrentUser)}
                                link="#"
                            />
                        </>
                    )}
                </AppShell.Section>
            ) : (
                <AppShell.Section>
                    <NavbarItem
                        text="Iniciar sesión"
                        link="/users/loginRegister"
                        icon={<IconUserCircle size={iconSize} />}
                    />
                </AppShell.Section>
            )}
            <Divider />
            <AppShell.Section>
                {currentUser && (
                    <NavbarItem
                        text="Emprendimientos"
                        link={`/businesses`}
                        icon={<IconBuildingStore size={iconSize} />}
                    />
                )}
                {currentUser && (
                    <NavbarItem
                        text="Productos"
                        link={`/products`}
                        icon={<IconRocket size={iconSize} />}
                    />
                )}
                {currentUser && (
                    <NavbarItem
                        text="Proveedores"
                        link="/suppliers"
                        icon={<IconUserCog size={iconSize} />}
                    />
                )}
                {currentUser && (
                    <NavbarItem
                        text="Clientes"
                        link="/clients"
                        icon={<IconUserDollar size={iconSize} />}
                    />
                )}
                {currentUser && (
                    <NavbarItem
                        text="Ventas"
                        link="/sales"
                        icon={<IconCashRegister size={iconSize} />}
                    />
                )}
                {currentUser && (
                    <NavbarItem
                        text="Estadísticas"
                        link="/stats"
                        icon={<IconChartBar size={iconSize} />}
                    />
                )}
            </AppShell.Section>
            <AppShell.Section grow>
                <NavbarItem
                    text="Sobre nosotros"
                    link="/about"
                    icon={<IconBulb size={iconSize} />}
                />
                <NavbarItem
                    text="Ayuda"
                    link="/help"
                    icon={<IconHelp size={iconSize} />}
                />
            </AppShell.Section>
            <Divider />
        </>
    )
}

export default Navbar
