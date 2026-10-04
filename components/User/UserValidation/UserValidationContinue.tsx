import Link from 'next/link'
import { Button, Card, Stack, Text, Title } from '@mantine/core'
import { IconMailCheck, IconUser } from '@tabler/icons-react'

import Theme from '@/app/theme'

interface UserValidationContinueProps {
    isLogged: boolean | null
    isValidated: boolean | null
}

const UserValidationContinue = (props: UserValidationContinueProps) => {
    const { isLogged, isValidated } = props

    // User is not logged in
    if (!isLogged) {
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
    if (isValidated) return <></>

    // User is logged in but not validated
    return (
        <Card
            withBorder
            padding="lg"
            radius="md"
            w="100%"
            bg="light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))">
            <Stack align="center" gap="md">
                <Title size="1.5rem" ta="center">
                    Terminá la validación para continuar
                </Title>
                <Text ta="center" maw={480}>
                    Para continuar tenés que terminar el proceso de validación
                    de tu usuario.
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
        </Card>
    )
}

export default UserValidationContinue
