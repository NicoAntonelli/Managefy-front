import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ActionIcon, Burger, Group, Indicator } from '@mantine/core'
import { IconBell, IconSunMoon } from '@tabler/icons-react'

import useSidebarStore from '@/hooks/stores/useSidebarStore'
import useNotificationsReloadStore from '@/hooks/stores/useNotificationsReloadStore'
import useGetNotifications from '@/hooks/notifications/useGetNotifications'

import Theme from '@/app/theme'

import NotificationsList from '@/components/Notifications/NotificationsList'

import User from '@/entities/users/User'

interface HeaderProps {
    currentUser: User | null
    showNavbar: boolean
    toggleColorScheme: () => void
}

const Header = (props: HeaderProps) => {
    const opened = useSidebarStore((state) => state.opened)
    const toggle = useSidebarStore((state) => state.toggle)

    const [isBurgerHovered, setIsBurgerHovered] = useState(false)
    const [isIconHovered, setIsIconHovered] = useState(false)

    const { currentUser, showNavbar, toggleColorScheme } = props

    // Notifications are only available for logged and validated users
    const notificationsEnabled = !!currentUser?.validated

    const {
        notificationsList,
        unreadCount,
        updateNotification,
        removeNotification,
    } = useGetNotifications(notificationsEnabled)

    const requestNotificationsReload = useNotificationsReloadStore(
        (state) => state.requestReload
    )
    const [notificationsOpened, setNotificationsOpened] = useState(false)

    const openNotifications = () => {
        requestNotificationsReload()
        setNotificationsOpened(true)
    }

    return (
        <Group justify="space-between" h="100%" wrap="nowrap">
            <Group ml={15} h="100%" gap="xs">
                {showNavbar && (
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                        onMouseEnter={() => setIsBurgerHovered(true)}
                        onMouseLeave={() => setIsBurgerHovered(false)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: 'var(--mantine-radius-sm)',
                            backgroundColor: isBurgerHovered
                                ? 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))'
                                : 'transparent',
                            transition: 'background-color 0.15s ease',
                        }}
                    />
                )}
                <ActionIcon
                    component={Link}
                    href="/"
                    variant="transparent"
                    aria-label="Managefy Icon"
                    onMouseEnter={() => setIsIconHovered(true)}
                    onMouseLeave={() => setIsIconHovered(false)}
                    style={{
                        cursor: 'pointer',
                        transform: isIconHovered ? 'scale(1.1)' : 'scale(1)',
                        opacity: isIconHovered ? 0.85 : 1,
                        transition: 'transform 0.15s ease, opacity 0.15s ease',
                    }}>
                    <Image
                        src="/favicon.ico"
                        alt="Managefy favicon"
                        width={32}
                        height={32}
                    />
                </ActionIcon>
                <ActionIcon
                    variant="filled"
                    color={Theme.other!.secondaryColor}
                    aria-label="Cambiar entre tema claro y oscuro"
                    onClick={toggleColorScheme}>
                    <IconSunMoon
                        style={{ width: '70%', height: '70%' }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Group>

            {notificationsEnabled && (
                <Group mr={15} h="100%">
                    <Indicator
                        label={unreadCount > 99 ? '99+' : unreadCount}
                        size={18}
                        color={Theme.other!.danger}
                        disabled={unreadCount === 0}>
                        <ActionIcon
                            variant="light"
                            size="lg"
                            aria-label="Notificaciones"
                            onClick={openNotifications}>
                            <IconBell
                                style={{ width: '70%', height: '70%' }}
                                stroke={1.5}
                            />
                        </ActionIcon>
                    </Indicator>

                    <NotificationsList
                        opened={notificationsOpened}
                        notificationsList={notificationsList}
                        onUpdate={updateNotification}
                        onCloseNotification={removeNotification}
                        onClose={() => setNotificationsOpened(false)}
                    />
                </Group>
            )}
        </Group>
    )
}

export default Header
