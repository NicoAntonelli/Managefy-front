import React from 'react'

import Link from 'next/link'
import Theme from '@/app/theme'
import { Button, Card, Text, Title } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'

import Business from '@/entities/businesses/Business'

import BusinessesRoleBadge from '@/components/Businesses/BusinesRoleBadge'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'

interface BusinessesListItemProps {
    business: Business
}

const BusinessesListItem = (props: BusinessesListItemProps) => {
    const { business } = props

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
            {business.currentUserRole && (
                <BusinessesRoleBadge role={business.currentUserRole} />
            )}
            <Title
                size="2rem"
                style={{ paddingTop: '0.25rem', paddingRight: '7rem' }}>
                {business.name}
            </Title>
            <Text mt="1rem">{business.description}</Text>

            <Link
                href={`/businesses/${business.id}`}
                style={{ marginTop: 'auto' }}>
                <Button
                    color={Theme.primaryColor}
                    leftSection={<IconSettings size={24} />}>
                    Manage business
                </Button>
            </Link>
        </Card>
    )
}

export default BusinessesListItem
