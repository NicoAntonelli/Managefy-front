import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Stack, Table, Text, Title } from '@mantine/core'

import Theme from '@/app/theme'

import SuppliersCompactTableItem from '@/components/Suppliers/SuppliersCompactTableItem'

import ResourceName from '@/entities/helpTypes/ResourceName'
import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersCompactTableProps {
    suppliers: Supplier[]
    resourceName: ResourceName
    hideActions?: boolean
}

const SuppliersCompactTable = (props: SuppliersCompactTableProps) => {
    const { suppliers, resourceName, hideActions } = props

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
                Proveedores del {resourceName}
            </Title>
            {suppliers.length === 0 ? (
                <Text c="dimmed">
                    {`Este ${resourceName} no tiene proveedores asociados`}
                </Text>
            ) : isSmallScreen ? (
                <Stack gap="sm">
                    {suppliers.map((supplier) => (
                        <SuppliersCompactTableItem
                            key={supplier.id}
                            supplier={supplier}
                            isSmallScreen
                            hideActions={hideActions}
                        />
                    ))}
                </Stack>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Descripción</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Teléfono</Table.Th>
                            {!hideActions && (
                                <Table.Th style={{ textAlign: 'center' }}>
                                    Acciones
                                </Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {suppliers.map((supplier) => (
                            <SuppliersCompactTableItem
                                key={supplier.id}
                                supplier={supplier}
                                hideActions={hideActions}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default SuppliersCompactTable
