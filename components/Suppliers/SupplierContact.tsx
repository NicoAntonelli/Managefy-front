import React from 'react'

import { Group, Text } from '@mantine/core'
import { IconMail, IconPhone } from '@tabler/icons-react'

import Supplier from '@/entities/suppliers/Supplier'

interface SupplierContactProps {
    supplier: Supplier
}

const SupplierContact = (props: SupplierContactProps) => {
    const { supplier } = props

    return (
        <Group gap="md" mt="sm">
            <Group gap="xs">
                <IconMail size={18} />
                <Text>{supplier.email}</Text>
            </Group>
            <Group gap="xs">
                <IconPhone size={18} />
                <Text>{supplier.phone}</Text>
            </Group>
        </Group>
    )
}

export default SupplierContact
