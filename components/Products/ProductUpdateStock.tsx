import React, { useEffect, useState } from 'react'
import { Modal, NumberInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

import Products from '@/services/products'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import Product from '@/entities/products/Product'

interface ProductUpdateStockProps {
    opened: boolean
    productID: number
    businessID: number
    currentStock: number
    onSuccess: (product: Product) => void
    onClose: () => void
}

const ProductUpdateStock = (props: ProductUpdateStockProps) => {
    const { opened, productID, businessID, currentStock } = props
    const { onSuccess, onClose } = props

    const [newStock, setNewStock] = useState<number | ''>(currentStock)
    const [updatingStock, setUpdatingStock] = useState(false)

    useEffect(() => {
        if (opened) {
            setNewStock(currentStock)
        }
    }, [opened, currentStock])

    const handleUpdateStock = async () => {
        if (newStock === '') return

        setUpdatingStock(true)
        try {
            const response = await Products.updateProductStock(
                productID,
                businessID,
                newStock
            )
            onSuccess(response)
            notifications.show({
                title: 'Éxito',
                message: 'Stock actualizado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el stock',
                color: Theme.other!.danger,
            })
        } finally {
            setUpdatingStock(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Actualizar stock"
            centered>
            <NumberInput
                label="Stock"
                placeholder="Ingresá el nuevo stock"
                value={newStock}
                onChange={(value) =>
                    setNewStock(value === '' ? '' : Number(value))
                }
                allowNegative={false}
                allowDecimal={false}
                decimalScale={0}
                mb="lg"
            />
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdateStock()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Update"
                    operationText="Guardar"
                    leftIcon={<IconCheck />}
                    submitting={updatingStock}
                    disabled={newStock === ''}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default ProductUpdateStock
