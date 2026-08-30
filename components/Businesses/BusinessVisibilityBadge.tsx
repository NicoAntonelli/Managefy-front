import React from 'react'

import { Badge } from '@mantine/core'

interface BusinessVisibilityBadgeProps {
    isPublic?: boolean | null
}

const BusinessVisibilityBadge = (props: BusinessVisibilityBadgeProps) => {
    const { isPublic } = props

    // Empty info, return a blank fragment
    if (isPublic === null || isPublic === undefined) return <></>

    const visibilityLabel = isPublic ? 'Public' : 'Private'
    const visibilityColor = isPublic ? 'blue' : 'orange.6'

    return (
        <Badge
            size="lg"
            variant="filled"
            color={visibilityColor}
            style={{
                display: 'inline-flex',
                whiteSpace: 'nowrap',
            }}>
            {visibilityLabel}
        </Badge>
    )
}

export default BusinessVisibilityBadge
