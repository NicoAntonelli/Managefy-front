import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ActionIcon,
    Card,
    Group,
    Stack,
    Table,
    Text,
    Tooltip,
} from '@mantine/core'
import { IconEye, IconX } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Product from '@/entities/products/Product'
import ProductEraseSupplier from '@/components/Products/ProductEraseSupplier'

interface ProductsCompactTableItemProps {
    product: Product
    businessID?: number
    supplierName?: string
    isSmallScreen?: boolean
    hideActions?: boolean
    onRemoved?: (productID: number) => void
}

const ProductsCompactTableItem = (props: ProductsCompactTableItemProps) => {
    const { product, businessID, supplierName, isSmallScreen } = props
    const { hideActions, onRemoved } = props

    const router = useRouter()

    const [eraseModalOpened, setEraseModalOpened] = useState(false)

    const openProduct = () => router.push(`/products/${product.id}`)

    const actions = (
        <Group gap={4} wrap="nowrap" onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Ver producto">
                <ActionIcon
                    component={Link}
                    href={`/products/${product.id}`}
                    variant="outline"
                    color={Theme.other!.secondaryColor}
                    size="sm"
                    aria-label="Ver producto">
                    <IconEye size={16} />
                </ActionIcon>
            </Tooltip>

            {businessID && supplierName && (
                <Tooltip label="Remover producto de la lista">
                    <ActionIcon
                        variant="outline"
                        color={Theme.other!.danger}
                        size="sm"
                        aria-label="Remover producto de la lista"
                        onClick={() => setEraseModalOpened(true)}>
                        <IconX size={16} />
                    </ActionIcon>
                </Tooltip>
            )}
        </Group>
    )

    const eraseModal = businessID && supplierName && (
        <div onClick={(e) => e.stopPropagation()}>
            <ProductEraseSupplier
                opened={eraseModalOpened}
                productID={product.id}
                businessID={businessID}
                supplierName={supplierName}
                productName={product.name}
                onSuccess={() => onRemoved?.(product.id)}
                onClose={() => setEraseModalOpened(false)}
            />
        </div>
    )

    if (isSmallScreen) {
        return (
            <Card
                withBorder
                padding="sm"
                radius="sm"
                style={{ cursor: 'pointer' }}
                onClick={openProduct}>
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="sm">
                    <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                        <Text
                            size="sm"
                            c={product.code ? undefined : 'dimmed'}
                            style={{ overflowWrap: 'anywhere' }}>
                            {product.code || 'Sin código'}
                        </Text>
                        <Text fw={500} style={{ overflowWrap: 'anywhere' }}>
                            {product.name}
                        </Text>
                        <Text
                            size="sm"
                            c={product.description ? undefined : 'dimmed'}
                            style={{ overflowWrap: 'anywhere' }}>
                            {product.description || 'Sin descripción'}
                        </Text>
                    </Stack>
                    {!hideActions && actions}
                </Group>
                {eraseModal}
            </Card>
        )
    }

    return (
        <Table.Tr style={{ cursor: 'pointer' }} onClick={openProduct}>
            <Table.Td
                c={product.code ? undefined : 'dimmed'}
                style={{ overflowWrap: 'anywhere' }}>
                {product.code || 'Sin código'}
            </Table.Td>
            <Table.Td fw={500} style={{ overflowWrap: 'anywhere' }}>
                {product.name}
            </Table.Td>
            <Table.Td
                c={product.description ? undefined : 'dimmed'}
                style={{ overflowWrap: 'anywhere' }}>
                {product.description || 'Sin descripción'}
            </Table.Td>
            {!hideActions && (
                <Table.Td style={{ width: '100px' }}>
                    <Group justify="center">{actions}</Group>
                    {eraseModal}
                </Table.Td>
            )}
        </Table.Tr>
    )
}

export default ProductsCompactTableItem
