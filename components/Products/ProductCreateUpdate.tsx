import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import { Card, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconBarcode,
    IconBox,
    IconCoins,
    IconRocket,
} from '@tabler/icons-react'

import Products from '@/services/products'
import Helper from '@/services/helper'
import Theme from '@/app/theme'
import Validation from '@/utils/validation/Validation'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessSelection from '@/components/Common/BusinessSelection'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputNumeric from '@/components/Common/Inputs/InputNumeric'
import InputText from '@/components/Common/Inputs/InputText'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import SuppliersDropdown from '@/components/Suppliers/SuppliersDropdown'

import Product from '@/entities/products/Product'
import ProductCU from '@/entities/products/ProductCU'
import Supplier from '@/entities/suppliers/Supplier'

interface ProductCreateUpdateForm {
    code: string
    name: string
    description: string
    unitCost: number | null
    unitPrice: number | null
    stock: number | null
    stockMin: number | null
    saleMinAmount: number | null
}

interface ProductCreateUpdateProps {
    currentProduct?: ProductCU
}

const ProductCreateUpdate = (props: ProductCreateUpdateProps) => {
    const { currentProduct } = props
    const isUpdate = !!currentProduct

    const initialSupplier: Supplier | null = currentProduct?.supplier?.id
        ? {
              id: currentProduct.supplier.id,
              name: currentProduct.supplier.name,
              description: currentProduct.supplier.description,
              email: currentProduct.supplier.email,
              phone: currentProduct.supplier.phone,
          }
        : null

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        initialSupplier
    )

    const router = useRouter()

    useEffect(() => {
        setLoading(false)
    }, [])

    const form = useForm<ProductCreateUpdateForm>({
        mode: 'controlled',
        initialValues: {
            code: currentProduct?.code ?? '',
            name: currentProduct?.name ?? '',
            description: currentProduct?.description ?? '',
            unitCost: currentProduct?.unitCost ?? null,
            unitPrice: currentProduct?.unitPrice ?? null,
            stock: currentProduct?.stock ?? null,
            stockMin: currentProduct?.stockMin ?? null,
            saleMinAmount: currentProduct?.saleMinAmount ?? null,
        },
        validate: {
            code: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un código',
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
            description: (value) =>
                Validation.string(value, true)
                    ? null
                    : 'Debe ingresar una descripción',
            unitCost: (value) =>
                Validation.decimal(value, true)
                    ? null
                    : 'Debe ingresar un costo válido',
            unitPrice: (value) =>
                Validation.decimal(value, true)
                    ? null
                    : 'Debe ingresar un precio válido',
            stock: (value) =>
                Validation.integer(value, true)
                    ? null
                    : 'Debe ingresar un stock válido',
        },
    })

    const handleSubmit = async (values: ProductCreateUpdateForm) => {
        if (submitting || !selectedBusiness) return

        setSubmitting(true)
        try {
            const productCU: ProductCU = {
                id: currentProduct?.id,
                code: values.code,
                name: values.name,
                description: values.description,
                unitCost: values.unitCost as number,
                unitPrice: values.unitPrice as number,
                stock: values.stock as number,
                stockMin: values.stockMin,
                saleMinAmount: values.saleMinAmount,
                businessID: selectedBusiness.id,
                supplier: selectedSupplier
                    ? {
                          id: selectedSupplier.id,
                          name: selectedSupplier.name,
                          description: selectedSupplier.description,
                          email: selectedSupplier.email,
                          phone: selectedSupplier.phone,
                          businessID: selectedBusiness.id,
                      }
                    : null,
            }
            const response: Product = isUpdate
                ? await Products.updateProduct(productCU)
                : await Products.createProduct(productCU)
            if (!response?.id)
                throw new Error(
                    isUpdate
                        ? 'Error actualizando producto'
                        : 'Error creando producto'
                )

            setErrorMessage('')
            router.push('/products')
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message: isUpdate
                    ? 'Error al actualizar el producto. Inténtalo de nuevo más tarde.'
                    : 'Error al crear el producto. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessSelection resourceName="productos" />
    }

    return (
        <Stack gap="xs" w="100%" maw="40rem" mx="auto">
            <ButtonGoBack href="/products" text="productos" />

            <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Group mt="md" mb="xs">
                    <Title size="2rem">
                        {isUpdate ? 'Editar producto' : 'Nuevo producto'}
                    </Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputText
                        key={form.key('code')}
                        required
                        label="Código"
                        placeholder="Código del producto"
                        leftIcon={<IconBarcode />}
                        InputProps={{ ...form.getInputProps('code') }}
                    />

                    <InputText
                        key={form.key('name')}
                        required
                        label="Nombre"
                        placeholder="Nombre del producto"
                        leftIcon={<IconRocket />}
                        InputProps={{ ...form.getInputProps('name') }}
                    />

                    <InputDescription
                        key={form.key('description')}
                        required
                        placeholder="Descripción del producto"
                        InputProps={{ ...form.getInputProps('description') }}
                    />

                    <SuppliersDropdown
                        businessID={selectedBusiness.id}
                        initialSupplier={initialSupplier}
                        onChange={setSelectedSupplier}
                    />

                    <InputNumeric
                        key={form.key('unitCost')}
                        name="unitCost"
                        required
                        label="Costo unitario"
                        placeholder="10.50"
                        leftIcon={<IconCoins />}
                        InputProps={{ ...form.getInputProps('unitCost') }}
                    />

                    <InputNumeric
                        key={form.key('unitPrice')}
                        name="unitPrice"
                        required
                        label="Precio unitario"
                        placeholder="25.00"
                        leftIcon={<IconCoins />}
                        InputProps={{ ...form.getInputProps('unitPrice') }}
                    />

                    <InputNumeric
                        key={form.key('stock')}
                        name="stock"
                        isInteger
                        required
                        label="Stock"
                        placeholder="50"
                        leftIcon={<IconBox />}
                        InputProps={{ ...form.getInputProps('stock') }}
                    />

                    <InputNumeric
                        key={form.key('stockMin')}
                        name="stockMin"
                        isInteger
                        label="Stock mínimo (opcional)"
                        placeholder="10"
                        leftIcon={<IconBox />}
                        InputProps={{ ...form.getInputProps('stockMin') }}
                    />

                    <InputNumeric
                        key={form.key('saleMinAmount')}
                        name="saleMinAmount"
                        isInteger
                        label="Cantidad mínima por venta (opcional)"
                        placeholder="5"
                        leftIcon={<IconBox />}
                        InputProps={{ ...form.getInputProps('saleMinAmount') }}
                    />

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        text="producto"
                        leftIcon={<IconRocket size={20} />}
                        isCreate={!isUpdate}
                        submitting={submitting}
                        cancelHref="/products"
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default ProductCreateUpdate
