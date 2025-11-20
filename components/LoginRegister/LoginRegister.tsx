import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { Button, Card, Checkbox, Group, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconLock, IconMail, IconUserCircle } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Users from '@/services/users'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'
import Validation from '@/utils/validation/Validation'

import Login from '@/entities/Login'
import Registration from '@/entities/Registration'
import User from '@/entities/User'

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

    const router = useRouter()

    const [isRegistration, setIsRegistration] = useState<boolean>(false)

    const handleLoginRegister = async (
        loginRegisterData: LoginRegisterForm,
        isRegister: boolean,
        router: AppRouterInstance
    ) => {
        try {
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

                setNeedReload(true)

                router.push('/businesses')
            }

            const login: Login = {
                email: loginRegisterData.email,
                password: loginRegisterData.password,
            }

            const response: User = await Users.login(login)
            if (!response?.email) {
                throw new Error('Error iniciando sesión')
            }

            setNeedReload(true)

            router.push('/businesses')
        } catch (error) {
            console.error(error)
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
                Validation.email(value) ? null : 'Invalid email',
            password: (value) =>
                Validation.password(value)
                    ? null
                    : 'Invalid password (At least one uppercase letter, one lowercase letter, one number and one symbol. 8 to 30 characters.)',
            name: (value) =>
                !isRegistration || Validation.string(value)
                    ? null
                    : 'Name is required',
            termsOfService: (value) =>
                !isRegistration || value === true
                    ? null
                    : 'Accepting terms of service is required',
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
                    label="Password"
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
                            label="Confirm password"
                            placeholder="..."
                            leftSection={<IconLock />}
                            key={form.key('confirmPassword')}
                            {...form.getInputProps('confirmPassword')}
                        />

                        <TextInput
                            pt={'1rem'}
                            withAsterisk
                            label="Name"
                            placeholder="John Doe"
                            leftSection={<IconUserCircle />}
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />

                        <Checkbox
                            pt={'1rem'}
                            mt="md"
                            label="I agree to terms of service"
                            key={form.key('termsOfService')}
                            {...form.getInputProps('termsOfService', {
                                type: 'checkbox',
                            })}
                        />
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
                    <Button type="submit">
                        {isRegistration ? 'Registrarse' : 'Iniciar sesión'}
                    </Button>
                </Group>
            </form>
        </Card>
    )
}

export default LoginRegister
