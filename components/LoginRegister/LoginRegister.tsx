import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { Button, Card, Checkbox, Group, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconLock, IconMail, IconUserCircle } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Helper from '@/services/helper'
import Users from '@/services/users'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'
import Validation from '@/utils/validation/Validation'

import Login from '@/entities/Login'
import Registration from '@/entities/Registration'
import User from '@/entities/User'
import SkeletonFull from '../Common/Loader/SkeletonFull'

interface LoginRegisterForm {
    email: string
    password: string
    confirmPassword?: string
    name?: string
    termsOfService: boolean
}

const LoginRegister = () => {
    const setNeedReload = useSessionReloadStore((state) => state.setNeedReload)
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    const [isRegistration, setIsRegistration] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        setLoading(false)
    }, [])

    const handleLoginRegister = async (
        loginRegisterData: LoginRegisterForm,
        isRegister: boolean,
        router: AppRouterInstance
    ) => {
        try {
            if (submitting) return

            setSubmitting(true)

            if (isRegister) {
                if (!loginRegisterData.name) return

                const registration: Registration = {
                    email: loginRegisterData.email,
                    password: loginRegisterData.password,
                    name: loginRegisterData.name,
                }

                const response: User = await Users.register(registration)
                if (!response?.email) {
                    throw new Error('Error registrando usuario')
                }

                setErrorMessage('')
                setNeedReload(true)

                router.push('/users/validation')
            }

            const login: Login = {
                email: loginRegisterData.email,
                password: loginRegisterData.password,
            }

            const response: User = await Users.login(login)
            if (!response?.email) {
                throw new Error('Error iniciando sesión')
            }

            setErrorMessage('')
            setNeedReload(true)

            if (response.validated) router.push('/businesses')
            else router.push('/users/validation')
        } catch (error) {
            setErrorMessage(Helper.parseError(error))
        } finally {
            setSubmitting(false)
        }
    }

    const form = useForm<LoginRegisterForm>({
        mode: 'controlled',
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            termsOfService: false,
        },

        validate: {
            email: (value) =>
                Validation.email(value) ? null : 'Email no válido',
            password: (value) =>
                !isRegistration
                    ? value.length > 0
                        ? null
                        : 'Debe especificar una contraseña'
                    : Validation.password(value)
                    ? null
                    : 'Contraseña no válida (Al menos una letra mayúscula, una letra minúscula, un número y un símbolo. 8 a 30 caracteres.)',
            confirmPassword: (value, values) =>
                !isRegistration || value === values.password
                    ? null
                    : 'Las contraseñas no coinciden',
            name: (value) =>
                !isRegistration || Validation.string(value)
                    ? null
                    : 'Debe ingresar un nombre',
            termsOfService: (value) =>
                !isRegistration || value === true
                    ? null
                    : 'Debe aceptar los términos y condiciones de servicio para registrarse',
        },
    })

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className={isMobile ? 'min-w-full' : 'w-screen-l'}>
            <Group justify="space-between" mt="md" mb="xs">
                <Text size="2rem">
                    {isRegistration ? 'Nueva cuenta' : 'Login'}
                </Text>
            </Group>
            <form
                onSubmit={form.onSubmit((values) =>
                    handleLoginRegister(values, isRegistration, router)
                )}>
                <TextInput
                    pt={'1rem'}
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    leftSection={<IconMail />}
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />

                <TextInput
                    pt={'1rem'}
                    withAsterisk
                    label="Contraseña"
                    placeholder="..."
                    leftSection={<IconLock />}
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />

                {isRegistration && (
                    <>
                        <TextInput
                            pt={'1rem'}
                            withAsterisk
                            label="Confirmar contraseña"
                            placeholder="..."
                            leftSection={<IconLock />}
                            key={form.key('confirmPassword')}
                            {...form.getInputProps('confirmPassword')}
                        />

                        <TextInput
                            pt={'1rem'}
                            withAsterisk
                            label="Nombre"
                            placeholder="John Doe"
                            leftSection={<IconUserCircle />}
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />

                        <Checkbox
                            pt={'1rem'}
                            mt="md"
                            label="Acepto los términos y condiciones de servicio"
                            key={form.key('termsOfService')}
                            {...form.getInputProps('termsOfService', {
                                type: 'checkbox',
                            })}
                        />
                    </>
                )}

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
                        onClick={() => setIsRegistration(!isRegistration)}>
                        {isRegistration
                            ? 'Ya tengo una cuenta'
                            : 'No tengo cuenta'}
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting
                            ? 'Cargando...'
                            : isRegistration
                            ? 'Registrarse'
                            : 'Iniciar sesión'}
                    </Button>
                </Group>
            </form>
        </Card>
    )
}

export default LoginRegister
