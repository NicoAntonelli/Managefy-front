import React from 'react'

import { Badge } from '@mantine/core'
import Role from '@/entities/helpTypes/Role'

interface BusinessesRoleBadgeProps {
    role?: Role | null
}

const BusinessRoleBadge = (props: BusinessesRoleBadgeProps) => {
    const { role } = props

    const roleColors: Record<NonNullable<Role>, string> = {
        Manager: 'pink',
        Admin: 'red',
        Collaborator: 'green',
    }

    // Empty role, return a blank fragment
    if (!role) return <></>

    return (
        <Badge
            size="lg"
            variant="filled"
            color={roleColors[role]}
            style={{
                display: 'inline-flex',
                whiteSpace: 'nowrap',
            }}>
            {role}
        </Badge>
    )
}

export default BusinessRoleBadge
