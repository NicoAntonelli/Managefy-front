import { useEffect, useState } from 'react'

import Helper from '@/services/helper'
import Notifications from '@/services/notifications'

import Constant from '@/utils/validation/Constant'
import useNotificationsReloadStore from '@/hooks/stores/useNotificationsReloadStore'

import Notification from '@/entities/notifications/Notification'

// Get the logged user's non-closed notifications
// Refreshes periodically and whenever a reload is requested
const useGetNotifications = (enabled: boolean) => {
    const [notificationsList, setNotificationsList] = useState<Notification[]>(
        []
    )

    const reloadKey = useNotificationsReloadStore((state) => state.reloadKey)

    useEffect(() => {
        if (!enabled) {
            setNotificationsList([])
            return
        }

        let active = true

        const fetchNotifications = async () => {
            try {
                const response = await Notifications.listNotifications()
                if (active) setNotificationsList(response || [])
            } catch (error) {
                // Silent error, the next refresh will try again
                Helper.parseLogError(error)
            }
        }
        fetchNotifications()

        const interval = setInterval(
            fetchNotifications,
            Constant.POLLING_INTERVAL_MS
        )

        return () => {
            active = false
            clearInterval(interval)
        }
    }, [enabled, reloadKey])

    // Local updates after the user changes a notification
    const updateNotification = (notification: Notification) => {
        setNotificationsList((current) =>
            current.map((item) =>
                item.id === notification.id ? notification : item
            )
        )
    }

    const removeNotification = (id: number) => {
        setNotificationsList((current) =>
            current.filter((item) => item.id !== id)
        )
    }

    const unreadCount = notificationsList.filter(
        (item) => item.state === 'Unread'
    ).length

    return {
        notificationsList,
        unreadCount,
        updateNotification,
        removeNotification,
    }
}

export default useGetNotifications
