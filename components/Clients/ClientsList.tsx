import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Clients from '@/services/clients'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import ClientListItem from './ClientListItem'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import BusinessSelection from '@/components/Common/BusinessSelection'

import Client from '@/entities/clients/Client'

const ClientsList = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id
    const [clients, setClients] = useState<Client[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (businessID === undefined) {
            setClients(null)
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchClients = async () => {
            try {
                const response = await Clients.listClients(businessID)
                setClients(response)
            } catch (error) {
                setClients(null)
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [businessID])

    if (!selectedBusiness) {
        return <BusinessSelection resourceName="clients" />
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!clients?.length) {
        return (
            <Stack align="center" gap="md" py="xl">
                <Title size="2rem">No clients yet</Title>
                <Text ta="center" maw={480}>
                    This business does not have any clients yet.
                </Text>
            </Stack>
        )
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            {clients.map((client) => (
                <ClientListItem key={client.id} client={client} />
            ))}
        </Stack>
    )
}

export default ClientsList
