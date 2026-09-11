import { useEffect, useState } from 'react'
import { Button, Group, Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import Products from '@/services/products'
import Helper from '@/services/helper'
import Theme from '@/app/theme'

import SuppliersDropdown from '@/components/Suppliers/SuppliersDropdown'

import Product from '@/entities/products/Product'
import Supplier from '@/entities/suppliers/Supplier'

interface ProductUpdateOrAddSupplierProps {
    opened: boolean
    onClose: () => void
    productId: number
    businessID: number
    currentProvider?: Supplier | null
    onSuccess: (product: Product) => void
}

const ProductUpdateOrAddSupplier = (props: ProductUpdateOrAddSupplierProps) => {
    const {
        opened,
        onClose,
        productId,
        businessID,
        currentProvider,
        onSuccess,
    } = props

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        currentProvider ?? null
    )
    const [updatingSupplier, setUpdatingSupplier] = useState(false)

    const isUpdate = !!currentProvider

    useEffect(() => {
        if (opened) {
            setSelectedSupplier(currentProvider ?? null)
        }
    }, [opened, currentProvider])

    const handleUpdateOrAddSupplier = async () => {
        if (!selectedSupplier) return

        setUpdatingSupplier(true)
        try {
            await Products.updateOrAddSupplierForProduct(
                productId,
                businessID,
                selectedSupplier.id
            )
            const updatedProduct = await Products.getOneProduct(
                productId,
                businessID
            )
            onSuccess(updatedProduct)
            notifications.show({
                title: 'Éxito',
                message: isUpdate
                    ? 'Proveedor actualizado correctamente'
                    : 'Proveedor agregado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'No se pudo actualizar el proveedor'
                    : 'No se pudo agregar el proveedor',
                color: Theme.other!.danger,
            })
        } finally {
            setUpdatingSupplier(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isUpdate ? 'Actualizar proveedor' : 'Agregar proveedor'}
            centered>
            <SuppliersDropdown
                key={`${isUpdate ? 'update' : 'add'}-${currentProvider?.id ?? 'none'}`}
                businessID={businessID}
                initialSupplier={currentProvider}
                onChange={setSelectedSupplier}
            />
            <Group justify="flex-end" mt="lg">
                <Button
                    variant="default"
                    onClick={onClose}
                    disabled={updatingSupplier}>
                    Cancelar
                </Button>
                <Button
                    color={Theme.primaryColor}
                    onClick={handleUpdateOrAddSupplier}
                    loading={updatingSupplier}
                    disabled={!selectedSupplier}>
                    Guardar
                </Button>
            </Group>
        </Modal>
    )
}

export default ProductUpdateOrAddSupplier
