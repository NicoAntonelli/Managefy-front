import React from 'react'
import { Table, Text, Title } from '@mantine/core'

import SaleLine from '@/entities/sales/SaleLine'

import SaleLinesTableItem from '@/components/Sales/SaleLinesTableItem'

interface SaleLinesTableProps {
    saleLines?: SaleLine[] | null
}

const SaleLinesTable = (props: SaleLinesTableProps) => {
    const { saleLines } = props

    return (
        <>
            <Title size="1.5rem" mb="md">
                Detalle de la venta
            </Title>
            {!saleLines || saleLines.length === 0 ? (
                <Text c="dimmed">Esta venta no tiene productos</Text>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Producto</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Cantidad
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Precio
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Costo
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Descuento/Recargo
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Subtotal
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Acciones
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {saleLines.map((saleLine) => (
                            <SaleLinesTableItem
                                key={saleLine.position}
                                saleLine={saleLine}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </>
    )
}

export default SaleLinesTable
