import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Sales from '@/services/sales'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import SalesListItem from '@/components/Sales/SalesListItem'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import ClientsFilter from '@/components/Clients/ClientsFilter'

import Client from '@/entities/clients/Client'
import Sale from '@/entities/sales/Sale'

const SalesList = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id
    const [sales, setSales] = useState<Sale[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [prevBusinessID, setPrevBusinessID] = useState(businessID)

    if (businessID !== prevBusinessID) {
        setPrevBusinessID(businessID)
        setSelectedClient(null)
    }

    useEffect(() => {
        if (businessID === undefined) {
            setSales(null)
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchSales = async () => {
            try {
                const response = selectedClient
                    ? await Sales.listSalesByClient(
                          businessID,
                          selectedClient.id
                      )
                    : await Sales.listSalesIncomplete(businessID)
                setSales(response)
            } catch (error) {
                setSales(null)
            } finally {
                setLoading(false)
            }
        }

        fetchSales()
    }, [businessID, selectedClient])

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="venta" />
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar
                    business={selectedBusiness}
                    filterContent={({ onClose }) => (
                        <ClientsFilter
                            key={`${selectedBusiness.id}-${selectedClient?.id ?? 'none'}`}
                            businessID={selectedBusiness.id}
                            appliedClient={selectedClient}
                            onApply={setSelectedClient}
                            onClose={onClose}
                        />
                    )}
                />
            </div>
            {!sales?.length ? (
                <Stack align="center" gap="md" py="xl">
                    <Title size="2rem">Aún no hay ventas</Title>
                    <Text ta="center" maw={480}>
                        Este emprendimiento aún no tiene ventas.
                    </Text>
                </Stack>
            ) : (
                <Stack gap="lg">
                    {sales.map((sale) => (
                        <SalesListItem key={sale.id} sale={sale} />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default SalesList
