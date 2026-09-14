import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'

import Products from '@/services/products'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'

type ProductDeleteProps = {
    opened: boolean
    productID: number
    businessID: number
    productName: string
    onClose: () => void
}

const ProductDelete = (props: ProductDeleteProps) => {
    const { opened, productID, businessID, productName, onClose } = props

    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await Products.deleteProduct(productID, businessID)
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
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleDelete()
                }}>
                <ButtonsSubmitAndCancel
                    operation="Delete"
                    operationText="Eliminar"
                    leftIcon={<IconTrash />}
                    submitting={deleting}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default ProductDelete
