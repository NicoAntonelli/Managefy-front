import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { Button, Card, Checkbox, Group, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconLock } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Helper from '@/services/helper'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'
import User from '@/entities/User'
import Users from '@/services/users'
import Validation from '@/utils/validation/Validation'

interface UserValidationForm {
    code?: number
}

const UserValidation = () => {
    const setNeedReload = useSessionReloadStore((state) => state.setNeedReload)

    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

    const router = useRouter()

    const [secondsRemaining, setSecondsRemaining] = useState<number>(0)
    const [sendingNewCode, setSendingNewCode] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    // Countdown effect
    useEffect(() => {
        if (secondsRemaining <= 0) return

        const interval = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [secondsRemaining])

    const handleGenerateValidation = async () => {
        if (secondsRemaining > 0 || sendingNewCode) return

        try {
            setSendingNewCode(true)
            setSecondsRemaining(60)

            const response: boolean = await Users.validationStart()
            if (!response) {
                throw new Error('Error validando usuario')
            }

            setErrorMessage('')
        } catch (error) {
            setErrorMessage(Helper.parseError(error))
        } finally {
            setSendingNewCode(false)
        }
    }

    const handleValidateUser = async (
        userValidationData: UserValidationForm,
        router: AppRouterInstance
    ) => {
        try {
            if (submitting) return

            setSubmitting(true)

            if (!userValidationData.code) return

            const validationCode: number = userValidationData.code

            const response: User = await Users.validate(validationCode)
            if (!response?.email) {
                throw new Error('Error validando usuario')
            }

            setErrorMessage('')
            setNeedReload(true)

            router.push('/businesses')
        } catch (error) {
            setErrorMessage(Helper.parseError(error))
        } finally {
            setSubmitting(false)
        }
    }

    const form = useForm<UserValidationForm>({
        mode: 'controlled',
        initialValues: { code: undefined },

        validate: {
            code: (value) =>
                value && Validation.integer(value)
                    ? null
                    : 'El código debe ser un número entero positivo',
        },
    })

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className={isMobile ? 'min-w-full' : 'w-screen-l'}>
            <Group justify="space-between" mt="md" mb="xs">
                <Text size="2rem">Validar cuenta</Text>
            </Group>
            <Group justify="space-between" mb="xs">
                <Text size="1rem">
                    Se enviará un código de validación a su correo electrónico
                </Text>
            </Group>
            <form
                onSubmit={form.onSubmit((values) =>
                    handleValidateUser(values, router)
                )}>
                <TextInput
                    pt={'1rem'}
                    withAsterisk
                    label="Código de validación"
                    placeholder="123456"
                    leftSection={<IconLock />}
                    key={form.key('code')}
                    {...form.getInputProps('code')}
                />

                {errorMessage && (
                    <>
                        <Group mt="md">
                            <Text c="red" size="sm">
                                {errorMessage}
                            </Text>
                        </Group>
                    </>
                )}

                <Group justify="flex-end" mt="md">
                    <Button
                        color="orange.6"
                        disabled={sendingNewCode || secondsRemaining > 0}
                        onClick={() => handleGenerateValidation()}>
                        {secondsRemaining > 0
                            ? `Reenviar código en ${secondsRemaining}s`
                            : sendingNewCode
                            ? 'Cargando...'
                            : 'Enviar código'}
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Cargando...' : 'Validar código'}
                    </Button>
                </Group>
            </form>
        </Card>
    )
}

export default UserValidation
