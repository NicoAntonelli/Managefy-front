import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, Card, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { IconMail, IconPencil, IconPhone, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Clients from '@/services/clients'
import Sales from '@/services/sales'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ClientCreateUpdate from '@/components/Clients/ClientCreateUpdate'
import ClientDelete from '@/components/Clients/ClientDelete'
import SalesCompactTable from '@/components/Sales/SalesCompactTable'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Client from '@/entities/clients/Client'
import ClientCU from '@/entities/clients/ClientCU'
import Sale from '@/entities/sales/Sale'

const ClientDetail = () => {
    const params = useParams()
    const clientID = params?.id ? Number(params.id) : null

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id

    const [client, setClient] = useState<Client | null>(null)
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)

    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (!clientID || !businessID) {
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                const [clientData, salesData] = await Promise.all([
                    Clients.getOneClient(clientID, businessID),
                    Sales.listSalesByClient(businessID, clientID),
                ])
                setClient(clientData)
                setSales(salesData || [])
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'No se pudo cargar el cliente',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [clientID, businessID])

    const handleEdit = () => {
        if (!client) return
        setEditing(true)
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="cliente" />
    }

    if (client && editing) {
        const clientCU: ClientCU = {
            id: client.id,
            name: client.name,
            description: client.description,
            email: client.email,
            phone: client.phone,
            businessID: selectedBusiness.id,
            salesIDs: sales.map((s) => s.id),
        }

        return (
            <ClientCreateUpdate
                currentClient={clientCU}
                backHref={`/clients/${client.id}`}
                cancelHref={`/clients/${client.id}`}
                onCancel={() => setEditing(false)}
                onSuccess={(updatedClient) => {
                    setClient(updatedClient)
                    setEditing(false)
                    if (businessID && client.id) {
                        Sales.listSalesByClient(businessID, client.id)
                            .then((s) => setSales(s || []))
                            .catch(() => {})
                    }
                }}
            />
        )
    }

    if (!client) {
        return (
            <Stack gap="xs" style={{ width: '100%' }}>
                <SelectedBusinessBar business={selectedBusiness} hideFilter />
                <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                    <ButtonGoBack href="/clients" text="clientes" />
                </div>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="min-w-full">
                    <Text c="dimmed">Cliente no encontrado</Text>
                </Card>
            </Stack>
        )
    }

    return (
        <Stack gap="xs" style={{ width: '100%' }}>
            <SelectedBusinessBar business={selectedBusiness} hideFilter />

            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <ButtonGoBack href="/clients" text="clientes" />
            </div>

            <div style={{ marginBottom: 'var(--mantine-spacing-sm)' }}>
                <ButtonCreate href="/clients/new" resourceName="cliente" />
            </div>

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Stack gap="xs" mb="md">
                    <Title size="2rem">{client.name}</Title>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Descripción
                        </Text>
                        <Text c={client.description ? undefined : 'dimmed'}>
                            {client.description || 'Sin asignar'}
                        </Text>
                    </div>
                </Stack>

                <Grid mb="lg">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Email
                                </Text>
                                <Group gap="xs" align="center">
                                    <IconMail size={18} />
                                    <Text
                                        size="lg"
                                        c={client.email ? undefined : 'dimmed'}>
                                        {client.email || 'Sin asignar'}
                                    </Text>
                                </Group>
                            </div>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Teléfono
                                </Text>
                                <Group gap="xs" align="center">
                                    <IconPhone size={18} />
                                    <Text
                                        size="lg"
                                        c={client.phone ? undefined : 'dimmed'}>
                                        {client.phone || 'Sin asignar'}
                                    </Text>
                                </Group>
                            </div>
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Group justify="flex-start" gap="sm" mt="xl">
                    <Button
                        color={Theme.primaryColor}
                        leftSection={<IconPencil size={20} />}
                        onClick={handleEdit}>
                        Editar
                    </Button>

                    <Button
                        color={Theme.other!.danger}
                        leftSection={<IconTrash size={20} />}
                        onClick={() => setDeleteModalOpened(true)}>
                        Eliminar
                    </Button>
                </Group>
            </Card>

            <SalesCompactTable sales={sales} resourceName="cliente" />

            <ClientDelete
                opened={deleteModalOpened}
                clientID={client.id}
                businessID={selectedBusiness.id}
                clientName={client.name}
                onClose={() => setDeleteModalOpened(false)}
            />
        </Stack>
    )
}

export default ClientDetail
