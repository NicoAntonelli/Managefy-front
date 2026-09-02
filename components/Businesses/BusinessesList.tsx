import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { Button, Stack, Text, Title } from '@mantine/core'
import { IconHexagonPlus } from '@tabler/icons-react'

import Businesses from '@/services/businesses'

import BusinessesListItem from './BusinessesListItem'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import Business from '@/entities/businesses/Business'

const BusinessesList = () => {
    const [businesses, setBusinesses] = useState<Business[] | null>(null)
    const [loading, setLoading] = useState(true)

    const initializeSelectedBusiness = useSelectedBusinessStore(
        (state) => state.initializeSelectedBusiness
    )

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response: Business[] | null =
                    await Businesses.listBusinesses()

                setBusinesses(response)

                const currentSelectedBusinessId =
                    useSelectedBusinessStore.getState().selectedBusiness

                if (!currentSelectedBusinessId && response?.length) {
                    initializeSelectedBusiness(
                        response.map((business) => business.id)
                    )
                }
            } catch (error) {
                setBusinesses(null)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinesses()
    }, [initializeSelectedBusiness])

    if (loading) {
        return <SkeletonFull />
    }

    if (!businesses?.length) {
        return (
            <Stack align="center" gap="md" py="xl">
                <Title size="2rem">Your business hub is waiting</Title>
                <Text ta="center" maw={480}>
                    You do not have any businesses yet. Start by creating your
                    first one and bring your work into one place.
                </Text>
                <Button
                    color="orange.6"
                    w={{ base: '100%', sm: 'fit-content' }}
                    leftSection={<IconHexagonPlus size={24} />}>
                    <Link href="/businesses/new">
                        Create your first business
                    </Link>
                </Button>
            </Stack>
        )
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <Button
                color="orange.6"
                w={{ base: '100%', sm: 'fit-content' }}
                leftSection={<IconHexagonPlus size={24} />}>
                <Link href="/businesses/new">Create a new business</Link>
            </Button>
            <Stack gap="lg">
                {businesses.map((business: Business) => (
                    <BusinessesListItem
                        key={business.id}
                        business={business}
                        showSelectedState={businesses.length > 1}
                    />
                ))}
            </Stack>
        </Stack>
    )
}

export default BusinessesList
