import React, { useState } from 'react'
import {
    Button,
    Card,
    CloseButton,
    getThemeColor,
    Group,
    Stack,
    Text,
    useMantineTheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

import Notifications from '@/services/notifications'
import Theme from '@/app/theme'

import DateHelper from '@/utils/math/DateHelper'
import TextHelper from '@/utils/string/TextHelper'

import NotificationTypeBadge from '@/components/Notifications/NotificationTypeBadge'

import Notification from '@/entities/notifications/Notification'

interface NotificationsListItemProps {
    notification: Notification
    onUpdate: (notification: Notification) => void
    onClose: (id: number) => void
}

const NotificationsListItem = (props: NotificationsListItemProps) => {
    const { notification, onUpdate, onClose } = props

    const theme = useMantineTheme()

    const [submitting, setSubmitting] = useState(false)

    const isUnread = notification.state === 'Unread'

    // Vertical line with the notification type color
    const typeColor = getThemeColor(
        TextHelper.getNotificationTypeColor(notification.type),
        theme
    )

    const handleToggleRead = async () => {
        if (submitting) return

        setSubmitting(true)
        try {
            const updatedNotification =
                await Notifications.updateNotificationState(
                    notification.id,
                    isUnread ? 'Read' : 'Unread'
                )
            onUpdate(updatedNotification)
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar la notificación',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = async () => {
        if (submitting) return

        setSubmitting(true)
        try {
            await Notifications.closeNotification(notification.id)
            onClose(notification.id)
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo cerrar la notificación',
                color: Theme.other!.danger,
            })
            setSubmitting(false)
        }
    }

    return (
        <Card
            withBorder
            padding="sm"
            radius="sm"
            style={{
                borderLeft: `4px solid ${typeColor}`,
                // Subtle highlight for unread notifications
                backgroundColor: isUnread
                    ? 'var(--mantine-primary-color-light)'
                    : undefined,
            }}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                    <Group gap="xs">
                        <NotificationTypeBadge type={notification.type} />
                        <Text size="xs" c="dimmed">
                            {DateHelper.formatDateTime(notification.date)}
                        </Text>
                    </Group>
                    <Text
                        size="sm"
                        fw={isUnread ? 600 : 400}
                        style={{ overflowWrap: 'anywhere' }}>
                        {notification.description}
                    </Text>
                </Stack>
                <CloseButton
                    size="sm"
                    aria-label="Cerrar notificación"
                    disabled={submitting}
                    onClick={handleClose}
                />
            </Group>
            <Group justify="flex-end" mt={4}>
                <Button
                    variant="subtle"
                    size="compact-xs"
                    color={isUnread ? Theme.primaryColor : Theme.other!.neutral}
                    leftSection={
                        isUnread ? (
                            <IconEye size={14} />
                        ) : (
                            <IconEyeOff size={14} />
                        )
                    }
                    loading={submitting}
                    onClick={handleToggleRead}>
                    {isUnread ? 'Marcar como leída' : 'Marcar como no leída'}
                </Button>
            </Group>
        </Card>
    )
}

export default NotificationsListItem
