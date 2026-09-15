import React, { useEffect, useState } from 'react'
import { Stack } from '@mantine/core'

import Businesses from '@/services/businesses'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessesListItem from '@/components/Businesses/BusinessesListItem'
import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

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
        return <BusinessWelcome resourceName="emprendimiento" />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <ButtonCreate
                href="/businesses/new"
                resourceName="emprendimiento"
            />
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
