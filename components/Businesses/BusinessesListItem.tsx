import React from 'react'

import Link from 'next/link'
import Theme from '@/app/theme'
import { Button, Card, Group, Text, Title } from '@mantine/core'
import { IconCheck, IconEye, IconSettings } from '@tabler/icons-react'

import Business from '@/entities/businesses/Business'

import BusinessRoleBadge from '@/components/Businesses/BusinessRoleBadge'
import BusinessVisibilityBadge from '@/components/Businesses/BusinessVisibilityBadge'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusiness'

interface BusinessesListItemProps {
    business: Business
    showSelectedState?: boolean
}

const BusinessesListItem = (props: BusinessesListItemProps) => {
    const { business, showSelectedState = true } = props

    const selectedBusinessID = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const setSelectedBusiness = useSelectedBusinessStore(
        (state) => state.setSelectedBusiness
    )

    const isSelected = showSelectedState && selectedBusinessID === business.id

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
                        View details
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
                        onClick={() => setSelectedBusiness(business.id)}>
                        {isSelected ? 'Selected' : 'Manage business'}
                    </Button>
                )}
            </Group>
        </Card>
    )
}

export default BusinessesListItem
