import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { Group, Modal, Text } from '@mantine/core'
import { IconBuildingStore, IconFilter } from '@tabler/icons-react'

import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'
import BusinessRoleBadge from '@/components/Businesses/BusinessRoleBadge'
import BusinessVisibilityBadge from '@/components/Businesses/BusinessVisibilityBadge'

interface SelectedBusinessBarProps {
    business: BusinessMinInfo
    hideFilter?: boolean
    filterContent?:
        | React.ReactNode
        | ((props: { onClose: () => void }) => React.ReactNode)
}

const SelectedBusinessBar = (props: SelectedBusinessBarProps) => {
    const { business, hideFilter = false, filterContent } = props

    const barRef = useRef<HTMLDivElement>(null)
    const businessRef = useRef<HTMLDivElement>(null)
    const badgesRef = useRef<HTMLDivElement>(null)
    const oneRowWidthRef = useRef(0)

    const [isWrapped, setIsWrapped] = useState(false)
    const [isFilterHovered, setIsFilterHovered] = useState(false)
    const [isBusinessHovered, setIsBusinessHovered] = useState(false)
    const [filterModalOpened, setFilterModalOpened] = useState(false)

    const handleFilter = () => {
        setFilterModalOpened(true)
    }

    useEffect(() => {
        const bar = barRef.current
        const business = businessRef.current
        const badges = badgesRef.current

        if (!bar || !business || !badges) return

        const updateWrappedState = () => {
            if (!isWrapped) {
                const columnGap = Number.parseFloat(
                    getComputedStyle(bar).columnGap
                )
                oneRowWidthRef.current =
                    business.getBoundingClientRect().width +
                    badges.getBoundingClientRect().width +
                    columnGap
            }

            setIsWrapped(
                bar.getBoundingClientRect().width < oneRowWidthRef.current
            )
        }

        const observer = new ResizeObserver(updateWrappedState)
        observer.observe(bar)
        observer.observe(business)
        observer.observe(badges)
        updateWrappedState()

        return () => observer.disconnect()
    }, [business.name, isWrapped])

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
            <Group
                ref={businessRef}
                gap={0}
                align="stretch"
                style={{
                    flex: isWrapped ? '1 1 auto' : '0 1 auto',
                    minWidth: 0,
                    width: isWrapped ? '100%' : undefined,
                }}>
                {!hideFilter && (
                    <button
                        type="button"
                        onClick={handleFilter}
                        onMouseEnter={() => setIsFilterHovered(true)}
                        onMouseLeave={() => setIsFilterHovered(false)}
                        aria-label="Filtrar por emprendimiento"
                        style={{
                            border: 0,
                            padding:
                                'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                            backgroundColor: isFilterHovered
                                ? 'var(--mantine-color-dark-7)'
                                : 'var(--mantine-color-dark-9)',
                            color: 'white',
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 1,
                            marginRight: 'calc(-1 * var(--mantine-spacing-sm))',
                            borderRadius:
                                '0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0',
                        }}>
                        <IconFilter size={20} />
                    </button>
                )}
                <Link
                    href={`/businesses/${business.id}`}
                    onMouseEnter={() => setIsBusinessHovered(true)}
                    onMouseLeave={() => setIsBusinessHovered(false)}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        textDecoration: 'none',
                    }}>
                    <Group
                        gap="sm"
                        align="center"
                        style={{
                            minWidth: 0,
                            flex: isWrapped ? 1 : undefined,
                            padding: hideFilter
                                ? 'var(--mantine-spacing-xs) var(--mantine-spacing-md)'
                                : 'var(--mantine-spacing-xs) var(--mantine-spacing-md) var(--mantine-spacing-xs) var(--mantine-spacing-lg)',
                            backgroundColor: isBusinessHovered
                                ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-4))'
                                : 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))',
                            borderRadius: isWrapped
                                ? 0
                                : '0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0',
                        }}>
                        <IconBuildingStore size={28} />
                        <Text fw={600} size="lg">
                            {business.name}
                        </Text>
                    </Group>
                </Link>
            </Group>
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
            <Modal
                opened={filterModalOpened}
                onClose={() => setFilterModalOpened(false)}
                title="Filtros"
                centered>
                {filterModalOpened &&
                    (typeof filterContent === 'function'
                        ? filterContent({
                              onClose: () => setFilterModalOpened(false),
                          })
                        : (filterContent ?? (
                              <Text>
                                  No hay filtros disponibles para esta pantalla
                              </Text>
                          )))}
            </Modal>
        </Group>
    )
}

export default SelectedBusinessBar
