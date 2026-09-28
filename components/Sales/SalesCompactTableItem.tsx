import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Table, Tooltip } from '@mantine/core'
import { IconBan, IconEye } from '@tabler/icons-react'

import Theme from '@/app/theme'

import DateHelper from '@/utils/math/DateHelper'
import Sale from '@/entities/sales/Sale'

import SaleCancel from '@/components/Sales/SaleCancel'
import SaleStateBadge from '@/components/Sales/SaleStateBadge'

interface SalesCompactTableItemProps {
    sale: Sale
    businessID: number
    onSaleCancelled: (saleID: number) => void
}

const SalesCompactTableItem = (props: SalesCompactTableItemProps) => {
    const { sale, businessID, onSaleCancelled } = props

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

    return (
        <>
            <Table.Tr style={{ cursor: 'pointer' }} onClick={salesRedirection}>
                <Table.Td fw={500}>
                    {sale.date
                        ? DateHelper.formatDateTime(sale.date)
                        : `#${sale.id}`}
                </Table.Td>
                <Table.Td c={sale.observation ? undefined : 'dimmed'}>
                    {sale.observation || 'Sin descripción'}
                </Table.Td>
                <Table.Td>${sale.totalPrice.toFixed(2)}</Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                    <SaleStateBadge state={sale.state} />
                </Table.Td>
                <Table.Td style={{ width: '100px', textAlign: 'center' }}>
                    {isActive && (
                        <Tooltip label="Ver venta">
                            <ActionIcon
                                component={Link}
                                href={`/sales/${sale.id}`}
                                variant="outline"
                                color={Theme.other!.secondaryColor}
                                size="sm"
                                aria-label="Ver venta"
                                onClick={(e) => e.stopPropagation()}>
                                <IconEye size={16} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                    {isActive && (
                        <Tooltip label="Cancelar venta">
                            <ActionIcon
                                variant="outline"
                                color={Theme.other!.danger}
                                size="sm"
                                aria-label="Cancelar venta"
                                ml="xs"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCancelModalOpened(true)
                                }}>
                                <IconBan size={16} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Table.Td>
            </Table.Tr>
            <SaleCancel
                opened={cancelModalOpened}
                saleID={sale.id}
                saleIdentifier={saleIdentifier}
                businessID={businessID}
                onClose={() => setCancelModalOpened(false)}
                onSuccess={() => onSaleCancelled(sale.id)}
            />
        </>
    )
}

export default SalesCompactTableItem
