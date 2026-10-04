import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Stack, Table, Text, Title } from '@mantine/core'

import Theme from '@/app/theme'

import ClientsCompactTableItem from '@/components/Clients/ClientsCompactTableItem'

import Client from '@/entities/clients/Client'
import ResourceName from '@/entities/helpTypes/ResourceName'

interface ClientsCompactTableProps {
    clients: Client[]
    resourceName: ResourceName
    hideActions?: boolean
}

const ClientsCompactTable = (props: ClientsCompactTableProps) => {
    const { clients, resourceName, hideActions } = props

    const isSmallScreen = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full"
            mt="md">
            <Title size="1.5rem" mb="md">
                Clientes del {resourceName}
            </Title>
            {clients.length === 0 ? (
                <Text c="dimmed">
                    {`Este ${resourceName} no tiene clientes asociados`}
                </Text>
            ) : isSmallScreen ? (
                <Stack gap="sm">
                    {clients.map((client) => (
                        <ClientsCompactTableItem
                            key={client.id}
                            client={client}
                            isSmallScreen
                            hideActions={hideActions}
                        />
                    ))}
                </Stack>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Descripción</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Teléfono</Table.Th>
                            {!hideActions && (
                                <Table.Th style={{ textAlign: 'center' }}>
                                    Acciones
                                </Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {clients.map((client) => (
                            <ClientsCompactTableItem
                                key={client.id}
                                client={client}
                                hideActions={hideActions}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default ClientsCompactTable
