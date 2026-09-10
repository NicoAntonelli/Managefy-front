import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    Card,
    Group,
    Stack,
    Text,
    Title,
    Button,
    Grid,
    Modal,
} from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Products from '@/services/products'
import Helper from '@/services/helper'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import SelectedBusinessBar from '@/components/Common/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import BusinessSelection from '@/components/Common/BusinessSelection'

import Product from '@/entities/products/Product'

const ProductDetail = () => {
    const params = useParams()
    const productId = params?.id ? Number(params.id) : null
    const router = useRouter()

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [deleteModalOpened, setDeleteModalOpened] = useState(false)

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
        console.log('Edit button')
    }

    const handleDelete = async () => {
        if (!product || !businessID) return

        setDeleting(true)
        try {
            await Products.deleteProduct(product.id, businessID)
            notifications.show({
                title: 'Éxito',
                message: 'Producto eliminado correctamente',
                color: Theme.other!.success,
            })
            router.push('/products')
        } catch (error) {
            const message = Helper.parseError(error)
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el producto',
                color: Theme.other!.danger,
            })
        } finally {
            setDeleting(false)
            setDeleteModalOpened(false)
        }
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessSelection resourceName="productos" />
    }

    if (!product) {
        return (
            <Stack gap="xs" style={{ width: '100%' }}>
                <SelectedBusinessBar business={selectedBusiness} />
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
            <SelectedBusinessBar business={selectedBusiness} />

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
                            {product.code || '-'}
                        </Text>
                    </div>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Descripción
                        </Text>
                        <Text c={product.description ? undefined : 'dimmed'}>
                            {product.description || '-'}
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
                                <Text size="lg">{product.stock}</Text>
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
                                    {product.stockMin ?? '-'}
                                </Text>
                            </div>

                            <div>
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
                                    {product.saleMinAmount ?? '-'}
                                </Text>
                            </div>

                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Proveedor
                                </Text>
                                <Text
                                    size="lg"
                                    c={
                                        product.supplier?.name
                                            ? undefined
                                            : 'dimmed'
                                    }>
                                    {product.supplier?.name || '-'}
                                </Text>
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
                        variant="outline"
                        leftSection={<IconTrash size={20} />}
                        onClick={() => setDeleteModalOpened(true)}>
                        Eliminar
                    </Button>
                </Group>
            </Card>

            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Eliminar producto"
                centered>
                <Text mb="lg">
                    ¿Estás seguro de que deseas eliminar el producto{' '}
                    <Text component="span" fw={700}>
                        {product.name}
                    </Text>
                    ?
                </Text>
                <Group justify="flex-end">
                    <Button
                        variant="default"
                        onClick={() => setDeleteModalOpened(false)}
                        disabled={deleting}>
                        Cancelar
                    </Button>
                    <Button
                        color={Theme.other!.danger}
                        onClick={handleDelete}
                        loading={deleting}>
                        Eliminar
                    </Button>
                </Group>
            </Modal>
        </Stack>
    )
}

export default ProductDetail
