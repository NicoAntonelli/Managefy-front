import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUserDollar } from '@tabler/icons-react'

import Clients from '@/services/clients'
import Helper from '@/services/helper'
import Sales from '@/services/sales'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'
import Validation from '@/utils/validation/Validation'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputPhone from '@/components/Common/Inputs/InputPhone'
import InputText from '@/components/Common/Inputs/InputText'
import SalesSelectionArea from '@/components/Sales/SalesSelectionArea'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Client from '@/entities/clients/Client'
import ClientCU from '@/entities/clients/ClientCU'

interface ClientCreateUpdateForm {
    name: string
    description: string
    email: string
    phone: string
    salesIDs: number[]
}

interface ClientCreateUpdateProps {
    currentClient?: ClientCU
    backHref?: string
    cancelHref?: string
    onSuccess?: (client: Client) => void
    onCancel?: () => void
}

const ClientCreateUpdate = (props: ClientCreateUpdateProps) => {
    const {
        currentClient,
        backHref = '/clients',
        cancelHref = '/clients',
        onSuccess,
        onCancel,
    } = props
    const isUpdate = !!currentClient

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [lockedSaleIDs, setLockedSaleIDs] = useState<number[]>(
        currentClient?.salesIDs ?? []
    )

    const router = useRouter()

    const form = useForm<ClientCreateUpdateForm>({
        mode: 'controlled',
        initialValues: {
            name: currentClient?.name ?? '',
            description: currentClient?.description ?? '',
            email: currentClient?.email ?? '',
            phone: currentClient?.phone ?? '',
            salesIDs: currentClient?.salesIDs ?? [],
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
            salesIDs: (value) =>
                value && value.length > 0
                    ? null
                    : 'Debe seleccionar al menos una venta',
        },
    })

    useEffect(() => {
        setLoading(false)

        if (
            isUpdate &&
            currentClient?.id &&
            selectedBusiness?.id &&
            (!currentClient.salesIDs || currentClient.salesIDs.length === 0)
        ) {
            Sales.listSalesByClient(selectedBusiness.id, currentClient.id)
                .then((sales) => {
                    if (sales?.length) {
                        const saleIDs = sales.map((s) => s.id)
                        form.setFieldValue('salesIDs', saleIDs)
                        setLockedSaleIDs(saleIDs)
                    }
                })
                .catch(() => {})
        }
    }, [currentClient?.id, selectedBusiness?.id])

    const handleSubmit = async (values: ClientCreateUpdateForm) => {
        if (submitting || !selectedBusiness) return

        setSubmitting(true)
        try {
            const clientCU: ClientCU = {
                id: currentClient?.id,
                name: values.name,
                description: values.description,
                email: values.email,
                phone: values.phone,
                businessID: selectedBusiness.id,
                salesIDs: values.salesIDs,
            }
            const response: Client = isUpdate
                ? await Clients.updateClient(clientCU)
                : await Clients.createClient(clientCU)
            if (!response?.id)
                throw new Error(
                    isUpdate
                        ? 'Error actualizando cliente'
                        : 'Error creando cliente'
                )

            setErrorMessage('')

            if (onSuccess) {
                onSuccess(response)
            } else {
                router.push(
                    isUpdate ? `/clients/${currentClient.id}` : '/clients'
                )
            }
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'Error al actualizar el cliente. Inténtalo de nuevo más tarde.'
                    : 'Error al crear el cliente. Inténtalo de nuevo más tarde.',
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
        return <BusinessWelcome resourceName="clientes" />
    }

    return (
        <Stack gap="xs" w="100%" maw="40rem" mx="auto">
            <ButtonGoBack
                href={backHref}
                text={isUpdate ? 'cliente detalle' : 'clientes'}
                onClick={onCancel}
            />

            <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Group mt="md" mb="xs">
                    <Title size="2rem">
                        {isUpdate ? 'Editar cliente' : 'Nuevo cliente'}
                    </Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputText
                        key={form.key('name')}
                        required
                        label="Nombre"
                        placeholder="Nombre del cliente"
                        leftIcon={<IconUserDollar />}
                        InputProps={{ ...form.getInputProps('name') }}
                    />

                    <InputDescription
                        key={form.key('description')}
                        required
                        placeholder="Descripción del cliente"
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

                    <SalesSelectionArea
                        key={form.key('salesIDs')}
                        businessID={selectedBusiness.id}
                        selectedSaleIDs={form.values.salesIDs}
                        lockedSaleIDs={isUpdate ? lockedSaleIDs : []}
                        required
                        error={form.errors.salesIDs as string}
                        onChange={(saleIDs) =>
                            form.setFieldValue('salesIDs', saleIDs)
                        }
                    />

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        operation={isUpdate ? 'Update' : 'Create'}
                        resource="cliente"
                        leftIcon={<IconUserDollar size={20} />}
                        submitting={submitting}
                        cancelHref={cancelHref}
                        onCancel={onCancel}
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default ClientCreateUpdate
