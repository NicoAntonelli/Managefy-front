import React from 'react'
import {
    ActionIcon,
    Card,
    Group,
    Stack,
    Table,
    Text,
    Tooltip,
} from '@mantine/core'
import { IconArrowsExchange, IconPencil, IconX } from '@tabler/icons-react'

import Theme from '@/app/theme'

import BusinessRoleBadge from '@/components/Businesses/BusinessRoleBadge'

import Role from '@/entities/helpTypes/Role'
import UserRole from '@/entities/userRoles/UserRole'

interface UserRolesCompactTableItemProps {
    userRole: UserRole
    isSmallScreen?: boolean
    isLoggedUser?: boolean
    onEdit?: (userRole: UserRole) => void
    onDelete?: (userRole: UserRole) => void
    onTransfer?: (userRole: UserRole) => void
}

const getRole = (userRole: UserRole): Role | null => {
    if (userRole.isManager) return 'Manager'
    if (userRole.isAdmin) return 'Admin'
    if (userRole.isCollaborator) return 'Collaborator'
    return null
}

const UserRolesCompactTableItem = (props: UserRolesCompactTableItemProps) => {
    const { userRole, isSmallScreen, isLoggedUser } = props
    const { onEdit, onDelete, onTransfer } = props

    const role = getRole(userRole)

    // Each action is shown only if its handler is received (depends on the logged user's role)
    const hasActions = !!(onEdit || onDelete || onTransfer)

    // No actions for the manager nor for the logged user's own row
    const actions = role !== 'Manager' && !isLoggedUser && hasActions && (
        <Group
            gap={4}
            wrap="nowrap"
            onClick={(event) => event.stopPropagation()}>
            {onEdit && (
                <Tooltip label="Editar">
                    <ActionIcon
                        variant="outline"
                        color={Theme.primaryColor}
                        size="sm"
                        aria-label="Editar"
                        onClick={() => onEdit(userRole)}>
                        <IconPencil size={16} />
                    </ActionIcon>
                </Tooltip>
            )}
            {onTransfer && (
                <Tooltip label="Transferir rol de manager">
                    <ActionIcon
                        variant="outline"
                        color={Theme.other!.warning}
                        size="sm"
                        aria-label="Transferir rol de manager"
                        onClick={() => onTransfer(userRole)}>
                        <IconArrowsExchange size={16} />
                    </ActionIcon>
                </Tooltip>
            )}
            {onDelete && (
                <Tooltip label="Eliminar">
                    <ActionIcon
                        variant="outline"
                        color={Theme.other!.danger}
                        size="sm"
                        aria-label="Eliminar"
                        onClick={() => onDelete(userRole)}>
                        <IconX size={16} />
                    </ActionIcon>
                </Tooltip>
            )}
        </Group>
    )

    const roleBadge = role ? (
        <BusinessRoleBadge role={role} />
    ) : (
        <Text size="sm" c="dimmed">
            Sin asignar
        </Text>
    )

    if (isSmallScreen) {
        return (
            <Card withBorder padding="sm" radius="sm">
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="sm">
                    <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                        <Text fw={500} style={{ overflowWrap: 'anywhere' }}>
                            {userRole.user?.name || 'Sin nombre'}
                        </Text>
                        <Text
                            size="sm"
                            c={userRole.user?.email ? undefined : 'dimmed'}
                            style={{ overflowWrap: 'anywhere' }}>
                            {userRole.user?.email || 'Sin asignar'}
                        </Text>
                    </Stack>
                    {actions}
                </Group>
                <Group
                    justify="space-between"
                    align="center"
                    mt="xs"
                    wrap="nowrap">
                    <Text size="sm" c="dimmed">
                        Rol
                    </Text>
                    {roleBadge}
                </Group>
            </Card>
        )
    }

    return (
        <Table.Tr>
            <Table.Td fw={500} style={{ overflowWrap: 'anywhere' }}>
                {userRole.user?.name || 'Sin nombre'}
            </Table.Td>
            <Table.Td
                c={userRole.user?.email ? undefined : 'dimmed'}
                style={{ overflowWrap: 'anywhere' }}>
                {userRole.user?.email || 'Sin asignar'}
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>{roleBadge}</Table.Td>
            <Table.Td style={{ width: '140px' }}>
                {actions && <Group justify="center">{actions}</Group>}
            </Table.Td>
        </Table.Tr>
    )
}

export default UserRolesCompactTableItem
