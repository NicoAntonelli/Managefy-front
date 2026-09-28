import { useState } from 'react'
import { Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

import Sale from '@/entities/sales/Sale'

interface SaleEraseClientProps {
    opened: boolean
    saleID: number
    businessID: number
    clientName: string
    saleIdentifier?: string
    onSuccess: (sale: Sale) => void
    onClose: () => void
}

const SaleEraseClient = (props: SaleEraseClientProps) => {
    const { opened, saleID, businessID, clientName, saleIdentifier } = props
    const { onSuccess, onClose } = props

    const [erasingClient, setErasingClient] = useState(false)

    const handleEraseClient = async () => {
        setErasingClient(true)
        try {
            const updatedSale = await Sales.eraseClientForSale(
                saleID,
                businessID
            )
            onSuccess(updatedSale)
            notifications.show({
                title: 'Éxito',
                message: 'Cliente removido de la venta correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo remover el cliente de la venta',
                color: Theme.other!.danger,
            })
        } finally {
            setErasingClient(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Remover cliente"
            centered>
            <Text mb="lg">
                ¿Estás seguro de que deseas remover el cliente{' '}
                <Text component="span" fw={700}>
                    {clientName}
                </Text>
                {saleIdentifier && (
                    <>
                        {' '}
                        de la venta{' '}
                        <Text component="span" fw={700}>
                            {saleIdentifier}
                        </Text>
                    </>
                )}
                ?
            </Text>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleEraseClient()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Delete"
                    operationText="Remover"
                    leftIcon={<IconX />}
                    submitting={erasingClient}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SaleEraseClient
