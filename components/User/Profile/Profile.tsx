import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
    Button,
    Card,
    Checkbox,
    Group,
    Stack,
    Text,
    TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import {
    IconAlertTriangle,
    IconCircleCheck,
    IconLock,
    IconMail,
    IconUserCircle,
} from '@tabler/icons-react'
import Theme from '@/app/theme'

import Helper from '@/services/helper'
import Users from '@/services/users'
import useSessionReloadStore from '@/utils/stores/useSessionReloadStore'
import Validation from '@/utils/validation/Validation'

import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import User from '@/entities/User'
import UserUpdate from '@/entities/UserUpdate'

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
    const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

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

            const userUpdate: UserUpdate = {
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
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = () => async () => {
        try {
            if (submitting) return
            if (!currentUser) return

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
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={isMobile ? 'min-w-full' : 'w-screen-l'}>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text size="2rem">Editar perfil</Text>
                </Group>
                <Group justify="flex-start" mt="md" mb="xs" c="green.8">
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
        )
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <>
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={isMobile ? 'min-w-full' : 'w-screen-l'}>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text size="2rem">Editar perfil</Text>
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
                        label="Recibir notificaciones por email"
                        key={form.key('emailNotifications')}
                        {...form.getInputProps('emailNotifications', {
                            type: 'checkbox',
                        })}
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
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Cargando...' : 'Guardar cambios'}
                        </Button>
                    </Group>
                </form>
            </Card>
            <Card
                mt="5rem"
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={isMobile ? 'min-w-full' : 'w-screen-l'}>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text size="2rem">Eliminar cuenta</Text>
                </Group>
                <Group justify="flex-start" mb="xs" c="red">
                    <IconAlertTriangle size="2rem" />
                    <Stack gap="0.25rem">
                        <Text size="1rem">
                            CUIDADO: Esta acción es irreversible y eliminará
                            toda su información de forma permanente.
                        </Text>
                        <Text size="1rem">
                            Una vez eliminada, será redireccionado al inicio de
                            sesión
                        </Text>
                    </Stack>
                </Group>
                <Group justify="flex-start" mt="md">
                    <Button
                        type="submit"
                        disabled={submitting}
                        color="red"
                        onClick={handleDelete()}>
                        {submitting ? 'Cargando...' : 'ELIMINAR CUENTA'}
                    </Button>
                </Group>
            </Card>
        </>
    )
}

export default Profile
