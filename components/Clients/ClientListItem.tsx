import React from 'react'

import Link from 'next/link'
import Theme from '@/app/theme'
import { Button, Card, Group, Text, Title } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Client from '@/entities/clients/Client'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'
import ClientContact from './ClientContact'

interface ClientListItemProps {
    client: Client
}

const ClientListItem = (props: ClientListItemProps) => {
    const { client } = props

    if (!client) return <SkeletonSmall />

    return (
        <Card
            shadow="sm"
            padding="lg"
            withBorder
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Title size="1.5rem">{client.name}</Title>
            <Text mt="xs">{client.description}</Text>

            <ClientContact client={client} />

            <Group justify="flex-start" mt="md" gap="sm">
                <Link href={`/clients/${client.id}`}>
                    <Button
                        color={Theme.primaryColor}
                        leftSection={<IconEye size={24} />}>
                        Ver detalles
                    </Button>
                </Link>
            </Group>
        </Card>
    )
}

export default ClientListItem
