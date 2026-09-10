import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPhone, IconUser } from '@tabler/icons-react'

import Clients from '@/services/clients'
import Helper from '@/services/helper'
import Theme from '@/app/theme'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'
import Validation from '@/utils/validation/Validation'

import BusinessSelection from '@/components/Common/BusinessSelection'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputInteger from '@/components/Common/Inputs/InputInteger'
import InputText from '@/components/Common/Inputs/InputText'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Client from '@/entities/clients/Client'
import ClientCU from '@/entities/clients/ClientCU'

interface ClientCreateForm {
    name: string
    description: string
    email: string
    phone: string
}

const ClientCreate = () => {
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

    const form = useForm<ClientCreateForm>({
        mode: 'controlled',
        initialValues: {
            name: '',
            description: '',
            email: '',
            phone: '',
        },
        validate: {
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
            description: (value) =>
                Validation.string(value)
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

    const handleSubmit = async (values: ClientCreateForm) => {
        if (submitting || !selectedBusiness) return

        setSubmitting(true)
        try {
            const clientCreate: ClientCU = {
                ...values,
                businessID: selectedBusiness.id,
            }
            const response: Client = await Clients.createClient(clientCreate)
            if (!response?.id) throw new Error('Error creando cliente')

            setErrorMessage('')
            router.push('/clients')
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message:
                    'Error al crear el cliente. Inténtalo de nuevo más tarde.',
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
        return <BusinessSelection resourceName="clientes" />
    }

    return (
        <Stack gap="xs">
            <ButtonGoBack href="/clients" text="clientes" />

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Group mt="md" mb="xs">
                    <Title size="2rem">Nuevo cliente</Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputText
                        key={form.key('name')}
                        withAsterisk
                        label="Nombre"
                        placeholder="Nombre del cliente"
                        leftIcon={<IconUser />}
                        InputProps={{ ...form.getInputProps('name') }}
                    />

                    <InputDescription
                        key={form.key('description')}
                        withAsterisk
                        placeholder="Descripción del cliente"
                        InputProps={{ ...form.getInputProps('description') }}
                    />

                    <InputEmail
                        key={form.key('email')}
                        withAsterisk
                        InputProps={{ ...form.getInputProps('email') }}
                    />

                    <InputInteger
                        key={form.key('phone')}
                        name="phone"
                        withAsterisk
                        label="Teléfono"
                        placeholder="Número de teléfono"
                        leftIcon={<IconPhone />}
                        InputProps={{ ...form.getInputProps('phone') }}
                    />

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        text="cliente"
                        leftIcon={<IconUser size={20} />}
                        isCreate
                        submitting={submitting}
                        cancelHref="/clients"
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default ClientCreate
