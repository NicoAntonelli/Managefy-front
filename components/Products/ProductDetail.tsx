import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ActionIcon,
    Card,
    Group,
    Stack,
    Text,
    Title,
    Button,
    Grid,
    Tooltip,
} from '@mantine/core'
import {
    IconEye,
    IconPencil,
    IconPlus,
    IconTrash,
    IconX,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Products from '@/services/products'
import Helper from '@/services/helper'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ProductCreateUpdate from '@/components/Products/ProductCreateUpdate'
import ProductDelete from '@/components/Products/ProductDelete'
import ProductEraseSupplier from '@/components/Products/ProductEraseSupplier'
import ProductUpdateOrAddSupplier from '@/components/Products/ProductUpdateOrAddSupplier'
import ProductUpdateStock from '@/components/Products/ProductUpdateStock'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Product from '@/entities/products/Product'
import ProductCU from '@/entities/products/ProductCU'

const ProductDetail = () => {
    const params = useParams()
    const productId = params?.id ? Number(params.id) : null

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [editing, setEditing] = useState(false)
    const [stockModalOpened, setStockModalOpened] = useState(false)
    const [supplierModalOpened, setSupplierModalOpened] = useState(false)
    const [eraseSupplierModalOpened, setEraseSupplierModalOpened] =
        useState(false)

    useEffect(() => {
        if (!productId || !businessID) {
            setLoading(false)
            return
        }

        const fetchProduct = async () => {
            try {
                const response = await Products.getOneProduct(
                    productId,
                    businessID
                )
                setProduct(response)
            } catch (error) {
                const message = Helper.parseError(error)
                notifications.show({
                    title: 'Error',
                    message: 'No se pudo cargar el producto',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productId, businessID])

    const handleEdit = () => {
        if (!product) return
        setEditing(true)
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="productos" />
    }

    if (product && editing) {
        const productCU: ProductCU = {
            id: product.id,
            code: product.code,
            name: product.name,
            description: product.description,
            unitCost: product.unitCost,
            unitPrice: product.unitPrice,
            stock: product.stock,
            stockMin: product.stockMin,
            saleMinAmount: product.saleMinAmount,
            businessID: selectedBusiness.id,
            supplier: product.supplier
                ? {
                      id: product.supplier.id,
                      name: product.supplier.name,
                      description: product.supplier.description,
                      email: product.supplier.email,
                      phone: product.supplier.phone,
                      businessID: selectedBusiness.id,
                  }
                : null,
        }

        return (
            <ProductCreateUpdate
                currentProduct={productCU}
                backHref={`/products/${product.id}`}
                cancelHref={`/products/${product.id}`}
                onCancel={() => setEditing(false)}
                onSuccess={(updatedProduct) => {
                    setProduct(updatedProduct)
                    setEditing(false)
                }}
            />
        )
    }

    if (!product) {
        return (
            <Stack gap="xs" style={{ width: '100%' }}>
                <SelectedBusinessBar business={selectedBusiness} hideFilter />
                <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                    <ButtonGoBack href="/products" text="productos" />
                </div>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="min-w-full">
                    <Text c="dimmed">Producto no encontrado</Text>
                </Card>
            </Stack>
        )
    }

    return (
        <Stack gap="xs" style={{ width: '100%' }}>
            <SelectedBusinessBar business={selectedBusiness} hideFilter />

            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <ButtonGoBack href="/products" text="productos" />
            </div>

            <div style={{ marginBottom: 'var(--mantine-spacing-sm)' }}>
                <ButtonCreate href="/products/new" resourceName="producto" />
            </div>

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Stack gap="xs" mb="md">
                    <Title size="2rem">{product.name}</Title>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Código
                        </Text>
                        <Text size="lg" c={product.code ? undefined : 'dimmed'}>
                            {product.code || 'Sin asignar'}
                        </Text>
                    </div>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Descripción
                        </Text>
                        <Text c={product.description ? undefined : 'dimmed'}>
                            {product.description || 'Sin asignar'}
                        </Text>
                    </div>
                </Stack>

                <Grid mb="lg">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Precio unitario
                                </Text>
                                <Text size="lg">
                                    ${product.unitPrice.toFixed(2)}
                                </Text>
                            </div>

                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Costo unitario
                                </Text>
                                <Text size="lg">
                                    ${product.unitCost.toFixed(2)}
                                </Text>
                            </div>

                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Stock actual
                                </Text>
                                <Group gap="xs" align="center">
                                    <Text size="lg">{product.stock}</Text>
                                    <ActionIcon
                                        color={Theme.primaryColor}
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setStockModalOpened(true)
                                        }>
                                        <IconPencil size={16} />
                                    </ActionIcon>
                                </Group>
                            </div>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Stock mínimo
                                </Text>
                                <Text
                                    size="lg"
                                    c={
                                        product.stockMin === null ||
                                        product.stockMin === undefined
                                            ? 'dimmed'
                                            : undefined
                                    }>
                                    {product.stockMin ?? 'Sin asignar'}
                                </Text>
                            </div>

                            <Tooltip
                                label="Unidades que se venden juntas. Al realizar una venta, las unidades tienen que ser múltiplo de este valor"
                                multiline
                                w={220}
                                position="top-start"
                                withArrow>
                                <div style={{ display: 'inline-block' }}>
                                    <Text size="sm" fw={500} c="dimmed">
                                        Cantidad mínima por venta
                                    </Text>
                                    <Text
                                        size="lg"
                                        c={
                                            product.saleMinAmount === null ||
                                            product.saleMinAmount === undefined
                                                ? 'dimmed'
                                                : undefined
                                        }>
                                        {product.saleMinAmount ?? 'Sin asignar'}
                                    </Text>
                                </div>
                            </Tooltip>

                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Proveedor
                                </Text>
                                <Group gap="0.5rem" align="center">
                                    <Text
                                        size="lg"
                                        c={
                                            product.supplier?.name
                                                ? undefined
                                                : 'dimmed'
                                        }>
                                        {product.supplier?.name || 'Ninguno'}
                                    </Text>
                                    {product.supplier && (
                                        <ActionIcon
                                            component={Link}
                                            href={`/suppliers/${product.supplier.id}`}
                                            color={Theme.other!.secondaryColor}
                                            variant="outline"
                                            size="sm"
                                            aria-label="Ver proveedor">
                                            <IconEye size={16} />
                                        </ActionIcon>
                                    )}
                                    <ActionIcon
                                        color={Theme.primaryColor}
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setSupplierModalOpened(true)
                                        }
                                        aria-label={
                                            product.supplier
                                                ? 'Actualizar proveedor'
                                                : 'Agregar proveedor'
                                        }>
                                        {product.supplier ? (
                                            <IconPencil size={16} />
                                        ) : (
                                            <IconPlus size={16} />
                                        )}
                                    </ActionIcon>
                                    {product.supplier && (
                                        <ActionIcon
                                            color={Theme.other!.danger}
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setEraseSupplierModalOpened(
                                                    true
                                                )
                                            }
                                            aria-label="Quitar proveedor">
                                            <IconX size={16} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </div>
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Group justify="flex-start" gap="sm" mt="xl">
                    <Button
                        color={Theme.primaryColor}
                        leftSection={<IconPencil size={20} />}
                        onClick={handleEdit}>
                        Editar
                    </Button>

                    <Button
                        color={Theme.other!.danger}
                        leftSection={<IconTrash size={20} />}
                        onClick={() => setDeleteModalOpened(true)}>
                        Eliminar
                    </Button>
                </Group>
            </Card>

            <ProductUpdateStock
                opened={stockModalOpened}
                productId={product.id}
                businessID={selectedBusiness.id}
                currentStock={product.stock}
                onSuccess={(updatedProduct) => setProduct(updatedProduct)}
                onClose={() => setStockModalOpened(false)}
            />

            <ProductUpdateOrAddSupplier
                opened={supplierModalOpened}
                productId={product.id}
                businessID={selectedBusiness.id}
                currentProvider={product.supplier}
                onSuccess={(updatedProduct) => setProduct(updatedProduct)}
                onClose={() => setSupplierModalOpened(false)}
            />

            {product.supplier && (
                <ProductEraseSupplier
                    opened={eraseSupplierModalOpened}
                    productId={product.id}
                    businessID={selectedBusiness.id}
                    supplierName={product.supplier.name}
                    onSuccess={(updatedProduct) => setProduct(updatedProduct)}
                    onClose={() => setEraseSupplierModalOpened(false)}
                />
            )}

            <ProductDelete
                opened={deleteModalOpened}
                productId={product.id}
                businessID={selectedBusiness.id}
                productName={product.name}
                onClose={() => setDeleteModalOpened(false)}
            />
        </Stack>
    )
}

export default ProductDetail
