import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Products from '@/services/products'
import useCheckUserLogin from '@/hooks/users/useCheckUserLogin'
import useSelectedBusinessStore from '@/hooks/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ProductsListItem from '@/components/Products/ProductsListItem'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import SuppliersFilter from '@/components/Suppliers/SuppliersFilter'
import UserValidationContinue from '@/components/User/UserValidation/UserValidationContinue'

import Product from '@/entities/products/Product'
import Supplier from '@/entities/suppliers/Supplier'

const ProductsList = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id
    const [products, setProducts] = useState<Product[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null
    )
    const [prevBusinessID, setPrevBusinessID] = useState(businessID)

    const checkUserLogin = useCheckUserLogin()

    if (businessID !== prevBusinessID) {
        setPrevBusinessID(businessID)
        setSelectedSupplier(null)
    }

    useEffect(() => {
        if (!checkUserLogin.isValidated) {
            setLoading(false)
            return
        }

        if (businessID === undefined) {
            setProducts(null)
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchProducts = async () => {
            try {
                const response = selectedSupplier
                    ? await Products.listProductsBySupplier(
                          businessID,
                          selectedSupplier.id
                      )
                    : await Products.listProducts(businessID)
                setProducts(response)
            } catch (error) {
                setProducts(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [checkUserLogin.isValidated, businessID, selectedSupplier])

    if (loading || checkUserLogin.isValidated === null) {
        return <SkeletonFull />
    }

    if (!checkUserLogin.isValidated) {
        return <UserValidationContinue checkUserLogin={checkUserLogin} />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="producto" />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar
                    business={selectedBusiness}
                    filterContent={({ onClose }) => (
                        <SuppliersFilter
                            key={`${selectedBusiness.id}-${selectedSupplier?.id ?? 'none'}`}
                            businessID={selectedBusiness.id}
                            appliedSupplier={selectedSupplier}
                            onApply={setSelectedSupplier}
                            onClose={onClose}
                        />
                    )}
                />
            </div>
            {!products?.length ? (
                <Stack align="center" gap="md" py="xl">
                    <Title size="2rem">Aún no hay productos</Title>
                    <Text ta="center" maw={480}>
                        Este emprendimiento aún no tiene productos.
                    </Text>
                    <ButtonCreate
                        href="/products/new"
                        resourceName="producto"
                    />
                </Stack>
            ) : (
                <Stack gap="lg">
                    <ButtonCreate
                        href="/products/new"
                        resourceName="producto"
                    />
                    {products.map((product) => (
                        <ProductsListItem key={product.id} product={product} />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default ProductsList
