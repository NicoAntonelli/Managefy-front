import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
    Button,
    Card,
    Checkbox,
    Group,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconArrowLeft,
    IconBook,
    IconBuildingStore,
    IconLink,
    IconWorld,
} from '@tabler/icons-react'

import Businesses from '@/services/businesses'
import Helper from '@/services/helper'
import TextHelper from '@/utils/string/TextHelper'
import Theme from '@/app/theme'
import Validation from '@/utils/validation/Validation'

import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Business from '@/entities/businesses/Business'
import WeekDay from '@/entities/helpTypes/WeekDay'

interface BusinessCreateForm {
    name: string
    description: string
    link: string
    isPublic: boolean
    businessDays: Record<WeekDay, boolean>
}

const initialBusinessDays: Record<WeekDay, boolean> = {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
}

const weekDayLabels: Record<WeekDay, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
}

const BusinessCreate = () => {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const suggestedLink = useRef('')
    const router = useRouter()

    useEffect(() => {
        setLoading(false)
    }, [])

    const form = useForm<BusinessCreateForm>({
        mode: 'controlled',
        initialValues: {
            name: '',
            description: '',
            link: '',
            isPublic: true,
            businessDays: initialBusinessDays,
        },
        validate: {
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
            description: (value) =>
                Validation.string(value)
                    ? null
                    : 'Debe ingresar una descripción',
            link: (value) =>
                Validation.urlSegment(value)
                    ? null
                    : 'Debe ingresar un enlace válido (por ejemplo, mi-emprendimiento)',
        },
    })

    const handleSubmit = async (values: BusinessCreateForm) => {
        if (submitting) return

        setSubmitting(true)
        try {
            const response: Business = await Businesses.createBusiness(values)
            if (!response?.id) throw new Error('Error creando emprendimiento')

            setErrorMessage('')
            router.push('/businesses')
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message:
                    'Error al crear el emprendimiento. Inténtalo de nuevo más tarde.',
                color: 'red',
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        form.getInputProps('name').onBlur(event)

        const name = event.currentTarget.value
        const currentLink = form.getValues().link

        if (
            Validation.string(name) &&
            (!currentLink || currentLink === suggestedLink.current)
        ) {
            const suggested = TextHelper.createUrlSegment(name)
            form.setFieldValue('link', suggested)
            suggestedLink.current = suggested
        }
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full">
            <Group justify="space-between" mt="md" mb="xs">
                <Title size="2rem">Nuevo emprendimiento</Title>
                <Button
                    component={Link}
                    href="/businesses"
                    variant="subtle"
                    color={Theme.primaryColor}
                    leftSection={<IconArrowLeft size={18} />}>
                    Volver a emprendimientos
                </Button>
            </Group>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    pt="1rem"
                    withAsterisk
                    label="Nombre"
                    placeholder="Mi emprendimiento"
                    leftSection={<IconBuildingStore />}
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                    onBlur={handleNameBlur}
                />

                <Textarea
                    pt="1rem"
                    withAsterisk
                    label="Descripción"
                    placeholder="¿A qué se dedica tu emprendimiento?"
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
                    label="Enlace personalizado"
                    placeholder="mi-emprendimiento"
                    leftSection={<IconLink />}
                    key={form.key('link')}
                    {...form.getInputProps('link')}
                />

                <Checkbox
                    pt="1rem"
                    mt="md"
                    label="Hacer público este emprendimiento"
                    key={form.key('isPublic')}
                    {...form.getInputProps('isPublic', { type: 'checkbox' })}
                />

                <Stack gap="xs" mt="lg">
                    <Text fw={500}>Días laborables</Text>
                    <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm">
                        {TextHelper.weekDaysComplete.map((day: WeekDay) => (
                            <Checkbox
                                key={day}
                                label={weekDayLabels[day]}
                                {...form.getInputProps(`businessDays.${day}`, {
                                    type: 'checkbox',
                                })}
                            />
                        ))}
                    </SimpleGrid>
                </Stack>

                {errorMessage && (
                    <Text c="red" size="sm" mt="md">
                        {errorMessage}
                    </Text>
                )}

                <Group justify="flex-end" mt="2rem">
                    <Button component={Link} href="/businesses" color="red">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        color={Theme.primaryColor}
                        leftSection={<IconWorld size={20} />}
                        disabled={submitting}>
                        {submitting ? 'Cargando...' : 'Crear emprendimiento'}
                    </Button>
                </Group>
            </form>
        </Card>
    )
}

export default BusinessCreate
