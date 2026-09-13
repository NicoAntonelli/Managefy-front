import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, Card, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { IconMail, IconPencil, IconPhone, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Suppliers from '@/services/suppliers'
import Products from '@/services/products'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ProductsCompactTable from '@/components/Products/ProductsCompactTable'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import SupplierCreateUpdate from '@/components/Suppliers/SupplierCreateUpdate'
import SupplierDelete from '@/components/Suppliers/SupplierDelete'

import Supplier from '@/entities/suppliers/Supplier'
import SupplierCU from '@/entities/suppliers/SupplierCU'
import Product from '@/entities/products/Product'

const SupplierDetail = () => {
    const params = useParams()
    const supplierId = params?.id ? Number(params.id) : null

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id

    const [supplier, setSupplier] = useState<Supplier | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (!supplierId || !businessID) {
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                const [supplierData, productsData] = await Promise.all([
                    Suppliers.getOneSupplier(supplierId, businessID),
                    Products.listProductsBySupplier(businessID, supplierId),
                ])
                setSupplier(supplierData)
                setProducts(productsData || [])
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'No se pudo cargar el proveedor',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [supplierId, businessID])

    const handleEdit = () => {
        if (!supplier) return
        setEditing(true)
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="proveedores" />
    }

    if (supplier && editing) {
        const supplierCU: SupplierCU = {
            id: supplier.id,
            name: supplier.name,
            description: supplier.description,
            email: supplier.email,
            phone: supplier.phone,
            businessID: selectedBusiness.id,
            productsIDs: products.map((p) => p.id),
        }

        return (
            <SupplierCreateUpdate
                currentSupplier={supplierCU}
                backHref={`/suppliers/${supplier.id}`}
                cancelHref={`/suppliers/${supplier.id}`}
                onCancel={() => setEditing(false)}
                onSuccess={(updatedSupplier) => {
                    setSupplier(updatedSupplier)
                    setEditing(false)
                    if (businessID && supplier.id) {
                        Products.listProductsBySupplier(businessID, supplier.id)
                            .then((p) => setProducts(p || []))
                            .catch(() => {})
                    }
                }}
            />
        )
    }

    if (!supplier) {
        return (
            <Stack gap="xs" style={{ width: '100%' }}>
                <SelectedBusinessBar business={selectedBusiness} hideFilter />
                <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                    <ButtonGoBack href="/suppliers" text="proveedores" />
                </div>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="min-w-full">
                    <Text c="dimmed">Proveedor no encontrado</Text>
                </Card>
            </Stack>
        )
    }

    return (
        <Stack gap="xs" style={{ width: '100%' }}>
            <SelectedBusinessBar business={selectedBusiness} hideFilter />

            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <ButtonGoBack href="/suppliers" text="proveedores" />
            </div>

            <div style={{ marginBottom: 'var(--mantine-spacing-sm)' }}>
                <ButtonCreate href="/suppliers/new" resourceName="proveedor" />
            </div>

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Stack gap="xs" mb="md">
                    <Title size="2rem">{supplier.name}</Title>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Descripción
                        </Text>
                        <Text c={supplier.description ? undefined : 'dimmed'}>
                            {supplier.description || 'Sin asignar'}
                        </Text>
                    </div>
                </Stack>

                <Grid mb="lg">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Email
                                </Text>
                                <Group gap="xs" align="center">
                                    <IconMail size={18} />
                                    <Text
                                        size="lg"
                                        c={
                                            supplier.email
                                                ? undefined
                                                : 'dimmed'
                                        }>
                                        {supplier.email || 'Sin asignar'}
                                    </Text>
                                </Group>
                            </div>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap="md">
                            <div>
                                <Text size="sm" fw={500} c="dimmed">
                                    Teléfono
                                </Text>
                                <Group gap="xs" align="center">
                                    <IconPhone size={18} />
                                    <Text
                                        size="lg"
                                        c={
                                            supplier.phone
                                                ? undefined
                                                : 'dimmed'
                                        }>
                                        {supplier.phone || 'Sin asignar'}
                                    </Text>
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

            <ProductsCompactTable products={products} resource="proveedor" />

            <SupplierDelete
                opened={deleteModalOpened}
                supplierId={supplier.id}
                businessID={selectedBusiness.id}
                supplierName={supplier.name}
                onClose={() => setDeleteModalOpened(false)}
            />
        </Stack>
    )
}

export default SupplierDetail
