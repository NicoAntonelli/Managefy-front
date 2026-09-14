import React, { useEffect, useState } from 'react'
import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconRefresh, IconRocket } from '@tabler/icons-react'

import Helper from '@/services/helper'
import Products from '@/services/products'
import Validation from '@/utils/validation/Validation'
import Theme from '@/app/theme'

import CustomDropdown from '@/components/Common/CustomDropdown/CustomDropdown'
import ProductsDropdownItem from '@/components/Products/ProductsDropdownItem'

import Product from '@/entities/products/Product'

interface ProductsDropdownProps {
    businessID: number
    selectedProductIDs: number[]
    forceRefresh?: boolean
    label?: string
    onToggleProduct: (product: Product) => void
    onProductsLoaded?: (products: Product[]) => void
}

const ProductsDropdown = (props: ProductsDropdownProps) => {
    const { businessID, selectedProductIDs, forceRefresh = false } = props
    const { label, onToggleProduct, onProductsLoaded } = props

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<Product[] | null>(null)

    const [cachedAt, setCachedAt] = useState<number | null>(null)
    const [cachedBusinessID, setCachedBusinessID] = useState<number | null>(
        null
    )

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await Products.listProducts(businessID)
            setProducts(response ?? [])
            setCachedAt(Date.now())
            setCachedBusinessID(businessID)
            if (onProductsLoaded && response) {
                onProductsLoaded(response)
            }
            return response
        } catch (error) {
            setProducts([])
            const message = Helper.parseError(error)
            notifications.show({
                title: 'Error',
                message:
                    message ||
                    'Error al obtener los productos. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const isCacheValid =
            products !== null &&
            cachedBusinessID === businessID &&
            cachedAt !== null &&
            Validation.cache(cachedAt)

        if (!isCacheValid || forceRefresh) {
            fetchProducts()
        }
    }, [businessID, forceRefresh])

    const handleSelect = (product: Product) => {
        onToggleProduct(product)
    }

    const filterPredicate = (product: Product, query: string) => {
        const matchesName = product.name?.toLowerCase().includes(query)
        const matchesDesc = product.description?.toLowerCase().includes(query)
        const matchesCode = product.code?.toLowerCase().includes(query)
        return Boolean(matchesName || matchesDesc || matchesCode)
    }

    const placeholder =
        products === null || loading
            ? 'Cargando productos...'
            : products.length === 0
              ? 'No hay productos para mostrar'
              : 'Seleccionar productos...'

    return (
        <Stack gap="xs">
            {label && (
                <Text size="sm" fw={500}>
                    {label}
                </Text>
            )}
            <Group align="center" gap="sm">
                <CustomDropdown<Product>
                    items={products ?? []}
                    getItemKey={(product) => product.id}
                    getItemLabel={(product) => product.name}
                    filterPredicate={filterPredicate}
                    onSelect={handleSelect}
                    closeOnSelect={false}
                    withinPortal={false}
                    loading={loading}
                    placeholder={placeholder}
                    searchPlaceholder="Buscar por nombre, código o descripción..."
                    emptyText="No se encontraron productos coincidentes"
                    leftIcon={<IconRocket size={18} />}
                    renderOption={(product) => (
                        <ProductsDropdownItem
                            product={product}
                            isSelected={selectedProductIDs.includes(product.id)}
                        />
                    )}
                />

                {!forceRefresh && (
                    <Tooltip label="Recargar productos">
                        <ActionIcon
                            variant="light"
                            size="lg"
                            loading={loading}
                            onClick={fetchProducts}>
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </Group>
        </Stack>
    )
}

export default ProductsDropdown
