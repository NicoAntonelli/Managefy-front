import React from 'react'
import Image from 'next/image'
import { ActionIcon, Burger, Group } from '@mantine/core'
import { IconSunMoon } from '@tabler/icons-react'

import { useRouter } from 'next/navigation'
import useSidebarStore from '@/utils/stores/useSidebarStore'

interface HeaderProps {
    showNavbar: boolean
    toggleColorScheme: () => void
}

const Header = (props: HeaderProps) => {
    const router = useRouter()
    const opened = useSidebarStore((state) => state.opened)
    const toggle = useSidebarStore((state) => state.toggle)

    return (
        <>
            <Group ml={15} h="100%" gap="xs">
                {props.showNavbar && (
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                )}
                <ActionIcon
                    variant="transparent"
                    color="blue.4"
                    onClick={() => router.push('/')}
                    aria-label="Managefy Icon">
                    <Image
                        src="/favicon.ico"
                        alt="Managefy favicon"
                        width={32}
                        height={32}
                    />
                </ActionIcon>
                <ActionIcon
                    variant="filled"
                    color="orange.4"
                    aria-label="Toggle dark/light theme"
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
