import React from 'react'

import { Button, Card, Text, Title } from '@mantine/core'

import Business from '@/entities/businesses/Business'
import Link from 'next/link'
import SkeletonSmall from '../Common/Loader/SkeletonSmall'

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
            }}>
            <Title size="2rem">{business.name}</Title>
            <Text mt="1rem">{business.description}</Text>

            <Link
                href={`/businesses/${business.id}`}
                style={{ marginTop: 'auto' }}>
                <Button color="orange.6">Manage business</Button>
            </Link>
        </Card>
    )
}

export default BusinessesListItem
