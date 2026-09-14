import { Group, Text } from '@mantine/core'
import { IconCheck, IconLock } from '@tabler/icons-react'

import Product from '@/entities/products/Product'

interface ProductsDropdownItemProps {
    product: Product
    isSelected: boolean
    isLocked?: boolean
}

const ProductsDropdownItem = (props: ProductsDropdownItemProps) => {
    const { product, isSelected, isLocked = false } = props

    return (
        <Group justify="space-between" flex={1} gap="xs">
            <Group gap="xs">
                {isLocked ? (
                    <IconLock size={16} color="var(--mantine-color-dimmed)" />
                ) : isSelected ? (
                    <IconCheck size={16} color="var(--mantine-color-teal-6)" />
                ) : (
                    <span style={{ width: 16, display: 'inline-block' }} />
                )}
                <div>
                    <Text size="sm" c={isLocked ? 'dimmed' : undefined}>
                        {product.name}
                        {product.code ? ` (${product.code})` : ''}
                    </Text>
                    {product.description && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                            {product.description}
                        </Text>
                    )}
                </div>
            </Group>
        </Group>
    )
}

export default ProductsDropdownItem
