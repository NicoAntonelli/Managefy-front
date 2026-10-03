import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ActionIcon,
    Card,
    Group,
    Stack,
    Text,
    Title,
    Button,
    Tooltip,
} from '@mantine/core'
import {
    IconBan,
    IconEye,
    IconFileInvoice,
    IconPencil,
    IconPlus,
    IconX,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import DateHelper from '@/utils/math/DateHelper'
import Math from '@/utils/math/Math'
import Sales from '@/services/sales'
import Theme from '@/app/theme'
import TextHelper from '@/utils/string/TextHelper'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonCreate from '@/components/Common/Buttons/ButtonCreate'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import SaleCancel from '@/components/Sales/SaleCancel'
import SaleInvoiceCreate from '@/components/Sales/SaleInvoiceCreate'
import SaleEraseClient from '@/components/Sales/SaleEraseClient'
import SaleLinesTable from '@/components/Sales/SaleLinesTable'
import SaleUpdateObservation from '@/components/Sales/SaleUpdateObservation'
import SaleUpdateOrAddClient from '@/components/Sales/SaleUpdateOrAddClient'
import SaleUpdatePartialPayment from '@/components/Sales/SaleUpdatePartialPayment'
import SaleUpdateState from '@/components/Sales/SaleUpdateState'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

import Client from '@/entities/clients/Client'
import Sale from '@/entities/sales/Sale'

const SaleDetail = () => {
    const params = useParams()
    const saleID = params?.id ? Number(params.id) : null

    const selectedBusiness = useSelectedBusinessStore(
        (state) => state.selectedBusiness
    )
    const businessID = selectedBusiness?.id

    const [sale, setSale] = useState<Sale | null>(null)
    const [loading, setLoading] = useState(true)

    const [cancelModalOpened, setCancelModalOpened] = useState(false)
    const [invoiceModalOpened, setInvoiceModalOpened] = useState(false)
    const [clientModalOpened, setClientModalOpened] = useState(false)
    const [eraseClientModalOpened, setEraseClientModalOpened] = useState(false)
    const [observationModalOpened, setObservationModalOpened] = useState(false)
    const [stateModalOpened, setStateModalOpened] = useState(false)
    const [partialPaymentModalOpened, setPartialPaymentModalOpened] =
        useState(false)

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
                notifications.show({
                    title: 'Error',
                    message: 'No se pudo cargar la venta',
                    color: Theme.other!.danger,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchSale()
    }, [saleID, businessID])

    if (loading) {
        return <SkeletonFull />
    }

    if (!selectedBusiness) {
        return <BusinessWelcome resourceName="venta" />
    }

    if (!sale) {
        return (
            <Stack gap="xs" style={{ width: '100%' }}>
                <SelectedBusinessBar business={selectedBusiness} hideFilter />
                <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                    <ButtonGoBack href="/sales" text="ventas" />
                </div>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="min-w-full">
                    <Text c="dimmed">Venta no encontrada</Text>
                </Card>
            </Stack>
        )
    }

    const saleIdentifier = sale.date
        ? DateHelper.formatDateTime(sale.date)
        : `Venta #${sale.id}`

    return (
        <Stack gap="xs" style={{ width: '100%' }}>
            <SelectedBusinessBar business={selectedBusiness} hideFilter />

            <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
                <ButtonGoBack href="/sales" text="ventas" />
            </div>

            <div style={{ marginBottom: 'var(--mantine-spacing-sm)' }}>
                <ButtonCreate
                    href="/sales/new"
                    resourceName="venta"
                    label="Registrar nueva venta"
                />
            </div>

            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="min-w-full">
                <Stack gap="xs" mb="md">
                    <Title size="2rem">{saleIdentifier}</Title>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Observación
                        </Text>
                        <Group gap="0.5rem" align="center">
                            <Text c={sale.observation ? undefined : 'dimmed'}>
                                {sale.observation || 'Sin asignar'}
                            </Text>
                            <Tooltip label="Actualizar observación">
                                <ActionIcon
                                    color={Theme.primaryColor}
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setObservationModalOpened(true)
                                    }
                                    aria-label="Actualizar observación">
                                    <IconPencil size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </div>
                </Stack>

                <Group gap="xl" mb="lg" align="flex-start">
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Estado
                        </Text>
                        <Group gap="0.5rem" align="center">
                            <Text size="lg">
                                {TextHelper.getSaleStateText(sale.state)}
                            </Text>
                            <Tooltip label="Actualizar estado">
                                <ActionIcon
                                    color={Theme.primaryColor}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStateModalOpened(true)}
                                    aria-label="Actualizar estado">
                                    <IconPencil size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </div>

                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Total
                        </Text>
                        <Text size="lg">
                            {Math.formatMoney(sale.totalPrice)}
                        </Text>
                    </div>

                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Pago parcial
                        </Text>
                        <Group gap="0.5rem" align="center">
                            <Text size="lg">
                                {Math.formatMoney(sale.partialPayment ?? 0)}
                            </Text>
                            <Tooltip label="Actualizar pago parcial">
                                <ActionIcon
                                    color={Theme.primaryColor}
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setPartialPaymentModalOpened(true)
                                    }
                                    aria-label="Actualizar pago parcial">
                                    <IconPencil size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </div>

                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Cliente
                        </Text>
                        <Group gap="0.5rem" align="center">
                            <Text
                                size="lg"
                                c={sale.client?.name ? undefined : 'dimmed'}>
                                {sale.client?.name || 'Ninguno'}
                            </Text>
                            {sale.client && (
                                <Tooltip label="Ver cliente">
                                    <ActionIcon
                                        component={Link}
                                        href={`/clients/${sale.client.id}`}
                                        color={Theme.other!.secondaryColor}
                                        variant="outline"
                                        size="sm"
                                        aria-label="Ver cliente">
                                        <IconEye size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            <Tooltip
                                label={
                                    sale.client
                                        ? 'Actualizar cliente'
                                        : 'Agregar cliente'
                                }>
                                <ActionIcon
                                    color={Theme.primaryColor}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setClientModalOpened(true)}
                                    aria-label={
                                        sale.client
                                            ? 'Actualizar cliente'
                                            : 'Agregar cliente'
                                    }>
                                    {sale.client ? (
                                        <IconPencil size={16} />
                                    ) : (
                                        <IconPlus size={16} />
                                    )}
                                </ActionIcon>
                            </Tooltip>
                            {sale.client && (
                                <Tooltip label="Remover cliente">
                                    <ActionIcon
                                        color={Theme.other!.danger}
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setEraseClientModalOpened(true)
                                        }
                                        aria-label="Remover cliente">
                                        <IconX size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </Group>
                    </div>
                </Group>

                <SaleLinesTable saleLines={sale.saleLines} />

                {sale.state !== 'Cancelled' && (
                    <Group justify="flex-start" gap="sm" mt="xl">
                        <Button
                            color={Theme.primaryColor}
                            leftSection={<IconFileInvoice size={20} />}
                            onClick={() => setInvoiceModalOpened(true)}>
                            Facturar
                        </Button>
                        <Button
                            color={Theme.other!.danger}
                            leftSection={<IconBan size={20} />}
                            onClick={() => setCancelModalOpened(true)}>
                            Cancelar venta
                        </Button>
                    </Group>
                )}
            </Card>

            <SaleInvoiceCreate
                opened={invoiceModalOpened}
                saleID={sale.id}
                saleIdentifier={saleIdentifier}
                businessID={selectedBusiness.id}
                isBilled={sale.state === 'PaidAndBilled'}
                onSuccess={(updatedSale) => setSale(updatedSale)}
                onClose={() => setInvoiceModalOpened(false)}
            />

            <SaleCancel
                opened={cancelModalOpened}
                saleID={sale.id}
                saleIdentifier={saleIdentifier}
                businessID={selectedBusiness.id}
                onClose={() => setCancelModalOpened(false)}
            />

            <SaleUpdateOrAddClient
                opened={clientModalOpened}
                saleID={sale.id}
                businessID={selectedBusiness.id}
                currentClient={sale.client as Client | null}
                onSuccess={(updatedSale) => setSale(updatedSale)}
                onClose={() => setClientModalOpened(false)}
            />

            {sale.client && (
                <SaleEraseClient
                    opened={eraseClientModalOpened}
                    saleID={sale.id}
                    businessID={selectedBusiness.id}
                    clientName={sale.client.name}
                    saleIdentifier={saleIdentifier}
                    onSuccess={(updatedSale) => setSale(updatedSale)}
                    onClose={() => setEraseClientModalOpened(false)}
                />
            )}

            <SaleUpdateObservation
                opened={observationModalOpened}
                saleID={sale.id}
                businessID={selectedBusiness.id}
                currentObservation={sale.observation}
                onSuccess={(updatedSale) => setSale(updatedSale)}
                onClose={() => setObservationModalOpened(false)}
            />

            <SaleUpdateState
                opened={stateModalOpened}
                saleID={sale.id}
                businessID={selectedBusiness.id}
                currentState={sale.state}
                onSuccess={(updatedSale) => setSale(updatedSale)}
                onClose={() => setStateModalOpened(false)}
            />

            <SaleUpdatePartialPayment
                opened={partialPaymentModalOpened}
                saleID={sale.id}
                businessID={selectedBusiness.id}
                currentPartialPayment={sale.partialPayment ?? 0}
                onSuccess={(updatedSale) => setSale(updatedSale)}
                onClose={() => setPartialPaymentModalOpened(false)}
            />
        </Stack>
    )
}

export default SaleDetail
