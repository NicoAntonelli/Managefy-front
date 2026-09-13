import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionIcon, Card, Table, Text, Title, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Product from '@/entities/products/Product'

interface ProductsCompactTableProps {
    products: Product[]
    resource: string
}

const ProductsCompactTable = (props: ProductsCompactTableProps) => {
    const { products, resource } = props

    const router = useRouter()

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full"
            mt="md">
            <Title size="1.5rem" mb="md">
                Productos del {resource}
            </Title>
            {products.length === 0 ? (
                <Text c="dimmed">
                    {`Este ${resource} no tiene productos asociados`}
                </Text>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Tbody>
                        {products.map((product) => (
                            <Table.Tr
                                key={product.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    router.push(`/products/${product.id}`)
                                }>
                                <Table.Td fw={500}>{product.name}</Table.Td>
                                <Table.Td
                                    c={
                                        product.description
                                            ? undefined
                                            : 'dimmed'
                                    }>
                                    {product.description || 'Sin descripción'}
                                </Table.Td>
                                <Table.Td
                                    style={{
                                        width: '80px',
                                        textAlign: 'center',
                                    }}>
                                    <Tooltip label="Ver producto">
                                        <ActionIcon
                                            component={Link}
                                            href={`/products/${product.id}`}
                                            variant="outline"
                                            color={Theme.other!.secondaryColor}
                                            size="sm"
                                            aria-label="Ver producto"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }>
                                            <IconEye size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default ProductsCompactTable
