import { Group, Text } from '@mantine/core'
import { IconCheck, IconUserCog } from '@tabler/icons-react'

import Supplier from '@/entities/suppliers/Supplier'

interface SuppliersDropdownItemProps {
    supplier: Supplier
    isSelected?: boolean
}

const SuppliersDropdownItem = (props: SuppliersDropdownItemProps) => {
    const { supplier, isSelected = false } = props

    return (
        <Group gap="xs">
            {isSelected ? (
                <IconCheck size={16} color="var(--mantine-color-teal-6)" />
            ) : (
                <span style={{ width: 16, display: 'inline-block' }} />
            )}
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
