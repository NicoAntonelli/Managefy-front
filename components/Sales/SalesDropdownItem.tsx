import { Badge, Group, Text } from '@mantine/core'
import { IconCheck, IconLock } from '@tabler/icons-react'

import TextHelper from '@/utils/string/TextHelper'

import Sale from '@/entities/sales/Sale'

interface SalesDropdownItemProps {
    sale: Sale
    isSelected: boolean
    isLocked?: boolean
}

const SalesDropdownItem = (props: SalesDropdownItemProps) => {
    const { sale, isSelected, isLocked = false } = props

    const saleInfo = sale.date
        ? `${TextHelper.dateFormatter(sale.date)} - $${sale.totalPrice.toFixed(2)}`
        : `#${sale.id}`

    return (
        <Group justify="space-between" flex={1} gap="xs">
            <Group gap="xs">
                {isLocked ? (
                    <IconLock size={16} color="var(--mantine-color-dimmed)" />
                ) : isSelected ? (
                    <IconCheck size={16} color="var(--mantine-color-teal-6)" />
                ) : (
                    <span style={{ width: 16, display: 'inline-block' }} />
                )}
                <div>
                    <Text size="sm" c={isLocked ? 'dimmed' : undefined}>
                        Venta {saleInfo}
                    </Text>
                    {sale.observation && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                            {sale.observation}
                        </Text>
                    )}
                </div>
            </Group>
            {sale.state && (
                <Badge size="xs" variant="light">
                    {TextHelper.getSaleStateText(sale.state)}
                </Badge>
            )}
        </Group>
    )
}

export default SalesDropdownItem
