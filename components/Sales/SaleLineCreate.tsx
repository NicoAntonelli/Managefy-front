import React from 'react'
import {
    ActionIcon,
    Card,
    Group,
    Stack,
    Table,
    Text,
    Tooltip,
} from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import Math from '@/utils/math/Math'
import Theme from '@/app/theme'

import InputNumeric from '@/components/Common/Inputs/InputNumeric'
import InputPercentage from '@/components/Common/Inputs/InputPercentage'

import SaleLineDraft from '@/entities/sales/SaleLineDraft'

interface SaleLineCreateProps {
    saleLine: SaleLineDraft
    isSmallScreen?: boolean
    onChange: (saleLine: SaleLineDraft) => void
    onRemove: () => void
}

const SaleLineCreate = (props: SaleLineCreateProps) => {
    const { saleLine, isSmallScreen, onChange, onRemove } = props

    const subtotal = Math.calculateSubtotal(
        saleLine.product.unitPrice,
        saleLine.amount ?? 0,
        saleLine.discountPercentage
            ? Math.formatPercentageToFactor(saleLine.discountPercentage)
            : undefined
    )

    const amountInput = (
        <InputNumeric
            name="amount"
            isInteger
            hideControls
            noPaddingTop
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
    )

    const discountInput = (
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
    )

    const actions = (
        <Group gap={4} wrap="nowrap">
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
        </Group>
    )

    if (isSmallScreen) {
        return (
            <Card withBorder padding="sm" radius="sm">
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="sm">
                    <Text
                        fw={500}
                        style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                        {saleLine.product.name}
                    </Text>
                    {actions}
                </Group>
                <Stack gap={4} mt="xs">
                    <Text size="sm" c="dimmed">
                        Cantidad
                    </Text>
                    {amountInput}
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Precio
                        </Text>
                        <Text size="sm">
                            {Math.formatMoney(saleLine.product.unitPrice)}
                        </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Costo
                        </Text>
                        <Text size="sm" c="dimmed">
                            {Math.formatMoney(saleLine.product.unitCost)}
                        </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                        Descuento/Recargo (%)
                    </Text>
                    {discountInput}
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Subtotal
                        </Text>
                        <Text size="sm" fw={500}>
                            {Math.formatMoney(subtotal)}
                        </Text>
                    </Group>
                </Stack>
            </Card>
        )
    }

    return (
        <Table.Tr>
            <Table.Td fw={500} style={{ overflowWrap: 'anywhere' }}>
                {saleLine.product.name}
            </Table.Td>
            <Table.Td style={{ width: '7rem' }}>{amountInput}</Table.Td>
            <Table.Td style={{ width: '8rem', textAlign: 'center' }}>
                {Math.formatMoney(saleLine.product.unitPrice)}
            </Table.Td>
            <Table.Td style={{ width: '8rem', textAlign: 'center' }} c="dimmed">
                {Math.formatMoney(saleLine.product.unitCost)}
            </Table.Td>
            <Table.Td style={{ width: '8rem' }}>{discountInput}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                {Math.formatMoney(subtotal)}
            </Table.Td>
            <Table.Td style={{ width: '4rem' }}>
                <Group justify="center">{actions}</Group>
            </Table.Td>
        </Table.Tr>
    )
}

export default SaleLineCreate
