import React from 'react'

import Link from 'next/link'
import Theme from '@/app/theme'
import { Button, Card, Group, Text, Title } from '@mantine/core'
import { IconCheck, IconEye, IconSettings } from '@tabler/icons-react'

import Business from '@/entities/businesses/Business'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'
import BusinessRoleBadge from '@/components/Businesses/BusinessRoleBadge'
import BusinessVisibilityBadge from '@/components/Businesses/BusinessVisibilityBadge'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'

interface BusinessesListItemProps {
    business: Business
    showSelectedState?: boolean
}

const BusinessesListItem = (props: BusinessesListItemProps) => {
    const { business, showSelectedState = true } = props

    const selectedBusiness: BusinessMinInfo | null = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const setSelectedBusiness = useSelectedBusinessStore(
        (state) => state.setSelectedBusiness
    )

    const isSelected = showSelectedState && selectedBusiness?.id === business.id

    if (!business) return <SkeletonSmall />

    return (
        <Card
            shadow="sm"
            padding="xl"
            withBorder
            style={{
                width: '100%',
                minHeight: '30vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}>
            <div
                style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.5rem',
                    alignItems: 'center',
                }}>
                <BusinessVisibilityBadge isPublic={business.isPublic} />
                {business.currentUserRole && (
                    <BusinessRoleBadge role={business.currentUserRole} />
                )}
            </div>
            <Title
                size="2rem"
                style={{ paddingTop: '0.25rem', paddingRight: '7rem' }}>
                {business.name}
            </Title>
            <Text mt="1rem">{business.description}</Text>

            <Group justify="flex-start" mt="auto" gap="sm">
                <Link href={`/businesses/${business.id}`}>
                    <Button
                        color={Theme.primaryColor}
                        leftSection={<IconEye size={24} />}>
                        Ver detalles
                    </Button>
                </Link>

                {showSelectedState && (
                    <Button
                        color={isSelected ? 'teal' : 'gray'}
                        variant={isSelected ? 'filled' : 'light'}
                        leftSection={
                            isSelected ? (
                                <IconCheck size={18} />
                            ) : (
                                <IconSettings size={18} />
                            )
                        }
                        onClick={() =>
                            setSelectedBusiness({
                                id: business.id,
                                name: business.name,
                                isPublic: business.isPublic,
                                currentUserRole: business.currentUserRole,
                            })
                        }>
                        {isSelected ? 'Seleccionado' : 'Gestionar emprendimiento'}
                    </Button>
                )}
            </Group>
        </Card>
    )
}

export default BusinessesListItem
