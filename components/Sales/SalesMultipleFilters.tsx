import React, { useState } from 'react'
import { Checkbox, Stack, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

import Client from '@/entities/clients/Client'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import ClientsDropdown from '@/components/Clients/ClientsDropdown'
import SalesRangeSelector from '@/components/Sales/SalesRangeSelector'

interface SalesMultipleFiltersProps {
    businessID: number
    appliedClient: Client | null
    appliedRange: SalesDateRange | null
    onApply: (client: Client | null, range: SalesDateRange | null) => void
    onClose: () => void
}

const SalesMultipleFilters = (props: SalesMultipleFiltersProps) => {
    const { businessID, appliedClient, appliedRange, onApply, onClose } = props
    const [selectedClient, setSelectedClient] = useState<Client | null>(
        appliedClient
    )
    const [clientSelected, setClientSelected] = useState(!!appliedClient)
    const [selectedRange, setSelectedRange] = useState<SalesDateRange | null>(
        appliedRange
    )
    const [pendingSalesSelected, setPendingSalesSelected] = useState(
        !appliedClient && !appliedRange
    )

    const handlePendingSalesChange = (checked: boolean) => {
        if (!checked) return

        setPendingSalesSelected(true)
        setSelectedClient(null)
        setClientSelected(false)
        setSelectedRange(null)
    }

    const handleClientEnabledChange = (enabled: boolean) => {
        if (enabled) {
            setPendingSalesSelected(false)
            setSelectedRange(null)
        } else {
            setPendingSalesSelected(true)
        }
        setClientSelected(enabled)
    }

    const handleClientChange = (client: Client | null) => {
        setSelectedClient(client)
        if (client) {
            setPendingSalesSelected(false)
            setClientSelected(true)
            setSelectedRange(null)
        }
    }

    const handleRangeChange = (range: SalesDateRange | null) => {
        setSelectedRange(range)
        if (range) {
            setPendingSalesSelected(false)
            setSelectedClient(null)
            setClientSelected(false)
        } else {
            setPendingSalesSelected(true)
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        onApply(selectedClient, selectedRange)
        onClose()
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="xs" mt="md">
                <Text size="sm" fw={500}>
                    Ventas pendientes
                </Text>
                <Checkbox
                    checked={pendingSalesSelected}
                    label="Traer todas las ventas con pago pendiente"
                    onChange={(event) =>
                        handlePendingSalesChange(event.currentTarget.checked)
                    }
                />
            </Stack>
            <SalesRangeSelector
                value={selectedRange}
                onChange={handleRangeChange}
            />
            <ClientsDropdown
                businessID={businessID}
                initialClient={selectedClient}
                forceRefresh={!!selectedClient}
                enabled={clientSelected}
                onEnabledChange={handleClientEnabledChange}
                onChange={handleClientChange}
            />
            <ButtonsSubmitAndCancel
                operation="Create"
                operationText="Aceptar"
                leftIcon={<IconCheck />}
                submitting={false}
                onCancel={onClose}
            />
        </form>
    )
}

export default SalesMultipleFilters
