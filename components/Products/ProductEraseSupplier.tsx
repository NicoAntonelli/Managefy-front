import { useState } from 'react'
import { Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'

import Products from '@/services/products'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

import Product from '@/entities/products/Product'

interface ProductEraseSupplierProps {
    opened: boolean
    productID: number
    businessID: number
    supplierName: string
    productName?: string
    onSuccess: (product: Product) => void
    onClose: () => void
}

const ProductEraseSupplier = (props: ProductEraseSupplierProps) => {
    const { opened, productID, businessID, supplierName, productName } = props
    const { onSuccess, onClose } = props

    const [erasingSupplier, setErasingSupplier] = useState(false)

    const handleEraseSupplier = async () => {
        setErasingSupplier(true)
        try {
            await Products.eraseSupplierForProduct(productID, businessID)
            const updatedProduct = await Products.getOneProduct(
                productID,
                businessID
            )
            onSuccess(updatedProduct)
            notifications.show({
                title: 'Éxito',
                message: 'Proveedor removido del producto correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo remover el proveedor del producto',
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
            title="Remover proveedor"
            centered>
            <Text mb="lg">
                ¿Estás seguro de que deseas remover el proveedor{' '}
                <Text component="span" fw={700}>
                    {supplierName}
                </Text>
                {productName && (
                    <>
                        {' '}
                        del producto{' '}
                        <Text component="span" fw={700}>
                            {productName}
                        </Text>
                    </>
                )}
                ?
            </Text>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleEraseSupplier()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Delete"
                    operationText="Remover"
                    leftIcon={<IconX />}
                    submitting={erasingSupplier}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default ProductEraseSupplier
