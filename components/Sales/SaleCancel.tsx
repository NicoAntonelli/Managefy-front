import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconBan } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

type SaleCancelProps = {
    opened: boolean
    saleID: number
    saleIdentifier: string
    businessID: number
    onClose: () => void
}

const SaleCancel = (props: SaleCancelProps) => {
    const { opened, saleID, saleIdentifier, businessID, onClose } = props

    const router = useRouter()
    const [cancelling, setCancelling] = useState(false)

    const handleCancel = async () => {
        setCancelling(true)
        try {
            await Sales.cancelSale(saleID, businessID)
            notifications.show({
                title: 'Éxito',
                message: 'Venta cancelada correctamente',
                color: Theme.other!.success,
            })
            router.push('/sales')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo cancelar la venta',
                color: Theme.other!.danger,
            })
        } finally {
            setCancelling(false)
            onClose()
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Cancelar venta"
            centered>
            <Text mb="lg">
                ¿Estás seguro de que deseas cancelar la venta{' '}
                <Text component="span" fw={700}>
                    {saleIdentifier}
                </Text>
                ?
            </Text>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleCancel()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Delete"
                    operationText="Cancelar venta"
                    leftIcon={<IconBan />}
                    submitting={cancelling}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SaleCancel
