import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Group, Modal, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react'

import Suppliers from '@/services/suppliers'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

type SupplierDeleteProps = {
    opened: boolean
    supplierID: number
    businessID: number
    supplierName: string
    onClose: () => void
}

const SupplierDelete = (props: SupplierDeleteProps) => {
    const { opened, supplierID, businessID, supplierName, onClose } = props

    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await Suppliers.deleteSupplier(supplierID, businessID)
            notifications.show({
                title: 'Éxito',
                message: 'Proveedor eliminado correctamente',
                color: Theme.other!.success,
            })
            router.push('/suppliers')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el proveedor',
                color: Theme.other!.danger,
            })
        } finally {
            setDeleting(false)
            onClose()
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Eliminar proveedor"
            centered>
            <Text mb="sm">
                ¿Estás seguro de que deseas eliminar el proveedor{' '}
                <Text component="span" fw={700}>
                    {supplierName}
                </Text>
                ?
            </Text>
            <Paper bg="gray.8" p="sm" radius="md" mb="lg">
                <Group gap="xs" wrap="nowrap" align="flex-start">
                    <IconAlertTriangle
                        size={20}
                        color={`var(--mantine-color-${Theme.other!.warning.replace('.', '-')})`}
                        style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <Text size="sm" c={Theme.other!.warning}>
                        Al eliminar este proveedor, también se eliminarán los
                        productos asociados a él.
                    </Text>
                </Group>
            </Paper>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleDelete()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Delete"
                    operationText="Eliminar"
                    leftIcon={<IconTrash />}
                    submitting={deleting}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default SupplierDelete
