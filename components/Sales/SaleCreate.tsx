import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
    Card,
    Checkbox,
    Group,
    Stack,
    Table,
    Text,
    Title,
    Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    IconCashRegister,
    IconCoins,
    IconInfoCircle,
} from '@tabler/icons-react'

import Math from '@/utils/math/Math'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'
import Validation from '@/utils/validation/Validation'

import Helper from '@/services/helper'
import Sales from '@/services/sales'
import Theme from '@/app/theme'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import ButtonsSubmitAndCancel from '@/components/Common/Buttons/ButtonsSubmitAndCancel'
import ClientsDropdown from '@/components/Clients/ClientsDropdown'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import InputNumeric from '@/components/Common/Inputs/InputNumeric'
import ProductsDropdown from '@/components/Products/ProductsDropdown'
import SaleLineCreate from '@/components/Sales/SaleLineCreate'

import Client from '@/entities/clients/Client'
import Product from '@/entities/products/Product'
import Sale from '@/entities/sales/Sale'
import SaleC from '@/entities/sales/SaleC'
import SaleLineC from '@/entities/sales/SaleLineC'
import SaleLineDraft from '@/entities/sales/SaleLineDraft'
import SaleState from '@/entities/helpTypes/SaleState'

interface SaleCreateForm {
    partialPayment: number | null
    observation: string
}

interface SaleCreateProps {
    backHref?: string
    cancelHref?: string
    onSuccess?: (sale: Sale) => void
    onCancel?: () => void
}

const SaleCreate = (props: SaleCreateProps) => {
    const { backHref = '/sales', cancelHref = '/sales' } = props
    const { onSuccess, onCancel } = props

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [saleLinesError, setSaleLinesError] = useState('')
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [saleLines, setSaleLines] = useState<SaleLineDraft[]>([])
    const [isPaid, setIsPaid] = useState(false)
    const [isBilled, setIsBilled] = useState(false)

    const router = useRouter()

    const form = useForm<SaleCreateForm>({
        mode: 'controlled',
        initialValues: {
            partialPayment: null,
            observation: '',
        },
    })

    const handlePaidChange = (checked: boolean) => {
        setIsPaid(checked)
        form.setFieldValue('partialPayment', null)
        if (!checked) {
            setIsBilled(false)
        }
    }

    const deriveSaleState = (
        partialPayment: number | null,
        totalPrice: number
    ): SaleState => {
        if (isBilled) return 'PaidAndBilled'
        if (isPaid) return 'Paid'
        if (partialPayment && partialPayment > 0) {
            if (partialPayment >= totalPrice) return 'Paid'
            else return 'PartialPayment'
        }

        return 'PendingPayment'
    }

    const handleToggleProduct = (product: Product) => {
        const alreadySelected = saleLines.some(
            (saleLine) => saleLine.product.id === product.id
        )

        if (alreadySelected) {
            setSaleLines((prev) =>
                prev.filter((saleLine) => saleLine.product.id !== product.id)
            )
            return
        }

        setSaleLines((prev) => [
            ...prev,
            {
                product,
                amount: 1,
                discountPercentage: null,
            },
        ])
    }

    const handleChangeSaleLine = (updatedSaleLine: SaleLineDraft) => {
        setSaleLines((prev) =>
            prev.map((saleLine) =>
                saleLine.product.id === updatedSaleLine.product.id
                    ? updatedSaleLine
                    : saleLine
            )
        )
    }

    const handleRemoveSaleLine = (productID: number) => {
        setSaleLines((prev) =>
            prev.filter((saleLine) => saleLine.product.id !== productID)
        )
    }

    const validateSaleLines = (): boolean => {
        if (saleLines.length === 0) {
            setSaleLinesError('Debe agregar al menos un producto')
            return false
        }

        const hasInvalidLine = saleLines.some(
            (saleLine) => !Validation.integer(saleLine.amount)
        )

        if (hasInvalidLine) {
            setSaleLinesError('Revise la cantidad de los productos agregados')
            return false
        }

        setSaleLinesError('')
        return true
    }

    const calculateTotalPrice = (lines: SaleLineDraft[]): number =>
        lines.reduce(
            (total, saleLine) =>
                total +
                Math.calculateSubtotal(
                    saleLine.product.unitPrice,
                    saleLine.amount ?? 0,
                    saleLine.discountPercentage
                        ? Math.formatPercentageToFactor(
                              saleLine.discountPercentage
                          )
                        : undefined
                ),
            0
        )

    const handleSubmit = async (values: SaleCreateForm) => {
        if (submitting || !selectedBusiness) return

        if (!validateSaleLines()) return

        const totalPrice = calculateTotalPrice(saleLines)
        if (values.partialPayment && values.partialPayment > totalPrice) {
            form.setFieldError(
                'partialPayment',
                'El pago parcial no puede ser mayor al total de la venta'
            )
            return
        }

        const isFullyPaid =
            !!values.partialPayment && values.partialPayment === totalPrice

        setSubmitting(true)
        try {
            const saleLinesC: SaleLineC[] = saleLines.map((saleLine) => ({
                amount: saleLine.amount as number,
                price: saleLine.product.unitPrice,
                cost: saleLine.product.unitCost,
                discountSurcharge: saleLine.discountPercentage
                    ? Validation.percentage(saleLine.discountPercentage)
                        ? Math.formatPercentageToFactor(
                              saleLine.discountPercentage
                          )
                        : null
                    : null,
                productID: saleLine.product.id,
            }))

            const saleC: SaleC = {
                state: deriveSaleState(values.partialPayment, totalPrice),
                partialPayment: isFullyPaid ? null : values.partialPayment,
                observation: values.observation || null,
                businessID: selectedBusiness.id,
                client: selectedClient
                    ? {
                          id: selectedClient.id,
                          name: selectedClient.name,
                          description: selectedClient.description,
                          email: selectedClient.email,
                          phone: selectedClient.phone,
                          businessID: selectedBusiness.id,
                          salesIDs: [],
                      }
                    : null,
                saleLines: saleLinesC,
            }

            const response: Sale = await Sales.createSale(saleC)
            if (!response?.id) throw new Error('Error creando venta')

            setErrorMessage('')

            if (onSuccess) {
                onSuccess(response)
            } else {
                router.push(`/sales/${response.id}`)
            }
        } catch (error) {
            const message = Helper.parseError(error)
            setErrorMessage(message)
            notifications.show({
                title: 'Error',
                message:
                    'Error al crear la venta. Inténtalo de nuevo más tarde.',
                color: Theme.other!.danger,
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="venta" />
    }

    const selectedProductIDs = saleLines.map((saleLine) => saleLine.product.id)

    const totalPrice = calculateTotalPrice(saleLines)

    return (
        <Stack gap="xs" w="100%" maw="60rem" mx="auto">
            <ButtonGoBack href={backHref} text="ventas" onClick={onCancel} />

            <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
                <Group mt="md" mb="xs">
                    <Title size="2rem">Nueva venta</Title>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <InputDescription
                        key={form.key('observation')}
                        placeholder="Observación de la venta"
                        InputProps={{ ...form.getInputProps('observation') }}
                    />

                    <Group mt="md" gap="xl">
                        <Checkbox
                            label="Pagada"
                            checked={isPaid}
                            onChange={(event) =>
                                handlePaidChange(event.currentTarget.checked)
                            }
                        />
                        <Checkbox
                            label="Facturada"
                            checked={isBilled}
                            disabled={!isPaid}
                            onChange={(event) =>
                                setIsBilled(event.currentTarget.checked)
                            }
                        />
                    </Group>

                    <InputNumeric
                        key={form.key('partialPayment')}
                        name="partialPayment"
                        label="Pago parcial (opcional)"
                        placeholder="0.00"
                        leftIcon={<IconCoins />}
                        InputProps={{
                            ...form.getInputProps('partialPayment'),
                            disabled: isPaid,
                        }}
                    />

                    <ClientsDropdown
                        businessID={selectedBusiness.id}
                        isOptional
                        onChange={setSelectedClient}
                    />

                    <Stack gap="xs" mt="md">
                        <Text size="sm" fw={500}>
                            Productos{' '}
                            <span
                                style={{ color: 'var(--mantine-color-error)' }}>
                                *
                            </span>
                        </Text>

                        {saleLines.length === 0 ? (
                            <Text size="sm" c="dimmed">
                                No hay productos agregados. Selecciona productos
                                a continuación.
                            </Text>
                        ) : (
                            <Table
                                highlightOnHover
                                withTableBorder
                                withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Producto</Table.Th>
                                        <Table.Th>Cantidad</Table.Th>
                                        <Table.Th>Precio</Table.Th>
                                        <Table.Th>Costo</Table.Th>
                                        <Table.Th>
                                            <Group gap={4} wrap="nowrap">
                                                Descuento/Recargo (%)
                                                <Tooltip
                                                    label="Negativo: descuento (hasta -99.99%). Positivo: recargo (hasta 200%)"
                                                    multiline
                                                    w={220}>
                                                    <IconInfoCircle
                                                        size={16}
                                                        style={{
                                                            cursor: 'help',
                                                        }}
                                                    />
                                                </Tooltip>
                                            </Group>
                                        </Table.Th>
                                        <Table.Th
                                            style={{ textAlign: 'center' }}>
                                            Subtotal
                                        </Table.Th>
                                        <Table.Th
                                            style={{ textAlign: 'center' }}>
                                            Acciones
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {saleLines.map((saleLine) => (
                                        <SaleLineCreate
                                            key={saleLine.product.id}
                                            saleLine={saleLine}
                                            onChange={handleChangeSaleLine}
                                            onRemove={() =>
                                                handleRemoveSaleLine(
                                                    saleLine.product.id
                                                )
                                            }
                                        />
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}

                        {saleLinesError && (
                            <Text size="xs" c={Theme.other!.danger}>
                                {saleLinesError}
                            </Text>
                        )}

                        <ProductsDropdown
                            businessID={selectedBusiness.id}
                            selectedProductIDs={selectedProductIDs}
                            onToggleProduct={handleToggleProduct}
                        />

                        <Group justify="flex-end" gap="xs" mt="xs">
                            <Text size="sm" fw={500}>
                                Total:
                            </Text>
                            <Text size="lg" fw={700}>
                                ${totalPrice.toFixed(2)}
                            </Text>
                        </Group>
                    </Stack>

                    {errorMessage && (
                        <Text c={Theme.other!.danger} size="sm" mt="md">
                            {errorMessage}
                        </Text>
                    )}

                    <ButtonsSubmitAndCancel
                        operation="Create"
                        resourceName="venta"
                        leftIcon={<IconCashRegister size={20} />}
                        submitting={submitting}
                        cancelHref={cancelHref}
                        onCancel={onCancel}
                    />
                </form>
            </Card>
        </Stack>
    )
}

export default SaleCreate
