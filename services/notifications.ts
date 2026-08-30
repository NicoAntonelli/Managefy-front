import api from './api'
import Env from '@/utils/Env'
import Helper from './helper'

import Notification from '@/entities/notifications/Notification'
import NotificationC from '@/entities/notifications/NotificationC'
import NotificationState from '@/entities/helpTypes/NotificationState'

const prefix = `${Env.backendAPI}/notifications`

const listNotifications = async (): Promise<Notification[]> => {
    const endpoint = prefix
    try {
        const response = await api.get<Notification[]>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const getOneNotification = async (id: number): Promise<Notification> => {
    const endpoint = `${prefix}/${id}`
    try {
        const response = await api.get<Notification>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const createNotification = async (
    notificationCreate: NotificationC
): Promise<Notification> => {
    const endpoint = prefix
    try {
        const response = await api.post<Notification>(
            endpoint,
            notificationCreate
        )
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const updateNotificationState = async (
    id: number,
    state: NotificationState
): Promise<Notification> => {
    const endpoint = `${prefix}/${id}/state/${state}`
    try {
        const response = await api.put<Notification>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const closeNotification = async (id: number): Promise<number> => {
    const endpoint = `${prefix}/${id}`
    try {
        const response = await api.put<number>(endpoint)
        Helper.validateResponseAPI(response)

        return response.data
    } catch (error: any) {
        throw new Error(Helper.parseLogErrorAPI(error, endpoint))
    }
}

const Notifications = {
    listNotifications,
    getOneNotification,
    createNotification,
    updateNotificationState,
    closeNotification,
}

export default Notifications
