import { useState } from 'react'
import { Button, Group, Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheckbox, IconFileInvoice } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import Sale from '@/entities/sales/Sale'

interface SaleInvoiceCreateProps {
    opened: boolean
    saleID: number
    saleIdentifier: string
    businessID: number
    isBilled: boolean
    onSuccess: (sale: Sale) => void
    onClose: () => void
}

const SaleInvoiceCreate = (props: SaleInvoiceCreateProps) => {
    const { opened, saleID, saleIdentifier, businessID, isBilled } = props
    const { onSuccess, onClose } = props

    const [updating, setUpdating] = useState(false)

    const handleMarkBilled = async (closeOnSuccess = true) => {
        setUpdating(true)
        try {
            const updatedSale = await Sales.updateSaleState(
                saleID,
                businessID,
                'PaidAndBilled'
            )
            onSuccess(updatedSale)
            notifications.show({
                title: 'Éxito',
                message: 'La venta quedó marcada como pagada y facturada',
                color: Theme.other!.success,
            })
            if (closeOnSuccess) onClose()
            return true
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el estado de la venta',
                color: Theme.other!.danger,
            })
            return false
        } finally {
            setUpdating(false)
        }
    }

    const handleGenerateInvoice = async () => {
        const invoiceTab = window.open('', '_blank')
        if (!isBilled) {
            const billed = await handleMarkBilled(false)
            if (!billed) {
                invoiceTab?.close()
                return
            }
        }

        const invoiceUrl = `/sales/${saleID}/invoice?businessID=${businessID}`
        if (invoiceTab) {
            invoiceTab.location.href = invoiceUrl
        } else {
            window.open(invoiceUrl, '_blank', 'noopener,noreferrer')
        }
        onClose()
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Facturar venta"
            centered>
            <Text mb="sm">
                ¿Desea generar una factura para la venta {saleIdentifier}?
            </Text>
            <Group justify="flex-end" mt="2rem">
                {!isBilled && (
                    <Button
                        variant="default"
                        leftSection={<IconCheckbox size={18} />}
                        loading={updating}
                        onClick={() => handleMarkBilled()}>
                        Solo indicar estado facturado
                    </Button>
                )}
                <Button
                    color={Theme.primaryColor}
                    leftSection={<IconFileInvoice size={18} />}
                    loading={updating}
                    onClick={handleGenerateInvoice}>
                    Generar factura
                </Button>
            </Group>
        </Modal>
    )
}

export default SaleInvoiceCreate
