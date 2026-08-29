import NotificationState from '@/entities/helpTypes/NotificationState'
import NotificationType from '@/entities/helpTypes/NotificationType'
import User from '@/entities/users/User'

interface Notification {
    id: number
    description: string
    type: NotificationType
    state: NotificationState
    date: Date
    user: User
}

export default Notification
