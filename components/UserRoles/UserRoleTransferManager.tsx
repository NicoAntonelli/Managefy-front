import { useState } from 'react'
import { Group, Modal, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconArrowsExchange } from '@tabler/icons-react'

import Theme from '@/app/theme'
import UserRoles from '@/services/userRoles'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

import UserRole from '@/entities/usersRoles/UserRole'

interface UserRoleTransferManagerProps {
    opened: boolean
    userID: number
    businessID: number
    userName: string
    onSuccess: (userRole: UserRole) => void
    onClose: () => void
}

const UserRoleTransferManager = (props: UserRoleTransferManagerProps) => {
    const { opened, userID, businessID, userName, onSuccess, onClose } = props

    const [transferring, setTransferring] = useState(false)

    const handleTransfer = async () => {
        setTransferring(true)
        try {
            const response = await UserRoles.transferManagerRole(
                userID,
                businessID
            )
            notifications.show({
                title: 'Éxito',
                message: 'Rol de manager transferido correctamente',
                color: Theme.other!.success,
            })
            onSuccess(response)
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo transferir el rol de manager',
                color: Theme.other!.danger,
            })
        } finally {
            setTransferring(false)
            onClose()
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Transferir rol de manager"
            centered>
            <Text mb="sm">
                ¿Estás seguro de que deseas transferir el rol de manager a{' '}
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
                        Dejarás de ser manager y pasarás a ser admin. El usuario
                        seleccionado pasará a ser el manager del emprendimiento.
                    </Text>
                </Group>
            </Paper>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleTransfer()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Update"
                    operationText="Transferir"
                    leftIcon={<IconArrowsExchange />}
                    submitting={transferring}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default UserRoleTransferManager
