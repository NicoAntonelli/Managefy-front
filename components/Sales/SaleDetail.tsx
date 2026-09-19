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
import { IconBan, IconEye } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import Sales from '@/services/sales'
import Theme from '@/app/theme'
import TextHelper from '@/utils/string/TextHelper'
import useSelectedBusinessStore from '@/utils/stores/useSelectedBusinessStore'

import BusinessWelcome from '@/components/Businesses/BusinessWelcome'
import ButtonGoBack from '@/components/Common/Buttons/ButtonGoBack'
import SaleCancel from '@/components/Sales/SaleCancel'
import SaleLinesTable from '@/components/Sales/SaleLinesTable'
import SelectedBusinessBar from '@/components/Businesses/SelectedBusinessBar'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'

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
        ? TextHelper.formatDate(sale.date)
        : `Venta #${sale.id}`

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
                <Stack gap="xs" mb="md">
                    <Title size="2rem">{saleIdentifier}</Title>
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Observación
                        </Text>
                        <Text c={sale.observation ? undefined : 'dimmed'}>
                            {sale.observation || 'Sin asignar'}
                        </Text>
                    </div>
                </Stack>

                <Group gap="xl" mb="lg" align="flex-start">
                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Estado
                        </Text>
                        <Text size="lg">
                            {TextHelper.getSaleStateText(sale.state)}
                        </Text>
                    </div>

                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Total
                        </Text>
                        <Text size="lg">${sale.totalPrice.toFixed(2)}</Text>
                    </div>

                    <div>
                        <Text size="sm" fw={500} c="dimmed">
                            Pago parcial
                        </Text>
                        <Text size="lg">
                            ${(sale.partialPayment ?? 0).toFixed(2)}
                        </Text>
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
                        </Group>
                    </div>
                </Group>

                <SaleLinesTable saleLines={sale.saleLines} />

                {sale.state !== 'Cancelled' && (
                    <Group justify="flex-start" gap="sm" mt="xl">
                        <Button
                            color={Theme.other!.danger}
                            leftSection={<IconBan size={20} />}
                            onClick={() => setCancelModalOpened(true)}>
                            Cancelar venta
                        </Button>
                    </Group>
                )}
            </Card>

            <SaleCancel
                opened={cancelModalOpened}
                saleID={sale.id}
                saleIdentifier={saleIdentifier}
                businessID={selectedBusiness.id}
                onClose={() => setCancelModalOpened(false)}
            />
        </Stack>
    )
}

export default SaleDetail
