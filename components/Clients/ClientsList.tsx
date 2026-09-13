import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Clients from '@/services/clients'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ClientListItem from '@/components/Clients/ClientListItem'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

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
        return <BusinessWelcome resourceName="clientes" />
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar business={selectedBusiness} hideFilter />
            </div>
            {!clients?.length ? (
                <Stack align="center" gap="md" py="xl">
                    <Title size="2rem">Aún no hay clientes</Title>
                    <Text ta="center" maw={480}>
                        Este emprendimiento aún no tiene clientes.
                    </Text>
                    <ButtonCreate href="/clients/new" resourceName="cliente" />
                </Stack>
            ) : (
                <Stack gap="lg">
                    <ButtonCreate href="/clients/new" resourceName="cliente" />
                    {clients.map((client) => (
                        <ClientListItem key={client.id} client={client} />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default ClientsList
