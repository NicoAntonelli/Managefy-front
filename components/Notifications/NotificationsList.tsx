import React from 'react'
import { Modal, ScrollArea, Stack, Text } from '@mantine/core'

import NotificationsListItem from '@/components/Notifications/NotificationsListItem'

import Notification from '@/entities/notifications/Notification'

interface NotificationsListProps {
    opened: boolean
    notificationsList: Notification[]
    onUpdate: (notification: Notification) => void
    onCloseNotification: (id: number) => void
    onClose: () => void
}

const NotificationsList = (props: NotificationsListProps) => {
    const { opened, notificationsList } = props
    const { onUpdate, onCloseNotification, onClose } = props

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Notificaciones"
            size="lg"
            scrollAreaComponent={ScrollArea.Autosize}
            centered>
            {notificationsList.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">
                    No tenés notificaciones
                </Text>
            ) : (
                <Stack gap="sm">
                    {notificationsList.map((notification) => (
                        <NotificationsListItem
                            key={notification.id}
                            notification={notification}
                            onUpdate={onUpdate}
                            onClose={onCloseNotification}
                        />
                    ))}
                </Stack>
            )}
        </Modal>
    )
}

export default NotificationsList
