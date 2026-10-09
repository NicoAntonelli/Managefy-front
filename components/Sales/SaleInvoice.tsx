import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, Group, Stack, Table, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPrinter } from '@tabler/icons-react'

import Sales from '@/services/sales'
import Theme from '@/app/theme'

import DateHelper from '@/utils/math/DateHelper'
import Math from '@/utils/math/Math'

import SplashLogo from '@/components/Common/Loader/SplashLogo'

import Sale from '@/entities/sales/Sale'
import SaleLine from '@/entities/sales/SaleLine'
import ErrorAlert from '@/components/Common/Error/ErrorAlert'

interface SaleInvoiceProps {
    saleID: number
    businessID: number
}

const lineSubtotal = (saleLine: SaleLine) =>
    Math.calculateSubtotal(
        saleLine.price,
        saleLine.amount,
        saleLine.discountSurcharge ?? undefined
    )

const SaleInvoice = (props: SaleInvoiceProps) => {
    const { saleID, businessID } = props

    const [sale, setSale] = useState<Sale | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)

    // Invoice number is the Sale ID padded to 8 digits
    const invoiceNumber = sale ? String(sale.id).padStart(8, '0') : ''

    useEffect(() => {
        if (!saleID || !businessID) {
            setLoading(false)
            return
        }

        const fetchSale = async () => {
            try {
                const response = await Sales.getOneSale(saleID, businessID)
                setSale(response)
            } catch (error) {
                setLoadError(true)
                notifications.show({
                    title: 'Error',
                    message: 'No se pudo cargar la factura',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchSale()
    }, [saleID, businessID])

    useEffect(() => {
        if (!sale) return

        const dateTime = DateHelper.formatDateTime(DateHelper.today(), true)
        const previousTitle = document.title
        document.title = `Managefy - Factura venta #${invoiceNumber} - ${dateTime}`

        return () => {
            document.title = previousTitle
        }
    }, [sale])

    if (loading) return <SplashLogo />

    if (loadError) {
        return (
            <ErrorAlert message="No se pudo cargar la factura. Cerrá esta ventana para seguir navegando en Managefy." />
        )
    }

    if (!sale) {
        return (
            <ErrorAlert message="No se encontró la venta para generar la factura. Cerrá esta ventana para seguir navegando en Managefy." />
        )
    }

    const issueDate = sale.date
        ? DateHelper.formatDateTime(sale.date)
        : 'Sin asignar'

    const clientName = sale.client?.name || 'Consumidor Final'

    const lines = sale.saleLines ?? []

    return (
        <Stack
            className="min-h-screen bg-white p-8 print:p-0"
            align="center"
            gap="md">
            <Group
                justify="flex-end"
                w="100%"
                maw={900}
                className="print:hidden">
                <Button
                    color={Theme.primaryColor}
                    leftSection={<IconPrinter size={18} />}
                    onClick={() => window.print()}>
                    Imprimir
                </Button>
            </Group>

            <Stack
                w="100%"
                maw={900}
                gap="md"
                p="xl"
                style={{
                    backgroundColor: Theme.other!.printBackground,
                    color: Theme.other!.printText,
                    border: `1px solid ${Theme.other!.printText}`,
                }}>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group align="flex-start" wrap="nowrap" gap="md">
                        <Image
                            src="/Managefy-logo.jpeg"
                            alt="Managefy"
                            width={72}
                            height={72}
                            style={{ height: 72, width: 'auto' }}
                        />
                        <Stack gap={2}>
                            <Text fw={700} size="lg" c={Theme.other!.printText}>
                                {sale.business?.name || 'Sin asignar'}
                            </Text>
                            <Text size="sm" c="#333">
                                {sale.business?.description ||
                                    'Sin descripción'}
                            </Text>
                            <Text size="sm" c="#333">
                                Condición frente al IVA: Responsable Monotributo
                            </Text>
                        </Stack>
                    </Group>
                    <Stack
                        gap={2}
                        align="center"
                        px="md"
                        py="xs"
                        style={{
                            border: `2px solid ${Theme.other!.printText}`,
                            minWidth: 140,
                        }}>
                        <Title order={2} c={Theme.other!.printText}>
                            C
                        </Title>
                        <Text size="xs" c="#333">
                            COD. 011
                        </Text>
                    </Stack>
                    <Stack gap={2} align="flex-end">
                        <Title order={2} c={Theme.other!.printText}>
                            FACTURA
                        </Title>
                        <Text size="sm" c={Theme.other!.printText}>
                            Nº {invoiceNumber}
                        </Text>
                        <Text size="sm" c={Theme.other!.printText}>
                            Fecha: {issueDate}
                        </Text>
                    </Stack>
                </Group>

                <Stack
                    gap={2}
                    p="sm"
                    style={{
                        borderTop: `1px solid ${Theme.other!.printText}`,
                        borderBottom: `1px solid ${Theme.other!.printText}`,
                    }}>
                    <Text size="sm" c={Theme.other!.printText}>
                        Cliente: {clientName}
                    </Text>
                    <Text size="sm" c="#333">
                        {sale.client?.email || 'Sin email'}
                        {sale.client?.phone ? ` · ${sale.client.phone}` : ''}
                    </Text>
                    <Text size="sm" c="#333">
                        Condición frente al IVA: Consumidor Final
                    </Text>
                    <Text size="sm" c="#333">
                        Condición de venta:{' '}
                        {sale.state === 'Paid' || sale.state === 'PaidAndBilled'
                            ? 'Contado'
                            : 'Cuenta corriente'}
                    </Text>
                </Stack>

                <Table
                    withTableBorder
                    withColumnBorders
                    style={{ color: Theme.other!.printText }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th c={Theme.other!.printText}>
                                Producto
                            </Table.Th>
                            <Table.Th
                                c={Theme.other!.printText}
                                style={{ textAlign: 'center' }}>
                                Cantidad
                            </Table.Th>
                            <Table.Th
                                c={Theme.other!.printText}
                                style={{ textAlign: 'right' }}>
                                Precio unitario
                            </Table.Th>
                            <Table.Th
                                c={Theme.other!.printText}
                                style={{ textAlign: 'center' }}>
                                Dto./Recargo
                            </Table.Th>
                            <Table.Th
                                c={Theme.other!.printText}
                                style={{ textAlign: 'right' }}>
                                Subtotal
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {lines.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={5} c="#333">
                                    Esta venta no tiene productos
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            lines.map((saleLine) => (
                                <Table.Tr key={saleLine.position}>
                                    <Table.Td c={Theme.other!.printText}>
                                        {saleLine.product?.name || 'Sin nombre'}
                                    </Table.Td>
                                    <Table.Td
                                        c={Theme.other!.printText}
                                        style={{ textAlign: 'center' }}>
                                        {saleLine.amount}
                                    </Table.Td>
                                    <Table.Td
                                        c={Theme.other!.printText}
                                        style={{ textAlign: 'right' }}>
                                        {Math.formatMoney(saleLine.price)}
                                    </Table.Td>
                                    <Table.Td
                                        c={Theme.other!.printText}
                                        style={{ textAlign: 'center' }}>
                                        {saleLine.discountSurcharge
                                            ? Math.formatFactorToPercentageString(
                                                  saleLine.discountSurcharge
                                              )
                                            : '—'}
                                    </Table.Td>
                                    <Table.Td
                                        c={Theme.other!.printText}
                                        style={{ textAlign: 'right' }}>
                                        {Math.formatMoney(
                                            lineSubtotal(saleLine)
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>

                {sale.observation && (
                    <Text size="sm" c="#333">
                        Observación: {sale.observation}
                    </Text>
                )}

                <Group justify="flex-end">
                    <Stack gap={2} align="flex-end">
                        <Text size="sm" c="#333">
                            Factura C. El importe no discrimina IVA.
                        </Text>
                        <Text fw={700} size="lg" c={Theme.other!.printText}>
                            Total: {Math.formatMoney(sale.totalPrice)}
                        </Text>
                    </Stack>
                </Group>
            </Stack>
        </Stack>
    )
}

export default SaleInvoice
