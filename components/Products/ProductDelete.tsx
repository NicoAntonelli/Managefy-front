import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Group, Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import Products from '@/services/products'
import Theme from '@/app/theme'

type ProductDeleteProps = {
    opened: boolean
    productId: number
    businessID: number
    productName: string
    onClose: () => void
}

const ProductDelete = (props: ProductDeleteProps) => {
    const { opened, productId, businessID, productName, onClose } = props

    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await Products.deleteProduct(productId, businessID)
            notifications.show({
                title: 'Éxito',
                message: 'Producto eliminado correctamente',
                color: Theme.other!.success,
            })
            router.push('/products')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el producto',
                color: Theme.other!.danger,
            })
        } finally {
            setDeleting(false)
            onClose()
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Eliminar producto"
            centered>
            <Text mb="lg">
                ¿Estás seguro de que deseas eliminar el producto{' '}
                <Text component="span" fw={700}>
                    {productName}
                </Text>
                ?
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose} disabled={deleting}>
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
    )
}

export default ProductDelete
