import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Stack, Table, Text, Title } from '@mantine/core'

import ResourceName from '@/entities/helpTypes/ResourceName'
import Sale from '@/entities/sales/Sale'
import Theme from '@/app/theme'

import SalesCompactTableItem from '@/components/Sales/SalesCompactTableItem'

interface SalesCompactTableProps {
    sales: Sale[]
    resourceName: ResourceName
    businessID: number
    hideActions?: boolean
    onSaleCancelled?: (saleID: number) => void
}

const SalesCompactTable = (props: SalesCompactTableProps) => {
    const { sales, resourceName, businessID } = props
    const { hideActions, onSaleCancelled } = props

    const isSmallScreen = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full"
            mt="md">
            <Title size="1.5rem" mb="md">
                Ventas del {resourceName}
            </Title>
            {sales.length === 0 ? (
                <Text c="dimmed">
                    {`Este ${resourceName} no tiene ventas asociadas`}
                </Text>
            ) : isSmallScreen ? (
                <Stack gap="sm">
                    {sales.map((sale) => (
                        <SalesCompactTableItem
                            key={sale.id}
                            sale={sale}
                            businessID={businessID}
                            isSmallScreen
                            hideActions={hideActions}
                            onSaleCancelled={onSaleCancelled}
                        />
                    ))}
                </Stack>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Fecha</Table.Th>
                            <Table.Th>Descripción</Table.Th>
                            <Table.Th>Total</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Estado
                            </Table.Th>
                            {!hideActions && (
                                <Table.Th style={{ textAlign: 'center' }}>
                                    Acciones
                                </Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sales.map((sale) => (
                            <SalesCompactTableItem
                                key={sale.id}
                                sale={sale}
                                businessID={businessID}
                                hideActions={hideActions}
                                onSaleCancelled={onSaleCancelled}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default SalesCompactTable
