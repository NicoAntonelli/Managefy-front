import React from 'react'
import { Badge } from '@mantine/core'

import TextHelper from '@/utils/string/TextHelper'

interface BusinessVisibilityBadgeProps {
    isPublic?: boolean | null
}

const BusinessVisibilityBadge = (props: BusinessVisibilityBadgeProps) => {
    const { isPublic } = props

    // Empty info, return a blank fragment
    if (isPublic === null || isPublic === undefined) return <></>

    const visibilityColor = TextHelper.getVisibilityColor(isPublic)
    const visibilityText = TextHelper.getVisibilityText(isPublic)

    return (
        <Badge
            size="lg"
            variant="filled"
            color={visibilityColor}
            style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            {visibilityText}
        </Badge>
    )
}

export default BusinessVisibilityBadge
