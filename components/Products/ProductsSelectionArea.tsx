import React, { useEffect, useState } from 'react'
import { ActionIcon, Badge, Box, Stack, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import ProductsDropdown from './ProductsDropdown'
import Products from '@/services/products'
import Theme from '@/app/theme'

import Product from '@/entities/products/Product'

interface ProductsSelectionAreaProps {
    businessID: number
    selectedProductIDs: number[]
    required?: boolean
    label?: string
    error?: string
    onChange: (productIDs: number[]) => void
}

const ProductsSelectionArea = (props: ProductsSelectionAreaProps) => {
    const { businessID, selectedProductIDs, required = false } = props
    const { label = 'Productos asociados', error, onChange } = props

    const [productsList, setProductsList] = useState<Product[]>([])

    useEffect(() => {
        if (businessID && productsList.length === 0) {
            Products.listProducts(businessID)
                .then((res) => {
                    if (res) setProductsList(res)
                })
                .catch(() => {})
        }
    }, [businessID])

    const handleToggleProduct = (product: Product) => {
        if (selectedProductIDs.includes(product.id)) {
            onChange(selectedProductIDs.filter((id) => id !== product.id))
        } else {
            onChange([...selectedProductIDs, product.id])
        }

        if (!productsList.some((p) => p.id === product.id)) {
            setProductsList((prev) => [...prev, product])
        }
    }

    const handleRemoveProduct = (productId: number) => {
        onChange(selectedProductIDs.filter((id) => id !== productId))
    }

    const handleProductsLoaded = (products: Product[]) => {
        setProductsList((prev) => {
            const map = new Map<number, Product>()
            prev.forEach((p) => map.set(p.id, p))
            products.forEach((p) => map.set(p.id, p))
            return Array.from(map.values())
        })
    }

    return (
        <Stack gap="xs" mt="md" w="100%">
            <Text size="sm" fw={500}>
                {label}{' '}
                {required && (
                    <span style={{ color: 'var(--mantine-color-error)' }}>
                        *
                    </span>
                )}
            </Text>

            <Box
                style={{
                    border: error
                        ? '1px solid var(--mantine-color-error)'
                        : '1px solid var(--mantine-color-default-border)',
                    borderRadius: 'var(--mantine-radius-sm)',
                    padding: 'var(--mantine-spacing-sm)',
                    minHeight: '4.5rem',
                    backgroundColor: 'var(--mantine-color-body)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    gap: '0.5rem',
                }}>
                {selectedProductIDs.length === 0 ? (
                    <Text size="sm" c="dimmed">
                        No hay productos seleccionados. Selecciona productos a
                        continuación.
                    </Text>
                ) : (
                    selectedProductIDs.map((id) => {
                        const product = productsList.find((p) => p.id === id)
                        const name = product ? product.name : `Producto #${id}`
                        return (
                            <Badge
                                key={id}
                                size="lg"
                                variant="light"
                                color={Theme.primaryColor}
                                rightSection={
                                    <ActionIcon
                                        size="xs"
                                        color="gray"
                                        radius="xl"
                                        variant="transparent"
                                        onClick={() => handleRemoveProduct(id)}
                                        aria-label={`Quitar ${name}`}>
                                        <IconX size={12} />
                                    </ActionIcon>
                                }>
                                {name}
                            </Badge>
                        )
                    })
                )}
            </Box>

            {error && (
                <Text size="xs" c={Theme.other!.danger} mt={-4}>
                    {error}
                </Text>
            )}

            <ProductsDropdown
                businessID={businessID}
                selectedProductIDs={selectedProductIDs}
                forceRefresh
                onToggleProduct={handleToggleProduct}
                onProductsLoaded={handleProductsLoaded}
            />
        </Stack>
    )
}

export default ProductsSelectionArea
