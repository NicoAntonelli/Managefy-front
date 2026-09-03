import React from 'react'

import { Group, Text } from '@mantine/core'
import { IconMail, IconPhone } from '@tabler/icons-react'

import Client from '@/entities/clients/Client'

interface ClientContactProps {
    client: Client
}

const ClientContact = ({ client }: ClientContactProps) => (
    <Group gap="md" mt="sm">
        <Group gap="xs">
            <IconMail size={18} />
            <Text>{client.email}</Text>
        </Group>
        <Group gap="xs">
            <IconPhone size={18} />
            <Text>{client.phone}</Text>
        </Group>
    </Group>
)

export default ClientContact
