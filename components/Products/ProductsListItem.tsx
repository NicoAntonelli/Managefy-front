import React from 'react'

import Link from 'next/link'
import { Button, Card, Group, Text, Title, Badge } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'

import Product from '@/entities/products/Product'
import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'

import Theme from '@/app/theme'

interface ProductsListItemProps {
    product: Product
}

const ProductsListItem = (props: ProductsListItemProps) => {
    const { product } = props

    if (!product) return <SkeletonSmall />

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
                <Title size="1rem">{product.name}</Title>
                <Badge
                    color={Theme.other!.secondaryColor}
                    variant="light"
                    size="sm">
                    {product.code}
                </Badge>
            </Group>

            <Text size="sm" c="dimmed" mt="xs">
                {product.description}
            </Text>

            <Group justify="flex-start" mt="md" gap="sm">
                <Link href={`/products/${product.id}`}>
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

export default ProductsListItem
