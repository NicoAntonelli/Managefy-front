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

    const calculateSubtotal = (saleLine: SaleLine) => {
        return Math.calculateSubtotal(
            saleLine.price,
            saleLine.amount,
            saleLine.discountSurcharge ?? undefined
        )
    }

    return (
        <Table.Tr>
            <Table.Td fw={500}>{saleLine.product.name}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                {saleLine.amount}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                {Math.formatMoney(saleLine.price)}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }} c="dimmed">
                {Math.formatMoney(saleLine.cost)}
            </Table.Td>
            <Table.Td
                style={{ textAlign: 'center' }}
                c={saleLine.discountSurcharge ? undefined : 'dimmed'}>
                {saleLine.discountSurcharge
                    ? `${Math.formatFactorToPercentageString(saleLine.discountSurcharge)}`
                    : 'Sin asignar'}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                {Math.formatMoney(calculateSubtotal(saleLine))}
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
