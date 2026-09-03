import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { Button, Stack, Text, Title } from '@mantine/core'
import { IconHexagonPlus } from '@tabler/icons-react'

import Businesses from '@/services/businesses'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessesListItem from './BusinessesListItem'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import BusinessSelection from '@/components/Common/BusinessSelection'

import Business from '@/entities/businesses/Business'
import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'

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

                const currentSelectedBusiness =
                    useSelectedBusinessStore.getState().selectedBusiness

                if (!currentSelectedBusiness && response?.length) {
                    const businessesMinInfo: BusinessMinInfo[] = response.map(
                        ({ id, name, isPublic, currentUserRole }) => ({
                            id,
                            name,
                            isPublic,
                            currentUserRole,
                        })
                    )

                    initializeSelectedBusiness(businessesMinInfo)
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
            <BusinessSelection
                resourceName="businesses"
                isBusinessPage={true}
            />
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
