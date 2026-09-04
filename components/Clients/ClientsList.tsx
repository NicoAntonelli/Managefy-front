import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Stack, Text, Title } from '@mantine/core'
import { Button } from '@mantine/core'
import { IconHexagonPlus } from '@tabler/icons-react'

import Clients from '@/services/clients'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import ClientListItem from './ClientListItem'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import BusinessSelection from '@/components/Common/BusinessSelection'
import SelectedBusinessBar from '@/components/Common/SelectedBusinessBar'

import Client from '@/entities/clients/Client'
import Theme from '@/app/theme'

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
        return <BusinessSelection resourceName="clientes" />
    }

    if (loading) {
        return <SkeletonFull />
    }

    const createClientButton = (
        <Button
            component={Link}
            href="/clients/new"
            color={Theme.other!.secondaryColor}
            w={{ base: '100%', sm: 'fit-content' }}
            leftSection={<IconHexagonPlus size={24} />}>
            Crear un nuevo cliente
        </Button>
    )

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar business={selectedBusiness} />
            </div>
            {!clients?.length ? (
                <Stack align="center" gap="md" py="xl">
                    <Title size="2rem">Aún no hay clientes</Title>
                    <Text ta="center" maw={480}>
                        Este emprendimiento aún no tiene clientes.
                    </Text>
                    {createClientButton}
                </Stack>
            ) : (
                <Stack gap="lg">
                    {createClientButton}
                    {clients.map((client) => (
                        <ClientListItem key={client.id} client={client} />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default ClientsList
