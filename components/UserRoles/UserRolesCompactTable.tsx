import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { Card, Stack, Table, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import Theme from '@/app/theme'
import UserRoles from '@/services/userRoles'

import SkeletonSmall from '@/components/Common/Loader/SkeletonSmall'
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

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="min-w-full"
            mt="md">
            <Title size="1.5rem" mb="md">
                Usuarios del emprendimiento
            </Title>
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
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Card>
    )
}

export default UserRolesCompactTable
