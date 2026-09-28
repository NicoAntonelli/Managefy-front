import { useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import ClientsDropdown from '@/components/Clients/ClientsDropdown'

import Client from '@/entities/clients/Client'
import Sale from '@/entities/sales/Sale'

interface SaleUpdateOrAddClientProps {
    opened: boolean
    saleID: number
    businessID: number
    currentClient?: Client | null
    onSuccess: (sale: Sale) => void
    onClose: () => void
}

const SaleUpdateOrAddClient = (props: SaleUpdateOrAddClientProps) => {
    const { opened, saleID, businessID, currentClient } = props
    const { onSuccess, onClose } = props

    const [selectedClient, setSelectedClient] = useState<Client | null>(
        currentClient ?? null
    )
    const [updatingClient, setUpdatingClient] = useState(false)

    const isUpdate = !!currentClient

    useEffect(() => {
        if (opened) {
            setSelectedClient(currentClient ?? null)
        }
    }, [opened, currentClient])

    const handleUpdateOrAddClient = async () => {
        if (!selectedClient) return

        setUpdatingClient(true)
        try {
            await Sales.updateOrAddClientForSale(
                saleID,
                businessID,
                selectedClient.id
            )
            const updatedSale = await Sales.getOneSale(saleID, businessID)
            onSuccess(updatedSale)
            notifications.show({
                title: 'Éxito',
                message: isUpdate
                    ? 'Cliente actualizado correctamente'
                    : 'Cliente agregado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'No se pudo actualizar el cliente'
                    : 'No se pudo agregar el cliente',
                color: Theme.other!.danger,
            })
        } finally {
            setUpdatingClient(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isUpdate ? 'Actualizar cliente' : 'Agregar cliente'}
            centered>
            <ClientsDropdown
                key={`${isUpdate ? 'update' : 'add'}-${currentClient?.id ?? 'none'}`}
                businessID={businessID}
                initialClient={currentClient}
                forceRefresh={isUpdate}
                onChange={setSelectedClient}
            />
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdateOrAddClient()
                }}>
                <ButtonsSubmitAndCancel
                    operation={isUpdate ? 'Update' : 'Create'}
                    operationText="Guardar"
                    leftIcon={<IconCheck />}
                    submitting={updatingClient}
                    disabled={!selectedClient}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SaleUpdateOrAddClient
