import React, { useEffect, useState } from 'react'
import { Button, Group, Modal, NumberInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import Products from '@/services/products'
import Helper from '@/services/helper'
import Theme from '@/app/theme'

import Product from '@/entities/products/Product'

interface ProductUpdateStockProps {
    opened: boolean
    onClose: () => void
    productId: number
    businessID: number
    currentStock: number
    onSuccess: (product: Product) => void
}

const ProductUpdateStock = (props: ProductUpdateStockProps) => {
    const { opened, onClose, productId, businessID, currentStock, onSuccess } =
        props

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
                productId,
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
            <Group justify="flex-end">
                <Button
                    variant="default"
                    onClick={onClose}
                    disabled={updatingStock}>
                    Cancelar
                </Button>
                <Button
                    color={Theme.primaryColor}
                    onClick={handleUpdateStock}
                    loading={updatingStock}
                    disabled={newStock === ''}>
                    Guardar
                </Button>
            </Group>
        </Modal>
    )
}

export default ProductUpdateStock
