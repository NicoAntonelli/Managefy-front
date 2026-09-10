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
import InputDecimal from '@/components/Common/Inputs/InputDecimal'
import InputInteger from '@/components/Common/Inputs/InputInteger'
import InputText from '@/components/Common/Inputs/InputText'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Product from '@/entities/products/Product'
import ProductCU from '@/entities/products/ProductCU'

interface ProductCreateForm {
    code: string
    name: string
    description: string
    unitCost: string
    unitPrice: string
    stock: string
    stockMin: string
    saleMinAmount: string
}

const ProductCreate = () => {
    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        setLoading(false)
    }, [])

    const form = useForm<ProductCreateForm>({
        mode: 'controlled',
        initialValues: {
            code: '',
            name: '',
            description: '',
            unitCost: '',
            unitPrice: '',
            stock: '',
            stockMin: '',
            saleMinAmount: '',
        },
        validate: {
            code: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un código',
            name: (value) =>
                Validation.string(value) ? null : 'Debe ingresar un nombre',
            description: (value) =>
                Validation.string(value)
                    ? null
                    : 'Debe ingresar una descripción',
            unitCost: (value) =>
                Validation.decimalString(value, true)
                    ? null
                    : 'Debe ingresar un costo válido',
            unitPrice: (value) =>
                Validation.decimalString(value, true)
                    ? null
                    : 'Debe ingresar un precio válido',
            stock: (value) =>
                Validation.integerString(value, true)
                    ? null
                    : 'Debe ingresar un stock válido',
        },
    })

    const handleSubmit = async (values: ProductCreateForm) => {
        if (submitting || !selectedBusiness) return

        setSubmitting(true)
        try {
            const productCreate: ProductCU = {
                code: values.code,
                name: values.name,
                description: values.description,
                unitCost: parseFloat(values.unitCost),
                unitPrice: parseFloat(values.unitPrice),
                stock: parseInt(values.stock),
                stockMin: values.stockMin ? parseInt(values.stockMin) : null,
                saleMinAmount: values.saleMinAmount
                    ? parseInt(values.saleMinAmount)
                    : null,
                businessID: selectedBusiness.id,
            }
            const response: Product =
                await Products.createProduct(productCreate)
            if (!response?.id) throw new Error('Error creando producto')

            setErrorMessage('')
            router.push('/products')
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message:
                    'Error al crear el producto. Inténtalo de nuevo más tarde.',
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
        <Stack gap="xs">
            <ButtonGoBack href="/products" text="productos" />

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Group mt="md" mb="xs">
                    <Title size="2rem">Nuevo producto</Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputText
                        key={form.key('code')}
                        withAsterisk
                        label="Código"
                        placeholder="Código del producto"
                        leftIcon={<IconBarcode />}
                        InputProps={{ ...form.getInputProps('code') }}
                    />

                    <InputText
                        key={form.key('name')}
                        withAsterisk
                        label="Nombre"
                        placeholder="Nombre del producto"
                        leftIcon={<IconRocket />}
                        InputProps={{ ...form.getInputProps('name') }}
                    />

                    <InputDescription
                        key={form.key('description')}
                        withAsterisk
                        placeholder="Descripción del producto"
                        InputProps={{ ...form.getInputProps('description') }}
                    />

                    <InputDecimal
                        key={form.key('unitCost')}
                        name="unitCost"
                        withAsterisk
                        label="Costo unitario"
                        placeholder="10.50"
                        leftIcon={<IconCoins />}
                        InputProps={{ ...form.getInputProps('unitCost') }}
                    />

                    <InputDecimal
                        key={form.key('unitPrice')}
                        name="unitPrice"
                        withAsterisk
                        label="Precio unitario"
                        placeholder="25.00"
                        leftIcon={<IconCoins />}
                        InputProps={{ ...form.getInputProps('unitPrice') }}
                    />

                    <InputInteger
                        key={form.key('stock')}
                        name="stock"
                        withAsterisk
                        label="Stock"
                        placeholder="50"
                        leftIcon={<IconBox />}
                        InputProps={{ ...form.getInputProps('stock') }}
                    />

                    <InputInteger
                        key={form.key('stockMin')}
                        name="stockMin"
                        label="Stock mínimo (opcional)"
                        placeholder="10"
                        leftIcon={<IconBox />}
                        InputProps={{ ...form.getInputProps('stockMin') }}
                    />

                    <InputInteger
                        key={form.key('saleMinAmount')}
                        name="saleMinAmount"
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
                        isCreate
                        submitting={submitting}
                        cancelHref="/products"
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default ProductCreate
