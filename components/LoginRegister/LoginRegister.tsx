import React, { useState } from 'react'

import { Button, Card, Checkbox, Group, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconLock, IconMail, IconUserCircle } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Users from '@/services/users'
import Validation from '@/utils/validation/Validation'

import Login from '@/entities/Login'
import Registration from '@/entities/Registration'

const handleLoginRegister = async (
    loginRegisterData: LoginRegisterForm,
    isRegister: boolean
) => {
    try {
        if (isRegister) {
            if (!loginRegisterData.name) return

            const registration: Registration = {
                email: loginRegisterData.email,
                password: loginRegisterData.password,
                name: loginRegisterData.name,
            }

            const response = await Users.register(registration)
            // To-Do: handle token server-side and save it as http-only jwt cookie
            console.log('registration response OK')
            console.log(response)
            return response
        }

        const login: Login = {
            email: loginRegisterData.email,
            password: loginRegisterData.password,
        }

        const response = await Users.login(login)
        // To-Do: handle token server-side and save it as http-only jwt cookie
        console.log('login response OK')
        console.log(response)
        return response
    } catch (error) {
        console.error(error)
    }
}

interface LoginRegisterForm {
    email: string
    password: string
    confirmPassword?: string
    name?: string
    termsOfService: boolean
}

const LoginRegister = () => {
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

    const [isRegistration, setIsRegistration] = useState<boolean>(false)

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
                value === true
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
            <Group justify="space-between" mt="md" mb="xs">
                <Button
                    color="orange.6"
                    onClick={() => setIsRegistration(!isRegistration)}>
                    {isRegistration ? 'Ya tengo una cuenta' : 'No tengo cuenta'}
                </Button>
            </Group>
            <form
                onSubmit={form.onSubmit((values) =>
                    handleLoginRegister(values, isRegistration)
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
                    </>
                )}

                <Checkbox
                    pt={'1rem'}
                    mt="md"
                    label="I agree to terms of service"
                    key={form.key('termsOfService')}
                    {...form.getInputProps('termsOfService', {
                        type: 'checkbox',
                    })}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">
                        {isRegistration ? 'Registrarse' : 'Iniciar sesión'}
                    </Button>
                </Group>
            </form>
        </Card>
    )
}

export default LoginRegister
