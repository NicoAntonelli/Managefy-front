import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUserCog } from '@tabler/icons-react'

import Helper from '@/services/helper'
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
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Supplier from '@/entities/suppliers/Supplier'
import SupplierCU from '@/entities/suppliers/SupplierCU'

interface SupplierCreateUpdateForm {
    name: string
    description: string
    email: string
    phone: string
}

interface SupplierCreateUpdateProps {
    currentSupplier?: SupplierCU
    backHref?: string
    cancelHref?: string
    onSuccess?: (supplier: Supplier) => void
    onCancel?: () => void
}

const SupplierCreateUpdate = (props: SupplierCreateUpdateProps) => {
    const {
        currentSupplier,
        backHref = '/suppliers',
        cancelHref = '/suppliers',
        onSuccess,
        onCancel,
    } = props
    const isUpdate = !!currentSupplier

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter()

    useEffect(() => {
        setLoading(false)
    }, [])

    const form = useForm<SupplierCreateUpdateForm>({
        mode: 'controlled',
        initialValues: {
            name: currentSupplier?.name ?? '',
            description: currentSupplier?.description ?? '',
            email: currentSupplier?.email ?? '',
            phone: currentSupplier?.phone ?? '',
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
        },
    })

    const handleSubmit = async (values: SupplierCreateUpdateForm) => {
        if (submitting || !selectedBusiness) return

        setSubmitting(true)
        try {
            const supplierCU: SupplierCU = {
                id: currentSupplier?.id,
                ...values,
                businessID: selectedBusiness.id,
                productsIDs: currentSupplier?.productsIDs,
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
        return <BusinessWelcome resourceName="proveedores" />
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

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        operation={isUpdate ? 'Update' : 'Create'}
                        resource="proveedor"
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
