import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUserCog } from '@tabler/icons-react'

import Helper from '@/services/helper'
import Products from '@/services/products'
import Suppliers from '@/services/suppliers'
import Theme from '@/app/theme'
import Validation from '@/utils/validation/Validation'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputPhone from '@/components/Common/Inputs/InputPhone'
import InputText from '@/components/Common/Inputs/InputText'
import ProductsSelectionArea from '@/components/Products/ProductsSelectionArea'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Supplier from '@/entities/suppliers/Supplier'
import SupplierCU from '@/entities/suppliers/SupplierCU'

interface SupplierCreateUpdateForm {
    name: string
    description: string
    email: string
    phone: string
    productsIDs: number[]
}

interface SupplierCreateUpdateProps {
    currentSupplier?: SupplierCU
    backHref?: string
    cancelHref?: string
    onSuccess?: (supplier: Supplier) => void
    onCancel?: () => void
}

const SupplierCreateUpdate = (props: SupplierCreateUpdateProps) => {
    const { currentSupplier } = props
    const { backHref = '/suppliers', cancelHref = '/suppliers' } = props
    const { onSuccess, onCancel } = props

    const isUpdate = !!currentSupplier

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [lockedProductIDs, setLockedProductIDs] = useState<number[]>(
        currentSupplier?.productsIDs ?? []
    )

    const router = useRouter()

    const form = useForm<SupplierCreateUpdateForm>({
        mode: 'controlled',
        initialValues: {
            name: currentSupplier?.name ?? '',
            description: currentSupplier?.description ?? '',
            email: currentSupplier?.email ?? '',
            phone: currentSupplier?.phone ?? '',
            productsIDs: currentSupplier?.productsIDs ?? [],
        },
        validate: {
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
            description: (value) =>
                Validation.string(value, true)
                    ? null
                    : 'Debe ingresar una descripción',
            email: (value) =>
                Validation.email(value)
                    ? null
                    : 'Debe ingresar un correo válido',
            phone: (value) =>
                Validation.phone(value)
                    ? null
                    : 'Debe ingresar un teléfono válido',
            productsIDs: (value) =>
                value && value.length > 0
                    ? null
                    : 'Debe seleccionar al menos un producto',
        },
    })

    useEffect(() => {
        setLoading(false)

        if (
            isUpdate &&
            currentSupplier?.id &&
            selectedBusiness?.id &&
            (!currentSupplier.productsIDs ||
                currentSupplier.productsIDs.length === 0)
        ) {
            Products.listProductsBySupplier(
                selectedBusiness.id,
                currentSupplier.id
            )
                .then((products) => {
                    if (products?.length) {
                        const productIDs = products.map((p) => p.id)
                        form.setFieldValue('productsIDs', productIDs)
                        setLockedProductIDs(productIDs)
                    }
                })
                .catch(() => {})
        }
    }, [currentSupplier?.id, selectedBusiness?.id])

    const handleSubmit = async (values: SupplierCreateUpdateForm) => {
        if (submitting || !selectedBusiness) return

        setSubmitting(true)
        try {
            const supplierCU: SupplierCU = {
                id: currentSupplier?.id,
                name: values.name,
                description: values.description,
                email: values.email,
                phone: values.phone,
                businessID: selectedBusiness.id,
                productsIDs: values.productsIDs,
            }
            const response: Supplier = isUpdate
                ? await Suppliers.updateSupplier(supplierCU)
                : await Suppliers.createSupplier(supplierCU)
            if (!response?.id)
                throw new Error(
                    isUpdate
                        ? 'Error actualizando proveedor'
                        : 'Error creando proveedor'
                )

            setErrorMessage('')

            if (onSuccess) {
                onSuccess(response)
            } else {
                router.push(
                    isUpdate ? `/suppliers/${currentSupplier.id}` : '/suppliers'
                )
            }
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'Error al actualizar el proveedor. Inténtalo de nuevo más tarde.'
                    : 'Error al crear el proveedor. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="proveedor" />
    }

    return (
        <Stack gap="xs" w="100%" maw="40rem" mx="auto">
            <ButtonGoBack
                href={backHref}
                text={isUpdate ? 'proveedor detalle' : 'proveedores'}
                onClick={onCancel}
            />

            <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Group mt="md" mb="xs">
                    <Title size="2rem">
                        {isUpdate ? 'Editar proveedor' : 'Nuevo proveedor'}
                    </Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputText
                        key={form.key('name')}
                        required
                        label="Nombre"
                        placeholder="Nombre del proveedor"
                        leftIcon={<IconUserCog />}
                        InputProps={{ ...form.getInputProps('name') }}
                    />

                    <InputDescription
                        key={form.key('description')}
                        required
                        placeholder="Descripción del proveedor"
                        InputProps={{ ...form.getInputProps('description') }}
                    />

                    <InputEmail
                        key={form.key('email')}
                        required
                        InputProps={{ ...form.getInputProps('email') }}
                    />

                    <InputPhone
                        key={form.key('phone')}
                        name="phone"
                        required
                        InputProps={{ ...form.getInputProps('phone') }}
                    />

                    <ProductsSelectionArea
                        key={form.key('productsIDs')}
                        businessID={selectedBusiness.id}
                        selectedProductIDs={form.values.productsIDs}
                        lockedProductIDs={isUpdate ? lockedProductIDs : []}
                        required
                        error={form.errors.productsIDs as string}
                        onChange={(productIDs) =>
                            form.setFieldValue('productsIDs', productIDs)
                        }
                    />

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        operation={isUpdate ? 'Update' : 'Create'}
                        resourceName="proveedor"
                        leftIcon={<IconUserCog size={20} />}
                        submitting={submitting}
                        cancelHref={cancelHref}
                        onCancel={onCancel}
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default SupplierCreateUpdate
