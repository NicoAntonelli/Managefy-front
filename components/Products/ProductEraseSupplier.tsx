import { useState } from 'react'
import { Button, Group, Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import Products from '@/services/products'
import Theme from '@/app/theme'

import Product from '@/entities/products/Product'

interface ProductEraseSupplierProps {
    opened: boolean
    productId: number
    businessID: number
    supplierName: string
    onSuccess: (product: Product) => void
    onClose: () => void
}

const ProductEraseSupplier = (props: ProductEraseSupplierProps) => {
    const { opened, productId, businessID, supplierName } = props
    const { onSuccess, onClose } = props

    const [erasingSupplier, setErasingSupplier] = useState(false)

    const handleEraseSupplier = async () => {
        setErasingSupplier(true)
        try {
            await Products.eraseSupplierForProduct(productId, businessID)
            const updatedProduct = await Products.getOneProduct(
                productId,
                businessID
            )
            onSuccess(updatedProduct)
            notifications.show({
                title: 'Éxito',
                message: 'Proveedor quitado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo quitar el proveedor',
                color: Theme.other!.danger,
            })
        } finally {
            setErasingSupplier(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Quitar proveedor"
            centered>
            <Text mb="lg">
                ¿Estás seguro de que deseas quitar el proveedor{' '}
                <Text component="span" fw={700}>
                    {supplierName}
                </Text>
                ?
            </Text>
            <Group justify="flex-end">
                <Button
                    variant="default"
                    onClick={onClose}
                    disabled={erasingSupplier}>
                    Cancelar
                </Button>
                <Button
                    color={Theme.other!.danger}
                    onClick={handleEraseSupplier}
                    loading={erasingSupplier}>
                    Quitar
                </Button>
            </Group>
        </Modal>
    )
}

export default ProductEraseSupplier
