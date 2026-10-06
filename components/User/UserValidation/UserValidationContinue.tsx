import Link from 'next/link'
import { Button, Card, Stack, Text, Title } from '@mantine/core'
import { IconMailCheck, IconUser } from '@tabler/icons-react'

import CheckUserLogin from '@/entities/helpTypes/CheckUserLogin'
import Theme from '@/app/theme'

interface UserValidationContinueProps {
    checkUserLogin: CheckUserLogin
}

const UserValidationContinue = (props: UserValidationContinueProps) => {
    const { checkUserLogin } = props

    // User is not logged in
    if (!checkUserLogin.isLogged) {
        return (
            <Stack align="center" gap="md" py="xl">
                <Stack align="center" gap="md">
                    <Title size="1.5rem" ta="center">
                        Iniciá sesión o regístrate para continuar
                    </Title>
                    <Text ta="center" maw={480}>
                        Para continuar tenés que iniciar sesión en tu cuenta.
                    </Text>
                    <Button
                        color={Theme.primaryColor}
                        w={{ base: '100%', sm: 'fit-content' }}
                        leftSection={<IconUser size={24} />}
                        component={Link}
                        href="/users/loginRegister">
                        Ir a iniciar sesión o registrarse
                    </Button>
                </Stack>
            </Stack>
        )
    }

    // Don't show anything if the user is already validated
    if (checkUserLogin.isValidated) return <></>

    // User is logged in but not validated
    return (
        <Stack align="center" gap="md" py="xl">
            <Title size="2rem">Terminá la validación para continuar</Title>
            <Text ta="center" maw={480}>
                Para continuar tenés que terminar el proceso de validación de tu
                usuario.
            </Text>
            <Button
                color={Theme.primaryColor}
                w={{ base: '100%', sm: 'fit-content' }}
                leftSection={<IconMailCheck size={24} />}
                component={Link}
                href="/users/validation">
                Ir a validar usuario
            </Button>
        </Stack>
    )
}

export default UserValidationContinue
