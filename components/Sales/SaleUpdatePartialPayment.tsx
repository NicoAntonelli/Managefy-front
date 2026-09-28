import { useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconCoins } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputNumeric from '@/components/Common/Inputs/InputNumeric'

import Sale from '@/entities/sales/Sale'

interface SaleUpdatePartialPaymentProps {
    opened: boolean
    saleID: number
    businessID: number
    currentPartialPayment: number
    onSuccess: (sale: Sale) => void
    onClose: () => void
}

const SaleUpdatePartialPayment = (props: SaleUpdatePartialPaymentProps) => {
    const { opened, saleID, businessID, currentPartialPayment } = props
    const { onSuccess, onClose } = props

    const [newPartialPayment, setNewPartialPayment] = useState<number | ''>(
        currentPartialPayment
    )
    const [updatingPartialPayment, setUpdatingPartialPayment] = useState(false)

    useEffect(() => {
        if (opened) {
            setNewPartialPayment(currentPartialPayment)
        }
    }, [opened, currentPartialPayment])

    const handleUpdatePartialPayment = async () => {
        if (newPartialPayment === '') return

        setUpdatingPartialPayment(true)
        try {
            const updatedSale = await Sales.updatePartialPayment(
                saleID,
                businessID,
                newPartialPayment
            )
            onSuccess(updatedSale)
            notifications.show({
                title: 'Éxito',
                message: 'Pago parcial actualizado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el pago parcial',
                color: Theme.other!.danger,
            })
        } finally {
            setUpdatingPartialPayment(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Actualizar pago parcial"
            centered>
            <InputNumeric
                name="partialPayment"
                label="Pago parcial"
                placeholder="10.50"
                leftIcon={<IconCoins size={16} />}
                InputProps={{
                    value: newPartialPayment,
                    mb: 'lg',
                    onChange: (value) =>
                        setNewPartialPayment(
                            value === '' || value === null ? '' : Number(value)
                        ),
                }}
            />
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdatePartialPayment()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Update"
                    operationText="Guardar"
                    leftIcon={<IconCheck />}
                    submitting={updatingPartialPayment}
                    disabled={newPartialPayment === ''}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SaleUpdatePartialPayment
