import React from 'react'
import { Card, Table, Text, Title } from '@mantine/core'

import Product from '@/entities/products/Product'
import ResourceName from '@/entities/helpTypes/ResourceName'

import ProductsCompactTableItem from '@/components/Products/ProductsCompactTableItem'

interface ProductsCompactTableProps {
    products: Product[]
    resourceName: ResourceName
    businessID?: number
    supplierName?: string
    onProductRemoved?: (productID: number) => void
}

const ProductsCompactTable = (props: ProductsCompactTableProps) => {
    const { products, resourceName, businessID, supplierName } = props
    const { onProductRemoved } = props

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full"
            mt="md">
            <Title size="1.5rem" mb="md">
                Productos del {resourceName}
            </Title>
            {products.length === 0 ? (
                <Text c="dimmed">
                    {`Este ${resourceName} no tiene productos asociados`}
                </Text>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Descripción</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Acciones
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {products.map((product) => (
                            <ProductsCompactTableItem
                                key={product.id}
                                product={product}
                                businessID={businessID}
                                supplierName={supplierName}
                                onRemoved={onProductRemoved}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default ProductsCompactTable
