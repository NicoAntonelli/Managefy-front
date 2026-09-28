import { useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputTextArea from '@/components/Common/Inputs/InputTextArea'

import Sale from '@/entities/sales/Sale'

interface SaleUpdateObservationProps {
    opened: boolean
    saleID: number
    businessID: number
    currentObservation?: string | null
    onSuccess: (sale: Sale) => void
    onClose: () => void
}

const SaleUpdateObservation = (props: SaleUpdateObservationProps) => {
    const { opened, saleID, businessID, currentObservation } = props
    const { onSuccess, onClose } = props

    const [observation, setObservation] = useState(currentObservation ?? '')
    const [updatingObservation, setUpdatingObservation] = useState(false)

    useEffect(() => {
        if (opened) {
            setObservation(currentObservation ?? '')
        }
    }, [opened, currentObservation])

    const handleUpdateObservation = async () => {
        setUpdatingObservation(true)
        try {
            const updatedSale = await Sales.updateSaleObservation(
                saleID,
                businessID,
                observation
            )
            onSuccess(updatedSale)
            notifications.show({
                title: 'Éxito',
                message: 'Observación actualizada correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar la observación',
                color: Theme.other!.danger,
            })
        } finally {
            setUpdatingObservation(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Actualizar observación"
            centered>
            <InputTextArea
                label="Observación"
                placeholder="Ingresá la nueva observación"
                InputProps={{
                    value: observation,
                    onChange: (event) =>
                        setObservation(event.currentTarget.value),
                }}
            />
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdateObservation()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Update"
                    operationText="Guardar"
                    leftIcon={<IconCheck />}
                    submitting={updatingObservation}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SaleUpdateObservation
