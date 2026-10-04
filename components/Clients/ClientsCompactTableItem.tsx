import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Card, Group, Stack, Table, Text, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Theme from '@/app/theme'

import Client from '@/entities/clients/Client'

interface ClientsCompactTableItemProps {
    client: Client
    isSmallScreen?: boolean
    hideActions?: boolean
}

const ClientsCompactTableItem = (props: ClientsCompactTableItemProps) => {
    const { client, isSmallScreen, hideActions } = props

    const router = useRouter()

    const openClient = () => router.push(`/clients/${client.id}`)

    const actions = (
        <Group gap={4} wrap="nowrap" onClick={(event) => event.stopPropagation()}>
            <Tooltip label="Ver cliente">
                <ActionIcon
                    component={Link}
                    href={`/clients/${client.id}`}
                    variant="outline"
                    color={Theme.other!.secondaryColor}
                    size="sm"
                    aria-label="Ver cliente">
                    <IconEye size={16} />
                </ActionIcon>
            </Tooltip>
        </Group>
    )

    if (isSmallScreen) {
        return (
            <Card
                withBorder
                padding="sm"
                radius="sm"
                style={{ cursor: 'pointer' }}
                onClick={openClient}>
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="sm">
                    <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                        <Text fw={500} style={{ overflowWrap: 'anywhere' }}>
                            {client.name}
                        </Text>
                        <Text
                            size="sm"
                            c={client.description ? undefined : 'dimmed'}
                            style={{ overflowWrap: 'anywhere' }}>
                            {client.description || 'Sin descripción'}
                        </Text>
                        <Text size="sm" c={client.email ? undefined : 'dimmed'}>
                            {client.email || 'Sin email'}
                        </Text>
                        <Text size="sm" c={client.phone ? undefined : 'dimmed'}>
                            {client.phone || 'Sin teléfono'}
                        </Text>
                    </Stack>
                    {!hideActions && actions}
                </Group>
            </Card>
        )
    }

    return (
        <Table.Tr style={{ cursor: 'pointer' }} onClick={openClient}>
            <Table.Td fw={500} style={{ overflowWrap: 'anywhere' }}>
                {client.name}
            </Table.Td>
            <Table.Td
                c={client.description ? undefined : 'dimmed'}
                style={{ overflowWrap: 'anywhere' }}>
                {client.description || 'Sin descripción'}
            </Table.Td>
            <Table.Td c={client.email ? undefined : 'dimmed'}>
                {client.email || 'Sin email'}
            </Table.Td>
            <Table.Td c={client.phone ? undefined : 'dimmed'}>
                {client.phone || 'Sin teléfono'}
            </Table.Td>
            {!hideActions && (
                <Table.Td style={{ width: '80px' }}>
                    <Group justify="center">{actions}</Group>
                </Table.Td>
            )}
        </Table.Tr>
    )
}

export default ClientsCompactTableItem
