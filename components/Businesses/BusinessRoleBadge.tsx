import React from 'react'
import { Badge } from '@mantine/core'

import Role from '@/entities/helpTypes/Role'
import TextHelper from '@/utils/string/TextHelper'

interface BusinessRoleBadgeProps {
    role?: Role | null
}

const BusinessRoleBadge = (props: BusinessRoleBadgeProps) => {
    const { role } = props

    // Empty role, return a blank fragment
    if (!role) return <></>

    const roleColor = TextHelper.getRoleColor(role)
    const roleText = TextHelper.getRoleText(role)

    return (
        <Badge
            size="lg"
            variant="filled"
            color={roleColor}
            style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            {roleText}
        </Badge>
    )
}

export default BusinessRoleBadge
