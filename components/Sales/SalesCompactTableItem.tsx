import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Badge, Table, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Theme from '@/app/theme'
import TextHelper from '@/utils/string/TextHelper'

import Sale from '@/entities/sales/Sale'

interface SalesCompactTableItemProps {
    sale: Sale
}

const SalesCompactTableItem = (props: SalesCompactTableItemProps) => {
    const { sale } = props

    const router = useRouter()

    return (
        <Table.Tr
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/sales/${sale.id}`)}>
            <Table.Td fw={500}>
                {sale.date
                    ? TextHelper.dateFormatter(sale.date)
                    : `#${sale.id}`}
            </Table.Td>
            <Table.Td c={sale.observation ? undefined : 'dimmed'}>
                {sale.observation || 'Sin descripción'}
            </Table.Td>
            <Table.Td>${sale.totalPrice.toFixed(2)}</Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
                <Badge size="sm" variant="light">
                    {TextHelper.getSaleStateText(sale.state)}
                </Badge>
            </Table.Td>
            <Table.Td style={{ width: '80px', textAlign: 'center' }}>
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
            </Table.Td>
        </Table.Tr>
    )
}

export default SalesCompactTableItem
