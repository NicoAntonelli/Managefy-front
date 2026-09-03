import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { Group, Text } from '@mantine/core'
import { IconBuildingStore } from '@tabler/icons-react'

import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'
import BusinessRoleBadge from '@/components/Businesses/BusinessRoleBadge'
import BusinessVisibilityBadge from '@/components/Businesses/BusinessVisibilityBadge'

interface SelectedBusinessBarProps {
    business: BusinessMinInfo
}

const SelectedBusinessBar = ({ business }: SelectedBusinessBarProps) => {
    const barRef = useRef<HTMLDivElement>(null)
    const badgesRef = useRef<HTMLDivElement>(null)
    const [isWrapped, setIsWrapped] = useState(false)

    useEffect(() => {
        const bar = barRef.current
        const badges = badgesRef.current

        if (!bar || !badges) return

        const updateWrappedState = () => {
            const barTop = bar.getBoundingClientRect().top
            const badgesTop = badges.getBoundingClientRect().top
            setIsWrapped(badgesTop > barTop)
        }

        const observer = new ResizeObserver(updateWrappedState)
        observer.observe(bar)
        observer.observe(badges)
        updateWrappedState()

        return () => observer.disconnect()
    }, [business.name])

    return (
        <Group
            ref={barRef}
            justify="space-between"
            align="stretch"
            gap="md"
            style={{
                width: '100%',
                rowGap: isWrapped ? 'var(--mantine-spacing-xs)' : 0,
                backgroundColor:
                    'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                borderRadius: 'var(--mantine-radius-sm)',
            }}>
            <Link
                href={`/businesses/${business.id}`}
                style={{
                    flex: isWrapped ? '1 1 auto' : '0 1 auto',
                    minWidth: 0,
                    textDecoration: 'none',
                }}>
                <Group
                    gap="sm"
                    align="center"
                    style={{
                        minWidth: 0,
                        padding:
                            'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                        backgroundColor:
                            'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))',
                        borderRadius: 'var(--mantine-radius-sm)',
                    }}>
                    <IconBuildingStore size={28} />
                    <Text fw={600} size="lg">
                        {business.name}
                    </Text>
                </Group>
            </Link>
            <Group
                ref={badgesRef}
                gap="sm"
                style={{
                    padding: isWrapped
                        ? '0 var(--mantine-spacing-md) var(--mantine-spacing-xs)'
                        : '0 var(--mantine-spacing-md)',
                }}>
                <BusinessVisibilityBadge isPublic={business.isPublic} />
                <BusinessRoleBadge role={business.currentUserRole} />
            </Group>
        </Group>
    )
}

export default SelectedBusinessBar
