import { Group, Text } from '@mantine/core'
import { IconCheck, IconUserDollar } from '@tabler/icons-react'

import Client from '@/entities/clients/Client'

interface ClientsDropdownItemProps {
    client: Client
    isSelected?: boolean
}

const ClientsDropdownItem = (props: ClientsDropdownItemProps) => {
    const { client, isSelected = false } = props

    return (
        <Group gap="xs">
            {isSelected ? (
                <IconCheck size={16} color="var(--mantine-color-teal-6)" />
            ) : (
                <span style={{ width: 16, display: 'inline-block' }} />
            )}
            <IconUserDollar size={16} />
            <div>
                <Text size="sm">{client.name}</Text>
                {client.description && (
                    <Text size="xs" c="dimmed" lineClamp={1}>
                        {client.description}
                    </Text>
                )}
            </div>
        </Group>
    )
}

export default ClientsDropdownItem
