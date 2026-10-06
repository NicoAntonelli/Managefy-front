import React from 'react'
import { Badge } from '@mantine/core'

import NotificationType from '@/entities/helpTypes/NotificationType'
import TextHelper from '@/utils/string/TextHelper'

interface NotificationTypeBadgeProps {
    type?: NotificationType | null
}

const NotificationTypeBadge = (props: NotificationTypeBadgeProps) => {
    const { type } = props

    // Empty type, return a blank fragment
    if (!type) return <></>

    const notificationTypeColor = TextHelper.getNotificationTypeColor(type)
    const notificationTypeText = TextHelper.getNotificationTypeText(type)

    return (
        <Badge
            size="sm"
            variant="light"
            color={notificationTypeColor}
            style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            {notificationTypeText}
        </Badge>
    )
}

export default NotificationTypeBadge
