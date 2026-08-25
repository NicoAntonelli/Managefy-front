import React, { useEffect, useState } from 'react'

import { Stack, Text } from '@mantine/core'

import Businesses from '@/services/businesses'

import BusinessesListItem from './BusinessesListItem'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Business from '@/entities/businesses/Business'

const BusinessesList = () => {
    const [businesses, setBusinesses] = useState<Business[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response: Business[] | null =
                    await Businesses.listBusinesses()

                setBusinesses(response)
            } catch (error) {
                setBusinesses(null)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinesses()
    }, [])

    if (loading) {
        return <SkeletonFull />
    }

    // To-Do: Add a navigation button to the business creation page if the user doesn't have any businesses yet
    if (!businesses?.length) {
        return <Text>No businesses found.</Text>
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            {businesses.map((business) => (
                <BusinessesListItem key={business.id} business={business} />
            ))}
        </Stack>
    )
}

export default BusinessesList
