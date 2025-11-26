import React, { useCallback } from 'react'
import { Box, Flex, Text, useMantineColorScheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import CustomLink from '@/components/Common/CustomLink/CustomLink'
import Theme from '@/app/theme'
import useSidebarStore from '@/utils/stores/useSidebarStore'

interface NavbarItemProps {
    text: string
    textSecondLine?: string
    link?: string
    icon?: JSX.Element
    small?: boolean
    textColor?: string
    background?: string
    onClick?: () => void
}

const NavbarItem = ({
    text,
    textSecondLine,
    link,
    icon,
    small = false,
    textColor,
    background = 'var(--mantine-color-gray-light)',
    onClick,
}: NavbarItemProps) => {
    const { colorScheme } = useMantineColorScheme()

    // If no textColor provided, set default based on color scheme
    if (!textColor) {
        textColor =
            colorScheme === 'light'
                ? 'var(--mantine-color-black)'
                : 'var(--mantine-color-white)'
    }

    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
    const toggle = useSidebarStore((state) => state.toggle)

    const handleClick = () => {
        if (isMobile) toggle()
        if (onClick) onClick()
    }

    const truncateTextStyle = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
    }

    const itemContent = useCallback(
        () => (
            <Flex
                h={small ? 45 : 60}
                bg={background}
                c={textColor}
                pl={20}
                onClick={handleClick}
                align="center"
                gap={20}
                role="button"
                tabIndex={0}>
                <Box style={{ flexShrink: 0 }}>{icon && icon}</Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text style={truncateTextStyle}>{text}</Text>
                    {textSecondLine && (
                        <Text size="sm" style={truncateTextStyle}>
                            {textSecondLine}
                        </Text>
                    )}
                </Box>
            </Flex>
        ),
        [text, textSecondLine, icon, small, isMobile]
    )

    return link ? (
        <CustomLink link={link} content={itemContent()} />
    ) : (
        itemContent()
    )
}

export default NavbarItem
