import React, { useEffect, useState } from 'react'
import {
    ActionIcon,
    Combobox,
    Group,
    Loader,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Tooltip,
    useCombobox,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconCheck,
    IconChevronDown,
    IconRefresh,
    IconRocket,
    IconSearch,
} from '@tabler/icons-react'

import Helper from '@/services/helper'
import Products from '@/services/products'
import Validation from '@/utils/validation/Validation'
import Theme from '@/app/theme'

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

    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption()
        },
    })

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<Product[] | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

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

    const filteredProducts = (products ?? []).filter((product) => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase().trim()
        const matchesName = product.name?.toLowerCase().includes(query)
        const matchesDesc = product.description?.toLowerCase().includes(query)
        const matchesCode = product.code?.toLowerCase().includes(query)
        return Boolean(matchesName || matchesDesc || matchesCode)
    })

    const handleSelect = (val: string) => {
        const product = products?.find((p) => String(p.id) === val)
        if (product) {
            onToggleProduct(product)
        }
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
                <Combobox
                    store={combobox}
                    onOptionSubmit={(val) => {
                        handleSelect(val)
                    }}
                    withinPortal={false}>
                    <Combobox.Target>
                        <TextInput
                            flex={1}
                            placeholder={placeholder}
                            leftSection={<IconRocket size={18} />}
                            rightSection={
                                loading ? (
                                    <Loader size={18} />
                                ) : (
                                    <IconChevronDown size={18} />
                                )
                            }
                            readOnly
                            onClick={() => combobox.toggleDropdown()}
                            style={{ cursor: 'pointer' }}
                            styles={{
                                input: {
                                    cursor: 'pointer',
                                },
                            }}
                        />
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Search
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.currentTarget.value)
                            }
                            placeholder="Buscar por nombre, código o descripción..."
                            leftSection={<IconSearch size={16} />}
                        />
                        <Combobox.Options>
                            <ScrollArea.Autosize type="scroll" mah={220}>
                                {loading && (
                                    <Combobox.Empty>
                                        <Group justify="center" p="xs">
                                            <Loader size="sm" />
                                        </Group>
                                    </Combobox.Empty>
                                )}

                                {!loading && filteredProducts.length === 0 && (
                                    <Combobox.Empty>
                                        No se encontraron productos coincidentes
                                    </Combobox.Empty>
                                )}

                                {!loading &&
                                    filteredProducts.map((product) => {
                                        const isSelected =
                                            selectedProductIDs.includes(
                                                product.id
                                            )
                                        return (
                                            <Combobox.Option
                                                value={String(product.id)}
                                                key={product.id}>
                                                <Group
                                                    justify="space-between"
                                                    flex={1}
                                                    gap="xs">
                                                    <Group gap="xs">
                                                        {isSelected ? (
                                                            <IconCheck
                                                                size={16}
                                                                color="var(--mantine-color-teal-6)"
                                                            />
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    width: 16,
                                                                    display:
                                                                        'inline-block',
                                                                }}
                                                            />
                                                        )}
                                                        <div>
                                                            <Text size="sm">
                                                                {product.name}
                                                                {product.code
                                                                    ? ` (${product.code})`
                                                                    : ''}
                                                            </Text>
                                                            {product.description && (
                                                                <Text
                                                                    size="xs"
                                                                    c="dimmed"
                                                                    lineClamp={
                                                                        1
                                                                    }>
                                                                    {
                                                                        product.description
                                                                    }
                                                                </Text>
                                                            )}
                                                        </div>
                                                    </Group>
                                                </Group>
                                            </Combobox.Option>
                                        )
                                    })}
                            </ScrollArea.Autosize>
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>

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
