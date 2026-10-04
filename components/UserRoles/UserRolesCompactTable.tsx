import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Button, Card, Group, Stack, Table, Text, Title } from '@mantine/core'
import { IconUserPlus } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Theme from '@/app/theme'
import UserRoles from '@/services/userRoles'

import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'
import UserRoleCreateUpdate from '@/components/UserRoles/UserRoleCreateUpdate'
import UserRoleDelete from '@/components/UserRoles/UserRoleDelete'
import UserRolesCompactTableItem from '@/components/UserRoles/UserRolesCompactTableItem'

import UserRole from '@/entities/usersRoles/UserRole'

interface UserRolesCompactTableProps {
    businessID: number
}

const UserRolesCompactTable = (props: UserRolesCompactTableProps) => {
    const { businessID } = props

    const isSmallScreen = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

    const [userRoles, setUserRoles] = useState<UserRole[]>([])
    const [loading, setLoading] = useState(true)
    const [roleModalOpened, setRoleModalOpened] = useState(false)
    const [editingRole, setEditingRole] = useState<UserRole | null>(null)
    const [deletingRole, setDeletingRole] = useState<UserRole | null>(null)

    useEffect(() => {
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
    }, [businessID])

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
                <Button
                    color={Theme.primaryColor}
                    leftSection={<IconUserPlus size={18} />}
                    onClick={() => {
                        setEditingRole(null)
                        setRoleModalOpened(true)
                    }}>
                    Agregar colaborador
                </Button>
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
                            isSmallScreen
                            onEdit={(userRole) => {
                                setEditingRole(userRole)
                                setRoleModalOpened(true)
                            }}
                            onDelete={setDeletingRole}
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
                                onEdit={(userRole) => {
                                    setEditingRole(userRole)
                                    setRoleModalOpened(true)
                                }}
                                onDelete={setDeletingRole}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <UserRoleCreateUpdate
                opened={roleModalOpened}
                businessID={businessID}
                currentUserRole={editingRole ?? undefined}
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
        </Card>
    )
}

export default UserRolesCompactTable
