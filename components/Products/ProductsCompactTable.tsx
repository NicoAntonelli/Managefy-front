import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Stack, Table, Text, Title } from '@mantine/core'

import Product from '@/entities/products/Product'
import ResourceName from '@/entities/helpTypes/ResourceName'
import Theme from '@/app/theme'

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
                Productos del {resourceName}
            </Title>
            {products.length === 0 ? (
                <Text c="dimmed">
                    {`Este ${resourceName} no tiene productos asociados`}
                </Text>
            ) : isSmallScreen ? (
                <Stack gap="sm">
                    {products.map((product) => (
                        <ProductsCompactTableItem
                            key={product.id}
                            product={product}
                            businessID={businessID}
                            supplierName={supplierName}
                            isSmallScreen
                            onRemoved={onProductRemoved}
                        />
                    ))}
                </Stack>
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
