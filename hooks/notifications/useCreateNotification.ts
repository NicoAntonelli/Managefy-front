import { useCallback } from 'react'

import Helper from '@/services/helper'
import Notifications from '@/services/notifications'

import useNotificationsReloadStore from '@/hooks/stores/useNotificationsReloadStore'

import NotificationC from '@/entities/notifications/NotificationC'

// Create a notification for the logged user and refresh the notifications list
// Errors are only logged, so the action that triggered it isn't interrupted
const useCreateNotification = () => {
    const requestReload = useNotificationsReloadStore(
        (state) => state.requestReload
    )

    return useCallback(
        async (notification: NotificationC) => {
            try {
                await Notifications.createNotification(notification)
                requestReload()
            } catch (error) {
                Helper.parseLogError(error)
            }
        },
        [requestReload]
    )
}

export default useCreateNotification
