import React, { useEffect, useState } from 'react'
import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCashRegister, IconRefresh } from '@tabler/icons-react'

import Helper from '@/services/helper'
import Sales from '@/services/sales'
import TextHelper from '@/utils/string/TextHelper'
import Validation from '@/utils/validation/Validation'
import Theme from '@/app/theme'

import CustomDropdown from '@/components/Common/CustomDropdown/CustomDropdown'
import SalesDropdownItem from '@/components/Sales/SalesDropdownItem'

import Sale from '@/entities/sales/Sale'

interface SalesDropdownProps {
    businessID: number
    selectedSaleIDs: number[]
    disabledSaleIDs?: number[]
    forceRefresh?: boolean
    label?: string
    onToggleSale: (sale: Sale) => void
    onSalesLoaded?: (sales: Sale[]) => void
}

const SalesDropdown = (props: SalesDropdownProps) => {
    const { businessID, selectedSaleIDs, forceRefresh = false } = props
    const { label, onToggleSale, onSalesLoaded } = props
    const { disabledSaleIDs = [] } = props

    const [loading, setLoading] = useState(false)
    const [sales, setSales] = useState<Sale[] | null>(null)

    const [cachedAt, setCachedAt] = useState<number | null>(null)
    const [cachedBusinessID, setCachedBusinessID] = useState<number | null>(
        null
    )

    const fetchSales = async () => {
        setLoading(true)
        try {
            const response = await Sales.listSalesIncomplete(businessID)
            setSales(response ?? [])
            setCachedAt(Date.now())
            setCachedBusinessID(businessID)
            if (onSalesLoaded && response) {
                onSalesLoaded(response)
            }
            return response
        } catch (error) {
            setSales([])
            const message = Helper.parseError(error)
            notifications.show({
                title: 'Error',
                message:
                    message ||
                    'Error al obtener las ventas. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const isCacheValid =
            sales !== null &&
            cachedBusinessID === businessID &&
            cachedAt !== null &&
            Validation.cache(cachedAt)

        if (!isCacheValid || forceRefresh) {
            fetchSales()
        }
    }, [businessID, forceRefresh])

    const handleSelect = (sale: Sale) => {
        if (disabledSaleIDs.includes(sale.id)) return
        onToggleSale(sale)
    }

    const filterPredicate = (sale: Sale, query: string) => {
        const formattedDate = sale.date
            ? TextHelper.dateFormatter(sale.date)
            : ''
        const matchesDate = formattedDate.toLowerCase().includes(query)
        const matchesObs = sale.observation?.toLowerCase().includes(query)
        const matchesTotal = sale.totalPrice?.toString().includes(query)
        return Boolean(matchesDate || matchesObs || matchesTotal)
    }

    const placeholder =
        sales === null || loading
            ? 'Cargando ventas...'
            : sales.length === 0
              ? 'No hay ventas para mostrar'
              : 'Seleccionar ventas...'

    return (
        <Stack gap="xs">
            {label && (
                <Text size="sm" fw={500}>
                    {label}
                </Text>
            )}
            <Group align="center" gap="sm">
                <CustomDropdown<Sale>
                    items={sales ?? []}
                    getItemKey={(sale) => sale.id}
                    getItemLabel={(sale) => {
                        const saleInfo = sale.date
                            ? TextHelper.dateFormatter(sale.date)
                            : `#${sale.id}`
                        return `Venta ${saleInfo}`
                    }}
                    filterPredicate={filterPredicate}
                    onSelect={handleSelect}
                    isItemDisabled={(sale) => disabledSaleIDs.includes(sale.id)}
                    closeOnSelect={false}
                    withinPortal={false}
                    loading={loading}
                    placeholder={placeholder}
                    searchPlaceholder="Buscar por fecha, observación o monto..."
                    emptyText="No se encontraron ventas coincidentes"
                    leftIcon={<IconCashRegister size={18} />}
                    renderOption={(sale) => (
                        <SalesDropdownItem
                            sale={sale}
                            isSelected={selectedSaleIDs.includes(sale.id)}
                            isLocked={disabledSaleIDs.includes(sale.id)}
                        />
                    )}
                />

                {!forceRefresh && (
                    <Tooltip label="Recargar ventas">
                        <ActionIcon
                            variant="light"
                            size="lg"
                            loading={loading}
                            onClick={fetchSales}>
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </Group>
        </Stack>
    )
}

export default SalesDropdown
