import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import {
    Anchor,
    Button,
    Card,
    Checkbox,
    Group,
    Modal,
    Text,
    Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconUserCircle } from '@tabler/icons-react'

import Helper from '@/services/helper'
import Users from '@/services/users'
import Theme from '@/app/theme'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'
import Validation from '@/utils/validation/Validation'

import Login from '@/entities/users/Login'
import Registration from '@/entities/users/Registration'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputPassword from '@/components/Common/Inputs/InputPassword'
import InputText from '@/components/Common/Inputs/InputText'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import TermsConditions from '@/components/Help/TermsConditions'
import User from '@/entities/users/User'

interface LoginRegisterForm {
    email: string
    password: string
    confirmPassword?: string
    name?: string
    termsOfService: boolean
}

const LoginRegister = () => {
    const setNeedReload = useSessionReloadStore((state) => state.setNeedReload)
    const [opened, { open, close }] = useDisclosure(false)

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    const [isRegistration, setIsRegistration] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        setLoading(false)
    }, [])

    const toggleForm = () => {
        setIsRegistration(!isRegistration)
        setErrorMessage('')
        form.clearErrors()
    }

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
            notifications.show({
                title: 'Error',
                message:
                    'Error al iniciar sesión o registrar al usuario. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
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
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Group justify="space-between" mt="md" mb="xs">
                    <Title size="2rem">
                        {isRegistration ? 'Nueva cuenta' : 'Iniciar sesión'}
                    </Title>
                </Group>
                <form
                    onSubmit={form.onSubmit((values) =>
                        handleLoginRegister(values, isRegistration, router)
                    )}>
                    <InputEmail
                        key={form.key('email')}
                        required
                        InputProps={{ ...form.getInputProps('email') }}
                    />

                    <InputPassword
                        key={form.key('password')}
                        required
                        InputProps={{ ...form.getInputProps('password') }}
                    />

                    {isRegistration && (
                        <>
                            <InputPassword
                                key={form.key('confirmPassword')}
                                required
                                isConfirmation
                                InputProps={{
                                    ...form.getInputProps('confirmPassword'),
                                }}
                            />

                            <InputText
                                key={form.key('name')}
                                required
                                label="Nombre"
                                placeholder="John Doe"
                                leftIcon={<IconUserCircle />}
                                InputProps={{ ...form.getInputProps('name') }}
                            />

                            <Checkbox
                                pt={'1rem'}
                                mt="md"
                                size="1rem"
                                label={
                                    <>
                                        Acepto los{' '}
                                        <Anchor
                                            size="1rem"
                                            target="_blank"
                                            underline="hover"
                                            c={Theme.other!.secondaryColor}
                                            onClick={open}>
                                            términos y condiciones de servicio
                                        </Anchor>
                                    </>
                                }
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
                                <Text c={Theme.other!.danger} size="sm">
                                    {errorMessage}
                                </Text>
                            </Group>
                        </>
                    )}

                    <Group justify="flex-end" mt="lg">
                        <Button
                            color={Theme.other!.secondaryColor}
                            onClick={() => toggleForm()}>
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

            <Modal
                opened={opened}
                onClose={close}
                size="75vw"
                title={
                    <Title size="1.5rem">Términos y condiciones de uso</Title>
                }
                centered>
                <TermsConditions />
            </Modal>
        </>
    )
}

export default LoginRegister
