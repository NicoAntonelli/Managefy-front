import React, { useEffect, useState } from 'react'
import { Stack } from '@mantine/core'

import Businesses from '@/services/businesses'

import useCheckUserLogin from '@/hooks/users/useCheckUserLogin'
import useSelectedBusinessStore from '@/hooks/stores/useSelectedBusinessStore'

import BusinessesListItem from '@/components/Businesses/BusinessesListItem'
import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import UserValidationContinue from '@/components/User/UserValidation/UserValidationContinue'

import Business from '@/entities/businesses/Business'
import BusinessMinInfo from '@/entities/businesses/BusinessMinInfo'

const BusinessesList = () => {
    const [businesses, setBusinesses] = useState<Business[] | null>(null)
    const [loading, setLoading] = useState(true)

    const checkUserLogin = useCheckUserLogin()

    const syncSelectedBusiness = useSelectedBusinessStore(
        (state) => state.syncSelectedBusiness
    )

    useEffect(() => {
        if (!checkUserLogin.isValidated) {
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchBusinesses = async () => {
            try {
                const response: Business[] | null =
                    await Businesses.listBusinesses()

                setBusinesses(response)

                // The selected business may no longer be valid (e.g. the user was removed from it)
                const businessesMinInfo: BusinessMinInfo[] = (
                    response ?? []
                ).map(({ id, name, isPublic, currentUserRole }) => ({
                    id,
                    name,
                    isPublic,
                    currentUserRole,
                }))

                syncSelectedBusiness(businessesMinInfo)
            } catch (error) {
                setBusinesses(null)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinesses()
    }, [checkUserLogin.isValidated, syncSelectedBusiness])

    if (loading || checkUserLogin.isValidated === null) {
        return <SkeletonFull />
    }

    if (!checkUserLogin.isValidated) {
        return <UserValidationContinue checkUserLogin={checkUserLogin} />
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
