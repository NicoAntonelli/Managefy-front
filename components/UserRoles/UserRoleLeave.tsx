import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Group, Modal, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconDoorExit } from '@tabler/icons-react'

import Theme from '@/app/theme'
import UserRoles from '@/services/userRoles'

import useSelectedBusinessStore from '@/hooks/stores/useSelectedBusinessStore'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

interface UserRoleLeaveProps {
    opened: boolean
    businessID: number
    onClose: () => void
}

const UserRoleLeave = (props: UserRoleLeaveProps) => {
    const { opened, businessID, onClose } = props

    const router = useRouter()
    const [leaving, setLeaving] = useState(false)
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const setSelectedBusiness = useSelectedBusinessStore(
        (state) => state.setSelectedBusiness
    )

    const handleLeave = async () => {
        setLeaving(true)
        try {
            await UserRoles.leaveUserRole(businessID)
            if (selectedBusiness?.id === businessID) {
                setSelectedBusiness(null)
            }
            notifications.show({
                title: 'Éxito',
                message: 'Abandonaste el emprendimiento',
                color: Theme.other!.success,
            })
            router.push('/businesses')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo abandonar el emprendimiento',
                color: Theme.other!.danger,
            })
        } finally {
            setLeaving(false)
            onClose()
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Abandonar emprendimiento"
            centered>
            <Text mb="sm">
                ¿Estás seguro de que deseas abandonar este emprendimiento?
            </Text>
            <Paper bg={Theme.other!.neutral} p="sm" radius="md" mb="lg">
                <Group gap="xs" wrap="nowrap" align="center">
                    <IconAlertTriangle
                        size={20}
                        color={`var(--mantine-color-${Theme.other!.warning.replace('.', '-')})`}
                        style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <Text size="sm" c={Theme.other!.warning}>
                        Al abandonar el emprendimiento, perderás todo el acceso
                        al mismo.
                    </Text>
                </Group>
            </Paper>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleLeave()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Delete"
                    operationText="Abandonar"
                    leftIcon={<IconDoorExit />}
                    submitting={leaving}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default UserRoleLeave
