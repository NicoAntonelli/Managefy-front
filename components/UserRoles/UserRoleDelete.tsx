import { useState } from 'react'
import { Group, Modal, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react'

import Theme from '@/app/theme'
import UserRoles from '@/services/userRoles'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

interface UserRoleDeleteProps {
    opened: boolean
    userID: number
    businessID: number
    userName: string
    onSuccess: (userID: number) => void
    onClose: () => void
}

const UserRoleDelete = (props: UserRoleDeleteProps) => {
    const { opened, userID, businessID, userName, onSuccess, onClose } = props

    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await UserRoles.deleteUserRole(userID, businessID)
            notifications.show({
                title: 'Éxito',
                message: 'Colaborador eliminado correctamente',
                color: Theme.other!.success,
            })
            onSuccess(userID)
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el colaborador',
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
            title="Eliminar colaborador"
            centered>
            <Text mb="sm">
                ¿Estás seguro de que deseas eliminar al colaborador{' '}
                <Text component="span" fw={700}>
                    {userName}
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
                        Al remover a este colaborador del emprendimiento,
                        perderá acceso completo al mismo.
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

export default UserRoleDelete
