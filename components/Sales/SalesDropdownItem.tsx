import { Group, Text } from '@mantine/core'
import { IconCheck, IconLock } from '@tabler/icons-react'

import DateHelper from '@/utils/math/DateHelper'
import Math from '@/utils/math/Math'
import Sale from '@/entities/sales/Sale'

import SaleStateBadge from '@/components/Sales/SaleStateBadge'

interface SalesDropdownItemProps {
    sale: Sale
    isSelected: boolean
    isLocked?: boolean
}

const SalesDropdownItem = (props: SalesDropdownItemProps) => {
    const { sale, isSelected, isLocked = false } = props

    const saleInfo = sale.date
        ? `${DateHelper.formatDateTime(sale.date)} - ${Math.formatMoney(sale.totalPrice)}`
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
            {sale.state && <SaleStateBadge state={sale.state} />}
        </Group>
    )
}

export default SalesDropdownItem
