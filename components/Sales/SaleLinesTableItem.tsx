import React from 'react'
import Link from 'next/link'
import { ActionIcon, Table, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Math from '@/utils/math/Math'
import Theme from '@/app/theme'

import SaleLine from '@/entities/sales/SaleLine'

interface SaleLinesTableItemProps {
    saleLine: SaleLine
}

const SaleLinesTableItem = (props: SaleLinesTableItemProps) => {
    const { saleLine } = props

    return (
        <Table.Tr>
            <Table.Td fw={500}>{saleLine.product.name}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                {saleLine.amount}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                ${saleLine.price.toFixed(2)}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }} c="dimmed">
                ${saleLine.cost.toFixed(2)}
            </Table.Td>
            <Table.Td
                style={{ textAlign: 'center' }}
                c={saleLine.discountSurcharge ? undefined : 'dimmed'}>
                {saleLine.discountSurcharge
                    ? `${Math.formatFactorToPercentage(saleLine.discountSurcharge).toFixed(2)}%`
                    : 'Sin asignar'}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                $
                {Math.calculateSubtotal(
                    saleLine.price,
                    saleLine.amount,
                    saleLine.discountSurcharge ?? undefined
                ).toFixed(2)}
            </Table.Td>
            <Table.Td style={{ width: '80px', textAlign: 'center' }}>
                <Tooltip label="Ver producto">
                    <ActionIcon
                        component={Link}
                        href={`/products/${saleLine.product.id}`}
                        variant="outline"
                        color={Theme.other!.secondaryColor}
                        size="sm"
                        aria-label="Ver producto">
                        <IconEye size={16} />
                    </ActionIcon>
                </Tooltip>
            </Table.Td>
        </Table.Tr>
    )
}

export default SaleLinesTableItem
