import React from 'react'
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
    IconRocket,
    IconUserCircle,
    IconUserCog,
    IconUserDollar,
} from '@tabler/icons-react'

import User from '@/entities/User'
import NavbarItem from './NavbarItem'
import UserBanner from './UserBanner'

// Icon properties
const iconSize = 40

// Dummy user
const getUser = () => {
    const user: User = {
        id: 1,
        email: 'jdoe@example.com',
        name: 'John Doe',
        validated: true,
        emailNotifications: true,
    }

    return user
}

// Dummy logout function
const logout = async (router: AppRouterInstance) => {
    try {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true)
            }, 1000)
        })
        router.push('/')
    } catch (error) {
        notifications.show({
            title: 'Error',
            message: 'No se pudo cerrar sesión. Intente mas tarde.',
            color: 'red',
        })
    }
}

const Navbar = () => {
    const currentUser: User = getUser()

    const [userMenuOpened, userMenuHandlers] = useDisclosure(false)

    const router = useRouter()

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
                                onClick={() => logout(router)}
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
