import React from 'react'

import Link from 'next/link'
import { Button, Card, Group, Text, Title } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'

import Theme from '@/app/theme'
import TextHelper from '@/utils/string/TextHelper'

import Sale from '@/entities/sales/Sale'

import SaleStateBadge from '@/components/Sales/SaleStateBadge'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'

interface SalesListItemProps {
    sale: Sale
}

const SalesListItem = (props: SalesListItemProps) => {
    const { sale } = props

    if (!sale) return <SkeletonSmall />

    return (
        <Card
            shadow="sm"
            padding="md"
            withBorder
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Group justify="space-between">
                <Title size="1rem">
                    {sale.date
                        ? TextHelper.formatDate(sale.date)
                        : `Venta #${sale.id}`}
                </Title>
                <SaleStateBadge state={sale.state} />
            </Group>

            <Text size="sm" c="dimmed" mt="xs">
                {sale.observation || 'Sin descripción'}
            </Text>

            <Text fw={500} mt="md">
                Total: ${sale.totalPrice.toFixed(2)}
            </Text>

            <Group justify="flex-start" mt="md" gap="sm">
                <Link href={`/sales/${sale.id}`}>
                    <Button
                        color={Theme.primaryColor}
                        size="sm"
                        leftSection={<IconChevronRight size={18} />}>
                        Ver detalles
                    </Button>
                </Link>
            </Group>
        </Card>
    )
}

export default SalesListItem
