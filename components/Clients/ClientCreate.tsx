'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
    Button,
    Card,
    Group,
    Text,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconArrowLeft,
    IconBook,
    IconMail,
    IconPhone,
    IconUser,
} from '@tabler/icons-react'

import Clients from '@/services/clients'
import Helper from '@/services/helper'
import Theme from '@/app/theme'
import Validation from '@/utils/validation/Validation'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import BusinessSelection from '@/components/Common/BusinessSelection'

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
                Validation.integerString(value)
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
                color: 'red',
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
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full">
            <Group justify="space-between" mt="md" mb="xs">
                <Title size="2rem">Nuevo cliente</Title>
                <Button
                    component={Link}
                    href="/clients"
                    variant="subtle"
                    color={Theme.primaryColor}
                    leftSection={<IconArrowLeft size={18} />}>
                    Volver a clientes
                </Button>
            </Group>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    pt="1rem"
                    withAsterisk
                    label="Nombre"
                    placeholder="Nombre del cliente"
                    leftSection={<IconUser />}
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />

                <Textarea
                    pt="1rem"
                    withAsterisk
                    label="Descripción"
                    placeholder="Descripción del cliente"
                    autosize
                    minRows={3}
                    leftSection={<IconBook />}
                    styles={{
                        section: {
                            alignItems: 'flex-start',
                            paddingTop: '0.2rem',
                        },
                    }}
                    key={form.key('description')}
                    {...form.getInputProps('description')}
                />

                <TextInput
                    pt="1rem"
                    withAsterisk
                    type="email"
                    label="Email"
                    placeholder="client@example.com"
                    leftSection={<IconMail />}
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />

                <TextInput
                    pt="1rem"
                    withAsterisk
                    label="Teléfono"
                    placeholder="Número de teléfono"
                    leftSection={<IconPhone />}
                    key={form.key('phone')}
                    {...form.getInputProps('phone')}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(event) =>
                        form.setFieldValue(
                            'phone',
                            event.currentTarget.value.replace(/\D/g, '')
                        )
                    }
                />

                {errorMessage && (
                    <Text c="red" size="sm" mt="md">
                        {errorMessage}
                    </Text>
                )}

                <Group justify="flex-end" mt="2rem">
                    <Button component={Link} href="/clients" color="red">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        color={Theme.primaryColor}
                        leftSection={<IconUser size={20} />}
                        disabled={submitting}>
                        {submitting ? 'Cargando...' : 'Crear cliente'}
                    </Button>
                </Group>
            </form>
        </Card>
    )
}

export default ClientCreate
