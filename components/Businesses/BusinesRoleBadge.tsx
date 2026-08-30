import React from 'react'

import { Badge } from '@mantine/core'
import Role from '@/entities/helpTypes/Role'

interface BusinessesRoleBadgeProps {
    role?: Role | null
}

const BusinessesRoleBadge = (props: BusinessesRoleBadgeProps) => {
    const { role } = props

    const roleColors: Record<NonNullable<Role>, string> = {
        Manager: 'orange.6',
        Admin: 'red',
        Collaborator: 'pink',
    }

    // Empty role, return a blank fragment
    if (!role) return <></>

    return (
        <Badge
            size="lg"
            variant="filled"
            color={roleColors[role]}
            style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
            }}>
            {role}
        </Badge>
    )
}

export default BusinessesRoleBadge
