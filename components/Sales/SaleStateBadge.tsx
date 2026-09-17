import React from 'react'
import { Badge } from '@mantine/core'

import SaleState from '@/entities/helpTypes/SaleState'
import TextHelper from '@/utils/string/TextHelper'

interface SaleStateBadgeProps {
    state?: SaleState | null
}

const SaleStateBadge = (props: SaleStateBadgeProps) => {
    const { state } = props

    // Empty state, return a blank fragment
    if (!state) return <></>

    const saleStateColor = TextHelper.getSaleStateColor(state)
    const saleStateText = TextHelper.getSaleStateText(state)

    return (
        <Badge
            size="sm"
            variant="light"
            color={saleStateColor}
            style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            {saleStateText}
        </Badge>
    )
}

export default SaleStateBadge
