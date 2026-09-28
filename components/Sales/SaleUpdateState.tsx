import { useEffect, useState } from 'react'
import { Modal, Select } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'
import TextHelper from '@/utils/string/TextHelper'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

import Sale from '@/entities/sales/Sale'
import SaleState from '@/entities/helpTypes/SaleState'

interface SaleUpdateStateProps {
    opened: boolean
    saleID: number
    businessID: number
    currentState: SaleState
    onSuccess: (sale: Sale) => void
    onClose: () => void
}

const saleStateOptions = TextHelper.saleStatesComplete.map((state) => ({
    value: state,
    label: TextHelper.getSaleStateText(state),
}))

const SaleUpdateState = (props: SaleUpdateStateProps) => {
    const { opened, saleID, businessID, currentState } = props
    const { onSuccess, onClose } = props

    const [newState, setNewState] = useState<SaleState | null>(currentState)
    const [updatingState, setUpdatingState] = useState(false)

    useEffect(() => {
        if (opened) {
            setNewState(currentState)
        }
    }, [opened, currentState])

    const handleUpdateState = async () => {
        if (!newState) return

        setUpdatingState(true)
        try {
            const updatedSale = await Sales.updateSaleState(
                saleID,
                businessID,
                newState
            )
            onSuccess(updatedSale)
            notifications.show({
                title: 'Éxito',
                message: 'Estado actualizado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el estado',
                color: Theme.other!.danger,
            })
        } finally {
            setUpdatingState(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Actualizar estado"
            centered>
            <Select
                pt="1rem"
                label="Estado"
                placeholder="Seleccioná el nuevo estado"
                data={saleStateOptions}
                value={newState}
                onChange={(value) => setNewState(value as SaleState | null)}
                allowDeselect={false}
            />
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdateState()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Update"
                    operationText="Guardar"
                    leftIcon={<IconCheck />}
                    submitting={updatingState}
                    disabled={!newState}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SaleUpdateState
