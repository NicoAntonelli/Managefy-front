import { useEffect, useState } from 'react'
import { Checkbox, Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUserPlus } from '@tabler/icons-react'

import Theme from '@/app/theme'
import Helper from '@/services/helper'
import UserRoles from '@/services/userRoles'

import Validation from '@/utils/validation/Validation'

import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputText from '@/components/Common/Inputs/InputText'

import Role from '@/entities/helpTypes/Role'
import UserRole from '@/entities/usersRoles/UserRole'

interface UserRoleCreateUpdateProps {
    opened: boolean
    businessID: number
    currentUserRole?: UserRole
    onSuccess: (userRole: UserRole) => void
    onClose: () => void
}

const UserRoleCreateUpdate = (props: UserRoleCreateUpdateProps) => {
    const { opened, businessID, currentUserRole, onSuccess, onClose } = props

    const isUpdate = !!currentUserRole

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!opened) return

        setEmail(currentUserRole?.user?.email ?? '')
        setName(currentUserRole?.user?.name ?? '')
        setIsAdmin(!!currentUserRole?.isAdmin)
        setErrorMessage('')
    }, [opened, currentUserRole])

    const handleSubmit = async () => {
        if (submitting) return

        if (!isUpdate && !Validation.email(email)) {
            setErrorMessage('Debe ingresar un email válido')
            return
        }

        const role: Role = isAdmin ? 'Admin' : 'Collaborator'

        setSubmitting(true)
        setErrorMessage('')
        try {
            const response = isUpdate
                ? await UserRoles.updateUserRole(
                      currentUserRole.user.id,
                      businessID,
                      role
                  )
                : await UserRoles.createUserRoleByMail(email, businessID, role)

            if (!response?.user?.id) {
                throw new Error(
                    isUpdate
                        ? 'Error actualizando colaborador'
                        : 'Error agregando colaborador'
                )
            }

            onSuccess(response)
            notifications.show({
                title: 'Éxito',
                message: isUpdate
                    ? 'Colaborador actualizado correctamente'
                    : 'Colaborador agregado correctamente',
                color: Theme.other!.success,
            })
            onClose()
        } catch (error) {
            setErrorMessage(Helper.parseError(error))
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'No se pudo actualizar el colaborador'
                    : 'No se pudo agregar el colaborador',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isUpdate ? 'Actualizar colaborador' : 'Agregar colaborador'}
            centered>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit()
                }}>
                <InputEmail
                    required={!isUpdate}
                    InputProps={{
                        value: email,
                        disabled: isUpdate,
                        onChange: (event) =>
                            setEmail(event.currentTarget.value),
                    }}
                />

                {isUpdate && (
                    <InputText
                        label="Nombre"
                        InputProps={{
                            value: name,
                            disabled: true,
                        }}
                    />
                )}

                <Checkbox
                    mt="md"
                    label="Es admin"
                    checked={isAdmin}
                    onChange={(event) =>
                        setIsAdmin(event.currentTarget.checked)
                    }
                />

                {errorMessage && (
                    <Text
                        c={Theme.other!.danger}
                        size="sm"
                        mt="md"
                        style={{ overflowWrap: 'anywhere' }}>
                        {errorMessage}
                    </Text>
                )}

                <ButtonsSubmitAndCancel
                    operation={isUpdate ? 'Update' : 'Create'}
                    operationText={isUpdate ? 'Actualizar' : 'Agregar'}
                    leftIcon={<IconUserPlus />}
                    submitting={submitting}
                    onCancel={onClose}
                />
            </form>
        </Modal>
    )
}

export default UserRoleCreateUpdate
