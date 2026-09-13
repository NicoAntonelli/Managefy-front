import React, { forwardRef, useState } from 'react'
import { UnstyledButton, Group, Avatar, Text, Flex } from '@mantine/core'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'

interface UserBannerProps extends React.ComponentPropsWithoutRef<'button'> {
    profileIcon: React.ReactNode
    name: string
    email: string
    isMenuOpen?: boolean
}

const UserBanner = forwardRef<HTMLButtonElement, UserBannerProps>(
    (
        { profileIcon, name, email, isMenuOpen, ...others }: UserBannerProps,
        ref
    ) => {
        const [isHovered, setIsHovered] = useState(false)

        return (
            <UnstyledButton
                ref={ref}
                {...others}
                onMouseEnter={(e) => {
                    setIsHovered(true)
                    others.onMouseEnter?.(e)
                }}
                onMouseLeave={(e) => {
                    setIsHovered(false)
                    others.onMouseLeave?.(e)
                }}
                style={{
                    padding: 'var(--mantine-spacing-md)',
                    color: 'var(--mantine-color-text)',
                    borderRadius: 'var(--mantine-radius-sm)',
                    width: '100%',
                    backgroundColor: isHovered
                        ? 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))'
                        : 'transparent',
                    transition: 'background-color 0.15s ease',
                    ...(typeof others.style === 'object' ? others.style : {}),
                }}>
                <Flex align="center" justify="space-between">
                    <Group>
                        <Avatar radius="xl">{profileIcon}</Avatar>
                        <div style={{ maxWidth: 'calc(100% - 60px)' }}>
                            <Text size="sm" fw={500} truncate>
                                {name}
                            </Text>
                            <Text c="dimmed" size="xs" truncate>
                                {email}
                            </Text>
                        </div>
                    </Group>
                    {isMenuOpen ? (
                        <IconChevronDown
                            size="1rem"
                            style={{ flexShrink: 0 }}
                        />
                    ) : (
                        <IconChevronRight
                            size="1rem"
                            style={{ flexShrink: 0 }}
                        />
                    )}
                </Flex>
            </UnstyledButton>
        )
    }
)

export default UserBanner
