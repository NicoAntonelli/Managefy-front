import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Group, Modal, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react'

import Businesses from '@/services/businesses'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

interface BusinessDeleteProps {
    opened: boolean
    businessID: number
    businessName: string
    onClose: () => void
}

const BusinessDelete = (props: BusinessDeleteProps) => {
    const { opened, businessID, businessName, onClose } = props

    const router = useRouter()
    const [deleting, setDeleting] = useState(false)
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const setSelectedBusiness = useSelectedBusinessStore(
        (state) => state.setSelectedBusiness
    )

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await Businesses.deleteBusiness(businessID)
            if (selectedBusiness?.id === businessID) {
                setSelectedBusiness(null)
            }
            notifications.show({
                title: 'Éxito',
                message: 'Emprendimiento eliminado correctamente',
                color: Theme.other!.success,
            })
            router.push('/businesses')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el emprendimiento',
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
            title="Eliminar emprendimiento"
            centered>
            <Text mb="sm">
                ¿Estás seguro de que deseas eliminar el emprendimiento{' '}
                <Text component="span" fw={700}>
                    {businessName}
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
                        Esta acción no se puede deshacer, y se eliminarán los
                        productos, ventas y demás datos asociados al
                        emprendimiento.
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

export default BusinessDelete
