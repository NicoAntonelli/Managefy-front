import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Card, Group, Table, Text, Tooltip } from '@mantine/core'
import { IconBan, IconEye } from '@tabler/icons-react'

import Theme from '@/app/theme'

import DateHelper from '@/utils/math/DateHelper'
import Math from '@/utils/math/Math'
import Sale from '@/entities/sales/Sale'

import SaleCancel from '@/components/Sales/SaleCancel'
import SaleStateBadge from '@/components/Sales/SaleStateBadge'

interface SalesCompactTableItemProps {
    sale: Sale
    businessID: number
    isSmallScreen?: boolean
    hideActions?: boolean
    onSaleCancelled?: (saleID: number) => void
}

const SalesCompactTableItem = (props: SalesCompactTableItemProps) => {
    const { sale, businessID, isSmallScreen } = props
    const { hideActions, onSaleCancelled } = props

    const router = useRouter()

    const [cancelModalOpened, setCancelModalOpened] = useState(false)

    const saleIdentifier = sale.date
        ? DateHelper.formatDateTime(sale.date)
        : `Venta #${sale.id}`

    const isActive = sale.state !== 'Cancelled'

    // Prevent redirection if the sale is cancelled
    const salesRedirection = () => {
        if (isActive) router.push(`/sales/${sale.id}`)
    }

    const actions = isActive && (
        <Group gap={4} wrap="nowrap" onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Ver venta">
                <ActionIcon
                    component={Link}
                    href={`/sales/${sale.id}`}
                    variant="outline"
                    color={Theme.other!.secondaryColor}
                    size="sm"
                    aria-label="Ver venta">
                    <IconEye size={16} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Cancelar venta">
                <ActionIcon
                    variant="outline"
                    color={Theme.other!.danger}
                    size="sm"
                    aria-label="Cancelar venta"
                    onClick={() => setCancelModalOpened(true)}>
                    <IconBan size={16} />
                </ActionIcon>
            </Tooltip>
        </Group>
    )

    const cancelModal = (
        <SaleCancel
            opened={cancelModalOpened}
            saleID={sale.id}
            saleIdentifier={saleIdentifier}
            businessID={businessID}
            onClose={() => setCancelModalOpened(false)}
            onSuccess={() => onSaleCancelled?.(sale.id)}
        />
    )

    if (isSmallScreen) {
        return (
            <Card
                withBorder
                padding="sm"
                radius="sm"
                style={{ cursor: isActive ? 'pointer' : 'default' }}
                onClick={salesRedirection}>
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="sm">
                    <Text
                        fw={500}
                        style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                        {saleIdentifier}
                    </Text>
                    <SaleStateBadge state={sale.state} />
                </Group>
                <Text
                    size="sm"
                    mt={4}
                    c={sale.observation ? undefined : 'dimmed'}
                    style={{ overflowWrap: 'anywhere' }}>
                    {sale.observation || 'Sin descripción'}
                </Text>
                <Group
                    justify="space-between"
                    align="center"
                    mt="xs"
                    wrap="nowrap">
                    <Text size="sm" fw={500}>
                        {Math.formatMoney(sale.totalPrice)}
                    </Text>
                    {!hideActions && actions}
                </Group>
                {cancelModal}
            </Card>
        )
    }

    return (
        <>
            <Table.Tr
                style={{ cursor: isActive ? 'pointer' : 'default' }}
                onClick={salesRedirection}>
                <Table.Td fw={500} style={{ overflowWrap: 'anywhere' }}>
                    {sale.date
                        ? DateHelper.formatDateTime(sale.date)
                        : `#${sale.id}`}
                </Table.Td>
                <Table.Td
                    c={sale.observation ? undefined : 'dimmed'}
                    style={{ overflowWrap: 'anywhere' }}>
                    {sale.observation || 'Sin descripción'}
                </Table.Td>
                <Table.Td>{Math.formatMoney(sale.totalPrice)}</Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                    <SaleStateBadge state={sale.state} />
                </Table.Td>
                {!hideActions && (
                    <Table.Td style={{ width: '100px' }}>
                        <Group justify="center">{actions}</Group>
                    </Table.Td>
                )}
            </Table.Tr>
            {cancelModal}
        </>
    )
}

export default SalesCompactTableItem
