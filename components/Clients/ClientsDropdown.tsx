import { useEffect, useState } from 'react'
import {
    ActionIcon,
    Checkbox,
    Group,
    Stack,
    Text,
    Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconRefresh, IconUserDollar } from '@tabler/icons-react'

import Clients from '@/services/clients'
import Helper from '@/services/helper'
import Validation from '@/utils/validation/Validation'
import Theme from '@/app/theme'

import ClientsDropdownItem from '@/components/Clients/ClientsDropdownItem'
import CustomDropdown from '@/components/Common/CustomDropdown/CustomDropdown'

import Client from '@/entities/clients/Client'

interface ClientsDropdownProps {
    businessID: number
    initialClient?: Client | null
    forceRefresh?: boolean
    withinPortal?: boolean
    isOptional?: boolean
    enabled?: boolean
    onEnabledChange?: (enabled: boolean) => void
    onChange: (client: Client | null) => void
}

const ClientsDropdown = (props: ClientsDropdownProps) => {
    const { businessID, initialClient, forceRefresh = false } = props
    const { withinPortal = true, isOptional = false } = props
    const { enabled: controlledEnabled, onEnabledChange, onChange } = props

    const [enabled, setEnabled] = useState(!!initialClient)
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<Client[] | null>(null)
    const [selectedID, setSelectedID] = useState<string | null>(
        initialClient ? String(initialClient.id) : null
    )
    const [cachedAt, setCachedAt] = useState<number | null>(null)
    const [cachedBusinessID, setCachedBusinessID] = useState<number | null>(
        null
    )
    const isEnabled = controlledEnabled ?? enabled

    const selectClient = (client: Client | null) => {
        setSelectedID(client ? String(client.id) : null)
        onChange(client)
    }

    const fetchClients = async () => {
        setLoading(true)

        try {
            const response = await Clients.listClients(businessID)
            setClients(response ?? [])
            setCachedAt(Date.now())
            setCachedBusinessID(businessID)

            return response
        } catch (error) {
            setClients([])
            const message = Helper.parseError(error)
            notifications.show({
                title: 'Error',
                message:
                    message ||
                    'Error al obtener los clientes. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (forceRefresh) {
            fetchClients()
        }
    }, [forceRefresh])

    useEffect(() => {
        setEnabled(!!initialClient)
        setSelectedID(initialClient ? String(initialClient.id) : null)
    }, [initialClient])

    const handleToggle = async (checked: boolean) => {
        setEnabled(checked)
        onEnabledChange?.(checked)
        if (!checked) {
            selectClient(null)
            return
        }

        const isCacheValid =
            clients !== null &&
            cachedBusinessID === businessID &&
            cachedAt !== null &&
            Validation.cache(cachedAt)

        if (isCacheValid) {
            selectClient(clients[0] ?? null)
            return
        }

        const response = await fetchClients()
        selectClient(response?.[0] ?? null)
    }

    const showRefresh = isEnabled && clients === null && !forceRefresh
    const availableClients = clients ?? (initialClient ? [initialClient] : [])
    const selectedClient = availableClients.find(
        (client) => String(client.id) === selectedID
    )

    const filterPredicate = (client: Client, query: string) => {
        const matchesName = client.name?.toLowerCase().includes(query)
        const matchesDescription = client.description
            ?.toLowerCase()
            .includes(query)
        const matchesEmail = client.email?.toLowerCase().includes(query)
        return Boolean(matchesName || matchesDescription || matchesEmail)
    }

    const placeholder = !isEnabled
        ? 'Ninguno'
        : clients === null || loading
          ? 'Cargando clientes...'
          : clients.length === 0
            ? 'No hay clientes para mostrar'
            : 'Seleccionar cliente...'

    return (
        <Stack gap="xs" mt="md">
            <Text size="sm" fw={500}>
                {`Cliente${isOptional ? ' (opcional)' : ''}`}
            </Text>
            <Group align="center" gap="sm">
                <Checkbox
                    checked={isEnabled}
                    onChange={(event) =>
                        handleToggle(event.currentTarget.checked)
                    }
                />
                <CustomDropdown<Client>
                    items={availableClients}
                    value={isEnabled ? (selectedClient ?? null) : null}
                    getItemKey={(client) => client.id}
                    getItemLabel={(client) => client.name}
                    filterPredicate={filterPredicate}
                    onSelect={selectClient}
                    loading={loading}
                    disabled={!isEnabled || loading || clients?.length === 0}
                    withinPortal={withinPortal}
                    placeholder={placeholder}
                    searchPlaceholder="Buscar por nombre, descripción o email..."
                    emptyText="No se encontraron clientes coincidentes"
                    leftIcon={<IconUserDollar size={18} />}
                    renderOption={(client) => (
                        <ClientsDropdownItem
                            client={client}
                            isSelected={client.id === selectedClient?.id}
                        />
                    )}
                />
                {showRefresh && (
                    <Tooltip label="Cargar todos los clientes">
                        <ActionIcon
                            variant="light"
                            size="lg"
                            loading={loading}
                            onClick={fetchClients}>
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </Group>
        </Stack>
    )
}

export default ClientsDropdown
