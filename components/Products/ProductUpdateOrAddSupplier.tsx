import { useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

import Products from '@/services/products'
import Theme from '@/app/theme'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import SuppliersDropdown from '@/components/Suppliers/SuppliersDropdown'

import Product from '@/entities/products/Product'
import Supplier from '@/entities/suppliers/Supplier'

interface ProductUpdateOrAddSupplierProps {
    opened: boolean
    productId: number
    businessID: number
    currentProvider?: Supplier | null
    onSuccess: (product: Product) => void
    onClose: () => void
}

const ProductUpdateOrAddSupplier = (props: ProductUpdateOrAddSupplierProps) => {
    const { opened, productId, businessID, currentProvider } = props
    const { onSuccess, onClose } = props

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
                forceRefresh={isUpdate}
                onChange={setSelectedSupplier}
            />
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdateOrAddSupplier()
                }}>
                <ButtonsSubmitAndCancel
                    operation={isUpdate ? 'Update' : 'Create'}
                    operationText="Guardar"
                    leftIcon={<IconCheck />}
                    submitting={updatingSupplier}
                    disabled={!selectedSupplier}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default ProductUpdateOrAddSupplier
