import React, { useEffect, useState } from 'react'
import { Box, Stack, Text } from '@mantine/core'

import Sales from '@/services/sales'
import TextHelper from '@/utils/string/TextHelper'
import Theme from '@/app/theme'

import SalesDropdown from '@/components/Sales/SalesDropdown'
import SalesSelectionAreaItem from '@/components/Sales/SalesSelectionAreaItem'

import Sale from '@/entities/sales/Sale'

interface SalesSelectionAreaProps {
    businessID: number
    selectedSaleIDs: number[]
    lockedSaleIDs?: number[]
    required?: boolean
    label?: string
    error?: string
    onChange: (saleIDs: number[]) => void
}

const SalesSelectionArea = (props: SalesSelectionAreaProps) => {
    const { businessID, selectedSaleIDs, required = false } = props
    const { label = 'Ventas asociadas', error, onChange } = props
    const { lockedSaleIDs = [] } = props

    const [salesList, setSalesList] = useState<Sale[]>([])

    useEffect(() => {
        if (businessID && salesList.length === 0) {
            Sales.listSalesIncomplete(businessID)
                .then((res) => {
                    if (res) setSalesList(res)
                })
                .catch(() => {})
        }
    }, [businessID])

    const handleToggleSale = (sale: Sale) => {
        if (lockedSaleIDs.includes(sale.id)) return

        if (selectedSaleIDs.includes(sale.id)) {
            onChange(selectedSaleIDs.filter((id) => id !== sale.id))
        } else {
            onChange([...selectedSaleIDs, sale.id])
        }

        if (!salesList.some((s) => s.id === sale.id)) {
            setSalesList((prev) => [...prev, sale])
        }
    }

    const handleRemoveSale = (saleID: number) => {
        if (lockedSaleIDs.includes(saleID)) return
        onChange(selectedSaleIDs.filter((id) => id !== saleID))
    }

    const handleSalesLoaded = (sales: Sale[]) => {
        setSalesList((prev) => {
            const map = new Map<number, Sale>()
            prev.forEach((s) => map.set(s.id, s))
            sales.forEach((s) => map.set(s.id, s))
            return Array.from(map.values())
        })
    }

    return (
        <Stack gap="xs" mt="md" w="100%">
            <Text size="sm" fw={500}>
                {label}{' '}
                {required && (
                    <span style={{ color: 'var(--mantine-color-error)' }}>
                        *
                    </span>
                )}
            </Text>

            <Box
                style={{
                    border: error
                        ? '1px solid var(--mantine-color-error)'
                        : '1px solid var(--mantine-color-default-border)',
                    borderRadius: 'var(--mantine-radius-sm)',
                    padding: 'var(--mantine-spacing-sm)',
                    minHeight: '4.5rem',
                    backgroundColor: 'var(--mantine-color-body)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    gap: '0.5rem',
                }}>
                {selectedSaleIDs.length === 0 ? (
                    <Text size="sm" c="dimmed">
                        No hay ventas seleccionadas. Selecciona ventas a
                        continuación.
                    </Text>
                ) : (
                    selectedSaleIDs.map((id) => {
                        const sale = salesList.find((s) => s.id === id)
                        const saleInfo = sale?.date
                            ? `${TextHelper.formatDate(sale.date)} ($${sale.totalPrice.toFixed(2)})`
                            : `#${id}`
                        return (
                            <SalesSelectionAreaItem
                                key={id}
                                name={`Venta ${saleInfo}`}
                                removable={!lockedSaleIDs.includes(id)}
                                onRemove={() => handleRemoveSale(id)}
                            />
                        )
                    })
                )}
            </Box>

            {error && (
                <Text size="xs" c={Theme.other!.danger} mt={-4}>
                    {error}
                </Text>
            )}

            <SalesDropdown
                businessID={businessID}
                selectedSaleIDs={selectedSaleIDs}
                disabledSaleIDs={lockedSaleIDs}
                forceRefresh
                onToggleSale={handleToggleSale}
                onSalesLoaded={handleSalesLoaded}
            />
        </Stack>
    )
}

export default SalesSelectionArea
