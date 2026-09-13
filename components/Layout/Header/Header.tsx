import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ActionIcon, Burger, Group } from '@mantine/core'
import { IconSunMoon } from '@tabler/icons-react'

import useSidebarStore from '@/utils/stores/useSidebarStore'

import Theme from '@/app/theme'

interface HeaderProps {
    showNavbar: boolean
    toggleColorScheme: () => void
}

const Header = (props: HeaderProps) => {
    const router = useRouter()
    const opened = useSidebarStore((state) => state.opened)
    const toggle = useSidebarStore((state) => state.toggle)

    const [isBurgerHovered, setIsBurgerHovered] = useState(false)
    const [isIconHovered, setIsIconHovered] = useState(false)

    return (
        <>
            <Group ml={15} h="100%" gap="xs">
                {props.showNavbar && (
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
                    variant="transparent"
                    onClick={() => router.push('/')}
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
                    onClick={props.toggleColorScheme}>
                    <IconSunMoon
                        style={{ width: '70%', height: '70%' }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Group>
        </>
    )
}

export default Header
