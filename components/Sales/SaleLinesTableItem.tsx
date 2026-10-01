import React from 'react'
import Link from 'next/link'
import { ActionIcon, Card, Group, Stack, Table, Text, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Math from '@/utils/math/Math'
import Theme from '@/app/theme'

import SaleLine from '@/entities/sales/SaleLine'

interface SaleLinesTableItemProps {
    saleLine: SaleLine
    isSmallScreen?: boolean
}

const SaleLinesTableItem = (props: SaleLinesTableItemProps) => {
    const { saleLine, isSmallScreen } = props

    const calculateSubtotal = (saleLine: SaleLine) => {
        return Math.calculateSubtotal(
            saleLine.price,
            saleLine.amount,
            saleLine.discountSurcharge ?? undefined
        )
    }

    const discountLabel = saleLine.discountSurcharge
        ? `${Math.formatFactorToPercentageString(saleLine.discountSurcharge)}`
        : 'Sin asignar'

    const actions = (
        <Group gap={4} wrap="nowrap">
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
                    <Text fw={500} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                        {saleLine.product.name}
                    </Text>
                    {actions}
                </Group>
                <Stack gap={4} mt="xs">
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Cantidad
                        </Text>
                        <Text size="sm">{saleLine.amount}</Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Precio
                        </Text>
                        <Text size="sm">{Math.formatMoney(saleLine.price)}</Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Costo
                        </Text>
                        <Text size="sm" c="dimmed">
                            {Math.formatMoney(saleLine.cost)}
                        </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Descuento/Recargo
                        </Text>
                        <Text
                            size="sm"
                            c={saleLine.discountSurcharge ? undefined : 'dimmed'}>
                            {discountLabel}
                        </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                        <Text size="sm" c="dimmed">
                            Subtotal
                        </Text>
                        <Text size="sm" fw={500}>
                            {Math.formatMoney(calculateSubtotal(saleLine))}
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
                {discountLabel}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                {Math.formatMoney(calculateSubtotal(saleLine))}
            </Table.Td>
            <Table.Td style={{ width: '80px' }}>
                <Group justify="center">{actions}</Group>
            </Table.Td>
        </Table.Tr>
    )
}

export default SaleLinesTableItem
