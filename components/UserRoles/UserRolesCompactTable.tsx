import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Button, Card, Group, Stack, Table, Text, Title } from '@mantine/core'
import { IconDoorExit, IconUserPlus } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Theme from '@/app/theme'
import UserRoles from '@/services/userRoles'

import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'
import UserRoleCreateUpdate from '@/components/UserRoles/UserRoleCreateUpdate'
import UserRoleDelete from '@/components/UserRoles/UserRoleDelete'
import UserRoleLeave from '@/components/UserRoles/UserRoleLeave'
import UserRoleTransferManager from '@/components/UserRoles/UserRoleTransferManager'
import UserRolesCompactTableItem from '@/components/UserRoles/UserRolesCompactTableItem'

import useGetUserRole from '@/hooks/userRoles/useGetUserRole'

import UserRole from '@/entities/userRoles/UserRole'

interface UserRolesCompactTableProps {
    businessID: number
    publicUserRoles?: UserRole[] // Public view (without a valid session): shown read-only, nothing is fetched
}

const UserRolesCompactTable = (props: UserRolesCompactTableProps) => {
    const { businessID, publicUserRoles } = props

    const isSmallScreen = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

    const [userRoles, setUserRoles] = useState<UserRole[]>([])
    const [loading, setLoading] = useState(true)
    const [roleModalOpened, setRoleModalOpened] = useState(false)
    const [editingRole, setEditingRole] = useState<UserRole | null>(null)
    const [deletingRole, setDeletingRole] = useState<UserRole | null>(null)
    const [transferringRole, setTransferringRole] = useState<UserRole | null>(
        null
    )
    const [leaveOpened, setLeaveOpened] = useState(false)

    // In the public view there is no logged role (no actions nor buttons are shown)
    const { userRole, reload: reloadRole } = useGetUserRole(
        publicUserRoles ? undefined : businessID
    )

    const userIsManager = !!userRole?.isManager
    const userIsAdmin = !!userRole?.isAdmin
    const loggedUserID = userRole?.user?.id ?? null

    // Manager can edit or delete anyone, admin can only edit or delete collaborators
    const canEditOrDelete = (target: UserRole) =>
        userIsManager || (userIsAdmin && !target.isAdmin && !target.isManager)

    useEffect(() => {
        if (publicUserRoles) {
            setUserRoles(publicUserRoles)
            setLoading(false)
            return
        }

        const fetchUserRoles = async () => {
            try {
                const response =
                    await UserRoles.listUserRolesByBusiness(businessID)
                setUserRoles(response || [])
            } catch (error) {
                setUserRoles([])
                notifications.show({
                    title: 'Error',
                    message: 'No se pudieron cargar los usuarios',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchUserRoles()
    }, [businessID, publicUserRoles])

    const handleEdit = (userRole: UserRole) => {
        setEditingRole(userRole)
        setRoleModalOpened(true)
    }

    const handleCreateUpdate = (userRole: UserRole) => {
        setUserRoles((current) => {
            const exists = current.some(
                (item) => item.user.id === userRole.user.id
            )
            if (!exists) return [...current, userRole]
            return current.map((item) =>
                item.user.id === userRole.user.id ? userRole : item
            )
        })
    }

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full"
            mt="md">
            <Group justify="space-between" align="center" mb="md">
                <Title size="1.5rem">Usuarios del emprendimiento</Title>
                <Group gap="sm">
                    {(userIsManager || userIsAdmin) && (
                        <Button
                            color={Theme.primaryColor}
                            leftSection={<IconUserPlus size={18} />}
                            onClick={() => {
                                setEditingRole(null)
                                setRoleModalOpened(true)
                            }}>
                            Agregar colaborador
                        </Button>
                    )}
                    {userRole && (
                        <Button
                            color={Theme.other!.danger}
                            leftSection={<IconDoorExit size={18} />}
                            onClick={() => setLeaveOpened(true)}>
                            Abandonar emprendimiento
                        </Button>
                    )}
                </Group>
            </Group>
            {loading ? (
                <SkeletonSmall />
            ) : userRoles.length === 0 ? (
                <Text c="dimmed">
                    Este emprendimiento no tiene usuarios asociados
                </Text>
            ) : isSmallScreen ? (
                <Stack gap="sm">
                    {userRoles.map((userRole) => (
                        <UserRolesCompactTableItem
                            key={userRole.user.id}
                            userRole={userRole}
                            isLoggedUser={userRole.user.id === loggedUserID}
                            isSmallScreen
                            onEdit={
                                canEditOrDelete(userRole)
                                    ? handleEdit
                                    : undefined
                            }
                            onDelete={
                                canEditOrDelete(userRole)
                                    ? setDeletingRole
                                    : undefined
                            }
                            onTransfer={
                                userIsManager ? setTransferringRole : undefined
                            }
                        />
                    ))}
                </Stack>
            ) : (
                <Table highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Rol
                            </Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>
                                Acciones
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {userRoles.map((userRole) => (
                            <UserRolesCompactTableItem
                                key={userRole.user.id}
                                userRole={userRole}
                                isLoggedUser={userRole.user.id === loggedUserID}
                                onEdit={
                                    canEditOrDelete(userRole)
                                        ? handleEdit
                                        : undefined
                                }
                                onDelete={
                                    canEditOrDelete(userRole)
                                        ? setDeletingRole
                                        : undefined
                                }
                                onTransfer={
                                    userIsManager
                                        ? setTransferringRole
                                        : undefined
                                }
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <UserRoleCreateUpdate
                opened={roleModalOpened}
                businessID={businessID}
                currentUserRole={editingRole ?? undefined}
                canAssignAdmin={userIsManager}
                onSuccess={(userRole) => handleCreateUpdate(userRole)}
                onClose={() => {
                    setRoleModalOpened(false)
                    setEditingRole(null)
                }}
            />
            <UserRoleDelete
                opened={!!deletingRole}
                userID={deletingRole?.user.id ?? 0}
                businessID={businessID}
                userName={deletingRole?.user.name || 'Sin nombre'}
                onSuccess={(userID) =>
                    setUserRoles((current) =>
                        current.filter((item) => item.user.id !== userID)
                    )
                }
                onClose={() => setDeletingRole(null)}
            />
            <UserRoleTransferManager
                opened={!!transferringRole}
                userID={transferringRole?.user.id ?? 0}
                businessID={businessID}
                userName={transferringRole?.user.name || 'Sin nombre'}
                onSuccess={() => {
                    reloadRole()
                    UserRoles.listUserRolesByBusiness(businessID)
                        .then((response) => setUserRoles(response || []))
                        .catch(() => {})
                }}
                onClose={() => setTransferringRole(null)}
            />
            <UserRoleLeave
                opened={leaveOpened}
                businessID={businessID}
                onClose={() => setLeaveOpened(false)}
            />
        </Card>
    )
}

export default UserRolesCompactTable
