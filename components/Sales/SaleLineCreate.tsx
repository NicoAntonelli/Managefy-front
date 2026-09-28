import React from 'react'
import { Table, Tooltip, ActionIcon } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import Math from '@/utils/math/Math'
import Theme from '@/app/theme'

import InputNumeric from '@/components/Common/Inputs/InputNumeric'
import InputPercentage from '@/components/Common/Inputs/InputPercentage'

import SaleLineDraft from '@/entities/sales/SaleLineDraft'

interface SaleLineCreateProps {
    saleLine: SaleLineDraft
    onChange: (saleLine: SaleLineDraft) => void
    onRemove: () => void
}

const SaleLineCreate = (props: SaleLineCreateProps) => {
    const { saleLine, onChange, onRemove } = props

    const subtotal = Math.calculateSubtotal(
        saleLine.product.unitPrice,
        saleLine.amount ?? 0,
        saleLine.discountPercentage
            ? Math.formatPercentageToFactor(saleLine.discountPercentage)
            : undefined
    )

    return (
        <Table.Tr>
            <Table.Td fw={500}>{saleLine.product.name}</Table.Td>
            <Table.Td style={{ width: '7rem' }}>
                <InputNumeric
                    name="amount"
                    isInteger
                    hideControls
                    InputProps={{
                        'aria-label': 'Cantidad',
                        min: 1,
                        value: saleLine.amount ?? undefined,
                        onChange: (value) =>
                            onChange({
                                ...saleLine,
                                amount: value === null ? null : Number(value),
                            }),
                    }}
                />
            </Table.Td>
            <Table.Td style={{ width: '8rem', textAlign: 'center' }}>
                ${saleLine.product.unitPrice.toFixed(2)}
            </Table.Td>
            <Table.Td style={{ width: '8rem', textAlign: 'center' }} c="dimmed">
                ${saleLine.product.unitCost.toFixed(2)}
            </Table.Td>
            <Table.Td style={{ width: '8rem' }}>
                <InputPercentage
                    ariaLabel="Descuento/Recargo (%)"
                    value={saleLine.discountPercentage ?? null}
                    onChange={(value) =>
                        onChange({
                            ...saleLine,
                            discountPercentage: value,
                        })
                    }
                />
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                ${subtotal.toFixed(2)}
            </Table.Td>
            <Table.Td style={{ width: '4rem', textAlign: 'center' }}>
                <Tooltip label="Quitar producto">
                    <ActionIcon
                        color={Theme.other!.danger}
                        variant="outline"
                        size="sm"
                        onClick={onRemove}
                        aria-label="Quitar producto">
                        <IconX size={16} />
                    </ActionIcon>
                </Tooltip>
            </Table.Td>
        </Table.Tr>
    )
}

export default SaleLineCreate
