import React, { useEffect, useState } from 'react'
import { Stack, Text, Title } from '@mantine/core'

import Products from '@/services/products'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ProductsListItem from '@/components/Products/ProductsListItem'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Product from '@/entities/products/Product'

const ProductsList = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id
    const [products, setProducts] = useState<Product[] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (businessID === undefined) {
            setProducts(null)
            setLoading(false)
            return
        }

        setLoading(true)

        const fetchProducts = async () => {
            try {
                const response = await Products.listProducts(businessID)
                setProducts(response)
            } catch (error) {
                setProducts(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [businessID])

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="productos" />
    }

    if (loading) {
        return <SkeletonFull />
    }

    return (
        <Stack gap="lg" style={{ width: '100%' }}>
            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <SelectedBusinessBar business={selectedBusiness} />
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
