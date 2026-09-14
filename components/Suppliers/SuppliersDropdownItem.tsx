import { Group, Text } from '@mantine/core'
import { IconUserCog } from '@tabler/icons-react'

import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersDropdownItemProps {
    supplier: Supplier
}

const SuppliersDropdownItem = (props: SuppliersDropdownItemProps) => {
    const { supplier } = props

    return (
        <Group gap="xs">
            <IconUserCog size={16} />
            <div>
                <Text size="sm">{supplier.name}</Text>
                {supplier.email && (
                    <Text size="xs" c="dimmed" lineClamp={1}>
                        {supplier.email}
                    </Text>
                )}
            </div>
        </Group>
    )
}

export default SuppliersDropdownItem
