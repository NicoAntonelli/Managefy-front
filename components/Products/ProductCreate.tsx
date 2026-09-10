'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
    Card,
    Group,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconBook,
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
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Product from '@/entities/products/Product'
import ProductCU from '@/entities/products/ProductCU'
import RegEx from '@/utils/string/RegEx'

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
                    <TextInput
                        pt="1rem"
                        withAsterisk
                        label="Código"
                        placeholder="Código del producto"
                        leftSection={<IconBarcode />}
                        key={form.key('code')}
                        {...form.getInputProps('code')}
                    />

                    <TextInput
                        pt="1rem"
                        withAsterisk
                        label="Nombre"
                        placeholder="Nombre del producto"
                        leftSection={<IconRocket />}
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />

                    <Textarea
                        pt="1rem"
                        withAsterisk
                        label="Descripción"
                        placeholder="Descripción del producto"
                        autosize
                        minRows={3}
                        leftSection={<IconBook />}
                        styles={{
                            section: {
                                alignItems: 'flex-start',
                                paddingTop: '0.2rem',
                            },
                        }}
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                    />

                    <TextInput
                        pt="1rem"
                        withAsterisk
                        type="text"
                        inputMode="decimal"
                        label="Costo unitario"
                        placeholder="10.50"
                        leftSection={<IconCoins />}
                        key={form.key('unitCost')}
                        {...form.getInputProps('unitCost')}
                        onChange={(event) => {
                            const value = event.currentTarget.value
                            const filtered = RegEx.cleanDecimal(value)
                            form.setFieldValue('unitCost', filtered)
                        }}
                    />

                    <TextInput
                        pt="1rem"
                        withAsterisk
                        type="text"
                        inputMode="decimal"
                        label="Precio unitario"
                        placeholder="25.00"
                        leftSection={<IconCoins />}
                        key={form.key('unitPrice')}
                        {...form.getInputProps('unitPrice')}
                        onChange={(event) => {
                            const value = event.currentTarget.value
                            const filtered = RegEx.cleanDecimal(value)
                            form.setFieldValue('unitPrice', filtered)
                        }}
                    />

                    <TextInput
                        pt="1rem"
                        withAsterisk
                        type="text"
                        inputMode="numeric"
                        label="Stock"
                        placeholder="50"
                        leftSection={<IconBox />}
                        key={form.key('stock')}
                        {...form.getInputProps('stock')}
                        onChange={(event) => {
                            const value = event.currentTarget.value
                            const filtered = RegEx.cleanInteger(value)
                            form.setFieldValue('stock', filtered)
                        }}
                    />

                    <TextInput
                        pt="1rem"
                        type="text"
                        inputMode="numeric"
                        label="Stock mínimo (opcional)"
                        placeholder="10"
                        leftSection={<IconBox />}
                        key={form.key('stockMin')}
                        {...form.getInputProps('stockMin')}
                        onChange={(event) => {
                            const value = event.currentTarget.value
                            const filtered = RegEx.cleanInteger(value)
                            form.setFieldValue('stockMin', filtered)
                        }}
                    />

                    <TextInput
                        pt="1rem"
                        type="text"
                        inputMode="numeric"
                        label="Cantidad mínima por venta (opcional)"
                        placeholder="5"
                        leftSection={<IconBox />}
                        key={form.key('saleMinAmount')}
                        {...form.getInputProps('saleMinAmount')}
                        onChange={(event) => {
                            const value = event.currentTarget.value
                            const filtered = RegEx.cleanInteger(value)
                            form.setFieldValue('saleMinAmount', filtered)
                        }}
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
