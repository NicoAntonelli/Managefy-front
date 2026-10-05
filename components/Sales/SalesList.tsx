import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Sales from '@/services/sales'
import useCheckUserLogin from '@/hooks/users/useCheckUserLogin'
import useSelectedBusinessStore from '@/hooks/stores/useSelectedBusinessStore'
import DateHelper from '@/utils/math/DateHelper'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import SalesListItem from '@/components/Sales/SalesListItem'
import SalesMultipleFilters from '@/components/Sales/SalesMultipleFilters'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import UserValidationContinue from '@/components/User/UserValidation/UserValidationContinue'

import Client from '@/entities/clients/Client'
import Sale from '@/entities/sales/Sale'
import SalesDateRange from '@/entities/helpTypes/SalesDateRange'

const SalesList = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id
    const [sales, setSales] = useState<Sale[] | null>(null)
    const [loading, setLoading] = useState(true)

    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [selectedRange, setSelectedRange] = useState<SalesDateRange | null>(
        DateHelper.getDefaultRange()
    )
    const [prevBusinessID, setPrevBusinessID] = useState(businessID)

    const checkUserLogin = useCheckUserLogin()

    if (businessID !== prevBusinessID) {
        setPrevBusinessID(businessID)
        setSelectedClient(null)
        setSelectedRange(DateHelper.getDefaultRange())
    }

    useEffect(() => {
        if (!checkUserLogin.isValidated) {
            setLoading(false)
            return
        }

        if (businessID === undefined) {
            setSales(null)
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchSales = async () => {
            try {
                const response = selectedRange
                    ? await Sales.listSalesByInterval(
                          businessID,
                          selectedRange.dateFrom,
                          selectedRange.dateTo
                      )
                    : selectedClient
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
    }, [checkUserLogin.isValidated, businessID, selectedClient, selectedRange])

    if (loading || checkUserLogin.isValidated === null) {
        return <SkeletonFull />
    }

    if (!checkUserLogin.isValidated) {
        return <UserValidationContinue checkUserLogin={checkUserLogin} />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="venta" />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar
                    business={selectedBusiness}
                    filterContent={({ onClose }) => (
                        <SalesMultipleFilters
                            key={`${selectedBusiness.id}-${selectedClient?.id ?? 'none'}-${selectedRange?.dateFrom ?? 'none'}-${selectedRange?.dateTo ?? 'none'}`}
                            businessID={selectedBusiness.id}
                            appliedClient={selectedClient}
                            appliedRange={selectedRange}
                            onApply={(client, range) => {
                                setSelectedClient(client)
                                setSelectedRange(range)
                            }}
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
                    <ButtonCreate
                        href="/sales/new"
                        resourceName="venta"
                        label="Registrar nueva venta"
                    />
                </Stack>
            ) : (
                <Stack gap="lg">
                    <ButtonCreate
                        href="/sales/new"
                        resourceName="venta"
                        label="Registrar nueva venta"
                    />
                    {sales.map((sale) => (
                        <SalesListItem key={sale.id} sale={sale} />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default SalesList
