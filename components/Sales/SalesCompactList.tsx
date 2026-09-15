import React from 'react'
import { Card, Table, Text, Title } from '@mantine/core'

import ResourceName from '@/entities/helpTypes/ResourceName'
import Sale from '@/entities/sales/Sale'

import SalesCompactListItem from '@/components/Sales/SalesCompactListItem'

interface SalesCompactListProps {
    sales: Sale[]
    resourceName: ResourceName
}

const SalesCompactList = (props: SalesCompactListProps) => {
    const { sales, resourceName } = props

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
                            <Table.Th style={{ textAlign: 'center' }}>
                                Acciones
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sales.map((sale) => (
                            <SalesCompactListItem key={sale.id} sale={sale} />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default SalesCompactList
