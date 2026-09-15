import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
    Button,
    Card,
    Checkbox,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
    IconAlertTriangle,
    IconCircleCheck,
    IconUserCircle,
} from '@tabler/icons-react'

import Helper from '@/services/helper'
import Users from '@/services/users'
import Theme from '@/app/theme'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'
import Validation from '@/utils/validation/Validation'

import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputPassword from '@/components/Common/Inputs/InputPassword'
import InputText from '@/components/Common/Inputs/InputText'
import User from '@/entities/users/User'
import UserU from '@/entities/users/UserU'

interface ProfileForm {
    email: string
    password: string
    confirmPassword: string
    name: string
    emailNotifications: boolean
}

const Profile = () => {
    const needReload = useSessionReloadStore((state) => state.needReload)
    const setNeedReload = useSessionReloadStore((state) => state.setNeedReload)
    const [opened, { open, close }] = useDisclosure(false)

    // User data needed for profile edition
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    const [submitting, setSubmitting] = useState<boolean>(false)
    const [finalized, setFinalized] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await Helper.getUserOrAuthenticate(router, true)
                setCurrentUser(user)
                if (user) setFormInitialValues(user)
            } catch (error) {
                setCurrentUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [needReload])

    const setFormInitialValues = (user: User) => {
        form.setValues({
            email: user.email || '',
            password: '',
            confirmPassword: '',
            name: user.name || '',
            emailNotifications: user.emailNotifications ?? false,
        })

        if (form.resetDirty) form.resetDirty()
    }

    const handleUpdateUser = async (profileData: ProfileForm) => {
        try {
            if (submitting) return
            if (!currentUser) return

            setSubmitting(true)

            const userUpdate: UserU = {
                id: currentUser.id,
                email: profileData.email,
                password: profileData.password,
                name: profileData.name,
                emailNotifications: profileData.emailNotifications,
            }

            const response: User = await Users.updateUser(userUpdate)
            if (!response?.email) {
                throw new Error('Error actualizando usuario')
            }

            setErrorMessage('')
            setNeedReload(true)
            setFinalized(true)
        } catch (error) {
            setErrorMessage(Helper.parseError(error))
            notifications.show({
                title: 'Error',
                message:
                    'Error al actualizar el perfil de usuario. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = () => async () => {
        try {
            if (submitting) return
            if (!currentUser) return

            setSubmitting(true)

            const response: number = await Users.deleteUser()
            if (!response) {
                throw new Error('Error eliminando cuenta de usuario')
            }

            await Users.sessionDelete()
            setCurrentUser(null)

            setErrorMessage('')
            setNeedReload(true)
            router.push('/users/loginRegister')
        } catch (error) {
            setErrorMessage(Helper.parseError(error))
            notifications.show({
                title: 'Error',
                message:
                    'Error al eliminar la cuenta de usuario. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const form = useForm<ProfileForm>({
        mode: 'controlled',
        initialValues: {
            email: currentUser?.email || '',
            password: '',
            confirmPassword: '',
            name: currentUser?.name || '',
            emailNotifications: currentUser?.emailNotifications || false,
        },

        validate: {
            email: (value) =>
                Validation.email(value) ? null : 'Email no válido',
            password: (value) =>
                Validation.password(value)
                    ? null
                    : 'Contraseña no válida (Al menos una letra mayúscula, una letra minúscula, un número y un símbolo. 8 a 30 caracteres.)',
            confirmPassword: (value, values) =>
                value === values.password
                    ? null
                    : 'Las contraseñas no coinciden',
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
        },
    })

    if (finalized) {
        return (
            <Stack w="100%" maw="60rem" mx="auto">
                <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                    <Group justify="space-between" mt="md" mb="xs">
                        <Title size="2rem">Editar perfil</Title>
                    </Group>
                    <Group
                        justify="flex-start"
                        mt="md"
                        mb="xs"
                        c={Theme.other!.success}>
                        <IconCircleCheck size="2rem" />
                        <Text size="1.5rem">
                            Tu perfil ha sido actualizado correctamente
                        </Text>
                    </Group>
                    <Group justify="flex-end" mt="md">
                        <Button onClick={() => router.push('/businesses')}>
                            Ir a Emprendimientos
                        </Button>
                    </Group>
                </Card>
            </Stack>
        )
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Stack w="100%" maw="60rem" mx="auto">
            <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Group justify="space-between" mt="md" mb="xs">
                    <Title size="2rem">Editar perfil</Title>
                </Group>
                <Group justify="space-between" mb="xs">
                    <Text size="1rem">
                        Puede utilizar la misma o una nueva contraseña
                    </Text>
                </Group>
                <form
                    onSubmit={form.onSubmit((values) =>
                        handleUpdateUser(values)
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
                        label="Recibir notificaciones por email"
                        key={form.key('emailNotifications')}
                        {...form.getInputProps('emailNotifications', {
                            type: 'checkbox',
                        })}
                    />

                    {errorMessage && (
                        <>
                            <Group mt="md">
                                <Text c={Theme.other!.danger} size="sm">
                                    {errorMessage}
                                </Text>
                            </Group>
                        </>
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" loading={submitting}>
                            Guardar cambios
                        </Button>
                    </Group>
                </form>
            </Card>
            <Card
                mt="3rem"
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                w="100%">
                <Group justify="space-between" mt="md" mb="xs">
                    <Title size="2rem">Eliminar cuenta</Title>
                </Group>
                <Paper bg={Theme.other!.neutral} p="sm" radius="md" mb="lg">
                    <Group gap="xs" wrap="nowrap" align="center">
                        <IconAlertTriangle
                            size="2rem"
                            color={`var(--mantine-color-${Theme.other!.danger.replace('.', '-')})`}
                            style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <Stack gap="0.25rem">
                            <Text size="1rem" c={Theme.other!.danger}>
                                CUIDADO: Esta acción es irreversible y eliminará
                                toda su información de forma permanente.
                            </Text>
                            <Text size="1rem" c={Theme.other!.danger}>
                                Una vez eliminada, será redireccionado al inicio
                                de sesión.
                            </Text>
                        </Stack>
                    </Group>
                </Paper>
                <Group justify="flex-start" mt="md">
                    <Button
                        loading={submitting}
                        color={Theme.other!.danger}
                        onClick={open}>
                        ELIMINAR CUENTA
                    </Button>
                </Group>
            </Card>

            <Modal
                opened={opened}
                onClose={close}
                title={<Title size="1.5rem">Eliminar cuenta</Title>}
                centered>
                <Group mt="md">
                    <Text size="1rem">
                        ¿Está seguro que desea eliminar su cuenta?
                    </Text>
                    <Paper bg={Theme.other!.neutral} p="sm" radius="md">
                        <Group gap="xs" wrap="nowrap" align="center">
                            <IconAlertTriangle
                                size={20}
                                color={`var(--mantine-color-${Theme.other!.danger.replace('.', '-')})`}
                                style={{ flexShrink: 0, marginTop: 2 }}
                            />
                            <Text size="sm" c={Theme.other!.danger}>
                                Esta acción es irreversible y eliminará toda su
                                información de forma permanente.
                            </Text>
                        </Group>
                    </Paper>
                    <Text size="1rem">
                        Una vez eliminada, será redireccionado al inicio de
                        sesión.
                    </Text>
                </Group>
                <Group mt="xl">
                    <Button
                        loading={submitting}
                        color={Theme.other!.danger}
                        onClick={handleDelete()}>
                        ELIMINAR CUENTA
                    </Button>
                </Group>
            </Modal>
        </Stack>
    )
}

export default Profile
