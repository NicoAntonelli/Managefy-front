import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Suppliers from '@/services/suppliers'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import SuppliersListItem from '@/components/Suppliers/SuppliersListItem'

import Supplier from '@/entities/suppliers/Supplier'

const SuppliersList = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id
    const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (businessID === undefined) {
            setSuppliers(null)
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchSuppliers = async () => {
            try {
                const response = await Suppliers.listSuppliers(businessID)
                setSuppliers(response)
            } catch (error) {
                setSuppliers(null)
            } finally {
                setLoading(false)
            }
        }

        fetchSuppliers()
    }, [businessID])

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="proveedor" />
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar business={selectedBusiness} hideFilter />
            </div>
            {!suppliers?.length ? (
                <Stack align="center" gap="md" py="xl">
                    <Title size="2rem">Aún no hay proveedores</Title>
                    <Text ta="center" maw={480}>
                        Este emprendimiento aún no tiene proveedores.
                    </Text>
                    <ButtonCreate
                        href="/suppliers/new"
                        resourceName="proveedor"
                    />
                </Stack>
            ) : (
                <Stack gap="lg">
                    <ButtonCreate
                        href="/suppliers/new"
                        resourceName="proveedor"
                    />
                    {suppliers.map((supplier) => (
                        <SuppliersListItem
                            key={supplier.id}
                            supplier={supplier}
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default SuppliersList
