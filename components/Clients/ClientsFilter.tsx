import React, { useState } from 'react'
import { IconCheck } from '@tabler/icons-react'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import ClientsDropdown from '@/components/Clients/ClientsDropdown'

import Client from '@/entities/clients/Client'

interface ClientsFilterProps {
    businessID: number
    appliedClient: Client | null
    onApply: (client: Client | null) => void
    onClose: () => void
}

const ClientsFilter = (props: ClientsFilterProps) => {
    const { businessID, appliedClient, onApply, onClose } = props
    const [selectedClient, setSelectedClient] = useState<Client | null>(
        appliedClient
    )

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        onApply(selectedClient)
        onClose()
    }

    return (
        <form onSubmit={handleSubmit}>
            <ClientsDropdown
                businessID={businessID}
                initialClient={selectedClient}
                forceRefresh={!!selectedClient}
                onChange={setSelectedClient}
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

export default ClientsFilter
