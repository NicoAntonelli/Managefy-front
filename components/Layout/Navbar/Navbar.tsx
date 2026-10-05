import React, { useState } from 'react'
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

import Users from '@/services/users'
import Theme from '@/app/theme'
import useGetUserOrAuthenticate from '@/hooks/users/useGetUserOrAuthenticate'

import NavbarItem from './NavbarItem'
import UserBanner from './UserBanner'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'

// Icon properties
const iconSize = 40

const logout = async (
    router: AppRouterInstance,
    onLoggedOut: () => void
) => {
    try {
        await Users.sessionDelete()
        onLoggedOut()
        router.push('/users/loginRegister')
    } catch (error) {
        notifications.show({
            title: 'Error',
            message:
                'No se pudo cerrar la sesión. Inténtalo de nuevo más tarde.',
            color: Theme.other!.danger,
        })

        return null
    }
}

const Navbar = () => {
    const { user, loading } = useGetUserOrAuthenticate(false)

    // Overrides the session user right after logging out
    const [signedOut, setSignedOut] = useState(false)
    const currentUser = signedOut ? null : user

    const [userMenuOpened, userMenuHandlers] = useDisclosure(false)

    const router = useRouter()

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
                                    background="inherit"
                                />
                            )}
                            <NavbarItem
                                text="Editar perfil"
                                link="/users/profile"
                                icon={
                                    <IconEdit
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                small
                                background="inherit"
                            />
                            <NavbarItem
                                text="Cerrar sesión"
                                link="#"
                                icon={
                                    <IconDoorExit
                                        style={{
                                            width: rem(14),
                                            height: rem(14),
                                        }}
                                    />
                                }
                                small
                                background="inherit"
                                onClick={() => logout(router, () => setSignedOut(true))}
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
