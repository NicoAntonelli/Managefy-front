import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Group, Modal, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react'

import Clients from '@/services/clients'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

type ClientDeleteProps = {
    opened: boolean
    clientID: number
    businessID: number
    clientName: string
    onClose: () => void
}

const ClientDelete = (props: ClientDeleteProps) => {
    const { opened, clientID, businessID, clientName, onClose } = props

    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await Clients.deleteClient(clientID, businessID)
            notifications.show({
                title: 'Éxito',
                message: 'Cliente eliminado correctamente',
                color: Theme.other!.success,
            })
            router.push('/clients')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el cliente',
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
            title="Eliminar cliente"
            centered>
            <Text mb="sm">
                ¿Estás seguro de que deseas eliminar el cliente{' '}
                <Text component="span" fw={700}>
                    {clientName}
                </Text>
                ?
            </Text>
            <Paper bg={Theme.other!.neutral} p="sm" radius="md" mb="lg">
                <Group gap="xs" wrap="nowrap" align="center">
                    <IconAlertTriangle
                        size={20}
                        color={`var(--mantine-color-${Theme.other!.warning.replace('.', '-')})`}
                        style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <Text size="sm" c={Theme.other!.warning}>
                        Al eliminar este cliente, las ventas asociadas a él
                        perderán la referencia al mismo.
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

export default ClientDelete
