import React, { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
    Card,
    Checkbox,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconBuildingStore, IconLink } from '@tabler/icons-react'

import Businesses from '@/services/businesses'
import Helper from '@/services/helper'
import TextHelper from '@/utils/string/TextHelper'
import Validation from '@/utils/validation/Validation'

import Theme from '@/app/theme'
import useGetUserOrAuthenticate from '@/hooks/users/useGetUserOrAuthenticate'

import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputText from '@/components/Common/Inputs/InputText'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Business from '@/entities/businesses/Business'
import BusinessCU from '@/entities/businesses/BusinessCU'
import WeekDay from '@/entities/helpTypes/WeekDay'

interface BusinessCreateUpdateProps {
    currentBusiness?: BusinessCU
    backHref?: string
    cancelHref?: string
    onSuccess?: (business: Business) => void
    onCancel?: () => void
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

const BusinessCreateUpdate = (props: BusinessCreateUpdateProps) => {
    const { currentBusiness } = props
    const { backHref = '/businesses', cancelHref = '/businesses' } = props
    const { onSuccess, onCancel } = props

    const isUpdate = !!currentBusiness

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const suggestedLink = useRef('')
    const router = useRouter()

    const { user } = useGetUserOrAuthenticate(true)

    const form = useForm<BusinessCU>({
        mode: 'controlled',
        initialValues: {
            name: currentBusiness?.name ?? '',
            description: currentBusiness?.description ?? '',
            link: currentBusiness?.link ?? '',
            isPublic: currentBusiness?.isPublic ?? true,
            businessDays: currentBusiness?.businessDays ?? initialBusinessDays,
        },
        validate: {
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
            description: (value) =>
                Validation.string(value, true)
                    ? null
                    : 'Debe ingresar una descripción',
            link: (value) =>
                Validation.urlSegment(value)
                    ? null
                    : 'Debe ingresar un enlace válido (por ejemplo, mi-emprendimiento)',
        },
    })

    useEffect(() => {
        setLoading(false)
    }, [])

    const handleSubmit = async (values: BusinessCU) => {
        if (submitting) return

        setSubmitting(true)
        try {
            values.id = currentBusiness?.id

            const response: Business = isUpdate
                ? await Businesses.updateBusiness(values)
                : await Businesses.createBusiness(values)
            if (!response?.id)
                throw new Error(
                    isUpdate
                        ? 'Error actualizando emprendimiento'
                        : 'Error creando emprendimiento'
                )

            setErrorMessage('')

            if (onSuccess) {
                onSuccess(response)
            } else {
                router.push(
                    isUpdate
                        ? `/businesses/${currentBusiness?.id}`
                        : '/businesses'
                )
            }
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'Error al actualizar el emprendimiento. Inténtalo de nuevo más tarde.'
                    : 'Error al crear el emprendimiento. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
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

    if (loading || !user) {
        return <SkeletonFull />
    }

    return (
        <Stack gap="xs" w="100%" maw="40rem" mx="auto">
            <ButtonGoBack
                href={backHref}
                text={isUpdate ? 'emprendimiento detalle' : 'emprendimientos'}
                onClick={onCancel}
            />

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Group mt="md" mb="xs">
                    <Title size="2rem">
                        {isUpdate
                            ? 'Editar emprendimiento'
                            : 'Nuevo emprendimiento'}
                    </Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputText
                        key={form.key('name')}
                        required
                        label="Nombre"
                        placeholder="Mi emprendimiento"
                        leftIcon={<IconBuildingStore />}
                        InputProps={{
                            ...form.getInputProps('name'),
                            onBlur: handleNameBlur,
                        }}
                    />

                    <InputDescription
                        key={form.key('description')}
                        required
                        placeholder="Describe tu emprendimiento"
                        InputProps={{ ...form.getInputProps('description') }}
                    />

                    <InputText
                        key={form.key('link')}
                        required
                        label="Enlace personalizado"
                        placeholder="mi-emprendimiento"
                        leftIcon={<IconLink />}
                        InputProps={{ ...form.getInputProps('link') }}
                    />

                    <Checkbox
                        key={form.key('isPublic')}
                        pt="1rem"
                        mt="md"
                        label="Hacer público este emprendimiento"
                        {...form.getInputProps('isPublic', {
                            type: 'checkbox',
                        })}
                    />

                    <Stack gap="xs" mt="lg">
                        <Text fw={500}>Días laborables</Text>
                        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm">
                            {TextHelper.weekDaysComplete.map((day: WeekDay) => (
                                <Checkbox
                                    key={day}
                                    label={weekDayLabels[day]}
                                    {...form.getInputProps(
                                        `businessDays.${day}`,
                                        {
                                            type: 'checkbox',
                                        }
                                    )}
                                />
                            ))}
                        </SimpleGrid>
                    </Stack>

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        operation={isUpdate ? 'Update' : 'Create'}
                        resourceName="emprendimiento"
                        leftIcon={<IconBuildingStore size={20} />}
                        submitting={submitting}
                        cancelHref={cancelHref}
                        onCancel={onCancel}
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default BusinessCreateUpdate
