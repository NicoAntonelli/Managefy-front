import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Card, Group, Stack, Table, Text, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Theme from '@/app/theme'

import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersCompactTableItemProps {
    supplier: Supplier
    isSmallScreen?: boolean
    hideActions?: boolean
}

const SuppliersCompactTableItem = (props: SuppliersCompactTableItemProps) => {
    const { supplier, isSmallScreen, hideActions } = props

    const router = useRouter()

    const openSupplier = () => router.push(`/suppliers/${supplier.id}`)

    const actions = (
        <Group gap={4} wrap="nowrap" onClick={(event) => event.stopPropagation()}>
            <Tooltip label="Ver proveedor">
                <ActionIcon
                    component={Link}
                    href={`/suppliers/${supplier.id}`}
                    variant="outline"
                    color={Theme.other!.secondaryColor}
                    size="sm"
                    aria-label="Ver proveedor">
                    <IconEye size={16} />
                </ActionIcon>
            </Tooltip>
        </Group>
    )

    if (isSmallScreen) {
        return (
            <Card
                withBorder
                padding="sm"
                radius="sm"
                style={{ cursor: 'pointer' }}
                onClick={openSupplier}>
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="sm">
                    <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                        <Text fw={500} style={{ overflowWrap: 'anywhere' }}>
                            {supplier.name}
                        </Text>
                        <Text
                            size="sm"
                            c={supplier.description ? undefined : 'dimmed'}
                            style={{ overflowWrap: 'anywhere' }}>
                            {supplier.description || 'Sin descripción'}
                        </Text>
                        <Text
                            size="sm"
                            c={supplier.email ? undefined : 'dimmed'}>
                            {supplier.email || 'Sin email'}
                        </Text>
                        <Text
                            size="sm"
                            c={supplier.phone ? undefined : 'dimmed'}>
                            {supplier.phone || 'Sin teléfono'}
                        </Text>
                    </Stack>
                    {!hideActions && actions}
                </Group>
            </Card>
        )
    }

    return (
        <Table.Tr style={{ cursor: 'pointer' }} onClick={openSupplier}>
            <Table.Td fw={500} style={{ overflowWrap: 'anywhere' }}>
                {supplier.name}
            </Table.Td>
            <Table.Td
                c={supplier.description ? undefined : 'dimmed'}
                style={{ overflowWrap: 'anywhere' }}>
                {supplier.description || 'Sin descripción'}
            </Table.Td>
            <Table.Td c={supplier.email ? undefined : 'dimmed'}>
                {supplier.email || 'Sin email'}
            </Table.Td>
            <Table.Td c={supplier.phone ? undefined : 'dimmed'}>
                {supplier.phone || 'Sin teléfono'}
            </Table.Td>
            {!hideActions && (
                <Table.Td style={{ width: '80px' }}>
                    <Group justify="center">{actions}</Group>
                </Table.Td>
            )}
        </Table.Tr>
    )
}

export default SuppliersCompactTableItem
